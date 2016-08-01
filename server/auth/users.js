var cryPass = require("./bcrypt"); //引入密码加密模块

module.exports = function(server, db){
	db.users.ensureIndex({
		email: 1
	},{
		unique: true
	});
	//register
	server.post("/api/v1/auth/register", function(req, res, next){
		var user = req.params;
		cryPass.cryptPass(user.password, function(err, hash){
			user.password = hash;
			db.users.insert(user, function(err, dbUser){
				if(err){
					if(err.code == 11000){
						res.writeHead(400,{
							'Content-Type': 'application/json; charset=utf-8'
						});
						res.end(JSON.stringify({
                            error: err,
                            message: "A user with this email already exists"
                        }));
					}
				} else {
					res.writeHead(200, {
                        'Content-Type': 'application/json; charset=utf-8'
                    });
                    dbUser.password = ""; //密码置空，只返回用户名，以及邮箱
                    res.end(JSON.stringify(dbUser));
				}
			});
		});
		return next();
	});
	//login
	server.post("/api/v1/auth/login", function(req, res, next){
		var user = req.params;
		if(user.email.trim().length == 0 || user.password.trim().length == 0){
			res.writeHead(403, {
				"Content-Type": "application/json; charset=utf-8"
			});
			res.end(JSON.stringify({
				error:"Invalid Credentials"
			}));
		}
		db.users.findOne({
			email: req.params.email
		}, function(err, dbUser){
			cryPass.comparePass(user.password, dbUser.password, function(err, isPasswordMatch){
				if( isPasswordMatch ){
					res.writeHead(200, {
						"Content-Type" : "application/json; charset=utf-8"
					});
					dbUser.password = "";
					res.end(JSON.stringify(dbUser));
				}else{
					res.writeHead(403, {
						"Content-Type": "application/json; charset=utf-8"
					});
					res.end(JSON.stringify({
						error:"Invalid User"
					}));
				}
			})
		})
		return next();
	});
}

