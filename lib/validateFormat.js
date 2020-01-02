// Master Class
class Format {
  constructor(type = 'object') {
    this.type = type;

    this.validateType = function (obj) {
      const primitiveTypes = ['undefined', 'function', 'boolean', 'object', 'string', 'number', 'bigint', 'symbol'];

      if (primitiveTypes.includes(this.type)) {
        return typeof obj === this.type;
      } else if (this.type === "array") {
        return Array.isArray(obj);
      }
    };
  }

} // Anything goes through, it just needs to be defined


class Defined extends Format {
  constructor() {
    super('object');

    this.match = function (obj) {
      return typeof obj !== 'undefined';
    };
  }

} // Just a specific value goes through


class Specific extends Format {
  constructor(value) {
    super(typeof value);
    this.value = value;

    this.match = function (obj) {
      return obj === this.value;
    };
  }

} // Anything truthy goes through


class Thruthy extends Format {
  constructor() {
    super('object');

    this.match = function (obj) {
      return !!obj;
    };
  }

} // Anything falsy goes through


class Falsy extends Format {
  constructor() {
    super('object');

    this.match = function (obj) {
      return !obj;
    };
  }

} // Booleans go through


class Bool extends Format {
  constructor() {
    super('boolean');
    this.match = this.validateType;
  }

} // Numbers go through
// (You can specify a min, max and force integer or not)


class Num extends Format {
  constructor({
    min,
    max,
    forceInt = false
  }) {
    super('number');
    this.min = min;
    this.max = max;
    this.forceInt = forceInt;

    this.match = function (obj) {
      if (!this.validateType(obj)) {
        return false;
      }

      if (Number.isNaN(obj)) {
        return false;
      }

      if (this.forceInt && !Number.isInteger(obj)) {
        return false;
      }

      if (obj < min) {
        return false;
      }

      if (obj > max) {
        return false;
      }

      return true;
    };
  }

} // Integers go through
// (You can specify a min and a max)


class Int extends Num {
  constructor({
    min,
    max
  }) {
    super({
      'min': min,
      'max': max,
      'forceInt': true
    });
  }

} // Strings go through
// (you can specify a precise size, a min size, a max size and a regex f size is not null, min and max will not be checked)


class Str extends Format {
  constructor({
    size = null,
    min = null,
    max = null,
    regex = null
  }) {
    super('string');
    this.size = size;
    this.min = min;
    this.max = max;
    this.regex = regex;

    this.match = function (obj) {
      if (!this.validateType(obj)) {
        return false;
      }

      if (this.regex !== null) {
        if (!this.regex.test(obj)) {
          return false;
        }
      }

      if (this.size !== null) {
        if (obj.length !== this.size) {
          return false;
        }
      } else if (this.min !== null && this.max !== null) {
        if (obj.length < this.min) {
          return false;
        }

        if (obj.length > this.max) {
          return false;
        }
      }

      return true;
    };
  }

} // Arrays go through
// (You can specify a size, a min size and a max size, if size is not null, min and max will not be checked)


class Arr extends Format {
  constructor({
    size = null,
    min = null,
    max = null
  }) {
    super('array');
    this.size = size;
    this.min = min;
    this.max = max;

    this.globalMatch = function (obj) {
      if (!this.validateType(obj)) {
        return false;
      }

      if (this.size !== null) {
        if (obj.length !== this.size) {
          return false;
        }
      } else if (this.min !== null && this.max !== null) {
        if (obj.length < this.min) {
          return false;
        }

        if (obj.length > this.max) {
          return false;
        }
      }

      return true;
    };

    this.match = this.globalMatch;
  }

} // Arrays of specific things go through
// (Same parameters as Arr, plus insideFormat against all items of the array will be checked)


class ArrOf extends Arr {
  constructor({
    insideFormat,
    size = null,
    min = null,
    max = null
  }) {
    super({
      'size': size,
      'min': min,
      'max': max
    });
    this.insideFormat = format;

    this.match = function (obj) {
      if (!this.globalMatch(obj)) {
        return false;
      }

      for (let item of obj) {
        if (!this.insideFormat.match(item)) {
          return false;
        }

        ;
      }

      return true;
    };
  }

} // Any of the given formats goes through


class Or extends Format {
  constructor(formats) {
    super('object');
    this.formats = formats;

    this.match = function (obj) {
      this.formats.forEach(format => {
        if (format.match(obj)) {
          return true;
        }
      });
      return false;
    };
  }

} // Anything not validating the given format goes through


class Not extends Format {
  constructor(format) {
    super('object');
    this.format = format;

    this.match = function (obj) {
      return !this.format.match(obj);
    };
  }

}

function validate(obj, format) {
  // If format is a Format
  if (format instanceof Format) {
    // Test if obj matches format
    return format.match(obj);
  } // If format is not a Format
  else {
      // Go through the properties (recusively if needed)
      for (let [key, subFormat] of Object.entries(format)) {
        if (obj.hasOwnProperty(key)) {
          // If key exists, validate its content to the subFormat
          return validate(obj[key], subFormat);
        } else {
          // If key doesn't exist in obj, return false
          return false;
        }
      }
    }
} // -----------------------------------------------------------
// Exporting
// -----------------------------------------------------------
// Older browser method


const ValidateFormat = {
  'Format': Format,
  'Specific': Specific,
  'Defined': Defined,
  'Thruthy': Thruthy,
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
}; // Modern modules method

if (typeof module !== 'undefined') {
  module.exports = ValidateFormat;
}