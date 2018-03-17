import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as firebase from 'firebase';


class Firetest extends Component {
  constructor(props){
    super(props);
    this.state = {
        data: ""
    }
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
            hp: 123, 
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

  getChange = () => {
    firebase.database().ref("example").on("child_changed", function(snapshot, prevChildKey) {
        this.setState({data: snapshot.val()})
    }, this)
  }

  expressPost = (e) => {
    let move = parseInt(e.target.attributes["data-move"].value)
    $.post("http://localhost:3000/firetest", { move: move }, function(data){
        alert("Response: " + data);
    });
  }

  render() {
    return (
    	<div className="imagebg bg--dark" >
          <div className="wrapBuffer">
            <h2 className="clickable" onClick={this.resetRoom}> Battle room <span className="redtext">click to reset</span></h2>
            <div className="hp-bar">
              your health
              <div className="hp-bar-active" />
            </div>
            <div className="hp-bar">
              enemy
              <div className="hp-bar-active enemy" />
            </div>
            <div className="redbutton" onClick={this.expressPost} data-move="1">switpe attack</div>
            <div className="redbutton greenover" onClick={this.expressPost} data-move="2">self heal</div>
            <div className="redbutton purpover" onClick={this.expressPost} data-move="3">poison</div>
            {this.state.data}
          </div>
    	</div>
    );
  }
}

export default Firetest