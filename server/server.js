var http = require('http');
var url = require('url');
var fs = require('fs');
var CryptoJS = require("crypto-js");
var nodemailer=require("nodemailer");
// var crypto = require('crypto');


var express = require('express');
var jwt = require('jwt-simple');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var port = process.env.PORT || 8080;
var fs = require('fs');
const path = require('path');
const { Client } = require('pg');

app.set('jwtTokenSecret' , 'YOUR_SECRET_STRING');

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

app.use(cors());
// Express 4.0
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
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



app.get('/getActivePatient',function(req, res){
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
      var datetime = new Date();
      console.log(results); 
      var query2 = `INSERT INTO treatmentshistory (patientid, game_name, hand_in_therapy, treatment_time, treatment_duration, bubble_timeout, learning_rate, discount_factor, random_explore, rewards_table, qtable, last_appearance)
                    values ('`+req.body.id+`', 'bubbles', '`+req.body.hand_in_therapy+`', '`+datetime.toISOString()+`', `+req.body.game_duraion+`, `+req.body.bubble_timeout+`,`+req.body.learning_rate+`, `+req.body.discount_factor+`,`+req.body.random_explore+`, '`+
                    req.body.rewards_table+`', '`+req.body.qtable+`', '`+req.body.last_appearance+`' );`
      console.log(query2);
      client.query(query2).then(results2 => {
        console.log(results2);
        res.writeHead(200);
        res.end();
      }).catch(()=>{
        console.error("DB failed in Login attempt");
        res.writeHead(400);
        res.end()
      })

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


/*login*/
app.post('/login', function(req,res){
  var terapist = req.body;
  console.log(terapist);

  var query = `select * from terapists where user_id = '`+terapist.id+`'`;
  console.log(query);
  client.query(query).then(results => {
    console.log(results);
    var resultsFound = results.rowCount;
    if(resultsFound == 1)
    {
      var data=results.rows[0];
      password = data.password;
      console.log(password);
      var dec_password = decryptPassword(password);
      if( dec_password == terapist.password)
      {
        //var expires = moment().add('days',7).valueOf();
        console.log(dec_password);
        var token = jwt.encode({
          iss: terapist.id,
          //exp: exoires
        }, app.get('jwtTokenSecret'));

        res.status(200);
        res.json({
          token : token,
          //expires: expires,
          user: terapist
        
        });
      }
      else{
        console.log("wrong Password!!");
        res.status(400);
        res.json();
      }
    }
    else{
      console.log("user not exist!!");
      res.status(400);
      res.json();
    }
  }).catch(() => {
    console.error("DB failed in Login attempt");
    res.writeHead(400);
    res.end()
  });
 
});

/*update patient details */
app.patch('/patients/:id/', function(req, res){
  var patient = req.body;
  var query = `UPDATE patients 
               SET id = '`+patient.id+`', first_name = '`+patient.firstName+`',
                   last_name = '`+patient.lastName+`', height = `+patient.height+`,
                   birthday = '`+patient.birthday+`', email_address = '`+patient.email+`',
                   details = '`+patient.comments+`', address = '`+patient.address+`',
                   phone = '`+patient.phone+`'
               WHERE id = '`+patient.id+`'`;
 
  console.log(query);

  client.query(query).then(results => {
    console.log(results);

    res.status(200);
    res.json(patient);
    }
  ).catch(() => {
    console.error("DB failed in Login attempt");
    res.writeHead(400);
    res.end()
  });


});


/*serch patient by id and get his details*/
app.get('/patients', function(req, res){
  console.log("@@@@@");
  console.log(req.query);
  var id = req.query.id;
  var query1 = `SELECT * from patients where id = '`+id+`'`;
  console.log(query1);
  var patientsDetails;

  client.query(query1).then(results => {
    var resultsFound = results.rowCount;
    console.log(results);
    if (resultsFound == 1){
      var data = results.rows[0];
      console.log(data);
      patientsDetails = data;
  
      var query2 = `SELECT * from treatmentsHistory where patientid = '`+id+`'`;
      console.log(query2);
////////////////////////////////////////////
        client.query(query2).then(results => {
          var resultsFound = results.rowCount;
          console.log(results);
          if (resultsFound >= 0){
            var history = results.rows;
            console.log(history); 
            console.log("hiiiiiiiiiiii")
     
            patientsDetails['history'] = history;
            console.log(patientsDetails)
            
            res.status(200);
            res.json(patientsDetails);
          }
          else{
            res.writeHead(400);
            res.end();
          }
          }).catch((error) => {
          console.log(error);
          console.error("DB failed in history attempt");
        });

    }
    else{
      res.status(404);
      res.json();
    }
    }).catch((error) => {
      console.log(error);
      console.error("DB failed in Login attempt");
    });
});

/*start new treatment*/
app.post('/treatment', function (req, res) {
  console.log("@@***addNewTreatmenttttt***@@@");
  console.log(req.body);
  var treatment = req.body;
  var query = `select * from patients where id = '` + treatment.id + `'`;
  client.query(query).then(results => {
    var resultsFound = results.rowCount;
    if (resultsFound == 1) {

      var query1 = `select * from patientintherapy where patientid = '` + treatment.id + `' and hand_in_therapy = '` + treatment.patientDetails.newHand + `'`;
      console.log(query1);

      client.query(query1).then(results => {
        var resultsFound = results.rowCount;
        if (resultsFound == 1) {
          console.log("found an element, just updating!!!!");
          var data = results.rows[0];

          var query2 = `UPDATE patientintherapy SET "isActive" = true,
                                                      bubble_time_out = `+ treatment.patientDetails.newBubbleTimeOut + ` ,
                                                      treatment_time = `+ treatment.patientDetails.newDurationTime * 60 + `	
                                                  WHERE
                                                      patientid = '`+ treatment.id + `' and hand_in_therapy = '` + treatment.patientDetails.newHand + `'`;
          console.log(query2);
          client.query(query2).then(results => {
            console.log(results);
            res.status(200);
            res.json(treatment);
          }
          ).catch(() => {
            console.error("DB failed in update db");
            //res.json({'error':'User already Exists'});
            res.writeHead(400);
            res.end()
          });

        }
        else {
          console.log("element was not update, need to insert to db!!!!!");
          var query3 = `INSERT INTO patientintherapy (patientid, game_name, hand_in_therapy,"isActive", bubble_time_out, treatment_time, iterations_number)
                          VALUES ('`+ treatment.id + `', 'bubbles', '`
            + treatment.patientDetails.newHand + `', true,`
            + treatment.patientDetails.newBubbleTimeOut + `,` + treatment.patientDetails.newDurationTime * 60 + `,0);`;
          console.log(query3);
          client.query(query3).then(results => {
            console.log(results);
            res.status(200);
            res.json(treatment);
          }
          ).catch(() => {
            console.error("DB failed in insert to db");
            //res.json({'error':'User already Exists'});
            res.writeHead(400);
            res.end()
          });

        }
      }).catch((error) => {
        console.log(error);
        console.error("DB failed in selcet attempt");
      });
    }
    else{
      res.status(200);
      console.log("hereee in am")
      res.json(null);

    }
  }).catch((error) => {
    console.log(error);
    console.error("DB failed in find user for start treatment attempt");
  });
});

 

/*get details of last treatment*/
app.get('/treatment', function(req, res){
  console.log("*******@@treatment@@*********");
  console.log(req.query);
  var id = req.query.id;
  var query = `select * from patients where id = '` + id + `'`;
  client.query(query).then(results => {
    var resultsFound = results.rowCount;
    console.log(results);
    console.log(resultsFound);
    if (resultsFound ==1)
    {
          var query1 = `SELECT * from treatmentshistory where patientid = '`+id+`' order by treatment_time desc`;
          console.log(query1);

          client.query(query1).then(results => {
            var resultsFound = results.rowCount;
            console.log(results);
            console.log(resultsFound);
            if (resultsFound >=1){
              var data = results.rows[0];
              console.log(data);
              res.status(200);
              res.json(data);
            }
            else{
              res.status(200);
              console.log("hereee in am")
              res.json(null);
            }
          }).catch((error) => {
              console.log(error);
              console.error("DB failed in Login attempt");
          });
    }
     else{
      res.writeHead(400);
      res.end()
       console.log("user is not existt!")
       res.json(null);
     }
    }).catch((error) => {
      console.log(error);
      console.error("DB failed in find user for search for treatment attempt");
    });
});




/*add new patient */

app.post('/patients', function(req, res){
  var patient = req.body;
  var query = `INSERT INTO patients (id, first_name, last_name,height, birthday,
                         email_address, details, address, phone)
               VALUES ('`+patient.id + `', '` + patient.firstName + `', '`
                        + patient.lastName +`',` + patient.height +`,'`
                        + patient.birthday+`','` + patient.email + `','`
                        + patient.comments+`','` + patient.address + `','` + patient.phone + `');`;

  client.query(query).then(results => {
    res.json(patient);
    res.writeHead(200);
    res.end();
    }
  ).catch(() => {
    console.error("DB failed in Login attempt");
    //res.json({'error':'User already Exists'});
    res.writeHead(400);
    res.end()
  });




  // console.log(req);

});


app.patch('/terapists/:id', function(req, res){
  var terapist = req.body;
  console.log(terapist);
  if (terapist.firstName){
  console.log("update details");
  var query = `UPDATE terapists SET 
                  first_name = '`+terapist.firstName+`',
                  last_name = '`+ terapist.lastName+`',
                  email = '`+terapist.email+`',
                  address = '`+terapist.address+`',
                  phone = '`+terapist.phone+`'
              WHERE user_id='`+terapist.id+`'`;
  }
  else if (terapist.newPassword){
    console.log("change Password");
    password = encryptPassword(terapist.newPassword);
    var query = `UPDATE terapists SET 
    password = '`+password+`'
    WHERE user_id='`+terapist.id+`'`;
  }
  console.log(query);
  client.query(query).then(results => {
    console.log(results);
    res.status(200)
    res.json(terapist);
    }
  ).catch(() => {
    console.error("DB failed in Login attempt");
    //res.json({'error':'User already Exists'});
    res.writeHead(400);
    res.end()
  });

});

app.get('/terapists', function(req, res){
  terapist_id = req.query.id;
  var query = `SELECT * FROM terapists WHERE user_id = '`+terapist_id+`'`;
  console.log(query);
  client.query(query).then(results => {
    // console.log(results);
    terapist = results.rows[0];
    // console.log(terapist);
    terapist.password = decryptPassword(terapist.password);;
    res.status(200);
    res.json(terapist);
    }
  ).catch(() => {
    console.error("DB failed in Login attempt");
    //res.json({'error':'User already Exists'});
    res.writeHead(400);
    res.end()
  });

  // console.log(req);

});


app.post('/terapists', function(req, res){
  var terapist = req.body;
  console.log(terapist);
  password = encryptPassword(terapist.newPassword);
  console.log(password)

  var query = `INSERT INTO terapists (user_id, first_name, last_name, email, phone, address, password)
               VALUES ('`+terapist.id + `', '`+ terapist.firstName + `', '`
                        + terapist.lastName +`','` + terapist.email +`','`
                        + terapist.phone+`','` + terapist.address + `','`
                        + password +`');`;
  console.log(query); 
  client.query(query).then(results => {
    res.json(terapist);
    res.writeHead(200);
    res.end();
    }
  ).catch(() => {
    console.error("DB failed in Login attempt");
    //res.json({'error':'User already Exists'});
    res.writeHead(400);
    res.end()
  });

  // console.log(req);

});

var server = app.listen(port, function () {
  console.log('Node server is running..');
});


function encryptPassword(password){
  var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(password), 'secret key 123');
  var ciphertext= ciphertext.toString();
  return ciphertext;
}

function decryptPassword(ciphertext){
  var bytes  = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
