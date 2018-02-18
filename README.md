This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) with the sole purpose of testing ethereum StateChannel's. 

This uses express, firebase, truffle. 

The [contract is deployed on rinkeby test network here.](https://rinkeby.etherscan.io/address/0xd796f76a41831b5676a2be13aadfb595d04499e2)


## Install

For the project to build, **execute inside terminal**:

* `$ npm install` 
* `$ node server` turn on express server.
* `$ npm start` start app.



## Channels contract

Here is the raw code of the contract. 


```
pragma solidity ^0.4.8;

contract Channels {
  struct Channel {
    address sender;
    address recipient;
    uint timeout;
    uint deposit;
  }

  mapping (bytes32 => Channel) channels;
  mapping (address => mapping(address => bytes32)) active_ids;

	function OpenChannel(address to, uint timeout) public payable {
    if (msg.value == 0) { revert(); }
    if (to == msg.sender) { revert(); }
    if (active_ids[msg.sender][to] != bytes32(0)) { revert(); }
    bytes32 id = keccak256(msg.sender, to, now+timeout);

    Channel memory _channel;
		_channel.timeout = now+timeout;
    _channel.deposit = msg.value;
    _channel.sender = msg.sender;
    _channel.recipient = to;
    channels[id] = _channel;

    active_ids[msg.sender][to] = id;
	}

	function CloseChannel(bytes32[4] h, uint8 v, uint256 value) public {
    if (channels[h[0]].deposit == 0) { revert(); }
    Channel memory _channel;
    _channel = channels[h[0]];

    if (msg.sender != _channel.sender && msg.sender != _channel.recipient) { revert(); }

    address signer = ecrecover(h[1], v, h[2], h[3]);
    if (signer != _channel.sender) { revert(); }

    bytes32 proof = keccak256(h[0], value);
    if (proof != h[1]) { revert(); }
    else if (value > _channel.deposit) { revert(); }

    if (!_channel.recipient.send(value)) { revert(); }
    else if (!_channel.sender.send(_channel.deposit-value)) { revert(); }
    delete channels[h[0]];
    delete active_ids[_channel.sender][_channel.recipient];

	}

	function ChannelTimeout(bytes32 id) public {
    Channel memory _channel;
    _channel = channels[id];

    if (_channel.deposit == 0) { revert(); }
    else if (_channel.timeout > now) { revert(); }
    else if (!_channel.sender.send(_channel.deposit)) { revert(); }

    delete channels[id];
    delete active_ids[_channel.sender][_channel.recipient];
	}

  function VerifyMsg(bytes32[4] h, uint8 v, uint256 value) public view returns (bool) {
    if (channels[h[0]].deposit == 0) { return false; }
    Channel memory _channel;
    _channel = channels[h[0]];

    address signer = ecrecover(h[1], v, h[2], h[3]);
    if (signer != _channel.sender) { return false; }

    bytes32 proof = keccak256(h[0], value);
    if (proof != h[1]) { return false; }
    else if (value > _channel.deposit) { return false; }

    return true;
  }

  function GetChannelId(address from, address to) public view returns (bytes32) {
    return active_ids[from][to];
  }

  function GetTimeout(bytes32 id) public view returns (uint) {
    return channels[id].timeout;
  }

  function GetDeposit(bytes32 id) public view returns (uint) {
    return channels[id].deposit;
  }

  function GetSender(bytes32 id) public view returns (address) {
    return channels[id].sender;
  }

  function GetRecipient(bytes32 id) public view returns (address) {
    return channels[id].recipient;
  }


}
```

