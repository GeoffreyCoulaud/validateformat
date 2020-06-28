// Main test, to run them all !

const { testAndReport } = require("./test-suite.js");

// Import all sub-tests
let tests = [
	require("./defined.js").tests,
	require("./specific.js").tests,
	require("./truthy.js").tests,
	require("./falsy.js").tests,
	require("./boolean.js").tests,
].flat();

// Run all tests
testAndReport(tests);