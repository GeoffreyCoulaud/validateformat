# ValidateFormat
 Check if the given object matches a given format.


## Installation
### NPM install
You can download the npm package
```
npm install --save validate-format
```
### Manual install
You can download this repo as a zip from your browser or 

type `git clone https://github.com/GeoffreyCoulaud/ValidateFormat.git` in a terminal in your project folder.

## Usage
After including validateFormat for usage, just pass the object to be validated as the first parameter of validate and a format to be validated against as the second parameter.
All the options given to build your formats are enclosed in object litterals `{}`, except operator formats such as `Not` and `Or` that only recieve one or several format instances as parameters and `Specific` that can only recieve a primitive value.
The options and usage for built-in formats are given down below.

### Validating a simple string
```js
const val = require('validateFormat');
const myObject = 'foobar'; 
const myFormat = new val.Str({'regex':/^f.+r$/});
const doesThisMatch = val.validate(myObject, myFormat);
console.log(doesThisMatch); // <----------- true
```

### Validating a more complex object
```js
const val = require('validateFormat');
const myObject = {
	name: 'Geoffrey Coulaud',
	coolness: 9001,
	interests: [
		'coding',
		'web design',
		'videogames'
	]
};
// You can have sub-formats
const myFormat = {
	name: new val.Str({min: 1, max: 256}),
	coolness: new val.Num({min: 0, max: 9000}),
	interests: new val.ArrOf({format: new val.Str({min: 1, max: 256})})
};
const doesThisMatch = val.validate(myObject, myFormat);
console.log(doesThisMatch); // <----------- false (coolness is over 9000)
```

## Built-in formats
Parameters prefixed by a * are required.

| name (parameters) | condition for obj to match | example |
| ----------------- | -------------------------- | ------- |
| Defined | obj is not undefined | `new val.Defined()` |
| Specific | obj is a given value | `new val.Specific(4)` |
| Thruthy | obj is truthy | `new val.Truthy()` | 
| Falsy | obj is falsy | `new val.Falsy()` |
| Bool | obj is a boolean | `new val.Bool()` |
| Num (`min`,`max`,`forceInt`) | obj is a number between `min` and `max` (included). If `forceInt` is `true`, obj is an integer  | `new val.Num({min: -5.2, max: 9.3})` |
| Int (`min`,`max`) | obj is an integer between `min` and `max` (included) | `new val.Int({min: -1, max: 5})` |
| Str (`size`,`min`,`max`,`regex`) | obj is a string which length is `size` or between `min` and `max` (exact length prevals) and matches `regex` | `new val.Str({size: 20, regex: /^\[A-Z\].*\[\.?!\]/})` |
| Arr (`size`,`min`,`max`) | obj is an array which length is `size` or between `min` and `max` (exact length prevals) | `new val.Arr({size: 3})` |
| ArrOf (\*`format`,`size`,`min`,`max`) | obj is an array which length is `size` or between `min` and `max` (exact length prevals) and its items all match `format` | `new val.ArrOf({size: 2, insideFormat: new val.Num({min: -999, max: 999})})` |
| Or (\*`formats`) | obj matches one of the formats in the given array `formats` | `new val.Or(\[new val.Bool(), new val.Specific(-1)\])` |
| Not (\*`format`) | obj doesn't match the given `format` | `new val.Not(new val.Specific('Hello I am a hacking bot'))` |

## How to add formats
You can create your own formats simply by extending the `Format` class and precising the `match` method.
### E.G. A simple MinMax format
Lets say you recieve two values from the user, a lowest price (min) and a highest price (max) to filter a database search.
The minimum price can't be lower than 0, and the maximum price can't be higher than 100, our most expensive product of all time.
```js
const val = require('validateFormat');
const MAX_PRICE_OF_ALL_TIME = 100;
class MinMaxFormat extends val.Format{
	constructor({min = null, max = null}){
		super('object'); // Precising the js type expected
		this.min = new val.Num({'min':0, 'max':max});
		this.max = new val.Num({'min':min, 'max':Number.MAX_SAFE_INTEGER});
		this.match = function(obj){
			if (!this.validateType()){return false;}
			if (typeof obj.min !== 'number'){return false;}
			if (typeof obj.max !== 'number'){return false;}
			return this.min.match(obj.min) && this.max.match(obj.max);
		}
	}
}
const userCriteria = {'min':0, 'max':25};
const userCriteriaFormat = new MinMaxFormat({'min':0, 'max':MAX_PRICE_OF_ALL_TIME});
const doesThisMatch = val.validate(myObj, myFormat);
console.log(doesThisMatch); // <----------- true
```

## How to run the tests and add some
In the project folder, run `npm run test` or `npm run test-verbose` to run tests. 
To add tests, copy and paste one of the already existing test files in `tests` and rename it. Follow the given syntax, and everything should be fine.
Don't forget to import it in `tests/main.js` for it to be added to the global tests or you'll have to type `node ./tests/name_of_your_test.js` to run it.

### Base test file syntax
Replace everything between `<>` accordingly.
```js 
// <TEST_FILE_DESCRIPTION>

const { testAndReport, testResult: tr, testItem: ti } = require("./test-suite.js");
const { <TESTED_FORMAT> } = require("../src/validate-format.js");

const <MY_TESTED_FORMAT_1> = new <TESTED_FORMAT>(<OPTIONS>);
const <MY_TESTED_FORMAT_2> = new <TESTED_FORMAT>(<OPTIONS_2>);

// Values to test and their expected state
const tests = [

	// ### Evaluated to true :
	new tr(new ti(<TEST_VALUE_1>, <MY_TESTED_FORMAT_1>, <BOOL_EXPECTED_OUTPUT>, "<TEST_DESC>")),

	// ### Evaluated to false :
	new tr(new ti(<TEST_VALUE_2>, <MY_TESTED_FORMAT_2>, <BOOL_EXPECTED_OUTPUT>, "<TEST_DESC>")),];

module.exports = {tests};

if (!module.parent){
	testAndReport(tests);
}
```
