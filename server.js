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
	console.log(req.body);
});

app.listen(process.env.PORT || 8080);	