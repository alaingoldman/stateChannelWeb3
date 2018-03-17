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

  getChange = () => {
    firebase.database().ref("example").on("child_changed", function(snapshot, prevChildKey) {
        this.setState({data: snapshot.val()})
    }, this)
  }

  expressPost = () => {
    $.post("http://localhost:3000/firetest", {crap: "aaa", poop: "bbbb"}, function(data){
        alert("Response: " + data);
    });
  }

  render() {
    return (
    	<div className="imagebg bg--dark" >
          <div className="wrapBuffer">
            <h2 className="clickable"> Battle room <span className="redtext">click to reset</span></h2>
            <div className="hp-bar">
              your health
              <div className="hp-bar-active" />
            </div>
            <div className="hp-bar">
              enemy
              <div className="hp-bar-active enemy" />
            </div>
            <div className="redbutton" onClick={this.expressPost}>switpe attack</div>
            <div className="redbutton greenover" onClick={this.expressPost}>self heal</div>
            <div className="redbutton purpover" onClick={this.expressPost}>poison</div>
            {this.state.data}
          </div>
    	</div>
    );
  }
}

export default Firetest