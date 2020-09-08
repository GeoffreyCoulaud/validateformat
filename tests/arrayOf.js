// Test to verify that the validateformat.arrOf format works as intended.

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { ArrOf, Int } = require("../src/validateformat.js");

const smallInt = new Int({min: 0, max: 10})
const arrOfSmallInt = new ArrOf({format: smallInt});
const smallArrOfSmallInt = new ArrOf({format: smallInt, min: 1, max: 10});
const preciseArrOfSmallInt = new ArrOf({format: smallInt, size: 3});
const preciseMinMaxArrOfSmallInt = new ArrOf({format: smallInt, size: 3, min: 1, max: 10});

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti([1,2,3], arrOfSmallInt, true, "An array of small integers should match arrof(int(min0max10))")),
	new tr(new ti([1,2,3], smallArrOfSmallInt, true, "When the format inside matches and min<=length<=max, the format should match")),
	new tr(new ti([1], smallArrOfSmallInt, true, "When the format inside matches and min<=length<=max, the format should match")),
	new tr(new ti([1,2,3,4,5,6,7,8,9,10], smallArrOfSmallInt, true, "When the format inside matches and min<=length<=max, the format should match")),
	new tr(new ti([1,2,3], preciseArrOfSmallInt, true, "When the format inside matches and length = size, the format should match")),
	
	// ### Evaluated to false :
	// Obvious ones
	new tr(new ti(true, arrOfSmallInt, false, "Booleans should not match ArrOf")),
	new tr(new ti(1, arrOfSmallInt, false, "Numbers should not match ArrOf")),
	new tr(new ti("foobar", arrOfSmallInt, false, "Strings should not match ArrOf")),
	new tr(new ti({foo: "bar"}, arrOfSmallInt, false, "Objects should not match ArrOf")),
	new tr(new ti(undefined, arrOfSmallInt, false, "Undefined should not match ArrOf")),
	new tr(new ti(null, arrOfSmallInt, false, "Null should not match ArrOf")),
	new tr(new ti(["foo", "bar"], arrOfSmallInt, false, "Array of strings should not match Array of small ints")),
	// Parameters
	new tr(new ti([120], arrOfSmallInt, false, "Array's children should match inside format")),
	new tr(new ti([], smallArrOfSmallInt, false, "Arrays smaller than min should not match")),
	new tr(new ti([1,2,3,4,5,6,7,8,9,0,1,2,3,4,5], smallArrOfSmallInt, false, "Arrays larger than max should not match")),
	new tr(new ti([1,2,3,4,5], preciseArrOfSmallInt, false, "Arrays of length different than size should not match")),
	new tr(new ti([1,2,3,4,5,6], preciseMinMaxArrOfSmallInt, false, "Precie length prevals over min/max")),
	
];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}