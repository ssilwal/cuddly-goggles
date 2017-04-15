'use strict'

const express = require('express');
const path = require('path');
const http = require('http');

let app = express();
let server = http.createServer(app);
let config = require('./config/config')

server.listen(config.port);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public/static')));

require('./routes/routes')(app)

console.log("*****************************");
console.log("* App running at port: " + config.port + " *");
console.log("*****************************");
