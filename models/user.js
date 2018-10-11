const dynamoose = require("dynamoose");
const config = require("../config");

if (config.localstack) {
    console.log(
        "[*] running DynamoDB locally on %s",
        config.localstack.dynamoUrl
    );
    dynamoose.AWS.config.update({
        accessKeyId: config.localstack.accessKeyId,
        secretAccessKey: config.localstack.secretAccessKey,
        region: config.localstack.region
    });
    dynamoose.local(config.localstack.dynamoUrl);
}

const Schema = dynamoose.Schema;

const userSchema = new Schema({
    id: {
        type: String,
        hashKey: true
    },
    number: {
        type: String
    },
    name: {
        type: String,
        lowercase: true
    },
    pickUpLocation: {
        type: String,
        enum: config.pickUpLocations
    },
    driver: {
        type: Boolean
    },
    onboardingStage: {
        type: String,
        enum: config.onboardingStages,
        default: "createdNewUser"
    }
});

const User = dynamoose.model("User", userSchema);

module.exports = User;
