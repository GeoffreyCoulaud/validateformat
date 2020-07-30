// Test to verify that the validate-format.num format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { Arr } = require("../src/validate-format.js");

const anyArr = new Arr();
const shortArr = new Arr({min: 5, max: 10});
const preciseArr = new Arr({size: 7});
const minMaxPrecise = new Arr({size: 7, min: 5, max: 10});

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti([], anyArr, true, "Empty Arr should match any array")),
	new tr(new ti([1,2,3], anyArr, true, "Empty Arr should match any array")),
	new tr(new ti([1,2,3,4,5,6,7], shortArr, true, "Arrays such as min <= length <= max should match")),
	new tr(new ti([1,2,3,4,5], shortArr, true, "Arrays such as min <= length <= max should match")),
	new tr(new ti([1,2,3,4,5,6,7,8,9,10], shortArr, true, "Arrays such as min <= length <= max should match")),
	new tr(new ti([1,2,3,4,5,6,7], preciseArr, true, "Arrays of length = size should match")),
	new tr(new ti([1,2,3,4,5,6,7], minMaxPrecise, true, "Exact size prevals over min/max")),
	
	// ### Evaluated to false :
	// Obvious ones
	new tr(new ti(true, anyArr, false, "Booleans should not match Arr")),
	new tr(new ti(1, anyArr, false, "Numbers should not match Arr")),
	new tr(new ti("foobar", anyArr, false, "Strings should not match Arr")),
	new tr(new ti({foo: "bar"}, anyArr, false, "Objects should not match Arr")),
	new tr(new ti(undefined, anyArr, false, "Undefined should not match Arr")),
	new tr(new ti(null, anyArr, false, "Null should not match Arr")),
	// Parameters
	new tr(new ti([], shortArr, false, "Arrays shorter than min should not match")),
	new tr(new ti([1,2,3,4,5,6,7,8,9,10,11], shortArr, false, "Arrays larger than max should not match")),
	new tr(new ti([1,2,3], preciseArr, false, "Arrays of length different than size should not match")),
	new tr(new ti([1,2,3,4,5,6], preciseArr, false, "Precie lentgh prevals over min/max")),
	
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}