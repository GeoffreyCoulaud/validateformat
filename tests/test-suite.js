const { validate } = require('../src/validate-format.js');

// tests : An array of testResults
// return value : a percentage (0 to 1) giving pass proportion within tests
function testAndReport(tests){
	
	let resCount = {pass: 0, fail: 0}

	console.log("Starting tests...");

	for (let i=0; i<tests.length; i++){

		let test = tests[i];
		
		if (process.argv.includes("--verbose")){
			console.log(`Running test ${i}/${tests.length} - ${test.input.humanDesc}`);
		}

		// Testing input values with the format given and comparing to expected output 
		let res;
		try {
			res = validate(test.input.value, test.input.format);
		} catch (err){
			res = false;
			console.warn(`Test ${test.input.humanDesc} failed and threw : ${err}`);
		}
		test.output = test.input.expected === res;
		
		// Increment counters
		if (test.output) resCount.pass++;
		else resCount.fail++;

		// Reporting data
		if (test.output === false){
			console.error(`Test "${test.input.humanDesc}" failed with input \`${test.input.value}\``);
		}

	}

	console.log("Tests finished !");
	console.log(`${resCount.pass}/${tests.length} tests passed.`);
	console.log(`${resCount.fail}/${tests.length} tests failed.`);

	return resCount/tests.length;
}

// value : The value to input to the test (any)
// format : The format that value will be subjected to (format object | object)
// expected : The boolean value expected as output of validate function with input value and format (true, false)
// humanDesc : A string containing a short description of what the tests does
class testItem {
    constructor(value, format, expected, humanDesc = ""){
        this.value = value;
        this.format = format;
        this.expected = expected;
        this.humanDesc = humanDesc;
    }
}
// Input : a testItem object
// Output : a boolean indicating that the input test succeeded (true) or failed (false)
class testResult{
	constructor(input, output = null){
		this.input = input;
		this.output = output;
		this.toString = function(){
			if (this.output === true){
				return "Test passed - IN "
			}
		}
	}
}

module.exports = {testAndReport, testItem, testResult};