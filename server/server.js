var http = require('http');
var url = require('url');
var fs = require('fs');
var CryptoJS = require("crypto-js");
var nodemailer=require("nodemailer");
// var crypto = require('crypto');


var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 8080;
var fs = require('fs');
const path = require('path');
const { Client } = require('pg');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

conn = process.env.DATABASE_URL || "postgres://opmgpmcfwpmxql:cd340579afdb84b394f3f864d6169767d3b5571d4e12ee4f8390800a4723fe9a@ec2-54-92-174-171.compute-1.amazonaws.com:5432/dda7cseoas35iu"

const client = new Client(
{
  connectionString: conn,
  ssl: true
});
client.connect((err, res) => {
    if(err)
        console.log('failed to connect\n'+ err);
    else
        console.log("Connected!");
});


// var create_users_table=
// `CREATE TABLE IF NOT EXISTS
// users(
//     email VARCHAR(128) PRIMARY KEY NOT NULL,
//     password VARCHAR(128) NOT NULL
//     );`;
// client.query(create_users_table);

// var create_data_table=
// `CREATE TABLE data(
//   UserName VARCHAR(50) NOT NULL,
//   Data1 integer  NOT NULL,
//   Data2 integer  NOT NULL,
//   Lat decimal  NOT NULL,
//   Long decimal  NOT NULL
// );
// `
// client.query(create_data_table);

// var insert_data=
// `
// INSERT INTO data(UserName, Data1, Data2,Lat,Long)
// VALUES ('tamir@gmail.com', 5, 6,32.022455,32.0215454);

// INSERT INTO data(UserName, Data1, Data2,Lat,Long)
// VALUES ('tamir@gmail.com', 7, 8,26.321344,31.0012154);

// INSERT INTO data(UserName, Data1, Data2,Lat,Long)
// VALUES ('bar@gmail.com', 9, 10,24.455457,30.2321457);

// INSERT INTO data(UserName, Data1, Data2,Lat,Long)
// VALUES ('noam@gmail.com', 11, 12,35.321459,29.2345457);
// `
// client.query(insert_data);



// http.createServer(function (req, res) {
//   var q = url.parse(req.url, true);
//   var filename = "." + q.pathname;
//   fs.readFile(filename, function(err, data) {
//     if (err) {
//       res.writeHead(404, {'Content-Type': 'text/html'});
//       return res.end("404 Not Found");
//     }  
// 	res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     return res.end();
//   });
// }).listen(8080);
// // app.use('/login',       express.static(path.join(__dirname, 'login')));
// app.get('/MyCss.css', function(req, res) {
//   res.sendFile(__dirname + "/" + "MyCss.css");
// });
// app.use(express.static(__dirname));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use('/signUp',       express.static(path.join(__dirname)));

app.use('',             express.static(path.join(__dirname)));
app.use('/login',       express.static(path.join(__dirname)));
app.use('/mainView',       express.static(path.join(__dirname)));
app.use('/contactUs',       express.static(path.join(__dirname)));



app.get('/', function(req,res){
  res.redirect('/login/');
  console.log("Requested Main Menu, Opening \"login\" page by defualts.");
});

app.get('/login', function(req,res){
  res.sendFile(path.join(__dirname  + '/login.html'));
  console.log("Requested login via get");
});

app.post('/login',function(req,res){
  console.log(req.body);
  var userName= req.body.userName.toLowerCase();
  console.log(userName);
  var password= req.body.password;
  var query = "SELECT * FROM users WHERE email='"+userName+"'";
  console.log(query);
  client.query(query).then(results => {
      var resultsFound = results.rowCount;
      if (resultsFound == 1){
        var data=results.rows[0];
        psw= data.password;
        var password_dec= decryptPassword(psw);
        if (password_dec == password){
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end(JSON.stringify(data));
        }
        else{
          console.log("wrong password")
          res.writeHead(400);
          res.end();
        }

      }
      else{
        console.log("login failed")
        res.writeHead(400);
        res.end();
      }
  }).catch(() => {
    console.error("DB failed in Login attempt");
  });
});


app.get('/signUp', function(req,res){
  res.sendFile(path.join(__dirname  + '/signup.html'));
  console.log("Requested signup via get");
});

