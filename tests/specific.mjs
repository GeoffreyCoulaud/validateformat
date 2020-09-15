// Test to verify that the validateformat.specific format works as intended.

import { testAndReport, testResult as tr, testItem as ti } from "./test-suite.mjs";
import { Specific } from "../src/validateformat.mjs";

// Values to test and their expected state
export const tests = [

	// ### Evaluated to true :
	// NaN and null
	new tr(new ti(NaN, new Specific(NaN), true, "`NaN` matches itself")),
	new tr(new ti(null, new Specific(null), true, "`null` matches itself even thought it's technically an object")),
	// Standard data types
	new tr(new ti(undefined, new Specific(undefined), true, "Specific value matches itself for basic data types")),
	new tr(new ti(true, new Specific(true), true, "Specific value matches itself for basic data types")),
	new tr(new ti(false, new Specific(false), true, "Specific value matches itself for basic data types")),
	new tr(new ti(0, new Specific(0), true, "Specific value matches itself for basic data types")),
	new tr(new ti(1, new Specific(1), true, "Specific value matches itself for basic data types")),
	new tr(new ti(3.15, new Specific(3.15), true, "Specific value matches itself for basic data types")),
	new tr(new ti(256n, new Specific(256n), true, "Specific value matches itself for basic data types")),
	new tr(new ti("true", new Specific("true"), true, "Specific value matches itself for basic data types")),
	
	// ### Evaluated to false :
	// Type conversion
	new tr(new ti(null, new Specific(undefined), false, "Specific format differenciates `null` and `undefined`")),
	new tr(new ti(true, new Specific(1), false, "Specific format should not convert types")),
	new tr(new ti(null, new Specific(0), false, "Specific format should not convert types")),
	new tr(new ti(false, new Specific(0), false, "Specific format should not convert types")),
	new tr(new ti(undefined, new Specific(0), false, "Specific format should not convert types")),
	new tr(new ti("1", new Specific(1), false, "Specific format should not convert types")),
	new tr(new ti([], new Specific(false), false, "Specific format should not convert types")),
	new tr(new ti({}, new Specific(false), false, "Specific format should not convert types")),
	new tr(new ti([{}], new Specific(false), false, "Specific format should not convert types")),
];