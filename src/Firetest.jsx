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
            <h2> Welcome to firetest </h2>
            <div className="redbutton greenover" onClick={this.expressPost}>post to express</div>
            {this.state.data}
    	</div>
    );
  }
}

export default Firetest