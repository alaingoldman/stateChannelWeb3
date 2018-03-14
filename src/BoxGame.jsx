import React, { Component } from 'react';
import $ from 'jquery';
import firebae from 'firebase';
import sha3 from 'solidity-sha3'
import web3Utils  from 'web3-utils';
import { keccak256 } from 'js-sha3';
import * as firebase from 'firebase';

import Web3 from 'web3';
import util from 'ethereumjs-util'; 

var web3 = window.web3
var StateChannelContract;

class BoxGame extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            self: "0x6e6048503d4686def8eD5c968f653ce54F490e42",
            target: "0x6DFE44316C39132a4AA4603Cb4cBb204ed5C428F",
            contractInstance: null,
            expiredChannel: false,
            channelId: null,
            signedMessage: "0x0aa8db967db02f882950127eefa0fe875aff4b8368c126a8f01b6b3bdc29836279032291874d3a194b76b69c3040a99024a4c02d9712249de0a1f928e23cc5971b"
        }
    }

    componentWillMount() {
        var config = {
          apiKey: 'AIzaSyCyVq3TQ-ZsE965YHSnzGnax-v25F8GUCk',
          authDomain: 'test-stre.firebaseapp.com',
          databaseURL: 'https://test-stre.firebaseio.com'
        };

        firebase.initializeApp(config);
    }

    runQueries() {
        if(!this.state.contractInstance) { return; }
        let channelId;
        let that = this;
        // get the channel of our chat
        this.state.contractInstance.GetChannelId(this.state.self, this.state.target,  (err, result) => {
            if (err !== null){ return; }
            // if there is no channel
            if (result == "0x0000000000000000000000000000000000000000000000000000000000000000"){
                that.setState({channelId: null, expiredChannel: false, loading: false});
                return;
            }
            channelId = result;
            // ok we have the channel but is it still open
            this.state.contractInstance.GetTimeout(channelId,  (err, result) => {
                if (err !== null){ 
                    that.setState({channelId: channelId});
                    return; 
                }
                let d = new Date();
                let secs_since_epoch = Math.round(d.getTime() / 1000);
                if (result.toNumber() > secs_since_epoch){
                    // it means that you channel is open 
                    that.setState({channelId: channelId, expiredChannel: false, loading: false});
                }else {
                    // it means that your channel time is over
                    that.setState({channelId: channelId, expiredChannel: true, loading: false});
                }
            });
        });

    }

    componentDidMount(){
        setInterval(this.checkForMetamask.bind(this), 250);
        setInterval(this.runQueries.bind(this), 250)
    }

    checkForMetamask(){
        if(!web3){return}
        if(this.state.w3){ return } // makes sure web3 is injected
        if(web3.eth.accounts.length === 0){ return }// checks if metamask is locked
        if (typeof web3 !== 'undefined') {
          this.web3 = web3.currentProvider;
          web3 = new Web3(web3.currentProvider);
          var accounts = web3.eth.accounts;
          this.setState({w3: true, currentWallet: web3.eth.accounts[0]});
          StateChannelContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"}],"name":"GetChannelId","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"bytes32"}],"name":"GetDeposit","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"timeout","type":"uint256"}],"name":"OpenChannel","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"h","type":"bytes32[4]"},{"name":"v","type":"uint8"},{"name":"value","type":"uint256"}],"name":"CloseChannel","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"id","type":"bytes32"}],"name":"ChannelTimeout","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"bytes32"}],"name":"GetTimeout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"h","type":"bytes32[4]"},{"name":"v","type":"uint8"},{"name":"value","type":"uint256"}],"name":"VerifyMsg","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"bytes32"}],"name":"GetSender","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"id","type":"bytes32"}],"name":"GetRecipient","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"}])
          this.state.contractInstance = StateChannelContract.at("0xaDc53dD995C93FCbE42AFA485610F711f3A78Da6");
          console.log("setup?");
        }
    }

    handleSubmit(target) {
        //web3.eth.sendTransaction(params, callback)
    }

    openStateChannel(){
        this.state.contractInstance.OpenChannel(this.state.target, 6000, {from: this.state.currentWallet, value: 3},  (err, result) => {
            console.log("opened a state channel", result);
        })
    }

    timeoutChannel(){   
        let that = this;
        this.state.contractInstance.ChannelTimeout(this.state.channelId, {from: this.state.currentWallet, gasPrice: 5000000000},  (err, result) => { })
    }

    toHex(str) {
        var hex = '';
        for(var i=0;i<str.length;i++) {
            hex += ''+str.charCodeAt(i).toString(16);
        }
        return hex;
    }

    sendMessage() {
        let that = this;
        // var msg = "Lorem ipsum dolar sit amit";
        var username = "dipshit3000";
        var _msg_hash = web3Utils.soliditySha3(username);
        // var _msg_hash = 123;

        web3.personal.sign(_msg_hash, web3.eth.accounts[0], function(error, result){
            if (error !== null) { return; }

            web3.personal.ecRecover(_msg_hash, result, function(error2, rr){
                if (error2 !== null) { return; }
                // if (rr != web3.eth.accounts[0])
                // ^ it means someone else signed it and it's not valid 
                let q = firebase.database().ref(web3.eth.accounts[0]);
                let referalInfo = {
                  "username": "dipshit3000"
                };
                q.set(referalInfo).then((f) => {
                    alert("success");
                }).catch((e) => {
                    alert("error");
                })
            });

            // let r = "0x" + result.slice(2, 66); 
            // let s = "0x" + result.slice(66, 130); 
            // let v = "0x" + result.slice(130, 132) 
            // let h = [that.state.channelId, _msg_hash, r, s]; 

            // that.state.contractInstance.VerifyMsg.call(h, v, 3, (err, result) => {
            //     let xxx = result.toNumber();
            //     debugger;
            // })
        });
    }

    decipherSign() {
        // (msgHash, v, r, s) {
            // result = 
            var _msg = "Lorem ipsum dolar sit amit";


            //var msg = "0x" + this.toHex(_msg);
            // let _msg_hash = sha3(("0x" + this.state.channelId), _msg);  
            // let msg_hash = Buffer.from(_msg_hash.substr(2, 64), 'hex'); 
            // var result = this.state.signedMessage;
            // let r = "0x" + result.slice(2, 66); 
            // let s = "0x" + result.slice(66, 130); 
            // let v = "0x" + result.slice(130, 132) 
            // let h = [this.state.channelId, _msg_hash, r, s]; 

        // console.log(util.ecrecover);
        // util.ecrecover(_msg_hash, v, r, s);
        // debugger;
        // var msg = "Lorem ipsum dolar sit amit";
        // let change = "0x" + this.state.channelId;
        // let _msg_hash = sha3(change, msg);   
        // // console.log(msg, "---", this.state.channelId, "---",  _msg_hash);

        // var result = this.state.signedMessage;
        // let r = "0x" + result.slice(2, 66); 
        // let s = "0x" + result.slice(66, 130); 
        // let v = "0x" + result.slice(130, 132) 
        // let h = [this.state.channelId, _msg_hash, r, s]; 
        // const v_decimal = web3.toDecimal(v)
        // debugger
        // this.state.contractInstance.VerifyMsg.call(h, v, 3, {from: this.state.currentWallet}, (err, result) => {
        //     debugger;
        // })
    }

    render() {
        if(this.state.loading){
            return( 
                <h2> loading ... </h2>
            )
        }
        return (
            <div id="container" >
            
                <h3> channel test </h3>
                <br />
                {this.state.expiredChannel ?
                    <div className="redbutton redbutton" onClick={this.timeoutChannel.bind(this)}>delete expired channel</div>
                :
                    <div>
                        { this.state.channelId ? 
                            <div>
                                <div className="redbutton gray" onClick={this.decipherSign.bind(this)} >channel open...</div>
                                <br />
                                <div className="redbutton greenover" onClick={this.sendMessage.bind(this)}>send message.</div>  
                            </div>
                        :
                            <div className="redbutton purpover" onClick={this.openStateChannel.bind(this)}>open state channel</div>
                        }
                    </div>
                }
                <br />
                <br />
                <p>This opens a state channel conversation between
                <br />
                <br />
                  <b>0x6e6048503d4686def8eD5c968f653ce54F490e42</b> <br />
                  <b>0x6DFE44316C39132a4AA4603Cb4cBb204ed5C428F</b>  </p>
                  <p> The state channel lasts 1.5 hours for debugging purposes </p>
                  <p> This assumes you{"'"}re logged in as <b>0x6e604....42 </b></p>
                 <br />
                
                <a href="https://rinkeby.etherscan.io/address/0xaDc53dD995C93FCbE42AFA485610F711f3A78Da6" className="smaller" target="blank">
                0xaDc53dD995C93FCbE42AFA485610F711f3A78Da6
                </a> 
                {/*
                <br />
                owner
                <a href="https://rinkeby.etherscan.io/address/0x6e6048503d4686def8eD5c968f653ce54F490e42" target="blank">
                    &nbsp; 0x6e6048503d4686def8eD5c968f653ce54F490e42
                </a> 
                <br />
                <div className="row">
                    <div className="box" onClick={this.handleSubmit.bind(this, 1)}></div>
                    <div className="box" onClick={this.handleSubmit.bind(this, 2)}></div>
                    <div className="box" onClick={this.handleSubmit.bind(this, 3)}></div>
                    <div className="box" onClick={this.handleSubmit.bind(this, 4)}></div>
                    <div className="box" onClick={this.handleSubmit.bind(this, 5)}></div>
                </div>
                */}
            </div>
        );
    }
}

export default BoxGame