

var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var cors = require('cors');
var app  = express();
var server = require('http').Server(app);
var hbs = require('hbs');
var handlebars = require('handlebars');
//var fs = require('fs');


function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : process.env.MYSQL_ADDON_HOST || 	'bz400wnal-mysql.services.clever-cloud.com',
    	  database : process.env.MYSQL_ADDON_DB || 'bz400wnal',
    	  user     : process.env.MYSQL_ADDON_USER || 'urcopkascy7ls1pc',
    	  password : process.env.MYSQL_ADDON_PASSWORD || 'MCD3wSs7OrcRdXtaiTw',
        debug    :  false
    });
    self.configureExpress(pool);
}

REST.prototype.configureExpress = function(connection) {
	
	  //app.options('*', cors());
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      app.use(cors());
    //app.set('view engine', 'hbs');
	  app.set('view engine', 'hbs');
	  //app.use(express.static(path.join(__dirname, '../')));

      
      app.use(function (req, res, next) {
          // Website you wish to allow to connect
          res.setHeader('Access-Control-Allow-Origin', '*');
          // Request methods you wish to allow
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          // Request headers you wish to allow
          res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
          // Set to true if you need the website to include cookies in the requests sent
          // to the API (e.g. in case you use sessions)
          res.setHeader('Access-Control-Allow-Credentials', true);
		  
		  /*res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");*/
          // Pass to next layer of middleware
		  //res.writeHead(200, headers);
          next();
          //res.end();
    
      
});
self.startServer();
}

REST.prototype.startServer = function() {
      server.listen(process.env.PORT || 3000,function(){
          console.log("All right ! I am alive at Port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();