// Main test, to run them all !

import { testAndReport } from "./test-suite.mjs";

import * as defined from "./defined.mjs";
import * as specific from "./specific.mjs";
import * as truthy from "./truthy.mjs";
import * as falsy from "./falsy.mjs";
import * as boolean from "./boolean.mjs";
import * as number from "./number.mjs";
import * as integer from "./integer.mjs";
import * as string from "./string.mjs";
import * as array from "./array.mjs";
import * as arrayOf from "./arrayOf.mjs";
import * as or from "./or.mjs";
import * as not from "./not.mjs";

// Import all sub-tests
let tests = [
	defined.tests,
	specific.tests,
	truthy.tests,
	falsy.tests,
	boolean.tests,
	number.tests,
	integer.tests,
	string.tests,
	array.tests,
	arrayOf.tests,
	or.tests,
	not.tests,
].flat();

// Run all tests
testAndReport(tests);