var restify = require("restify"), //类似express的模块，
    mongojs = require("mongojs"), //方便调用mongodb
    morgan  = require("morgan"),  //用于打印nodejs服务器接收到的请求信息
    db      = mongojs("bucket", ["users", "buckets"]), //创建数据库
    server  = restify.createServer(); //创建服务

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(morgan("dev")); //输出logger

// CORS
server.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");  //接收来自所有域的请求
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

server.listen(process.env.PORT || 9804, function () {
    console.log("Server started @ ", process.env.PORT || 9804);
});
var manageUsers =   require('./auth/users')(server, db);
var manageLists =   require('./list/lists')(server, db);