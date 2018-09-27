// index.js

const serverless = require('serverless-http');

const express = require('express')

const app = express()


app.post('/sms', function (req, res) {

  res.send('Hello World!!')

})


module.exports.handler = serverless(app);