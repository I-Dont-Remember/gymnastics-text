// index.js

const serverless = require('serverless-http');

const express = require('express');

const app = express();

const { smsHandler } = require("./textHandler");


app.get('/', function (req, res) {

  res.send('Hello World!')

});


app.post("/sms", smsHandler);


module.exports.handler = serverless(app);