app.post('/signUp',function(req,res){
  console.log(req.body);
  var userName= req.body.email.toLowerCase();

  var password= req.body.password;
  
  var encrype_password=encryptPassword(password);
  var query="SELECT * FROM users WHERE email='"+userName+"'";
  client.query(query).then(results =>{
    var resultsFound = results.rowCount
    if (resultsFound != 0)
    {
      //already exists
      console.log("user exists");;
      res.writeHead(404);
      res.send();
      return;
    }
    client.query("INSERT INTO users(email, password) VALUES ('"+userName+"', '"+encrype_password+"');").then(()=> {
      //new user add successfuly
      console.log("new user added successfuly");
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testForBraude@gmail.com',
          pass: 'Aa123456!'
        }
      });

      var mailOptions = {
        from: 'testForBraude@gmail.com',
        to: userName,
        subject: 'Sending Email using Node.js',
        text: 'Congratulations you are a new member in our site !' 
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {

                  res.writeHead(404);
      res.end();
          console.log(error);
        } else {

          console.log('Email sent: ' + info.response);
        }
      });
      res.writeHead(200);
      res.end();
      return;
    }).catch(()=>{
      //failed to insert new user
      console.log("failed to add new user");
      res.writeHead(404);
      res.end();
    });

  });

});

app.get('/mainView', function(req,res){
  res.sendFile(path.join(__dirname  + '/mainView.html'));
  console.log("Requested main view via get");
});



app.post('/forgetPassword' , function(req,res){
  var userName = req.body.email
  userName =userName.toLowerCase();
  console.log(userName);
  var query = "SELECT * FROM users WHERE email='"+userName+"'";
  client.query(query).then(results => {
      var resultsFound = results.rowCount;
      if (resultsFound == 1){
        var data=results.rows[0];
        psw= data.password;
        var password_dec= decryptPassword(psw);
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'testForBraude@gmail.com',
            pass: 'Aa123456!'
          }
        });

        var mailOptions = {
          from: 'testForBraude@gmail.com',
          to: userName,
          subject: 'Sending Email using Node.js',
          text: 'Your password is: '+ password_dec
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {

                    res.writeHead(404);
        res.end();
            console.log(error);
          } else {
            res.writeHead(200);
            res.end();
            console.log('Email sent: ' + info.response);
          }
        });
      }
      else{
        console.log("user not exists")
        res.writeHead(404);
        res.end();
      }
  }).catch(() => {
    console.error("DB failed in Login attempt");
  });

});


app.post('/getUserData', function(req, res){
  user_email = req.body.email;
  query = "SELECT * FROM data WHERE UserName='"+user_email+"'";
  console.log(query);

  client.query(query).then(reults => {

    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(reults.rows));

  }).catch(() => {

    console.error("DB failed in attempt");

  });


});


app.post('/sendContuctMail', function(req,res){

  var name= req.body.name;
  var email= req.body.email;
  var subject= req.body.subject;
  var message= req.body.message;

  var mailBody = "Name : "+name+"\nEmail : "+email+"\nSubject : "+subject+"\nMessage : "+message;

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testForBraude@gmail.com',
      pass: 'Aa123456!'
    }
  });

  var mailOptions = {
    from: 'testForBraude@gmail.com',
    to: 'testForBraude@gmail.com',
    subject: 'Sending Email using Node.js',
    text: 'Contact Us message: \n'+ mailBody
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {

              res.writeHead(404);
  res.end();
      console.log(error);
    } else {
      res.writeHead(200);
      res.end();
      console.log('Email sent: ' + info.response);
    }
  });
});

app.get('/contactUs', function(req,res){
  res.sendFile(path.join(__dirname  + '/contact.html'));
  console.log("Requested main view via get");
});


 function encryptPassword(password){
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(password), 'secret key 123');
  var ciphertext= ciphertext.toString();
  return ciphertext;
}


function decryptPassword(ciphertext){
  console.log("start decrypt")
  var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}






// app.listen(port);
// console.log('Server started! At http://localhost:' + port );  
var server = app.listen(port, function () {
  console.log('Node server is running..');
});

