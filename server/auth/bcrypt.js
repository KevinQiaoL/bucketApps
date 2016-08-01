var bcrypt = require("bcrypt");

//密码加密
module.exports.cryptPass = function(password, callback){
	bcrypt.genSalt(10, function(err, salt){
		if(err)
			return callback(err);
		bcrypt.hash(password, salt, function(err, hash){
			return callback(err, hash);
		})
	})
};
//密码匹配
module.exports.comparePass = function(password, userPass, callback){
	bcrypt.compare(password, userPass, function(err, isPasswordMatch){
		if(err)
			return callback(err);
		return callback(err, isPasswordMatch);
	})
};