/* eslint no-console: 0 */

/**
 * TestRunner.js
 *
 * For running the tests in the test register.
 *
 * @author tlwr [toby@toby.codes]
 * @author n1474335 [n1474335@gmail.com]
 * @copyright Crown Copyright 2017
 * @license Apache-2.0
 */
import "babel-polyfill";

// Define global environment functions
global.ENVIRONMENT_IS_WORKER = function() {
    return typeof importScripts === "function";
};
global.ENVIRONMENT_IS_NODE = function() {
    return typeof process === "object" && typeof require === "function";
};
global.ENVIRONMENT_IS_WEB = function() {
    return typeof window === "object";
};

import TestRegister from "./TestRegister";
// import "./tests/operations/Base58.js";
import "./tests/operations/Base64";
// import "./tests/operations/BCD.js";
// import "./tests/operations/BitwiseOp.js";
// import "./tests/operations/BSON.js";
// import "./tests/operations/ByteRepr.js";
import "./tests/operations/CartesianProduct";
// import "./tests/operations/CharEnc.js";
import "./tests/operations/Ciphers";
//import "./tests/operations/Checksum.js";
// import "./tests/operations/Code.js";
// import "./tests/operations/Compress.js";
// import "./tests/operations/DateTime.js";
// import "./tests/operations/FlowControl.js";
// import "./tests/operations/Hash.js";
// import "./tests/operations/Hexdump.js";
// import "./tests/operations/Image.js";
// import "./tests/operations/MorseCode.js";
// import "./tests/operations/MS.js";
// import "./tests/operations/PHP.js";
// import "./tests/operations/NetBIOS.js";
// import "./tests/operations/OTP.js";
import "./tests/operations/PowerSet";
// import "./tests/operations/Regex.js";
import "./tests/operations/Rotate";
// import "./tests/operations/StrUtils.js";
// import "./tests/operations/SeqUtils.js";
import "./tests/operations/SetDifference";
import "./tests/operations/SetIntersection";
import "./tests/operations/SetUnion";
import "./tests/operations/SymmetricDifference";

let allTestsPassing = true;
const testStatusCounts = {
    total: 0,
};


/**
 * Helper function to convert a status to an icon.
 *
 * @param {string} status
 * @returns {string}
 */
function statusToIcon(status) {
    const icons = {
        erroring: "🔥",
        failing: "❌",
        passing: "✔️️",
    };
    return icons[status] || "?";
}


/**
 * Displays a given test result in the console.
 *
 * @param {Object} testResult
 */
function handleTestResult(testResult) {
    allTestsPassing = allTestsPassing && testResult.status === "passing";
    const newCount = (testStatusCounts[testResult.status] || 0) + 1;
    testStatusCounts[testResult.status] = newCount;
    testStatusCounts.total += 1;

    console.log([
        statusToIcon(testResult.status),
        testResult.test.name
    ].join(" "));

    if (testResult.output) {
        console.log(
            testResult.output
                .trim()
                .replace(/^/, "\t")
                .replace(/\n/g, "\n\t")
        );
    }
}


/**
 * Fail if the process takes longer than 10 seconds.
 */
setTimeout(function() {
    console.log("Tests took longer than 10 seconds to run, returning.");
    process.exit(1);
}, 10 * 1000);


TestRegister.runTests()
    .then(function(results) {
        results.forEach(handleTestResult);

        console.log("\n");

        for (const testStatus in testStatusCounts) {
            const count = testStatusCounts[testStatus];
            if (count > 0) {
                console.log(testStatus.toUpperCase(), count);
            }
        }

        if (!allTestsPassing) {
            console.log("\nNot all tests are passing");
        }

        process.exit(allTestsPassing ? 0 : 1);
    });
