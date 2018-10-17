// **** should only need Twilio auth if we do something besides returning XML
// to the service that sent request *******
const need_twilio_auth = false;
if (need_twilio_auth) {
    if (!process.env.TWILIO_SID) {
        console.log("[!] need TWILIO_SID env variable set.");
        process.exit(1);
    }

    if (!process.env.TWILIO_TOKEN) {
        console.log("[!] need TWILIO_TOKEN env variable set.");
        process.exit(1);
    }
}

// default settings for dev, to be modified to fit other environments
let config = {
    twilio: {
        sid: process.env.TWILIO_SID,
        token: process.env.TWILIO_TOKEN,
        number: "1234561234"
    },
    sheets: {}
};

const env = process.env.NODE_ENV;

if (env === "production") {
    // production config changes
}

module.exports = config;
