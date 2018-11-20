const smsService = require("./smsService");
const User = require("./models/user");
const config = require("./config");
const crypto = require("crypto");

const nameQuestion =
    "What's your first and last name (as seen on the signup sheet)?";
const driverQuestion = "Would you like to default to being a driver (yes/no)?";
const locationQuestion = `What would you like your default pick-up location to be? One of ${
    config.pickUpLocations
}.`;
const thankYouMessage =
    "Thanks! We got all of your info, you're all set to start using the service.";
const errorPrefix = "Didn't quite catch that. ";
const serverErrorMessage =
    "There's an issue with the server, please try again later.";
const newUserMessage =
    "Welcome! I'm here to help you signup for practice.  What's your first and last name (as seen on the signup sheet)?";
const helpMessage = `
Here's what I understand:
signup - stuff
drop - stuff
time - stuff
settings - this phone #'s personal defaults
help - bring up this message
`;

function getValidatedName(text) {
    // invalidate any name above 40 characters. If this comes up
    // it's an easy fix and logging will point it out right away
    return text.length < 40 && text.length > 0 ? text : null;
}

function getValidatedDriverStatus(text) {
    // TODO: this is not robust at all, flesh this out more
    const yesSynonyms = [
        "yes",
        "ye",
        "of course",
        "okay",
        "ok",
        "sure",
        "certainly",
        "yea",
        "yep",
        "drive",
        "driver"
    ];
    const noSynonyms = [
        "no",
        "noh",
        "no thanks",
        "nay",
        "never",
        "ride",
        "rider"
    ];

    // wants to be a driver
    for (const i in yesSynonyms) {
        const curr = yesSynonyms[i];
        if (text.indexOf(curr) != -1) {
            return true;
        }
    }

    // doesn't wanna be a driver
    for (const i in noSynonyms) {
        const curr = noSynonyms[i];
        if (text.indexOf(curr) != -1) {
            console.log("Chose to not be a driver");
            return false;
        }
    }

    // too dumb to know
    return null;
}

function getValidatedLocation(text) {
    // this approach will select the first one it finds, so long as
    // it is spelled correctly. If the user can't spell, then they
    // can suck it.
    for (const i in config.pickUpLocations) {
        const curr = config.pickUpLocations[i];
        if (text.indexOf(curr) != -1) {
            return curr;
        }
    }

    return null;
}

async function handleOnboarding(user, text) {
    const stage = user.onboardingStage;
    let returnMsg, nextStage;
    console.log("In onboarding, user input -", text);

    switch (stage) {
        case "createdNewUser":
            returnMsg = driverQuestion;
            nextStage = "updatedName";
            user.name = getValidatedName(text);
            if (user.name == null) {
                console.log("Invalid name provided -", text);
                return errorPrefix + nameQuestion;
            }
            break;
        case "updatedName":
            returnMsg = locationQuestion;
            nextStage = "updatedDriver";
            user.driver = getValidatedDriverStatus(text);
            if (user.driver == null) {
                console.log("Invalid driver status -", text);
                return errorPrefix + driverQuestion;
            }
            break;
        case "updatedDriver":
            returnMsg = thankYouMessage;
            nextStage = "DONE";
            user.pickUpLocation = getValidatedLocation(text);
            if (user.pickUpLocation == null) {
                console.log("Invalid location -", text);
                return errorPrefix + locationQuestion;
            }
            break;
        default:
            throw new Error("Uknown stage in onboarding handler - ", stage);
    }

    try {
        user.onboardingStage = nextStage;
        await user.save();
    } catch (e) {
        console.log("Failed saving user - ", e);
        return serverErrorMessage;
    }

    return returnMsg;
}

async function createNewUser(number) {
    // use crypto to avoid external dependencies
    const newId = crypto.randomBytes(16).toString("hex");
    return new User({ id: newId, number: number }).save().then(function() {
        return newUserMessage;
    });
}

async function getUserByNumber(number) {
    return new Promise((resolve, reject) => {
        User.scan({ number: { contains: number } }, function(err, users) {
            if (err) {
                console.log("Err in get user", err);
                return reject(err);
            }
            if (users.length > 1) {
                return reject(
                    new Error(
                        "[!] Found multiple users with same number! ids: " +
                            users.map(x => x.id)
                    )
                );
            }

            if (users.length == 1) {
                return resolve(users[0]);
            }

            return resolve(null);
        });
    });
}

