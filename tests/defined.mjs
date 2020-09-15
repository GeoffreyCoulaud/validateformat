// Test to verify that the validateformat.defined format works as intended.

import { testAndReport, testResult as tr, testItem as ti } from "./test-suite.mjs";
import { Defined } from "../src/validateformat.mjs";

// Format to test
const f = new Defined();

// Values to test and their expected state
export const tests = [

	// ### Evaluated to false :
	// undefined.
	new tr(new ti(undefined   , f, false, "`undefined` should not match as a defined value")),

	// ### Evaluated to true :
	// "weird" values
	new tr(new ti(Infinity    , f, true, "Everything else than undefined is defined")),
	new tr(new ti(null        , f, true, "Everything else than undefined is defined")),
	new tr(new ti(NaN         , f, true, "Everything else than undefined is defined")),
	// empty values
	new tr(new ti({}          , f, true, "Everything else than undefined is defined")),
	new tr(new ti([]          , f, true, "Everything else than undefined is defined")),
	new tr(new ti(""          , f, true, "Everything else than undefined is defined")),
	// falsy values
	new tr(new ti(false       , f, true, "Everything else than undefined is defined")),
	new tr(new ti(0           , f, true, "Everything else than undefined is defined")),
	// more standard values
	new tr(new ti(true        , f, true, "Everything else than undefined is defined")),
	new tr(new ti(128         , f, true, "Everything else than undefined is defined")),
	new tr(new ti("foo"       , f, true, "Everything else than undefined is defined")),
	new tr(new ti([1,2,3]     , f, true, "Everything else than undefined is defined")),
	new tr(new ti({foo: "bar"}, f, true, "Everything else than undefined is defined")),

];