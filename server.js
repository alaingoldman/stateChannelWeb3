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

  // get the state of the battle
  firebase.database().ref("example").once("value", function(snapshot) {
    // console.log(snapshot.val());
    let moveSelected = Moves[parseInt(req.body.move)];
    let battleState = snapshot.val();

    let moveAccuracy = moveSelected.accuracy * 100; 
    for(var i = 0; i < 400; i++){
      let rollHit = Math.floor(Math.random() * 100 + 1);  // intended range is 1 - 100
      if (rollHit >= moveAccuracy){
        console.log("mis--------------------: ", rollHit);
      } else {
        console.log("hit: ", rollHit);
      }
    }
    
    // console.log(moveSelected);
    // for(var i = 0; i < 200; i++){
    //   let xxxx = Math.floor(Math.random() * 5);
    //   if(xxxx == 0){
    //     console.log("you missed: 0");
    //   }else{
    //     console.log("hit: " + xxxx);
    //   }
    // }
    // if damage 
      // calculate 
    // if not damage

    // console.log(battleState.attacker);
    // console.log(battleState.attacker.moves[parseInt(req.body.move)]);
    	// - get current battle from fb
      // - check if it's your turn
      // - check if you own those moves 
      // - check you and the other dude are not dead
  })
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