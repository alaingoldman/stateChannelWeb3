const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

var firebase = require('firebase');
firebase.initializeApp({
	apiKey: 'AIzaSyCyVq3TQ-ZsE965YHSnzGnax-v25F8GUCk',
	authDomain: 'test-stre.firebaseapp.com',
	databaseURL: 'https://test-stre.firebaseio.com'
});

app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/firetest', function (req, res) {
	console.log(req.body);
  console.log("attempt push to firebase");
  // console.log(Moves[1]);
  // battle validations 
	// - get current battle from fb
	// - check if it's your turn
	// - check if you own those moves 
	// - check you and the other dude are not dead

	// let ref = firebase.database().ref("example");
  //   let val = Math.floor(Math.random() * Math.floor(1000));;
  //   let change = {
  //     "someVal": val
  //   };
  //   ref.set(change).then((f) => {
	// 	console.log("success!")
  //   }).catch((e) => {
	// 	console.log("error!")
  //   })
});

app.listen(process.env.PORT || 8080);	

var Moves = {
  1 : {
      isDamage: true, 
      delay: 0,
      duration: 0,
      accuracy: 0.93,
      effect: 0.5
  },
  2 : {
      isDamage: false, 
      delay: 0,
      duration: 0,
      accuracy: 0.93,
      effect: 0.5
  },
  3 : {
      isDamage: true, 
      delay: 1,
      duration: 3,
      accuracy: 0.93,
      effect: 0.5
  }
};