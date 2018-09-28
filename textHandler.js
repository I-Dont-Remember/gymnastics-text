const smsService = require("./smsService");

// returns the service response to the user (string)
function getResponse(req) {
    // do all the logic of shtuff and thingos
    return "a body of text";
}

module.exports.smsHandler = async function(req, res) {
    const smsResponse = getResponse(req);
    const formattedResponse = smsService.formatResponse(smsResponse);
    // Twilio and Plivo both use XML for their responses, other services probably do the same
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(formattedResponse);
};
