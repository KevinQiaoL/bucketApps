module.exports = function(server, db){
	var validateRequest = require("../auth/validateRequest"); //引入校验来源
	//get all
	server.get("/api/v1/data/list", function(req, res, next){
		validateRequest.validate(req, res, db, function(){
			console.log(req.params.token);
			db.buckets.find({
				user:req.params.token
			},function(err, list){
				res.writeHead(200,{
					"Content-Type":"application/json; charset=utf-8"
				});
				res.end(JSON.stringify(list));
			});
		});
		return next();
	});
	//get by id
	server.get("/api/v1/data/item/:id", function(req, res, next){
		validateRequest.validate(req, res, db, function(){
			db.buckets.find({
				_id:db.ObjectId(req.params.id)
			},function(err, data){
				res.writeHead(200,{
					"Content-Type":"application/json; charset=utf-8"
				});
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});
	//add
	server.post("/api/v1/data/item", function(req, res, next){
		validateRequest.validate(req, res, db, function(){
			var item = req.params;
			db.buckets.save(item, function(err, data){
				res.writeHead(200,{
					"Content-Type":"application/json; charset=utf-8"
				});
				res.end(JSON.stringify(data));
			});
		});
		return next();
	});
	//put 
	server.put("/api/v1/data/item/:id", function(req, res, next){
		validateRequest.validate(req, res, db, function(){
			db.buckets.findOne({
				_id: db.ObjectId(req.params.id)
			}, function(err, data){
				var updProd = {};
				for(var n in data) {
					updProd[n] = data[n];
				}
				for(var n in req.params){
					if(n != "id")
						updProd[n] = req.params[n];
				}
				console.log(updProd);
				db.buckets.update({
					_id:db.ObjectId(req.params.id)
				}, updProd, {
					multi : false
				}, function(err, data){
					res.writeHead(200,{
						"Content-Type":"application/json; charset=utf-8"
					});
					res.end(JSON.stringify(data));
				})
			})
			
		});
		return next();
	});
	//delete
	server.del("/api/v1/data/item/:id", function(req, res, next){
		validateRequest.validate(req, res, db, function(){
			db.buckets.remove({
				_id: db.ObjectId(req.params.id)
			},function(err, data){
				res.writeHead(200, {
                    'Content-Type': 'application/json; charset=utf-8'
                });
                res.end(JSON.stringify(data));
			});
			return next();
		});
	});
}

