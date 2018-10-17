const smsService = require("./smsService");

function helpMsg() {
    return `
Here's what I understand:
sign up - stuff
drop - stuff
time - stuff
settings - this phone #'s personal defaults
help - bring up this message
`;
}

// build the user incrementally like a chat bot
function newUserMsg(number) {
    // if a user has never been seen before
    let msg =
        "Welcome! I'm here to help you sign up for practice.  What's your first and last name?";
    // have to be able to come back through here and collect the next pieces of information
    // if need name stil
    // if need default location
    // if need default driver status
}

function isNewUser(number) {
    // TODO: this should check not only number but also that they have all necessary fields
    const numbers = ["7153387410"];
    return numbers.indexOf(number) == -1;
}

async function signUp() {}

async function drop() {}

async function updateSettings() {}

// returns the service response to the user (string)
function getResponse(req) {
    const number = smsService.getNumberFromRequest(req);
    const text = smsService.getSmsFromRequest(req);

    if (isNewUser(number)) {
        return newUserMsg(number);
    }
    // existing user, what do they want to do?
    // if want to update settings
    // if want to sign up
    // if want to drop

    // couldn't figure out what they wanted to do or help
    return helpMsg();
}

module.exports.smsHandler = async function(req, res) {
    const smsResponse = getResponse(req);
    const formattedResponse = smsService.formatResponse(smsResponse);
    // Twilio and Plivo both use XML for their responses, other services probably do the same
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(formattedResponse);
};
