// Test to verify that the validateformat.truthy format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { Truthy } = require("../src/validateformat.js");

const t = new Truthy();

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti(true, t, true, "true is truthy")),
	new tr(new ti(1, t, true, "numbers other than 0 are truthy")),
	new tr(new ti(5.21, t, true, "numbers other than 0 are truthy")),
	new tr(new ti("foo", t, true, "strings that are not empty are truthy")),
	new tr(new ti(256n, t, true, "bigints other than 0 are truthy")),
	new tr(new ti([], t, true, "empty arrays are truthy")),
	new tr(new ti({}, t, true, "empty objects are truthy")),
	new tr(new ti([0], t, true, "arrays with children are truthy")),
	new tr(new ti({foo: 'bar'}, t, true, "objects with properties are truthy")),
	new tr(new ti(Infinity, t, true, "Infinity is truthy")),
	new tr(new ti(-Infinity, t, true, "-Infinity is truthy")),
	
	// ### Evaluated to false :
	new tr(new ti(false, t, false, "false isn't truthy")),
	new tr(new ti(undefined, t, false, "undefined isn't truthy")),
	new tr(new ti(null, t, false, "null isn't truthy")),
	new tr(new ti(NaN, t, false, "NaN isn't truthy")),
	new tr(new ti(0, t, false, "0 isn't truthy")),
	new tr(new ti(0n, t, false, "0 (bigint) isn't truthy")),
	new tr(new ti("", t, false, "empty strings aren't truthy")),
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}