async function updateSettings(user, args) {
    // need some way to tell which setting they want to update
    // Options: pickup point, driver status, name
    const first = args.split(" ")[0];
    let choice;
    // TODO: handle more vagaries of user typing, start simple for now
    if (first == "pickup") {
        choice = "pickup";
    } else if (first == "driver") {
        choice = "driver";
    } else if (first == "name") {
        choice = "name";
    } else {
        choice = "default";
    }
    switch (choice) {
        case "pickup":
            // TODO: check that pickup location provided is valid
            args.split("pickup");
            const location = getValidatedLocation();
            if (location == null) {
                // TODO: return update error message
            }
            // TODO: update pickup location in Dynamo
            break;
        case "driver":
            // TODO: have to decide on boolean value to pass
            const driver = getValidatedDriverStatus();
            if (driver == null) {
                // TODO: return update error message
            }
            // TODO: update driver status in Dynamo
            break;
        case "name":
            const name = getValidatedName();
            if (name == null) {
                // TODO: return update error message
            }
            // TODO: update name in Dynamo
            break;
        default:
        // TODO: return update help message
    }
    return new Promise();
}

function updateHelpMessage() {
    return "Update help message";
}

function getSignupOptions(args) {
    // null if options are incorrect in any way
    // have to be able to grab multiple options from single string
    const hasRide = args.getIndexOf("ride") != -1;
    const hasDrive = args.getIndexOf("drive") != -1;
    if (hasDrive == hasRide) {
        // TODO: please select 1 of ride or drive
    }

    // now get the location (or leave as default)
    // TODO: do we want to allow partial non-default? like only change ride/drive
    // and leave rest the same? seems easy
    return null;
}

async function signUp(user, args) {
    // signup, sign up, sign-up; ride or drive
    // parse any extra args
    // For now, assume signup [ride|drive] [<location>]

    if (args == "") {
        // TODO: try to signup with defaults
    } else {
        const options = getSignupOptions(args);
        if (options == null) {
            // TODO: return signUp help message
        }
        // valid signup options
        // TODO: signup user with the options instead of their defaults
    }
    return new Promise();
}

function signUpHelpMessage() {
    return "Signup help message";
}

async function drop(user, args) {
    // try and drop user from signup with Google
    // send them back either a success message or failure
    // for their sanity

    // TODO: currently no sub-options for drop
    //sheets. drop user from sheet (user);
    return new Promise();
}

function isNewUser(user) {
    if (user == null) {
        return true;
    }
}

function isOnboardingUser(user) {
    return user.onboardingStage != "DONE";
}

function getUserChoice(text) {
    // Keep it simple, if the first string delimited word isn't an option, assume
    // the user is terrible at using the service.
    // Function returns the decision as well the remaining text from the message as args
    const words = text.split(" ");
    const first = words[0];
    const args = words.slice(1, -1).join("");
    if (first == "update") {
        return { choice: first, args: args };
    } else if (first == "sign") {
        if (words.length > 2) {
            if (words[1] == "up") {
                return { choice: "signup", args: words.slice(2, -1).join("") };
            }
        }
    } else if (first == "sign-up") {
        return { choice: "signup", args: args };
    } else if (first == "signup") {
        return { choice: "signup", args: args };
    } else if (first == "drop") {
        return { choice: "drop", args: args };
    }
    return { choice: "help", args: "" };
}

// returns the service response to the user (string)
async function getResponse(req) {
    // wrap it in one big one so any unexpected issues the user isn't left wondering why no text has come.
    try {
        const number = smsService.getNumberFromRequest(req);
        const text = smsService.getSmsFromRequest(req);
        const user = await getUserByNumber(number);
        console.log(`user for ${number} - ${JSON.stringify(user)}`);

        if (isNewUser(user)) {
            console.log("Creating new user with num:", number);
            return await createNewUser(number);
        }

        if (isOnboardingUser(user)) {
            console.log("Onboarding user");
            return await handleOnboarding(user, text);
        }

        // an existing user at this point
        const retVal = getUserChoice(text);
        const choice = retVal.choice;
        const args = retVal.args;
        console.log("User choice -", choice);

        // functions all decide what response they need to send and return it,
        // this makes it easy to pass correct error messages back to user
        switch (choice) {
            case "update":
                return await updateSettings(user, args);
                break;
            case "signup":
                return await signUp(user, args);
                break;
            case "drop":
                return await drop(user, args);
                break;
            // couldn't figure out what they wanted to do or help
            case "help":
            default:
                return helpMessage;
        }
    } catch (e) {
        console.log("Error", e);
        return serverErrorMessage;
    }
}

module.exports.smsHandler = async function(req, res) {
    const smsResponse = await getResponse(req);
    const formattedResponse = smsService.formatResponse(smsResponse);
    // Twilio and Plivo both use XML for their responses, other services probably do the same
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(formattedResponse);
};
