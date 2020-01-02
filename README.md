# ValidateFormat
 Check if the given object matches a given format.

## Usage
After including validateFormat for usage, just pass the object to be validated as the first parameter of validate and a format to be validated against as the second parameter.
All the options given to build your formats are enclosed in object litterals. (`{}`)
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
	interests: new val.ArrOf({insideFormat: val.Str({min: 0, max: 256})})
};
const doesThisMatch = val.validate(myObject, myFormat);
console.log(doesThisMatch); // <----------- false (coolness is over 9000)
```

## Built-in formats
The parameters prefixed by a * are required.

| name (parameters) | condition for obj to match | 
| ---- | ------------------ |
| Defined | obj is not undefined |
| Specific | obj is a given value |
| Thruthy | obj is truthy  |
| Falsy | obj is falsy |
| Bool | obj is a boolean  |
| Num (min,max,forceInt) | obj is a number between `min` and `max` (included). If `forceInt` is `true`, obj is an integer  |
| Int (min,max) | obj is an integer between `min` and `max`(included) |
| Str (size,min,max,regex) | obj is a string which length is `size` or between `min` and `max` (exact length prevals) and matches `regex` |
| Arr (size,min,max) | obj is an array which length is `size` or between `min` and `max` (exact length prevals) |
| ArrOf (\*insideFormat,size,min,max) | obj is an array which length is `size` or between `min` and `max` (exact length prevals) and its items all match `insideFormat` |
| Or (\*formats) | obj matches one of the formats in the given array `formats` |

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
