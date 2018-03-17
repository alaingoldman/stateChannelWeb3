import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as firebase from 'firebase';


class Firetest extends Component {
  constructor(props){
    super(props);
    this.state = {
        loading: true,
        data: {}
    }
    this.getInitial();
    this.getChange();
  }

  resetRoom = () => {
    let ref = firebase.database().ref("example");
      let value = {
        attacker: {
            bp: 123,
            hp: 123, 
            moves: [1,2,3]
        },
        defender: {
            bp: 123,
            hp: 100, 
            moves: [1,2,3]
        },
        turn: 0 
      }
      ref.set(value).then((f) => {
        console.log("success!")
      }).catch((e) => {
        console.log("error!")
      })
  }

  getInitial = () => {
    firebase.database().ref("example").once("value", function(snapshot) {
      this.setState({loading: false, data: snapshot.val()});
    }, this)
  }

  getChange = () => {
    firebase.database().ref("example").on("child_changed", function(snapshot, prevChildKey) {
        this.setState({data: snapshot.val()});
    }, this)
  }

  expressPost = (e) => {
    let move = parseInt(e.target.attributes["data-move"].value)
    $.post("http://localhost:3000/firetest", { move: move }, function(data){
        alert("Response: " + data);
    });
  }

  render() {
    let enemyHealthWidth  = {width: '100%'};
    let playerHealthWidth = {width: '100%'};
    
    if (!this.state.loading){
      let enemeyHelth = parseInt((this.state.data.defender.hp / this.state.data.defender.bp) * 100) + "%";
      enemyHealthWidth = { width: enemeyHelth };
      let playerHelth = parseInt((this.state.data.attacker.hp / this.state.data.attacker.bp) * 100) + "%";
      playerHealthWidth = { width: playerHelth };
    }
    return (
    	<div className="imagebg bg--dark">
          <div className="wrapBuffer">
            <h2 className="clickable" onClick={this.resetRoom}> Battle room <span className="redtext">click to reset</span></h2>
            <div className="hp-bar">
              your health
              <div className="hp-bar-active player" style={playerHealthWidth}/>
            </div>
            <div className="hp-bar">
              enemy
              <div className="hp-bar-active enemy" style={enemyHealthWidth}/>
            </div>
            <div className="redbutton" onClick={this.expressPost} data-move="1">switpe attack</div>
            <div className="redbutton greenover" onClick={this.expressPost} data-move="2">self heal</div>
            <div className="redbutton purpover" onClick={this.expressPost} data-move="3">poison</div>
            {/*this.state.data*/}
          </div>
    	</div>
    );
  }
}

export default Firetest