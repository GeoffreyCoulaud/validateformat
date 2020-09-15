// Test to verify that the validateformat.arrOf format works as intended.

import { testAndReport, testResult as tr, testItem as ti } from "./test-suite.mjs";
import { Not, Truthy } from "../src/validateformat.mjs";

const notTruthy = new Not(new Truthy());

// Values to test and their expected state
export const tests = [

	// ### Evaluated to true :
	new tr(new ti(false, notTruthy, true, "Not format should return true when inside format returns false")),
	
	// ### Evaluated to false :
	new tr(new ti(true, notTruthy, false, "Not format should return false when inside format returns true"))
	
];