const assert = require("assert");
const rewire = require("rewire");

// testing non exported functions
// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module#30794280

const handler = rewire("../textHandler.js");
const getValidatedName = handler.__get__("getValidatedName");
const getValidatedDriverStatus = handler.__get__("getValidatedDriverStatus");
const getValidatedLocation = handler.__get__("getValidatedLocation");
const getUserChoice = handler.__get__("getUserChoice");
const handleOnboarding = handler.__get__("handleOnboarding");
// https://zaiste.net/modern_node_js_async_await_based_testing_with_mocha_chai/
const getResponse = handler.__get__("getResponse");

describe("getValidatedName", function() {
    it("should disallow empty names", function() {
        const retVal = getValidatedName("");
        assert(retVal === null);
    });

    it("should disallow any names over 40 characters", function() {
        const retVal = getValidatedName(
            "aaaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeee"
        );
        assert(retVal === null);
    });
});

describe("getValidatedLocation", function() {
    it("disallows invalid locations", function() {
        const retVal = getValidatedLocation("Madison, WI");
        assert(retVal === null);
    });
    it("correctly selects valid locations", function() {
        const retVal = getValidatedLocation("mcdonalds");
        assert(retVal);
    });
});

describe("getValidatedDriverStatus", function() {
    it("ignores garbage phrases", function() {
        const retVal = getValidatedDriverStatus("hahaahaha");
        assert(retVal === null);
    });
    it("considers the phrase driver to be true", function() {
        const retVal = getValidatedDriverStatus("driver");
        assert(retVal === true);
    });
    it("considers the phrase ride to be false", function() {
        const retVal = getValidatedDriverStatus("ride");
        assert(retVal === false);
    });
});

describe("getUserChoice", function() {
    function isExpected(text, expected) {
        const retVal = getUserChoice(text);
        console.log(retVal);
        assert(retVal.choice == expected);
    }

    it("should choose update", function() {
        const text = "update driver";
        const expected = "update";
        isExpected(text, expected);
    });

    it("should choose signup with defaults", function() {
        const text = "signup";
        const expected = "signup";
        isExpected(text, expected);
    });

    it("should choose signup with extra options", function() {
        const text = "signup ride Mcdonalds";
        const expected = "signup";
        isExpected(text, expected);
    });

    it("should choose drop", function() {
        const text = "drop";
        const expected = "drop";
        isExpected(text, expected);
    });

    it("should not have a choice and pick help", function() {
        const text = "i don't know what I want to do";
        const expected = "help";
        isExpected(text, expected);
    });
});

// describe("handleOnboarding", function() {
//     it("", function() {
//         const user = {};
//         const text = "";
//         handleOnboarding(user, text);
//     });
// });

/*
Since getResponse is handed a request, this is an end-to-end
test of our logic.  Might be harder to pick out exact responses
in these tests, but they are extremely useful for code coverage
and making sure we have no weird spots that throw unexpected errors.
*/

// describe("getResponse", function() {
//     function notNull(req) {
//         const retVal = getResponse(req);
//         assert(retVal != null);
//     }
//     // TODO: need to mock smsService
//     // TODO: need to mock DB for getting existing user
//     it("a new user gets a response", function() {
//         const req = {};
//         notNull(req);
//     });

//     it("a user can continue onboarding", function() {
//         const req = {};
//         notNull(req);
//     });

//     it("a user can try to update their settings", function() {
//         const req = {};
//         notNull(req);
//     });

//     it("a user can sign up", function() {
//         const req = {};
//         notNull(req);
//     });

//     it("a user can drop", function() {
//         const req = {};
//         notNull(req);
//     });

//     it("a user can get help", function() {
//         const req = {};
//         notNull(req);
//     });
// });
