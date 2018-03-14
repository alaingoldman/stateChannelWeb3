import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import * as firebase from 'firebase';


class Firetest extends Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  someChange = () => {
    // alert("something");
    // let q = firebase.database().ref(web3.eth.accounts[0]);
    // let referalInfo = {
    //   "username": "dipshit3000"
    // };
    // q.set(referalInfo).then((f) => {
    //     alert("success");
    // }).catch((e) => {
    //     alert("error");
    // })
  }

  render() {
    return (
    	<div className="imagebg bg--dark" >
            <h2> Welcome to firetest </h2>
            <div className="redbutton redbutton" onClick={this.someChange}>update in firebase</div>
    	</div>
    );
  }
}

export default Firetest