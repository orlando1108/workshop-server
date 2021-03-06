var mysql = require('mysql');

var insertedCommande_ID;
var insertedUser_ID;
var nodemailer = require('nodemailer');
var fs = require('fs');
var HBS = require('hbs');
var Handlebars = require('handlebars');


function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}
REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    
    router.post("/commande",function(req,res){

		  //USER
		var msg_collections;
        var msg_produits;
		var msg_user;
		var error = false;
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["User","nom","email",req.body.name, req.body.email]; //md5(req.body.password)
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                error = true;
            } else {
				insertedUser_ID = rows.insertId;
                msg_user = " user added ";
				console.log("inserted id user  " + insertedUser_ID);
            }
			
        query = "INSERT INTO ??(??) VALUES (?)";
        table = ["Commande","id_user",insertedUser_ID]; //md5(req.body.password)
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                error = true;
            } else {
                insertedCommande_ID = rows.insertId;
                console.log("inserted id commande  " + insertedCommande_ID);
            }
        
            if(req.body.listProducts){
                for (i = 0; i < req.body.listProducts.length; i++) { 
                   // console.log("id PRODUIT before  " + req.body.listProducts[i]);
                    table = ["Produit_Commande","id_produit","id_commande",Number(req.body.list_produits[i]),insertedCommande_ID ]; //md5(req.body.password)
                    console.log("id PRODUIT after  " + table);
                    query = "INSERT INTO ??(??,??) VALUES (?,?)";
                    query = mysql.format(query,table);
                    connection.query(query,function(err,rows){
                    if(err) {
                        error = true;
                    }
                });
                }
                msg_produits = " products added ";
    
            }
            if(req.body.listCollections){
                //console.log("list collections exists");
               for (i = 0; i < req.body.listCollections.length; i++) { 
                    table = ["Collection_Commande","id_collection","id_commande",Number(req.body.list_collections[i]),insertedCommande_ID ]; //md5(req.body.password)
                    query = "INSERT INTO ??(??,??) VALUES (?,?)";
                    query = mysql.format(query,table);
                    connection.query(query,function(err,rows){
                    if(err) {
                        error = true;
                    } else {
                        msg_collections = " collections added ";
						
                    }
                   });
               }
    
            }
        });
		
		});
		if(error === true){
			res.json({"Error" : "an error has occurred, please inform the reseller !"});
		}else{
			res.json({"Error" : "none", "msg_collections" : msg_collections, "msg_produits" : msg_produits, "msg_user" : msg_user });
		}
        

    });

    router.post("/user",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["User","email","entreprise",req.body.email, req.body.factory]; //md5(req.body.password)
        query = mysql.format(query,table);
        connection.connect();
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query", "Detail": JSON.stringify(err)});
            } else {
                res.json({"Error" : false, "Message" : "User Added !"});
            }
        });
    });

    router.get("/collections",function(req,res){
		
       // contents = fs.readFileSync('sliderImages.json', 'utf8');
        var query = "SELECT * FROM ??";
        var table = ["Collection"];
        query = mysql.format(query,table);
        connection.getConnection(function(err, connection) {
        connection.query(query,function(err,rows){
            connection.release();
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query",  "Detail": JSON.stringify(err)});
            } else {
				//res.writeHead(200, {'Content-Type': 'text/plain'});
                res.json({"Error" : false, "Message" : "Success", "Collections" : rows});
            }
        });
    });
    });

    router.get("/produits/:id_collection",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["Produit","id_collection",req.params.id_collection];
        query = mysql.format(query,table);
        connection.getConnection(function(err, connection) {
        connection.query(query,function(err,rows){
            connection.release();
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Produits" : rows});
            }
        });
    });
    });
    router.get("/users/:user_id",function(req,res){
        var query = "SELECT * FROM ?? WHERE ??=?";
        var table = ["user_login","user_id",req.params.user_id];
        query = mysql.format(query,table);
        connection.connect();
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Success", "Users" : rows});
            }
        });
    });
	
    // EMAIL API
    
   
/*
router.post("/email",function(req,res){
	
    var template  = fs.readFileSync('./views/emailTest.hbs', 'utf-8');
    var compiledTemplate = Handlebars.compile(template);
	
var transporter = nodemailer.createTransport({
	host: "smtp-mail.outlook.com",
	port: 587,
	auth: {
		user: "erwan.raulo2015@campus-eni.fr",
		pass: "Batteur110891"
	}
});

 var context = {
     listProducts: req.body.listProducts,
     listCollections: req.body.listCollections,
     firstName: req.body.name
 }
 console.log(context.listCollections)
 console.log(context.listProducts)
				// send mail with defined transport object
				transporter.sendMail({
                    from: '<erwan.raulo2015@campus-eni.fr>', // sender address
					to: req.body.email, // list of receivers
					subject: 'Melbourne B2B event: your order ! ', // Subject line
					text: 'your order', // plain text body
                    html: compiledTemplate(context) // html body
                }, (error, info) => {
					if (error) {
						return console.log(error);
					}
					res.json({"Error" : false, "Message" : "Email sent !"});
				});
});

router.get('/preview', function(req, res){
    res.render('email', {firstname: 'Erwan'})
});
				
				

  /*  router.put("/users",function(req,res){
        var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        var table = ["user_login","user_password",md5(req.body.password),"user_email",req.body.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Updated the password for email "+req.body.email});
            }
        });
    });*/

   /* router.delete("/users/:email",function(req,res){
        var query = "DELETE from ?? WHERE ??=?";
        var table = ["user_login","user_email",req.params.email];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                res.json({"Error" : false, "Message" : "Deleted the user with email "+req.params.email});
            }
        });
    });*/
}

module.exports = REST_ROUTER;