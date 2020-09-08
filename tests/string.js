// Test to verify that the validateformat.str format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { Str } = require("../src/validateformat.js");

const anyStr = new Str();
const shortStr = new Str({min: 5, max: 10});
const preciseStr = new Str({size: 7});
const minMaxPrecise = new Str({size: 7, min: 5, max: 10});
const regexStr = new Str({regex: /foo(.*)bar/});
const regexStrMinMax = new Str({regex: /foo(.*)bar/, min: 5, max : 20});
const reducedAlphabetStr = new Str({alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"});

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti("Hello world !", anyStr, true, "Empty Str should match any string")),
	new tr(new ti("", anyStr, true, "Empty Str should match any string")),
	new tr(new ti("1234567", shortStr, true, "Str with min and max should match strings such as min <= length <= max")),
	new tr(new ti("12345", shortStr, true, "Str with min and max should match strings such as min <= length <= max")),
	new tr(new ti("1234567890", shortStr, true, "Str with min and max should match strings such as min <= length <= max")),
	new tr(new ti("1234567", preciseStr, true, "Str with size should match strings of their size")),
	new tr(new ti("1234567", minMaxPrecise, true, "Exact size prevals over min and max")),
	new tr(new ti("foobar", regexStr, true, "Str with regexes match when strings match the regex option")),
	new tr(new ti("foo something_else bar", regexStr, true,  "Str with regexes match when strings match the regex option")),
	new tr(new ti("fooshortbar", regexStrMinMax, true, "Str with regex and min/max should apply both criteria")),
	new tr(new ti("foobar", reducedAlphabetStr, true, "Str with only characters of given alphabet should match")),

	// ### Evaluated to false :
	// Obvious ones
	new tr(new ti(true, anyStr, false, "Booleans should not match Str")),
	new tr(new ti(1, anyStr, false, "Numbers shhould not match Str")),
	new tr(new ti(undefined, anyStr, false, "Undefined should not match Str")),
	new tr(new ti(null, anyStr, false, "Null should not match Str")),
	new tr(new ti(["foo", "bar"], anyStr, false, "Arrays should not match Str")),
	new tr(new ti({foo: "bar"}, anyStr, false, "Objects should not match Str")),
	// Parameters
	new tr(new ti("", shortStr, false, "Strings shorter than min should not match")),
	new tr(new ti("averylongstring", shortStr, false, "Strings larger than max should not match")),
	new tr(new ti("123", preciseStr, false, "Strings of length diffenrent than size should not match")),
	new tr(new ti("123", minMaxPrecise, false, "Exact length prevals over min/max")),
	new tr(new ti("barfoo", regexStr, false, "Strings should match regexes")),
	new tr(new ti("f00b4r", reducedAlphabetStr, false, "Strings containing at least one character not in alphabet should not match")),
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}