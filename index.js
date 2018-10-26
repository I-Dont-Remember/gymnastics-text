// index.js

const serverless = require("serverless-http");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json({ strict: false }));

const { smsHandler } = require("./textHandler");

app.post("/sms", smsHandler);

const { test, signUp } = require("./sheets");
app.get("/test", async (req, res) => {
    await signUp("Austin Meyer");
    return res.status(200).send({});
});

module.exports.handler = serverless(app);
