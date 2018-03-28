const nodemailer = require('nodemailer');

//Generate test SMTP service account from ethereal.email 
//Only needed if u don't havee a real mail account for testing

nodemailer.createTestAccount((err, account)=>{
    let transporter  = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: "erwan.raulo2015@campus-eni.fr",
            pass: "Batteur110891"
        }
    });

    //setup email data with unicode symbols
    let mailOptions ={
        from: '"Erwan Raulo" <erwan.raulo2015@campus-eni.fr>',
        to: "erwan.raulo@ynov.com",
        subject: "Hello ",
        text: " Hello World",
        html: "<b>test?</b>"
    };

    //send email with defined transport object
    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            return console.log(eror);
        }
        console.log("message sent: %s", info.messageId);
        console.log("preview url: %s", nodemailer.getTestMessageUrl(info));

    })
})