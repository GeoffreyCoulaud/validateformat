// Test to verify that the validateformat.arrOf format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { Not, Truthy } = require("../src/validateformat.js");

const notTruthy = new Not(new Truthy());

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti(false, notTruthy, true, "Not format should return true when inside format returns false")),
	
	// ### Evaluated to false :
	new tr(new ti(true, notTruthy, false, "Not format should return false when inside format returns true"))
	
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}