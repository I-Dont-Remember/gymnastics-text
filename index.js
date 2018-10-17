// index.js

const serverless = require("serverless-http");

const express = require("express");

const app = express();

const { smsHandler } = require("./textHandler");

app.post("/sms", smsHandler);

const { test } = require("./sheets");
app.get("/test", test);

module.exports.handler = serverless(app);
