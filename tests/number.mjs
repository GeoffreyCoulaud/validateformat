// Test to verify that the validateformat.num format works as intended.

import { testAndReport, testResult as tr, testItem as ti } from "./test-suite.mjs";
import { Num } from "../src/validateformat.mjs";

const zeroTen = new Num({min: 0, max: 10});
const zeroTenEx = new Num({min: 0, max: 10, strict: true});
const zeroTenInt = new Num({min: 0, max: 10, forceInt: true});
const allReal = new Num({min: -Infinity, max: Infinity});

// Values to test and their expected state
export const tests = [

	// ### Evaluated to true :
	new tr(new ti(5, zeroTen, true, "Numbers (clearly) between min and max should match")),
	new tr(new ti(0, zeroTen, true, "Numbers between min and max or equal min or max should match")),
	new tr(new ti(10, zeroTen, true, "Numbers between min and max or equal min or max should match")),
	new tr(new ti(Math.PI, zeroTen, true, "Numbers between min and max or equal min or max should match")),
	new tr(new ti(5.0, zeroTenInt, true, "Decimal numbers with zero decimal part should match with forceInt flag")),
	new tr(new ti(Infinity, allReal, true, "Infinity should match if max is Infinity without strict flag")),
	new tr(new ti(-Infinity, allReal, true, "-Infinity should match if min is -Infinity without strict flag")),

	// ### Evaluated to false :
	// Not numbers
	new tr(new ti(NaN, allReal, false, "NaN should not match numbers")),
	new tr(new ti(null, allReal, false, "null should not match numbers")),
	new tr(new ti(undefined, allReal, false, "undefined should not match numbers")),
	new tr(new ti("", allReal, false, "Empty strings should not match numbers")),
	new tr(new ti("1", allReal, false, "Strings should not match numbers")),
	new tr(new ti("abc", allReal, false, "Strings should not match numbers")),
	new tr(new ti(true, allReal, false, "Booleans should not match numbers")),
	new tr(new ti(false, allReal, false, "Booleans should not match numbers")),
	new tr(new ti([], allReal, false, "Empty arrays should not match numbers")),
	new tr(new ti([1,2,3], allReal, false, "Arrays should not match numbers")),
	new tr(new ti({}, allReal, false, "Empty objects should not match numbers")),
	new tr(new ti({foo: "bar"}, allReal, false, "Objects should not match numbers")),
	new tr(new ti(256n, allReal, false, "BigInts should not match numbers")), // ? Or should they ?
	// Numbers outside the bounds
	new tr(new ti(11, zeroTen, false, "Numbers bigger than max should not match")),
	new tr(new ti(-1, zeroTen, false, "Numbers smaller than min should not match")),
	new tr(new ti(0, zeroTenEx, false, "Numbers equals to min should not match with strict flag")),
	new tr(new ti(10, zeroTenEx, false, "Numbers equals to max should not match with strict flag")),
	new tr(new ti(0, zeroTenEx, false, "Numbers equals to max should not match with strict flag")),
	new tr(new ti(2.5, zeroTenInt, false, "Decimal numbers should not match with forceInt flag")),
	new tr(new ti(-2.5, zeroTenInt, false, "Decimal numbers should not match with forceInt flag")),
	new tr(new ti(10.0000001, zeroTenInt, false, "Decimal numbers should not match with forceInt flag")),
];