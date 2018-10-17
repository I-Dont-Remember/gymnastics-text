// index.js

const serverless = require("serverless-http");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ strict: false }));

const { smsHandler } = require("./textHandler");

app.post("/sms", smsHandler);

module.exports.handler = serverless(app);
