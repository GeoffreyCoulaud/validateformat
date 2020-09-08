// Master Class
class Format{
	constructor(type = 'object'){
		this.type = type;
		this.validateType = function(obj){
			const primitiveTypes = [
				'undefined',
				'function',
				'boolean',
				'object',
				'string',
				'number',
				'bigint',
				'symbol'
			];
			if (primitiveTypes.includes(this.type)){
				return (typeof obj === this.type);
			} 
			else if (this.type === "array"){
				return Array.isArray(obj);
			}
		}
	}
}

// Anything goes through, it just needs to be defined
class Defined extends Format{
	constructor(){
		super('object');
		this.match = function(obj){
			return (typeof obj !== 'undefined'); 
		}
	}
}

// Just a specific value goes through
const SpecificSupportedTypes = ["undefined", "boolean", "number", "bigint", "string"];
class Specific extends Format{
	constructor(value){
		
		// Check type of the specific value
		let t = typeof value;
		if (!SpecificSupportedTypes.includes(t) && value !== null){
			throw new TypeError("Supported types for specific formats are : "+SpecificSupportedTypes.join(", ")+" and the `null` value - given "+(t));
		}

		super(typeof value);
		this.value = value;
		this.match = function(obj){
			if (typeof this.value !== "bigint"){
				if (isNaN(this.value) && isNaN(obj)){return true;}
			} 
			return obj === this.value;
		}
	}
}

// Anything truthy goes through
class Truthy extends Format{
	constructor(){
		super('object');
		this.match = function(obj){
			return !!obj;
		}
	}
}

// Anything falsy goes through
class Falsy extends Format{
	constructor(){
		super('object');
		this.match = function(obj){
			return !obj;
		}
	}
}

// Booleans go through
class Bool extends Format{
	constructor(){
		super('boolean');
		this.match = this.validateType;
	}
}

// Numbers go through
// (You can specify a min, max and force integer or not)
class Num extends Format{
	constructor(options){
		super('number');
		
		let min=null, max=null, forceInt=false, strict=false;
		if (typeof options === 'object'){
			if (options.hasOwnProperty('min')){min=options.min;}
			if (options.hasOwnProperty('max')){max=options.max;}
			if (options.hasOwnProperty('forceInt')){forceInt=options.forceInt;}
			if (options.hasOwnProperty('strict')){strict=options.strict;}
		}
		
		this.min = min;
		this.max = max;
		this.forceInt = forceInt;
		this.strict = strict;

		this.match = function(obj){
			if (!this.validateType(obj)){return false;}
			if (Number.isNaN(obj)){return false;}
			if (this.forceInt){
				if (!Number.isInteger(obj)){return false;}
			}
			if (this.strict){
				if (obj === this.min){return false;}
				if (obj === this.max){return false;}
			}
			if (this.min !== null && obj < this.min){return false;}
			if (this.max !== null && obj > this.max){return false;}
			return true;
		}
	}
}

// Integers go through
// (You can specify a min and a max)
class Int extends Num{
	constructor(options){
		options.forceInt = true;
		super(options);
	}
}

// Strings go through
// (you can specify a precise size, a min size, a max size, an alphabet and a regex. If size is not null, min and max will not be checked)
class Str extends Format{
	constructor(options){
		super('string');

		let size=null, min=null, max=null, regex=null, alphabet=null;
		if(typeof options === 'object'){
			if(options.hasOwnProperty('size')){size=options.size}
			if(options.hasOwnProperty('min')){min=options.min}
			if(options.hasOwnProperty('max')){max=options.max}
			if(options.hasOwnProperty('regex')){regex=options.regex}
			if(options.hasOwnProperty('alphabet')){alphabet=options.alphabet}
		}

		this.size = size;
		this.min = min;
		this.max = max;
		this.regex = regex;
		this.alphabet = alphabet;
		
		this.match = function(obj){
			if (!this.validateType(obj)){return false;}
			if (this.alphabet !== null){
				for (let letter of obj){
					if (!this.alphabet.includes(letter)){return false;}
				}
			}
			if (this.regex !== null){
				if (!this.regex.test(obj)){return false;}
			}
			if (this.size !== null){
				if (obj.length !== this.size){return false;}
			} 
			else {
				if (this.min !== null && obj.length < this.min){return false;}
				if (this.max !== null && obj.length > this.max){return false;}
			}
			return true;
		}
	}
}

// Arrays go through
// (You can specify a size, a min size and a max size, if size is not null, min and max will not be checked)
class Arr extends Format{
	constructor(options){
		super('array');

		this.size=null;
		this.min=null;
		this.max=null;

		if (typeof options === 'object'){
			if(options.hasOwnProperty('size')){this.size = options.size};
			if(options.hasOwnProperty('min')){this.min = options.min};
			if(options.hasOwnProperty('max')){this.max = options.max};
		}
		
		this.match = function(obj){
			if (!this.validateType(obj)){return false;}
			if (this.size !== null){
				if (obj.length !== this.size){return false;}
			}
			else {
				if (this.min !== null && obj.length < this.min){return false;}
				if (this.max !== null && obj.length > this.max){return false;}
			}
			return true;
		}
	}
}

// Arrays of specific things go through
// (Same parameters as Arr, plus insideFormat against all items of the array will be checked)
class ArrOf extends Arr{
	constructor(options){
		
		let size=null, min=null, max=null;
		if (typeof options === 'object'){
			if (options.hasOwnProperty('size')){size=options.size;}
			if (options.hasOwnProperty('min')){min=options.min;}
			if (options.hasOwnProperty('max')){max=options.max;}
		}
		
		super({'size':size, 'min':min, 'max':max});
		this.origMatch = this.match;
		
		this.format = options.format;
		this.match = function(obj){
			if (!this.origMatch(obj)){return false;}
			for (let item of obj){
				if (!this.format.match(item)){return false;};
			}
			return true;
		}
	}
}

// Any of the given formats goes through
class Or extends Format{
	constructor(){
		super('object');
		this.formats = Array.from(arguments);
		this.match = function(obj){
			for (let format of this.formats){
				if (format.match(obj)){return true;}
			}
			return false;
		}
	}
}

// Anything not validating the given format goes through
class Not extends Format{
	constructor(format){
		super('object');
		this.format = format;
		this.match = function(obj){
			return !this.format.match(obj);
		}
	}
}

function validate(obj, format){
	// If format is a Format
	if (format instanceof Format){
		// Test if obj matches format
		return format.match(obj);
	} 

	// If format is not a Format
	else {
		// Go through the properties (recusively if needed)
		for (let [key, subFormat] of Object.entries(format)){
			if (obj.hasOwnProperty(key)){
				// If key exists, validate its content to the subFormat
				return validate(obj[key], subFormat);
			} else {
				// If key doesn't exist in obj, return false
				return false;
			}
		}
	} 
}

// -----------------------------------------------------------
// Exporting
// -----------------------------------------------------------

// Older browser method
const ValidateFormat = {
	'Format': Format,

	'Specific': Specific,
	'Defined': Defined,
	'Truthy': Truthy,
	'Falsy': Falsy,
	'ArrOf': ArrOf,
	'Bool': Bool,
	'Num': Num,
	'Int': Int,
	'Str': Str,
	'Arr': Arr,
	'Not': Not,
	'Or': Or,

	'validate': validate
};

// Modern modules method
if (typeof module !== 'undefined'){
	module.exports = ValidateFormat;
}