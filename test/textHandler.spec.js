const assert = require("assert");
const rewire = require("rewire");

// testing non exported functions
// https://stackoverflow.com/questions/14874208/how-to-access-and-test-an-internal-non-exports-function-in-a-node-js-module#30794280

const handler = rewire("../textHandler.js");
const getValidatedName = handler.__get__("getValidatedName");
const getValidatedDriverStatus = handler.__get__("getValidatedDriverStatus");
const getValidatedLocation = handler.__get__("getValidatedLocation");
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
