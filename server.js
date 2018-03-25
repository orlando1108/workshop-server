
/*var mysql = require('mysql');
var db;
function connection() {
  if (!db) {
    db = mysql.createConnection({
      host: "127.0.0.1",
      port: "3306",
      user: "alvin",
      password: "starwars17",
      database: "starwars"
    });
    db.connect(function (err) {
      if (!err) {
        console.log('Database is connected!');
      } else {
        console.log('Error connecting database!' + err);
      }
    });
    db.on('error', function (err) {
      console.log('db error', err);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
        db = null;
        connection()                         // lost due to either server restart, or a
      } else {                                      // connnection idle timeout (the wait_timeout
        throw err;                                  // server variable configures this)
      }
    });
  }
  return db;
}
module.exports = connection();
*/

var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var rest = require("./REST.js");
var app  = express();

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100,
        host     : 'bbqgq84xq-mysql.services.clever-cloud.com',
        user     : 'uyiyi3ppu3ygjfe0',
        password : 'xOB2HwbAefRcAmHzwsW',
        database : 'bbqgq84xq',
        debug    :  false
    });
    /*pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });*/
    self.configureExpress(pool);
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection,md5);
      
      app.use(function (req, res, next) {
          // Website you wish to allow to connect
          res.setHeader('Access-Control-Allow-Origin', '*');
          // Request methods you wish to allow
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
          // Request headers you wish to allow
          res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization, Content-Type');
          // Set to true if you need the website to include cookies in the requests sent
          // to the API (e.g. in case you use sessions)
          res.setHeader('Access-Control-Allow-Credentials', true);
          // Pass to next layer of middleware
          next();
        
    
      
});
self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(process.env.PORT || 3000,function(){
          console.log("All right ! I am alive at Port 8080.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();