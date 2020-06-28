// Test to verify that the validate-format.falsy format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { Falsy } = require("../src/validate-format.js");

const t = new Falsy();

// Values to test and their expected state
const tests = [

	// ### Evaluated to false :
	new tr(new ti(true, t, false, "true is truthy")),
	new tr(new ti(1, t, false, "numbers other than 0 are truthy")),
	new tr(new ti(5.21, t, false, "numbers other than 0 are truthy")),
	new tr(new ti("foo", t, false, "strings that are not empty are truthy")),
	new tr(new ti(256n, t, false, "bigints other than 0 are truthy")),
	new tr(new ti([], t, false, "empty arrays are truthy")),
	new tr(new ti({}, t, false, "empty objects are truthy")),
	new tr(new ti([0], t, false, "arrays with children are truthy")),
	new tr(new ti({foo: 'bar'}, t, false, "objects with properties are truthy")),
	new tr(new ti(Infinity, t, false, "Infinity is truthy")),
	new tr(new ti(-Infinity, t, false, "-Infinity is truthy")),
	
	// ### Evaluated to true :
	new tr(new ti(false, t, true, "false isn't truthy")),
	new tr(new ti(undefined, t, true, "undefined isn't truthy")),
	new tr(new ti(null, t, true, "null isn't truthy")),
	new tr(new ti(NaN, t, true, "NaN isn't truthy")),
	new tr(new ti(0, t, true, "0 isn't truthy")),
	new tr(new ti(0n, t, true, "0 (bigint) isn't truthy")),
	new tr(new ti("", t, true, "empty strings aren't truthy")),
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}