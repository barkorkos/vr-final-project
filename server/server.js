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

conn = process.env.DATABASE_URL || "postgres://kladcejyakzuuh:4c771fa9bedf54a64a477752590197321111e3b664add1c265606cd5a773d57c@ec2-52-87-58-157.compute-1.amazonaws.com:5432/dctsdce3c6fdck"

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


// Express 4.0
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
// app.use('/signUp',       express.static(path.join(__dirname)));

// app.use('',             express.static(path.join(__dirname)));
// app.use('/login',       express.static(path.join(__dirname)));
// app.use('/mainView',       express.static(path.join(__dirname)));
// app.use('/contactUs',       express.static(path.join(__dirname)));



app.get('/test', function(req, res){
  var i= 0;
  for (i =0 ; i<1000; i++){
    console.log(i);
  }
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify({'message': 'yayyyyy!!!!'}));
  
});



app.get('/getActivePatient', function(req, res){
  console.log(req.body);
  var query = `select * from PatientInTherapy join Patients on  PatientInTherapy.patientid = Patients.id where "isActive" = true;`

  client.query(query).then(results => {
    var resultsFound = results.rowCount;
    if (resultsFound == 1){
      var data = results.rows[0];
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end(JSON.stringify(data));
    }
    else{
      res.writeHead(400);
      res.end();
    }
}).catch(() => {
  console.error("DB failed in Login attempt");
});

  
});


app.post('/savePlayerResults', function(req, res){
  console.log(req.body);
  var query = `update PatientInTherapy set learning_rate=`+req.body.learning_rate+`,discount_factor=`+req.body.discount_factor+`,
               random_explore=`+req.body.random_explore+`, "isActive"=false, iterations_number=`+req.body.iterations_number+`
               where  PatientInTherapy.patientid = '`+req.body.id+`' and PatientInTherapy.hand_in_therapy='`+req.body.hand_in_therapy+`' and PatientInTherapy.game_name='`+req.body.game_name+`';`
  console.log(query);


  client.query(query).then(results => {

      console.log(results); 

      res.writeHead(200);
      res.end();
    }
).catch(() => {
  console.error("DB failed in Login attempt");
  res.writeHead(400);
  res.end()
});

  
});


app.post('/savePlayerRewardTable', function(req, res){
  console.log(req.body);
  var query = `update PatientInTherapy set reward_table='`+req.body.rewards_table+`'
               where  PatientInTherapy.patientid = '`+req.body.id+`' and PatientInTherapy.hand_in_therapy='`+req.body.hand_in_therapy+`' and PatientInTherapy.game_name='`+req.body.game_name+`';`
  console.log(query);


  client.query(query).then(results => {

      console.log(results);

      res.writeHead(200);
      res.end();
    }
).catch(() => {
  console.error("DB failed in Login attempt");
  res.writeHead(400);
  res.end()
});

  
});


app.post('/savePlayerQTable', function(req, res){
  console.log(req.body);
  var query = `update PatientInTherapy set qtable= '`+req.body.qtable+`'
               where  PatientInTherapy.patientid = '`+req.body.id+`' and PatientInTherapy.hand_in_therapy='`+req.body.hand_in_therapy+`' and PatientInTherapy.game_name='`+req.body.game_name+`';`
  console.log(query);


  client.query(query).then(results => {

      console.log(results);

      res.writeHead(200);
      res.end();
    }
).catch(() => {
  console.error("DB failed in Login attempt");
  res.writeHead(400);
  res.end()
});

  
});



app.post('/savePlayerLastAppearnce', function(req, res){
  console.log(req.body);
  var query = `update PatientInTherapy set last_appearance='`+req.body.last_apperance_table+`'
               where  PatientInTherapy.patientid = '`+req.body.id+`' and PatientInTherapy.hand_in_therapy='`+req.body.hand_in_therapy+`' and PatientInTherapy.game_name='`+req.body.game_name+`';`
  console.log(query);


  client.query(query).then(results => {

      console.log(results);

      res.writeHead(200);
      res.end();
    }
).catch(() => {
  console.error("DB failed in Login attempt");
  res.writeHead(400);
  res.end()
});

  
});



// app.listen(port);
// console.log('Server started! At http://localhost:' + port );  
var server = app.listen(port, function () {
  console.log('Node server is running..');
});

