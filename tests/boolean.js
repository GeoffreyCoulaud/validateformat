// Test to verify that the validate-format.truthy format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { Bool } = require("../src/validate-format.js");

const t = new Bool();

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti(true, t, true, "true is a boolean")),
	new tr(new ti(false, t, true, "false is a boolean")),
	
	// ### Evaluated to false :
	new tr(new ti(0, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(1, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(undefined, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(null, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(NaN, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(0n, t, false, "only `true` and `false` are booleans")),
	new tr(new ti("", t, false, "only `true` and `false` are booleans")),
	new tr(new ti([], t, false, "only `true` and `false` are booleans")),
	new tr(new ti({}, t, false, "only `true` and `false` are booleans")),
	new tr(new ti("abcd", t, false, "only `true` and `false` are booleans")),
	new tr(new ti(8, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(5.28, t, false, "only `true` and `false` are booleans")),
	new tr(new ti(256n, t, false, "only `true` and `false` are booleans")),
	new tr(new ti({foo: "bar"}, t, false, "only `true` and `false` are booleans")),
	new tr(new ti([1,2,3], t, false, "only `true` and `false` are booleans")),
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}