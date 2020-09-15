// Test to verify that the validateformat.truthy format works as intended.

import { testAndReport, testResult as tr, testItem as ti } from "./test-suite.mjs";
import { Bool } from"../src/validateformat.mjs";

const t = new Bool();

// Values to test and their expected state
export const tests = [

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