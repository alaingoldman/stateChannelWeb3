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

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  
  setChange = () => {
    let ref = firebase.database().ref("example");
    let val = this.getRandomInt(10000);
    let change = {
      "someVal": val
    };
    ref.set(change).then((f) => {
        // alert("success");
    }).catch((e) => {
        alert("error");
    })
  }

  getChange = () => {
    firebase.database().ref("example").on("child_changed", function(snapshot, prevChildKey) {
        this.setState({data: snapshot.val()})
    }, this)
  }

  render() {
    return (
    	<div className="imagebg bg--dark" >
            <h2> Welcome to firetest </h2>
            <div className="redbutton redbutton" onClick={this.setChange}>updates</div>
            {this.state.data}
    	</div>
    );
  }
}

export default Firetest