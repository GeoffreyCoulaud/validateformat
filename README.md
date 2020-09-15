# ValidateFormat
 Check if the given object matches a given format.


## Installation
You can download validateformat via npm
```
npm i -S validateformat
```

## Usage
After including validateFormat for usage, just pass the object to be validated as the first parameter of validate and a format to be validated against as the second parameter.
All the options given to build your formats are enclosed in object litterals `{}`, except operator formats such as `Not` and `Or` that only recieve one or several format instances as parameters and `Specific` that can only recieve a primitive value.
The options and usage for built-in formats are given down below.

### Validating a simple string
```js
import { validate, Str } from 'validateformat';
const myObject = 'foobar'; 
const myFormat = new Str({'regex':/^f.+r$/});
const doesThisMatch = validate(myObject, myFormat);
console.log(doesThisMatch); // <----------- true
```

### Validating a more complex object
```js
import { validate, Str, Num, ArrOf } from 'validateformat';
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
	name: new Str({min: 1, max: 256}),
	coolness: new Num({min: 0, max: 9000}),
	interests: new ArrOf({format: new Str({min: 1, max: 256})})
};
const doesThisMatch = validate(myObject, myFormat);
console.log(doesThisMatch); // <----------- false (coolness is over 9000)
```

## Built-in formats
Parameters prefixed by a * are required.

| name (parameters) | condition for obj to match | example |
| ----------------- | -------------------------- | ------- |
| Defined | obj is not undefined | `new Defined()` |
| Specific | obj is a given value | `new Specific(4)` |
| Thruthy | obj is truthy | `new Truthy()` | 
| Falsy | obj is falsy | `new Falsy()` |
| Bool | obj is a boolean | `new Bool()` |
| Num (`min`,`max`,`forceInt`) | obj is a number between `min` and `max` (included). If `forceInt` is `true`, obj is an integer  | `new Num({min: -5.2, max: 9.3})` |
| Int (`min`,`max`) | obj is an integer between `min` and `max` (included) | `new Int({min: -1, max: 5})` |
| Str (`size`,`min`,`max`,`regex`, `alphabet`) | obj is a string which length is `size` or between `min` and `max` (exact length prevals), matches `regex`, and only contains character of `alphabet`**(1)** | `new Str({size: 20, regex: /^\[A-Z\].*\[\.?!\]/})` |
| Arr (`size`,`min`,`max`) | obj is an array which length is `size` or between `min` and `max` (exact length prevals) | `new Arr({size: 3})` |
| ArrOf (\*`format`,`size`,`min`,`max`) | obj is an array which length is `size` or between `min` and `max` (exact length prevals) and its items all match `format` | `new ArrOf({size: 2, format: new Num({min: -999, max: 999})})` |
| Or (\*`formats`) | obj matches one of the formats in the given array `formats` | `new Or(new Bool(), new Specific(-1))` |
| Not (\*`format`) | obj doesn't match the given `format` | `new Not(new Specific('Hello I am a hacking bot'))` |

**(1)** `alphabet` can be any iterable. You would want to use a string as it is more readable. 

## How to add formats
You can create your own formats simply by extending the `Format` class and precising the `match` method.
### E.G. A simple MinMax format
Lets say you recieve two values from the user, a lowest price (min) and a highest price (max) to filter a database search.
The minimum price can't be lower than 0, and the maximum price can't be higher than 100, our most expensive product of all time.
```js
import { validate, Format, Num } from 'validateformat';
const MAX_PRICE_OF_ALL_TIME = 100;
class MinMaxFormat extends Format{
	constructor({min = null, max = null}){
		super('object'); // Precising the js type expected
		this.min = new Num({'min':0, 'max':max});
		this.max = new Num({'min':min, 'max':Number.MAX_SAFE_INTEGER});
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
const doesThisMatch = validate(myObj, myFormat);
console.log(doesThisMatch); // <----------- true
```

## How to run the tests and add some
In the project folder, run `npm run test` or `npm run test-verbose` to run tests.  
To add tests, copy and paste one of the already existing test files in `tests` and rename it. Follow the given syntax, and everything should be fine.
Don't forget to import it in `tests/main.js` for it to be added to the global tests.

### Base test file syntax
Replace everything between `<>` accordingly.
```js 
// <TEST_FILE_DESCRIPTION>

import { testAndReport, testResult as tr, testItem as ti } from "./test-suite.mjs";
import { <TESTED_FORMAT> } from "../src/validateformat.mjs");

const <MY_TESTED_FORMAT_1> = new <TESTED_FORMAT>(<OPTIONS>);
const <MY_TESTED_FORMAT_2> = new <TESTED_FORMAT>(<OPTIONS_2>);

// Values to test and their expected state
export const tests = [

	// ### Evaluated to true :
	new tr(new ti(<TEST_VALUE_1>, <MY_TESTED_FORMAT_1>, <BOOL_EXPECTED_OUTPUT>, "<TEST_DESC>")),

	// ### Evaluated to false :
	new tr(new ti(<TEST_VALUE_2>, <MY_TESTED_FORMAT_2>, <BOOL_EXPECTED_OUTPUT>, "<TEST_DESC>")),
];
```
