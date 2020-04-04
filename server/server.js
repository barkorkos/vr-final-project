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








app.post('/test', function(req, res){

  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({'message': 'yayyyyy!!!!'}));

});


// app.listen(port);
// console.log('Server started! At http://localhost:' + port );  
var server = app.listen(port, function () {
  console.log('Node server is running..');
});

