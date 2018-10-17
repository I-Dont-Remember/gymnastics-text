/* smsService: 
    Module to abstract out differences between services
    like Twilio and Plivo to only have to modify a single file if we switch.
*/

const MessagingResponse = require("twilio").twiml.MessagingResponse;
const config = require("./config");

// most of our responses will be handled by returning twiml/or alternative, but here in case we need to send a text directly
function sendText(to, body) {
    const client = new twilio(config.twilio.sid, config.twilio.token);
    const fromNumber = config.twilio.number;

    return client.messages.create({
        body: body,
        to: to,
        from: fromNumber
    });
}

// Twilio specific formatting of xml
function formatMessageToTwiml(message) {
    const twiml = new MessagingResponse();
    twiml.message(message);
    return twiml.toString();
}

function getNumberFromRequest(req) {
    return req.body.From;
}

// pulls out the user message from the services request
function getSmsFromRequest(req) {
    return req.body.Body;
}

function formatResponse(message) {
    return formatMessageToTwiml(message);
}

module.exports = {
    formatResponse,
    getSmsFromRequest,
    getNumberFromRequest
};
