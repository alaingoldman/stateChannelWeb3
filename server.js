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
  for(var i = 0; i < 100; i++){ 
  // console.log(req.body);

  // get the state of the battle
  // firebase.database().ref("example").once("value", function(snapshot) {
    // VALIDATIONS HERE ::::::::::::::::
      // - check if it's your turn
      // - check if you own those moves 
      // - check you and the other dude are not dead


    // LOCAL VARIABLES ::::::::::::::
    let monsterBp = 1000; //////////// to be changed <-----
    let moveSelected = Moves[parseInt(req.body.move)];
    // let battleState = snapshot.val();
    let battleState = {
      attacker: {
          bp: 123,
          hp: 123, 
          moves: [1,2,3]
      },
      defender: {
          bp: 123,
          hp: 123, 
          moves: [1,2,3]
      },
      turn: 0 
    }
    let moveAccuracy = moveSelected.accuracy * 100; 
    let effectPoints;
    let criticalHit;
    let targetHit;

    // CALCULATE HIT CHANCE ::::::::::
    let rollHit = Math.floor(Math.random() * 100 + 1);  // range is 1 - 100
    rollHit > moveAccuracy ? targetHit = false : targetHit = true;

    // CALCULATE CRIT CHANCE :::::::::
    rollHit <= (1 + moveSelected.criticalBonus) ? criticalHit = true : criticalHit = false;

    // CALCULATE DMG/HEAL ::::::::::::::
    if (targetHit) {
      if (criticalHit){
        console.log("!!!!!!!");
        effectPoints = Math.floor(moveSelected.effect * monsterBp * 1.8);
      } else {
        let battlePointVariance = Math.floor(0.2 * monsterBp);
        let bpRandomizer = Math.floor(Math.random() * battlePointVariance + 1);
        if (bpRandomizer == (battlePointVariance / 2)) {
          effectPoints = monsterBp;
        }else if (bpRandomizer < (battlePointVariance / 2)){
          effectPoints = monsterBp - bpRandomizer;
        }else {
          effectPoints = monsterBp + bpRandomizer;
        }
      }
      // let damageAverage =  moveSelected.effect 
      // criticalHit ? a = 12 : a = 13 ;
    } else {
      effectPoints = 0;
      // push that to firebase and increae turn 
    }
    console.log(effectPoints);
    // console.log(rollHit, criticalHit);
    // CALCULATE EFFECT :::::::::::
    // }

    // end scenario 
    // increase turn 

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
  }
  // })
});

app.listen(process.env.PORT || 8080);	

var Moves = {
  1 : {
      // swipe
      isDamage: true, 
      delay: 0,
      duration: 0,
      accuracy: 0.93,
      effect: 0.5,
      criticalBonus: 25
  },
  2 : {
      // heal
      isDamage: false, 
      delay: 0,
      duration: 0,
      accuracy: 1,
      effect: 0.5,
      criticalBonus: 0
  },
  3 : {
      // poison
      isDamage: true, 
      delay: 1,
      duration: 3,
      accuracy: 0.90,
      effect: 0.5,
      criticalBonus: 0
  }
};