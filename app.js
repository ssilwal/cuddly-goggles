'use strict'

const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const session = require('client-sessions')
const twilio = require('twilio');
const twilioClient = new twilio.RestClient('ACf85f0a6f9154eeb3ff8b5dc478909302', '1a5504babb66965fafd707999730001f');
const firebase = require('firebase');

let app = express();
let server = http.createServer(app);
let config = require('./config/config')

firebase.initializeApp(config.firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();

server.listen(config.port);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public/static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(session({
	cookieName: "session",
	secret: "supertopsecret",
	duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

require('./routes/routes')(app, twilioClient, db, auth);

console.log("*****************************");
console.log("* App running at port: " + config.port + " *");
console.log("*****************************");
