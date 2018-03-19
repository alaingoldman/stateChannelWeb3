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
  firebase.database().ref("example").once("value", function(snapshot) {
    // WHO IS ATTACKER WHO IS DEFENDER 
    
    // VALIDATIONS HERE ::::::::::::::::
      // - check if you are in this battle
      // - check if it's your turn
      // - check if you own those moves 
      // - check you and the other dude are not dead


    // LOCAL VARIABLES ::::::::::::::
    let monsterBp = 123; //////////// to be changed <-----
    let moveSelected = Moves[parseInt(req.body.move)];
    let battleState = snapshot.val();
    // let battleState = {
    //   attacker: {
    //       bp: 123,
    //       hp: 123, 
    //       moves: [1,2,3]
    //   },
    //   defender: {
    //       bp: 123,
    //       hp: 123, 
    //       moves: [1,2,3]
    //   },
    //   turn: 0 
    // }
    let moveAccuracy = moveSelected.accuracy * 100; 
    let effectPoints;
    let criticalHit;
    let targetHit;

    // CALCULATE HIT/CRIT CHANCE ::::::::::
    let rollHit = Math.floor(Math.random() * 100 + 1);  // range is 1 - 100
    rollHit > moveAccuracy ? targetHit = false : targetHit = true;
    rollHit <= (1 + moveSelected.criticalBonus) ? criticalHit = true : criticalHit = false;

    // CALCULATE DMG/HEAL ::::::::::::::
    if (targetHit) {
      if (criticalHit){
        console.log("CRIT!");
        effectPoints = Math.floor(moveSelected.effect * monsterBp * 1.8);
      } else {
        let battlePointVariance = Math.floor(0.2 * monsterBp);
        let bpRandomizer = Math.floor(Math.random() * battlePointVariance + 1);
        if (bpRandomizer == (battlePointVariance / 2)) {
          console.log("median");
          effectPoints = Math.floor(monsterBp * moveSelected.effect);
        }else if (bpRandomizer < (battlePointVariance / 2)){
          console.log("Under median");
          effectPoints = Math.floor(monsterBp * moveSelected.effect - bpRandomizer);
        }else {
          console.log("Above median");
          effectPoints = Math.floor(monsterBp * moveSelected.effect + bpRandomizer);
        }
      }
    } else {
      console.log("Miss :(");
      effectPoints = 0;
    }
    console.log(effectPoints);

    // checks if heal or damage
    if(moveSelected.isDamage){
      battleState.defender.hp = battleState.defender.hp - effectPoints;
    }else {
      battleState.attacker.hp = battleState.attacker.hp + effectPoints;
    }
    battleState.turn = battleState.turn + 1;
    let ref = firebase.database().ref("example");
    ref.set(battleState).then((f) => {
      // this.setState({ data: value });
      console.log("success!")
    }).catch((e) => {
      console.log("error!")
    })
  });

  });

app.listen(process.env.PORT || 8080);	

var Moves = {
  1 : {
      // swipe
      isDamage: true, 
      delay: 0,
      duration: 0,
      accuracy: 0.93,
      effect: 0.1,
      criticalBonus: 5
  },
  2 : {
      // heal
      isDamage: false, 
      delay: 0,
      duration: 0,
      accuracy: 1,
      effect: 0.1,
      criticalBonus: 0
  },
  3 : {
      // poison
      isDamage: true, 
      delay: 1,
      duration: 3,
      accuracy: 0.90,
      effect: 0.1,
      criticalBonus: 0
  }
};