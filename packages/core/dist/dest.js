(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Core = factory());
}(this, (function () { 'use strict';

	var eventEmitter = {exports: {}};

	var d$1 = {exports: {}};

	// ES3 safe
	var _undefined$1 = void 0;

	var is$5 = function (value) { return value !== _undefined$1 && value !== null; };

	var isValue$5 = is$5;

	// prettier-ignore
	var possibleTypes = { "object": true, "function": true, "undefined": true /* document.all */ };

	var is$4 = function (value) {
		if (!isValue$5(value)) return false;
		return hasOwnProperty.call(possibleTypes, typeof value);
	};

	var isObject$8 = is$4;

	var is$3 = function (value) {
		if (!isObject$8(value)) return false;
		try {
			if (!value.constructor) return false;
			return value.constructor.prototype === value;
		} catch (error) {
			return false;
		}
	};

	var isPrototype = is$3;

	var is$2 = function (value) {
		if (typeof value !== "function") return false;

		if (!hasOwnProperty.call(value, "length")) return false;

		try {
			if (typeof value.length !== "number") return false;
			if (typeof value.call !== "function") return false;
			if (typeof value.apply !== "function") return false;
		} catch (error) {
			return false;
		}

		return !isPrototype(value);
	};

	var isFunction = is$2;

	var classRe = /^\s*class[\s{/}]/, functionToString = Function.prototype.toString;

	var is$1 = function (value) {
		if (!isFunction(value)) return false;
		if (classRe.test(functionToString.call(value))) return false;
		return true;
	};

	var isImplemented$2 = function () {
		var assign = Object.assign, obj;
		if (typeof assign !== "function") return false;
		obj = { foo: "raz" };
		assign(obj, { bar: "dwa" }, { trzy: "trzy" });
		return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
	};

	var isImplemented$1 = function () {
		try {
			Object.keys("primitive");
			return true;
		} catch (e) {
			return false;
		}
	};

	// eslint-disable-next-line no-empty-function
	var noop = function () {};

	var _undefined = noop(); // Support ES3 engines

	var isValue$4 = function (val) { return val !== _undefined && val !== null; };

	var isValue$3 = isValue$4;

	var keys$2 = Object.keys;

	var shim$2 = function (object) { return keys$2(isValue$3(object) ? Object(object) : object); };

	var keys$1 = isImplemented$1() ? Object.keys : shim$2;

	var isValue$2 = isValue$4;

	var validValue = function (value) {
		if (!isValue$2(value)) throw new TypeError("Cannot use null or undefined");
		return value;
	};

	var keys  = keys$1
	  , value = validValue
	  , max$1   = Math.max;

	var shim$1 = function (dest, src/*, …srcn*/) {
		var error, i, length = max$1(arguments.length, 2), assign;
		dest = Object(value(dest));
		assign = function (key) {
			try {
				dest[key] = src[key];
			} catch (e) {
				if (!error) error = e;
			}
		};
		for (i = 1; i < length; ++i) {
			src = arguments[i];
			keys(src).forEach(assign);
		}
		if (error !== undefined) throw error;
		return dest;
	};

	var assign$1 = isImplemented$2() ? Object.assign : shim$1;

	var isValue$1 = isValue$4;

	var forEach = Array.prototype.forEach, create$2 = Object.create;

	var process = function (src, obj) {
		var key;
		for (key in src) obj[key] = src[key];
	};

	// eslint-disable-next-line no-unused-vars
	var normalizeOptions = function (opts1/*, …options*/) {
		var result = create$2(null);
		forEach.call(arguments, function (options) {
			if (!isValue$1(options)) return;
			process(Object(options), result);
		});
		return result;
	};

	var str = "razdwatrzy";

	var isImplemented = function () {
		if (typeof str.contains !== "function") return false;
		return str.contains("dwa") === true && str.contains("foo") === false;
	};

	var indexOf = String.prototype.indexOf;

	var shim = function (searchString/*, position*/) {
		return indexOf.call(this, searchString, arguments[1]) > -1;
	};

	var contains$1 = isImplemented() ? String.prototype.contains : shim;

	var isValue         = is$5
	  , isPlainFunction = is$1
	  , assign          = assign$1
	  , normalizeOpts   = normalizeOptions
	  , contains        = contains$1;

	var d = (d$1.exports = function (dscr, value/*, options*/) {
		var c, e, w, options, desc;
		if (arguments.length < 2 || typeof dscr !== "string") {
			options = value;
			value = dscr;
			dscr = null;
		} else {
			options = arguments[2];
		}
		if (isValue(dscr)) {
			c = contains.call(dscr, "c");
			e = contains.call(dscr, "e");
			w = contains.call(dscr, "w");
		} else {
			c = w = true;
			e = false;
		}

		desc = { value: value, configurable: c, enumerable: e, writable: w };
		return !options ? desc : assign(normalizeOpts(options), desc);
	});

	d.gs = function (dscr, get, set/*, options*/) {
		var c, e, options, desc;
		if (typeof dscr !== "string") {
			options = set;
			set = get;
			get = dscr;
			dscr = null;
		} else {
			options = arguments[3];
		}
		if (!isValue(get)) {
			get = undefined;
		} else if (!isPlainFunction(get)) {
			options = get;
			get = set = undefined;
		} else if (!isValue(set)) {
			set = undefined;
		} else if (!isPlainFunction(set)) {
			options = set;
			set = undefined;
		}
		if (isValue(dscr)) {
			c = contains.call(dscr, "c");
			e = contains.call(dscr, "e");
		} else {
			c = true;
			e = false;
		}

		desc = { get: get, set: set, configurable: c, enumerable: e };
		return !options ? desc : assign(normalizeOpts(options), desc);
	};

	var validCallable = function (fn) {
		if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
		return fn;
	};

	(function (module, exports) {

	var d        = d$1.exports
	  , callable = validCallable

	  , apply = Function.prototype.apply, call = Function.prototype.call
	  , create = Object.create, defineProperty = Object.defineProperty
	  , defineProperties = Object.defineProperties
	  , hasOwnProperty = Object.prototype.hasOwnProperty
	  , descriptor = { configurable: true, enumerable: false, writable: true }

	  , on, once, off, emit, methods, descriptors, base;

	on = function (type, listener) {
		var data;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) {
			data = descriptor.value = create(null);
			defineProperty(this, '__ee__', descriptor);
			descriptor.value = null;
		} else {
			data = this.__ee__;
		}
		if (!data[type]) data[type] = listener;
		else if (typeof data[type] === 'object') data[type].push(listener);
		else data[type] = [data[type], listener];

		return this;
	};

	once = function (type, listener) {
		var once, self;

		callable(listener);
		self = this;
		on.call(this, type, once = function () {
			off.call(self, type, once);
			apply.call(listener, this, arguments);
		});

		once.__eeOnceListener__ = listener;
		return this;
	};

	off = function (type, listener) {
		var data, listeners, candidate, i;

		callable(listener);

		if (!hasOwnProperty.call(this, '__ee__')) return this;
		data = this.__ee__;
		if (!data[type]) return this;
		listeners = data[type];

		if (typeof listeners === 'object') {
			for (i = 0; (candidate = listeners[i]); ++i) {
				if ((candidate === listener) ||
						(candidate.__eeOnceListener__ === listener)) {
					if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
					else listeners.splice(i, 1);
				}
			}
		} else {
			if ((listeners === listener) ||
					(listeners.__eeOnceListener__ === listener)) {
				delete data[type];
			}
		}

		return this;
	};

	emit = function (type) {
		var i, l, listener, listeners, args;

		if (!hasOwnProperty.call(this, '__ee__')) return;
		listeners = this.__ee__[type];
		if (!listeners) return;

		if (typeof listeners === 'object') {
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

			listeners = listeners.slice();
			for (i = 0; (listener = listeners[i]); ++i) {
				apply.call(listener, this, args);
			}
		} else {
			switch (arguments.length) {
			case 1:
				call.call(listeners, this);
				break;
			case 2:
				call.call(listeners, this, arguments[1]);
				break;
			case 3:
				call.call(listeners, this, arguments[1], arguments[2]);
				break;
			default:
				l = arguments.length;
				args = new Array(l - 1);
				for (i = 1; i < l; ++i) {
					args[i - 1] = arguments[i];
				}
				apply.call(listeners, this, args);
			}
		}
	};

	methods = {
		on: on,
		once: once,
		off: off,
		emit: emit
	};

	descriptors = {
		on: d(on),
		once: d(once),
		off: d(off),
		emit: d(emit)
	};

	base = defineProperties({}, descriptors);

	module.exports = exports = function (o) {
		return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
	};
	exports.methods = methods;
	}(eventEmitter, eventEmitter.exports));

	var EventEmitter = eventEmitter.exports;

	// This file replaces `index.js` in bundlers like webpack or Rollup,

	let nanoid = (size = 21) => {
	  let id = '';
	  let bytes = crypto.getRandomValues(new Uint8Array(size));

	  // A compact alternative for `for (var i = 0; i < step; i++)`.
	  while (size--) {
	    // It is incorrect to use bytes exceeding the alphabet size.
	    // The following mask reduces the random byte in the 0-255 value
	    // range to the 0-63 value range. Therefore, adding hacks, such
	    // as empty string fallback or magic numbers, is unneccessary because
	    // the bitmask trims bytes down to the alphabet size.
	    let byte = bytes[size] & 63;
	    if (byte < 36) {
	      // `0-9a-z`
	      id += byte.toString(36);
	    } else if (byte < 62) {
	      // `A-Z`
	      id += (byte - 26).toString(36).toUpperCase();
	    } else if (byte < 63) {
	      id += '_';
	    } else {
	      id += '-';
	    }
	  }
	  return id
	};

	/**
	 * 组件基类
	 *
	 * @class Component
	 */

	class Component {
	  constructor() {
	    EventEmitter(this);
	    this.id = nanoid(8);
	  }

	  destroy() {}

	}

	var _global = {exports: {}};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$6 = _global.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global$6; // eslint-disable-line no-undef

	var _core = {exports: {}};

	var core$4 = _core.exports = { version: '2.6.12' };
	if (typeof __e == 'number') __e = core$4; // eslint-disable-line no-undef

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding
	var aFunction$1 = _aFunction;
	var _ctx = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var _objectDp = {};

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var isObject$7 = _isObject;
	var _anObject = function (it) {
	  if (!isObject$7(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var isObject$6 = _isObject;
	var document$1 = _global.exports.document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject$6(document$1) && isObject$6(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject$5 = _isObject;
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!isObject$5(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject$5(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject$5(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject$5(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var anObject$5 = _anObject;
	var IE8_DOM_DEFINE$1 = _ie8DomDefine;
	var toPrimitive$2 = _toPrimitive;
	var dP$6 = Object.defineProperty;

	_objectDp.f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject$5(O);
	  P = toPrimitive$2(P, true);
	  anObject$5(Attributes);
	  if (IE8_DOM_DEFINE$1) try {
	    return dP$6(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var dP$5 = _objectDp;
	var createDesc$3 = _propertyDesc;
	var _hide = _descriptors ? function (object, key, value) {
	  return dP$5.f(object, key, createDesc$3(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty$1 = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty$1.call(it, key);
	};

	var global$5 = _global.exports;
	var core$3 = _core.exports;
	var ctx$5 = _ctx;
	var hide$4 = _hide;
	var has$6 = _has;
	var PROTOTYPE$2 = 'prototype';

	var $export$9 = function (type, name, source) {
	  var IS_FORCED = type & $export$9.F;
	  var IS_GLOBAL = type & $export$9.G;
	  var IS_STATIC = type & $export$9.S;
	  var IS_PROTO = type & $export$9.P;
	  var IS_BIND = type & $export$9.B;
	  var IS_WRAP = type & $export$9.W;
	  var exports = IS_GLOBAL ? core$3 : core$3[name] || (core$3[name] = {});
	  var expProto = exports[PROTOTYPE$2];
	  var target = IS_GLOBAL ? global$5 : IS_STATIC ? global$5[name] : (global$5[name] || {})[PROTOTYPE$2];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && has$6(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx$5(out, global$5)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE$2] = C[PROTOTYPE$2];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx$5(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export$9.R && expProto && !expProto[key]) hide$4(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export$9.F = 1;   // forced
	$export$9.G = 2;   // global
	$export$9.S = 4;   // static
	$export$9.P = 8;   // proto
	$export$9.B = 16;  // bind
	$export$9.W = 32;  // wrap
	$export$9.U = 64;  // safe
	$export$9.R = 128; // real proto method for `library`
	var _export = $export$9;

	var toString$1 = {}.toString;

	var _cof = function (it) {
	  return toString$1.call(it).slice(8, -1);
	};

	// 7.2.2 IsArray(argument)
	var cof$2 = _cof;
	var _isArray = Array.isArray || function isArray(arg) {
	  return cof$2(arg) == 'Array';
	};

	// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
	var $export$8 = _export;

	$export$8($export$8.S, 'Array', { isArray: _isArray });

	var isArray$3 = _core.exports.Array.isArray;

	var isArray$2 = isArray$3;

	function _arrayWithHoles(arr) {
	  if (isArray$2(arr)) return arr;
	}

	var _redefine = _hide;

	var _meta = {exports: {}};

	var id$1 = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id$1 + px).toString(36));
	};

	var META$1 = _uid('meta');
	var isObject$4 = _isObject;
	var has$5 = _has;
	var setDesc = _objectDp.f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !_fails(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META$1, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey$1 = function (it, create) {
	  // return primitive with prefix
	  if (!isObject$4(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has$5(it, META$1)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META$1].i;
	};
	var getWeak = function (it, create) {
	  if (!has$5(it, META$1)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META$1].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta$1.NEED && isExtensible(it) && !has$5(it, META$1)) setMeta(it);
	  return it;
	};
	var meta$1 = _meta.exports = {
	  KEY: META$1,
	  NEED: false,
	  fastKey: fastKey$1,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};

	var _shared = {exports: {}};

	var _library = true;

	var core$2 = _core.exports;
	var global$4 = _global.exports;
	var SHARED = '__core-js_shared__';
	var store$1 = global$4[SHARED] || (global$4[SHARED] = {});

	(_shared.exports = function (key, value) {
	  return store$1[key] || (store$1[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: core$2.version,
	  mode: 'pure' ,
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});

	var _wks = {exports: {}};

	var store = _shared.exports('wks');
	var uid$2 = _uid;
	var Symbol = _global.exports.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = _wks.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid$2)('Symbol.' + name));
	};

	$exports.store = store;

	var def = _objectDp.f;
	var has$4 = _has;
	var TAG$1 = _wks.exports('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !has$4(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
	};

	var _wksExt = {};

	_wksExt.f = _wks.exports;

	var core$1 = _core.exports;
	var wksExt$1 = _wksExt;
	var defineProperty = _objectDp.f;
	var _wksDefine = function (name) {
	  var $Symbol = core$1.Symbol || (core$1.Symbol = {} );
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt$1.f(name) });
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof$1 = _cof;
	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof$1(it) == 'String' ? it.split('') : Object(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject$1 = _iobject;
	var defined$2 = _defined;
	var _toIobject = function (it) {
	  return IObject$1(defined$2(it));
	};

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.1.15 ToLength
	var toInteger$2 = _toInteger;
	var min$1 = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min$1(toInteger$2(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var toInteger$1 = _toInteger;
	var max = Math.max;
	var min = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = toInteger$1(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject$5 = _toIobject;
	var toLength$3 = _toLength;
	var toAbsoluteIndex = _toAbsoluteIndex;
	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject$5($this);
	    var length = toLength$3(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var shared$1 = _shared.exports('keys');
	var uid$1 = _uid;
	var _sharedKey = function (key) {
	  return shared$1[key] || (shared$1[key] = uid$1(key));
	};

	var has$3 = _has;
	var toIObject$4 = _toIobject;
	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO$2 = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = toIObject$4(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO$2) has$3(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has$3(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys$2 = _objectKeysInternal;
	var enumBugKeys$1 = _enumBugKeys;

	var _objectKeys = Object.keys || function keys(O) {
	  return $keys$2(O, enumBugKeys$1);
	};

	var _objectGops = {};

	_objectGops.f = Object.getOwnPropertySymbols;

	var _objectPie = {};

	_objectPie.f = {}.propertyIsEnumerable;

	// all enumerable object keys, includes symbols
	var getKeys$1 = _objectKeys;
	var gOPS = _objectGops;
	var pIE$1 = _objectPie;
	var _enumKeys = function (it) {
	  var result = getKeys$1(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE$1.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};

	// 7.1.13 ToObject(argument)
	var defined$1 = _defined;
	var _toObject = function (it) {
	  return Object(defined$1(it));
	};

	var dP$4 = _objectDp;
	var anObject$4 = _anObject;
	var getKeys = _objectKeys;

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$4(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP$4.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document = _global.exports.document;
	var _html = document && document.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject$3 = _anObject;
	var dPs = _objectDps;
	var enumBugKeys = _enumBugKeys;
	var IE_PROTO$1 = _sharedKey('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = anObject$3(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

	var _objectGopnExt = {};

	var _objectGopn = {};

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys$1 = _objectKeysInternal;
	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	_objectGopn.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys$1(O, hiddenKeys);
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject$3 = _toIobject;
	var gOPN$1 = _objectGopn.f;
	var toString = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN$1(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	_objectGopnExt.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject$3(it));
	};

	var _objectGopd = {};

	var pIE = _objectPie;
	var createDesc$2 = _propertyDesc;
	var toIObject$2 = _toIobject;
	var toPrimitive$1 = _toPrimitive;
	var has$2 = _has;
	var IE8_DOM_DEFINE = _ie8DomDefine;
	var gOPD$1 = Object.getOwnPropertyDescriptor;

	_objectGopd.f = _descriptors ? gOPD$1 : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject$2(O);
	  P = toPrimitive$1(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD$1(O, P);
	  } catch (e) { /* empty */ }
	  if (has$2(O, P)) return createDesc$2(!pIE.f.call(O, P), O[P]);
	};

	// ECMAScript 6 symbols shim
	var global$3 = _global.exports;
	var has$1 = _has;
	var DESCRIPTORS$3 = _descriptors;
	var $export$7 = _export;
	var redefine$1 = _redefine;
	var META = _meta.exports.KEY;
	var $fails = _fails;
	var shared = _shared.exports;
	var setToStringTag$3 = _setToStringTag;
	var uid = _uid;
	var wks = _wks.exports;
	var wksExt = _wksExt;
	var wksDefine = _wksDefine;
	var enumKeys = _enumKeys;
	var isArray$1 = _isArray;
	var anObject$2 = _anObject;
	var isObject$3 = _isObject;
	var toObject$3 = _toObject;
	var toIObject$1 = _toIobject;
	var toPrimitive = _toPrimitive;
	var createDesc$1 = _propertyDesc;
	var _create = _objectCreate;
	var gOPNExt = _objectGopnExt;
	var $GOPD = _objectGopd;
	var $GOPS = _objectGops;
	var $DP = _objectDp;
	var $keys = _objectKeys;
	var gOPD = $GOPD.f;
	var dP$3 = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global$3.Symbol;
	var $JSON = global$3.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto$1 = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
	var QObject = global$3.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS$3 && $fails(function () {
	  return _create(dP$3({}, 'a', {
	    get: function () { return dP$3(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto$1, key);
	  if (protoDesc) delete ObjectProto$1[key];
	  dP$3(it, key, D);
	  if (protoDesc && it !== ObjectProto$1) dP$3(ObjectProto$1, key, protoDesc);
	} : dP$3;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty$1 = function defineProperty(it, key, D) {
	  if (it === ObjectProto$1) $defineProperty$1(OPSymbols, key, D);
	  anObject$2(it);
	  key = toPrimitive(key, true);
	  anObject$2(D);
	  if (has$1(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has$1(it, HIDDEN)) dP$3(it, HIDDEN, createDesc$1(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has$1(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc$1(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP$3(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject$2(it);
	  var keys = enumKeys(P = toIObject$1(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty$1(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto$1 && has$1(AllSymbols, key) && !has$1(OPSymbols, key)) return false;
	  return E || !has$1(this, key) || !has$1(AllSymbols, key) || has$1(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject$1(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto$1 && has$1(AllSymbols, key) && !has$1(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has$1(AllSymbols, key) && !(has$1(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject$1(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has$1(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto$1;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject$1(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has$1(AllSymbols, key = names[i++]) && (IS_OP ? has$1(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto$1) $set.call(OPSymbols, value);
	      if (has$1(this, HIDDEN) && has$1(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc$1(1, value));
	    };
	    if (DESCRIPTORS$3 && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine$1($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty$1;
	  _objectGopn.f = gOPNExt.f = $getOwnPropertyNames;
	  _objectPie.f = $propertyIsEnumerable;
	  $GOPS.f = $getOwnPropertySymbols;

	  if (DESCRIPTORS$3 && !_library) {
	    redefine$1(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable);
	  }

	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}

	$export$7($export$7.G + $export$7.W + $export$7.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

	$export$7($export$7.S + $export$7.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has$1(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	$export$7($export$7.S + $export$7.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty$1,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });

	$export$7($export$7.S + $export$7.F * FAILS_ON_PRIMITIVES, 'Object', {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return $GOPS.f(toObject$3(it));
	  }
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export$7($export$7.S + $export$7.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!isObject$3(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!isArray$1(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag$3($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag$3(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag$3(global$3.JSON, 'JSON', true);

	_wksDefine('asyncIterator');

	_wksDefine('observable');

	var symbol$1 = _core.exports.Symbol;

	var symbol = symbol$1;

	var toInteger = _toInteger;
	var defined = _defined;
	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _iterators = {};

	var create$1 = _objectCreate;
	var descriptor = _propertyDesc;
	var setToStringTag$2 = _setToStringTag;
	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks.exports('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = create$1(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag$2(Constructor, NAME + ' Iterator');
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = _has;
	var toObject$2 = _toObject;
	var IE_PROTO = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = toObject$2(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var $export$6 = _export;
	var redefine = _redefine;
	var hide$3 = _hide;
	var Iterators$4 = _iterators;
	var $iterCreate = _iterCreate;
	var setToStringTag$1 = _setToStringTag;
	var getPrototypeOf = _objectGpo;
	var ITERATOR$3 = _wks.exports('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR$3] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag$1(IteratorPrototype, TAG, true);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR$3])) {
	    hide$3(proto, ITERATOR$3, $default);
	  }
	  // Plug for library
	  Iterators$4[NAME] = $default;
	  Iterators$4[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export$6($export$6.P + $export$6.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var $at = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	var step$1 = _iterStep;
	var Iterators$3 = _iterators;
	var toIObject = _toIobject;

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	_iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step$1(1);
	  }
	  if (kind == 'keys') return step$1(0, index);
	  if (kind == 'values') return step$1(0, O[index]);
	  return step$1(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators$3.Arguments = Iterators$3.Array;

	var global$2 = _global.exports;
	var hide$2 = _hide;
	var Iterators$2 = _iterators;
	var TO_STRING_TAG = _wks.exports('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = global$2[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide$2(proto, TO_STRING_TAG, NAME);
	  Iterators$2[NAME] = Iterators$2.Array;
	}

	var iterator$1 = _wksExt.f('iterator');

	var iterator = iterator$1;

	function _iterableToArrayLimit(arr, i) {
	  var _i = arr == null ? null : typeof symbol !== "undefined" && arr[iterator] || arr["@@iterator"];

	  if (_i == null) return;
	  var _arr = [];
	  var _n = true;
	  var _d = false;

	  var _s, _e;

	  try {
	    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
	      _arr.push(_s.value);

	      if (i && _arr.length === i) break;
	    }
	  } catch (err) {
	    _d = true;
	    _e = err;
	  } finally {
	    try {
	      if (!_n && _i["return"] != null) _i["return"]();
	    } finally {
	      if (_d) throw _e;
	    }
	  }

	  return _arr;
	}

	// call something on iterator step with safe closing on error
	var anObject$1 = _anObject;
	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(anObject$1(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) anObject$1(ret.call(iterator));
	    throw e;
	  }
	};

	// check on default Array iterator
	var Iterators$1 = _iterators;
	var ITERATOR$2 = _wks.exports('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (Iterators$1.Array === it || ArrayProto[ITERATOR$2] === it);
	};

	var $defineProperty = _objectDp;
	var createDesc = _propertyDesc;

	var _createProperty = function (object, index, value) {
	  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = _cof;
	var TAG = _wks.exports('toStringTag');
	// ES3 wrong here
	var ARG = cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var classof$1 = _classof;
	var ITERATOR$1 = _wks.exports('iterator');
	var Iterators = _iterators;
	var core_getIteratorMethod = _core.exports.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || Iterators[classof$1(it)];
	};

	var ITERATOR = _wks.exports('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(riter, function () { throw 2; });
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	var ctx$4 = _ctx;
	var $export$5 = _export;
	var toObject$1 = _toObject;
	var call$1 = _iterCall;
	var isArrayIter$1 = _isArrayIter;
	var toLength$2 = _toLength;
	var createProperty = _createProperty;
	var getIterFn$1 = core_getIteratorMethod;

	$export$5($export$5.S + $export$5.F * !_iterDetect(function (iter) { Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	    var O = toObject$1(arrayLike);
	    var C = typeof this == 'function' ? this : Array;
	    var aLen = arguments.length;
	    var mapfn = aLen > 1 ? arguments[1] : undefined;
	    var mapping = mapfn !== undefined;
	    var index = 0;
	    var iterFn = getIterFn$1(O);
	    var length, result, step, iterator;
	    if (mapping) mapfn = ctx$4(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if (iterFn != undefined && !(C == Array && isArrayIter$1(iterFn))) {
	      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
	        createProperty(result, index, mapping ? call$1(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength$2(O.length);
	      for (result = new C(length); length > index; index++) {
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});

	var from$2 = _core.exports.Array.from;

	var from$1 = from$2;

	function _arrayLikeToArray$1(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;

	  for (var i = 0, arr2 = new Array(len); i < len; i++) {
	    arr2[i] = arr[i];
	  }

	  return arr2;
	}

	function _unsupportedIterableToArray$1(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return from$1(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
	}

	function _nonIterableRest() {
	  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	function _slicedToArray(arr, i) {
	  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest();
	}

	var hide$1 = _hide;
	var _redefineAll = function (target, src, safe) {
	  for (var key in src) {
	    if (safe && target[key]) target[key] = src[key];
	    else hide$1(target, key, src[key]);
	  } return target;
	};

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	var _forOf = {exports: {}};

	var ctx$3 = _ctx;
	var call = _iterCall;
	var isArrayIter = _isArrayIter;
	var anObject = _anObject;
	var toLength$1 = _toLength;
	var getIterFn = core_getIteratorMethod;
	var BREAK = {};
	var RETURN = {};
	var exports$1 = _forOf.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
	  var f = ctx$3(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (isArrayIter(iterFn)) for (length = toLength$1(iterable.length); length > index; index++) {
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = call(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports$1.BREAK = BREAK;
	exports$1.RETURN = RETURN;

	var global$1 = _global.exports;
	var core = _core.exports;
	var dP$2 = _objectDp;
	var DESCRIPTORS$2 = _descriptors;
	var SPECIES$1 = _wks.exports('species');

	var _setSpecies = function (KEY) {
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global$1[KEY];
	  if (DESCRIPTORS$2 && C && !C[SPECIES$1]) dP$2.f(C, SPECIES$1, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var isObject$2 = _isObject;
	var _validateCollection = function (it, TYPE) {
	  if (!isObject$2(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
	  return it;
	};

	var dP$1 = _objectDp.f;
	var create = _objectCreate;
	var redefineAll$1 = _redefineAll;
	var ctx$2 = _ctx;
	var anInstance$1 = _anInstance;
	var forOf$3 = _forOf.exports;
	var $iterDefine = _iterDefine;
	var step = _iterStep;
	var setSpecies = _setSpecies;
	var DESCRIPTORS$1 = _descriptors;
	var fastKey = _meta.exports.fastKey;
	var validate$1 = _validateCollection;
	var SIZE = DESCRIPTORS$1 ? '_s' : 'size';

	var getEntry = function (that, key) {
	  // fast case
	  var index = fastKey(key);
	  var entry;
	  if (index !== 'F') return that._i[index];
	  // frozen object case
	  for (entry = that._f; entry; entry = entry.n) {
	    if (entry.k == key) return entry;
	  }
	};

	var _collectionStrong = {
	  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
	    var C = wrapper(function (that, iterable) {
	      anInstance$1(that, C, NAME, '_i');
	      that._t = NAME;         // collection type
	      that._i = create(null); // index
	      that._f = undefined;    // first entry
	      that._l = undefined;    // last entry
	      that[SIZE] = 0;         // size
	      if (iterable != undefined) forOf$3(iterable, IS_MAP, that[ADDER], that);
	    });
	    redefineAll$1(C.prototype, {
	      // 23.1.3.1 Map.prototype.clear()
	      // 23.2.3.2 Set.prototype.clear()
	      clear: function clear() {
	        for (var that = validate$1(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
	          entry.r = true;
	          if (entry.p) entry.p = entry.p.n = undefined;
	          delete data[entry.i];
	        }
	        that._f = that._l = undefined;
	        that[SIZE] = 0;
	      },
	      // 23.1.3.3 Map.prototype.delete(key)
	      // 23.2.3.4 Set.prototype.delete(value)
	      'delete': function (key) {
	        var that = validate$1(this, NAME);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.n;
	          var prev = entry.p;
	          delete that._i[entry.i];
	          entry.r = true;
	          if (prev) prev.n = next;
	          if (next) next.p = prev;
	          if (that._f == entry) that._f = next;
	          if (that._l == entry) that._l = prev;
	          that[SIZE]--;
	        } return !!entry;
	      },
	      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
	      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        validate$1(this, NAME);
	        var f = ctx$2(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
	        var entry;
	        while (entry = entry ? entry.n : this._f) {
	          f(entry.v, entry.k, this);
	          // revert to the last existing entry
	          while (entry && entry.r) entry = entry.p;
	        }
	      },
	      // 23.1.3.7 Map.prototype.has(key)
	      // 23.2.3.7 Set.prototype.has(value)
	      has: function has(key) {
	        return !!getEntry(validate$1(this, NAME), key);
	      }
	    });
	    if (DESCRIPTORS$1) dP$1(C.prototype, 'size', {
	      get: function () {
	        return validate$1(this, NAME)[SIZE];
	      }
	    });
	    return C;
	  },
	  def: function (that, key, value) {
	    var entry = getEntry(that, key);
	    var prev, index;
	    // change existing entry
	    if (entry) {
	      entry.v = value;
	    // create new entry
	    } else {
	      that._l = entry = {
	        i: index = fastKey(key, true), // <- index
	        k: key,                        // <- key
	        v: value,                      // <- value
	        p: prev = that._l,             // <- previous entry
	        n: undefined,                  // <- next entry
	        r: false                       // <- removed
	      };
	      if (!that._f) that._f = entry;
	      if (prev) prev.n = entry;
	      that[SIZE]++;
	      // add to index
	      if (index !== 'F') that._i[index] = entry;
	    } return that;
	  },
	  getEntry: getEntry,
	  setStrong: function (C, NAME, IS_MAP) {
	    // add .keys, .values, .entries, [@@iterator]
	    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
	    $iterDefine(C, NAME, function (iterated, kind) {
	      this._t = validate$1(iterated, NAME); // target
	      this._k = kind;                     // kind
	      this._l = undefined;                // previous
	    }, function () {
	      var that = this;
	      var kind = that._k;
	      var entry = that._l;
	      // revert to the last existing entry
	      while (entry && entry.r) entry = entry.p;
	      // get next entry
	      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
	        // or finish the iteration
	        that._t = undefined;
	        return step(1);
	      }
	      // return step by kind
	      if (kind == 'keys') return step(0, entry.k);
	      if (kind == 'values') return step(0, entry.v);
	      return step(0, [entry.k, entry.v]);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // add [@@species], 23.1.2.2, 23.2.2.2
	    setSpecies(NAME);
	  }
	};

	var isObject$1 = _isObject;
	var isArray = _isArray;
	var SPECIES = _wks.exports('species');

	var _arraySpeciesConstructor = function (original) {
	  var C;
	  if (isArray(original)) {
	    C = original.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    if (isObject$1(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? Array : C;
	};

	// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
	var speciesConstructor = _arraySpeciesConstructor;

	var _arraySpeciesCreate = function (original, length) {
	  return new (speciesConstructor(original))(length);
	};

	// 0 -> Array#forEach
	// 1 -> Array#map
	// 2 -> Array#filter
	// 3 -> Array#some
	// 4 -> Array#every
	// 5 -> Array#find
	// 6 -> Array#findIndex
	var ctx$1 = _ctx;
	var IObject = _iobject;
	var toObject = _toObject;
	var toLength = _toLength;
	var asc = _arraySpeciesCreate;
	var _arrayMethods = function (TYPE, $create) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  var create = $create || asc;
	  return function ($this, callbackfn, that) {
	    var O = toObject($this);
	    var self = IObject(O);
	    var f = ctx$1(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var val, res;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      val = self[index];
	      res = f(val, index, O);
	      if (TYPE) {
	        if (IS_MAP) result[index] = res;   // map
	        else if (res) switch (TYPE) {
	          case 3: return true;             // some
	          case 5: return val;              // find
	          case 6: return index;            // findIndex
	          case 2: result.push(val);        // filter
	        } else if (IS_EVERY) return false; // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
	  };
	};

	var global = _global.exports;
	var $export$4 = _export;
	var meta = _meta.exports;
	var fails = _fails;
	var hide = _hide;
	var redefineAll = _redefineAll;
	var forOf$2 = _forOf.exports;
	var anInstance = _anInstance;
	var isObject = _isObject;
	var setToStringTag = _setToStringTag;
	var dP = _objectDp.f;
	var each = _arrayMethods(0);
	var DESCRIPTORS = _descriptors;

	var _collection = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
	  var Base = global[NAME];
	  var C = Base;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var proto = C && C.prototype;
	  var O = {};
	  if (!DESCRIPTORS || typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
	    new C().entries().next();
	  }))) {
	    // create collection constructor
	    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
	    redefineAll(C.prototype, methods);
	    meta.NEED = true;
	  } else {
	    C = wrapper(function (target, iterable) {
	      anInstance(target, C, NAME, '_c');
	      target._c = new Base();
	      if (iterable != undefined) forOf$2(iterable, IS_MAP, target[ADDER], target);
	    });
	    each('add,clear,delete,forEach,get,has,set,keys,values,entries,toJSON'.split(','), function (KEY) {
	      var IS_ADDER = KEY == 'add' || KEY == 'set';
	      if (KEY in proto && !(IS_WEAK && KEY == 'clear')) hide(C.prototype, KEY, function (a, b) {
	        anInstance(this, C, KEY);
	        if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
	        var result = this._c[KEY](a === 0 ? 0 : a, b);
	        return IS_ADDER ? this : result;
	      });
	    });
	    IS_WEAK || dP(C.prototype, 'size', {
	      get: function () {
	        return this._c.size;
	      }
	    });
	  }

	  setToStringTag(C, NAME);

	  O[NAME] = C;
	  $export$4($export$4.G + $export$4.W + $export$4.F, O);

	  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

	  return C;
	};

	var strong = _collectionStrong;
	var validate = _validateCollection;
	var MAP = 'Map';

	// 23.1 Map Objects
	_collection(MAP, function (get) {
	  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
	}, {
	  // 23.1.3.6 Map.prototype.get(key)
	  get: function get(key) {
	    var entry = strong.getEntry(validate(this, MAP), key);
	    return entry && entry.v;
	  },
	  // 23.1.3.9 Map.prototype.set(key, value)
	  set: function set(key, value) {
	    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
	  }
	}, strong, true);

	var forOf$1 = _forOf.exports;

	var _arrayFromIterable = function (iter, ITERATOR) {
	  var result = [];
	  forOf$1(iter, false, result.push, result, ITERATOR);
	  return result;
	};

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var classof = _classof;
	var from = _arrayFromIterable;
	var _collectionToJson = function (NAME) {
	  return function toJSON() {
	    if (classof(this) != NAME) throw TypeError(NAME + "#toJSON isn't generic");
	    return from(this);
	  };
	};

	// https://github.com/DavidBruant/Map-Set.prototype.toJSON
	var $export$3 = _export;

	$export$3($export$3.P + $export$3.R, 'Map', { toJSON: _collectionToJson('Map') });

	// https://tc39.github.io/proposal-setmap-offrom/
	var $export$2 = _export;

	var _setCollectionOf = function (COLLECTION) {
	  $export$2($export$2.S, COLLECTION, { of: function of() {
	    var length = arguments.length;
	    var A = new Array(length);
	    while (length--) A[length] = arguments[length];
	    return new this(A);
	  } });
	};

	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
	_setCollectionOf('Map');

	// https://tc39.github.io/proposal-setmap-offrom/
	var $export$1 = _export;
	var aFunction = _aFunction;
	var ctx = _ctx;
	var forOf = _forOf.exports;

	var _setCollectionFrom = function (COLLECTION) {
	  $export$1($export$1.S, COLLECTION, { from: function from(source /* , mapFn, thisArg */) {
	    var mapFn = arguments[1];
	    var mapping, A, n, cb;
	    aFunction(this);
	    mapping = mapFn !== undefined;
	    if (mapping) aFunction(mapFn);
	    if (source == undefined) return new this();
	    A = [];
	    if (mapping) {
	      n = 0;
	      cb = ctx(mapFn, arguments[2], 2);
	      forOf(source, false, function (nextItem) {
	        A.push(cb(nextItem, n++));
	      });
	    } else {
	      forOf(source, false, A.push, A);
	    }
	    return new this(A);
	  } });
	};

	// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
	_setCollectionFrom('Map');

	var map$1 = _core.exports.Map;

	var map = map$1;

	const INTERNAL_EVENT = {
	  ENTER_FRAME: "internal_enter_frame"
	};

	// 20.3.3.1 / 15.9.4.4 Date.now()
	var $export = _export;

	$export($export.S, 'Date', { now: function () { return new Date().getTime(); } });

	var now$1 = _core.exports.Date.now;

	var now = now$1;

	const selfRequestAnimationFrame = callback => {
	  return setInterval(callback, 30);
	};

	const selfCancelRequestAnimationFrame = id => {
	  clearInterval(id);
	};

	const RAF = window.requestAnimationFrame || selfRequestAnimationFrame;
	const CRAF = window.cancelAnimationFrame || selfCancelRequestAnimationFrame;

	class Stage {
	  constructor() {
	    EventEmitter(this);
	    this._fps = 30;
	    this.fpsInterval = ~~1000 / this._fps;
	    this.lastRenderTime = now();
	    this.render();
	  }

	  render() {
	    const lastRenderTime = this.lastRenderTime,
	          fpsInterval = this.fpsInterval;

	    const now$1 = now();

	    const elapsed = now$1 - lastRenderTime;

	    if (elapsed < fpsInterval) {
	      this.rafInterval = RAF(this.render.bind(this));
	      return;
	    }

	    this.lastRenderTime = now$1;
	    this.emit(INTERNAL_EVENT.ENTER_FRAME);
	    this.rafInterval = RAF(this.render.bind(this));
	  }

	  set fps(val) {
	    if (this.fps === +val) {
	      return;
	    }

	    this._fps = +val;

	    if (val === 0) {
	      CRAF(this.rafInterval);
	      return;
	    }

	    this.fpsInterval = ~~(1000 / +val);
	  }

	  get fps() {
	    return this._fps;
	  }

	}

	function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof symbol !== "undefined" && o[iterator] || o["@@iterator"]; if (!it) { if (isArray$2(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

	function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return from$1(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

	function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

	class Renderer {
	  /**
	   * Creates an instance of Renderer.
	   * @param { Stage } stage
	   * @memberof Renderer
	   */
	  constructor(stage) {
	    /** 延迟渲染队列 */
	    this.deferredQueue = new map();
	    /** @type { Stage } */

	    this.stage = stage;
	    this.stage.on(INTERNAL_EVENT.ENTER_FRAME, this.onValidate.bind(this));
	  }
	  /**
	   * 将待更新函数放入延迟渲染队列
	   *
	   * @param {*} fn
	   * @param {*} args
	   * @memberof Renderer
	   */


	  invalidate(fn, ...args) {
	    this.deferredQueue.set(fn, args);
	  }
	  /**
	   * 立即进行渲染
	   *
	   * @memberof Renderer
	   */


	  validateNow() {
	    this.onValidate();
	  }
	  /**
	   * 生效函数，该函数通常被stage.enter_frame事件 和 validateNow 函数调用。
	   *
	   * @return {*}
	   * @memberof Renderer
	   */


	  onValidate() {
	    var _this$deferredQueue;

	    const size = this.deferredQueue.size;

	    if (size === 0) {
	      return;
	    }

	    var _iterator = _createForOfIteratorHelper((_this$deferredQueue = this.deferredQueue) === null || _this$deferredQueue === void 0 ? void 0 : _this$deferredQueue.entries()),
	        _step;

	    try {
	      for (_iterator.s(); !(_step = _iterator.n()).done;) {
	        const _step$value = _slicedToArray(_step.value, 2),
	              fn = _step$value[0],
	              values = _step$value[1];

	        fn === null || fn === void 0 ? void 0 : fn(...values);
	        this.deferredQueue.delete(fn);
	      } // 渲染过程中，又来了新的

	    } catch (err) {
	      _iterator.e(err);
	    } finally {
	      _iterator.f();
	    }

	    const remainSize = this.deferredQueue.size;

	    if (remainSize > 0) {
	      this.validateNow();
	    }
	  }

	}

	class Core {
	  constructor(option = {}) {
	    this.option = option;
	    this.initialize();
	    console.log("init completed");
	  }

	  initialize() {
	    const option = this.option;
	    this.stage = new Stage();
	    this.stage.fps = +option.fps || 30;
	    this.renderer = new Renderer(this.stage);
	    const com = new Component();
	    window.com = com;
	  }

	}

	return Core;

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzdC5qcyIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3R5cGUvdmFsdWUvaXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdHlwZS9vYmplY3QvaXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdHlwZS9wcm90b3R5cGUvaXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvdHlwZS9mdW5jdGlvbi9pcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy90eXBlL3BsYWluLWZ1bmN0aW9uL2lzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L2Fzc2lnbi9pcy1pbXBsZW1lbnRlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9rZXlzL2lzLWltcGxlbWVudGVkLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VzNS1leHQvZnVuY3Rpb24vbm9vcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9pcy12YWx1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9rZXlzL3NoaW0uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3Qva2V5cy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC92YWxpZC12YWx1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9hc3NpZ24vc2hpbS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L29iamVjdC9hc3NpZ24vaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXM1LWV4dC9vYmplY3Qvbm9ybWFsaXplLW9wdGlvbnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucy9pcy1pbXBsZW1lbnRlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9lczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zL3NoaW0uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvZXM1LWV4dC9zdHJpbmcvIy9jb250YWlucy9pbmRleC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9kL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2VzNS1leHQvb2JqZWN0L3ZhbGlkLWNhbGxhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2V2ZW50LWVtaXR0ZXIvaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LnByb2QuanMiLCIuLi9zcmMvY29tcG9uZW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19nbG9iYWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2ZhaWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZXNjcmlwdG9ycy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXMtYXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2FycmF5L2lzLWFycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvY29yZS1qcy9hcnJheS9pcy1hcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2hlbHBlcnMvZXNtL2FycmF5V2l0aEhvbGVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19yZWRlZmluZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19saWJyYXJ5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy1leHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3drcy1kZWZpbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faHRtbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN5bWJvbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2luZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvY29yZS1qcy9zeW1ib2wuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2hlbHBlcnMvZXNtL2l0ZXJhYmxlVG9BcnJheUxpbWl0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNhbGwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NyZWF0ZS1wcm9wZXJ0eS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9hcnJheS9mcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvY29yZS1qcy9hcnJheS9mcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvaGVscGVycy9lc20vYXJyYXlMaWtlVG9BcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9AYmFiZWwvcnVudGltZS1jb3JlanMyL2hlbHBlcnMvZXNtL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvaGVscGVycy9lc20vbm9uSXRlcmFibGVSZXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvaGVscGVycy9lc20vc2xpY2VkVG9BcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZm9yLW9mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdmFsaWRhdGUtY29sbGVjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29sbGVjdGlvbi1zdHJvbmcuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1tZXRob2RzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2xsZWN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5tYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWZyb20taXRlcmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvbGxlY3Rpb24tdG8tanNvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcubWFwLnRvLWpzb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLW9mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5tYXAub2YuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1jb2xsZWN0aW9uLWZyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3Lm1hcC5mcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9tYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9jb3JlLWpzL21hcC5qcyIsIi4uL3NyYy9pbnRlcm5hbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuZGF0ZS5ub3cuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2RhdGUvbm93LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lLWNvcmVqczIvY29yZS1qcy9kYXRlL25vdy5qcyIsIi4uL3NyYy9zdGFnZS5qcyIsIi4uL3NyYy9yZW5kZXJlci5qcyIsIi4uL3NyYy9jb3JlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vLyBFUzMgc2FmZVxudmFyIF91bmRlZmluZWQgPSB2b2lkIDA7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiB2YWx1ZSAhPT0gX3VuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbDsgfTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNWYWx1ZSA9IHJlcXVpcmUoXCIuLi92YWx1ZS9pc1wiKTtcblxuLy8gcHJldHRpZXItaWdub3JlXG52YXIgcG9zc2libGVUeXBlcyA9IHsgXCJvYmplY3RcIjogdHJ1ZSwgXCJmdW5jdGlvblwiOiB0cnVlLCBcInVuZGVmaW5lZFwiOiB0cnVlIC8qIGRvY3VtZW50LmFsbCAqLyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAoIWlzVmFsdWUodmFsdWUpKSByZXR1cm4gZmFsc2U7XG5cdHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKHBvc3NpYmxlVHlwZXMsIHR5cGVvZiB2YWx1ZSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc09iamVjdCA9IHJlcXVpcmUoXCIuLi9vYmplY3QvaXNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdGlmICghaXNPYmplY3QodmFsdWUpKSByZXR1cm4gZmFsc2U7XG5cdHRyeSB7XG5cdFx0aWYgKCF2YWx1ZS5jb25zdHJ1Y3RvcikgcmV0dXJuIGZhbHNlO1xuXHRcdHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNQcm90b3R5cGUgPSByZXF1aXJlKFwiLi4vcHJvdG90eXBlL2lzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAodHlwZW9mIHZhbHVlICE9PSBcImZ1bmN0aW9uXCIpIHJldHVybiBmYWxzZTtcblxuXHRpZiAoIWhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIFwibGVuZ3RoXCIpKSByZXR1cm4gZmFsc2U7XG5cblx0dHJ5IHtcblx0XHRpZiAodHlwZW9mIHZhbHVlLmxlbmd0aCAhPT0gXCJudW1iZXJcIikgcmV0dXJuIGZhbHNlO1xuXHRcdGlmICh0eXBlb2YgdmFsdWUuY2FsbCAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdFx0aWYgKHR5cGVvZiB2YWx1ZS5hcHBseSAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cblx0cmV0dXJuICFpc1Byb3RvdHlwZSh2YWx1ZSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc0Z1bmN0aW9uID0gcmVxdWlyZShcIi4uL2Z1bmN0aW9uL2lzXCIpO1xuXG52YXIgY2xhc3NSZSA9IC9eXFxzKmNsYXNzW1xcc3svfV0vLCBmdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRpZiAoIWlzRnVuY3Rpb24odmFsdWUpKSByZXR1cm4gZmFsc2U7XG5cdGlmIChjbGFzc1JlLnRlc3QoZnVuY3Rpb25Ub1N0cmluZy5jYWxsKHZhbHVlKSkpIHJldHVybiBmYWxzZTtcblx0cmV0dXJuIHRydWU7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHR2YXIgYXNzaWduID0gT2JqZWN0LmFzc2lnbiwgb2JqO1xuXHRpZiAodHlwZW9mIGFzc2lnbiAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdG9iaiA9IHsgZm9vOiBcInJhelwiIH07XG5cdGFzc2lnbihvYmosIHsgYmFyOiBcImR3YVwiIH0sIHsgdHJ6eTogXCJ0cnp5XCIgfSk7XG5cdHJldHVybiBvYmouZm9vICsgb2JqLmJhciArIG9iai50cnp5ID09PSBcInJhemR3YXRyenlcIjtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG5cdHRyeSB7XG5cdFx0T2JqZWN0LmtleXMoXCJwcmltaXRpdmVcIik7XG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWVtcHR5LWZ1bmN0aW9uXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHt9O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdW5kZWZpbmVkID0gcmVxdWlyZShcIi4uL2Z1bmN0aW9uL25vb3BcIikoKTsgLy8gU3VwcG9ydCBFUzMgZW5naW5lc1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCAhPT0gX3VuZGVmaW5lZCAmJiB2YWwgIT09IG51bGw7IH07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGlzVmFsdWUgPSByZXF1aXJlKFwiLi4vaXMtdmFsdWVcIik7XG5cbnZhciBrZXlzID0gT2JqZWN0LmtleXM7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCkgeyByZXR1cm4ga2V5cyhpc1ZhbHVlKG9iamVjdCkgPyBPYmplY3Qob2JqZWN0KSA6IG9iamVjdCk7IH07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9pcy1pbXBsZW1lbnRlZFwiKSgpID8gT2JqZWN0LmtleXMgOiByZXF1aXJlKFwiLi9zaGltXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc1ZhbHVlID0gcmVxdWlyZShcIi4vaXMtdmFsdWVcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdGlmICghaXNWYWx1ZSh2YWx1ZSkpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgdXNlIG51bGwgb3IgdW5kZWZpbmVkXCIpO1xuXHRyZXR1cm4gdmFsdWU7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBrZXlzICA9IHJlcXVpcmUoXCIuLi9rZXlzXCIpXG4gICwgdmFsdWUgPSByZXF1aXJlKFwiLi4vdmFsaWQtdmFsdWVcIilcbiAgLCBtYXggICA9IE1hdGgubWF4O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkZXN0LCBzcmMvKiwg4oCmc3JjbiovKSB7XG5cdHZhciBlcnJvciwgaSwgbGVuZ3RoID0gbWF4KGFyZ3VtZW50cy5sZW5ndGgsIDIpLCBhc3NpZ247XG5cdGRlc3QgPSBPYmplY3QodmFsdWUoZGVzdCkpO1xuXHRhc3NpZ24gPSBmdW5jdGlvbiAoa2V5KSB7XG5cdFx0dHJ5IHtcblx0XHRcdGRlc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdH0gY2F0Y2ggKGUpIHtcblx0XHRcdGlmICghZXJyb3IpIGVycm9yID0gZTtcblx0XHR9XG5cdH07XG5cdGZvciAoaSA9IDE7IGkgPCBsZW5ndGg7ICsraSkge1xuXHRcdHNyYyA9IGFyZ3VtZW50c1tpXTtcblx0XHRrZXlzKHNyYykuZm9yRWFjaChhc3NpZ24pO1xuXHR9XG5cdGlmIChlcnJvciAhPT0gdW5kZWZpbmVkKSB0aHJvdyBlcnJvcjtcblx0cmV0dXJuIGRlc3Q7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vaXMtaW1wbGVtZW50ZWRcIikoKSA/IE9iamVjdC5hc3NpZ24gOiByZXF1aXJlKFwiLi9zaGltXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc1ZhbHVlID0gcmVxdWlyZShcIi4vaXMtdmFsdWVcIik7XG5cbnZhciBmb3JFYWNoID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2gsIGNyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5cbnZhciBwcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgb2JqKSB7XG5cdHZhciBrZXk7XG5cdGZvciAoa2V5IGluIHNyYykgb2JqW2tleV0gPSBzcmNba2V5XTtcbn07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0czEvKiwg4oCmb3B0aW9ucyovKSB7XG5cdHZhciByZXN1bHQgPSBjcmVhdGUobnVsbCk7XG5cdGZvckVhY2guY2FsbChhcmd1bWVudHMsIGZ1bmN0aW9uIChvcHRpb25zKSB7XG5cdFx0aWYgKCFpc1ZhbHVlKG9wdGlvbnMpKSByZXR1cm47XG5cdFx0cHJvY2VzcyhPYmplY3Qob3B0aW9ucyksIHJlc3VsdCk7XG5cdH0pO1xuXHRyZXR1cm4gcmVzdWx0O1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3RyID0gXCJyYXpkd2F0cnp5XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuXHRpZiAodHlwZW9mIHN0ci5jb250YWlucyAhPT0gXCJmdW5jdGlvblwiKSByZXR1cm4gZmFsc2U7XG5cdHJldHVybiBzdHIuY29udGFpbnMoXCJkd2FcIikgPT09IHRydWUgJiYgc3RyLmNvbnRhaW5zKFwiZm9vXCIpID09PSBmYWxzZTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGluZGV4T2YgPSBTdHJpbmcucHJvdG90eXBlLmluZGV4T2Y7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHNlYXJjaFN0cmluZy8qLCBwb3NpdGlvbiovKSB7XG5cdHJldHVybiBpbmRleE9mLmNhbGwodGhpcywgc2VhcmNoU3RyaW5nLCBhcmd1bWVudHNbMV0pID4gLTE7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vaXMtaW1wbGVtZW50ZWRcIikoKSA/IFN0cmluZy5wcm90b3R5cGUuY29udGFpbnMgOiByZXF1aXJlKFwiLi9zaGltXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBpc1ZhbHVlICAgICAgICAgPSByZXF1aXJlKFwidHlwZS92YWx1ZS9pc1wiKVxuICAsIGlzUGxhaW5GdW5jdGlvbiA9IHJlcXVpcmUoXCJ0eXBlL3BsYWluLWZ1bmN0aW9uL2lzXCIpXG4gICwgYXNzaWduICAgICAgICAgID0gcmVxdWlyZShcImVzNS1leHQvb2JqZWN0L2Fzc2lnblwiKVxuICAsIG5vcm1hbGl6ZU9wdHMgICA9IHJlcXVpcmUoXCJlczUtZXh0L29iamVjdC9ub3JtYWxpemUtb3B0aW9uc1wiKVxuICAsIGNvbnRhaW5zICAgICAgICA9IHJlcXVpcmUoXCJlczUtZXh0L3N0cmluZy8jL2NvbnRhaW5zXCIpO1xuXG52YXIgZCA9IChtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkc2NyLCB2YWx1ZS8qLCBvcHRpb25zKi8pIHtcblx0dmFyIGMsIGUsIHcsIG9wdGlvbnMsIGRlc2M7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMiB8fCB0eXBlb2YgZHNjciAhPT0gXCJzdHJpbmdcIikge1xuXHRcdG9wdGlvbnMgPSB2YWx1ZTtcblx0XHR2YWx1ZSA9IGRzY3I7XG5cdFx0ZHNjciA9IG51bGw7XG5cdH0gZWxzZSB7XG5cdFx0b3B0aW9ucyA9IGFyZ3VtZW50c1syXTtcblx0fVxuXHRpZiAoaXNWYWx1ZShkc2NyKSkge1xuXHRcdGMgPSBjb250YWlucy5jYWxsKGRzY3IsIFwiY1wiKTtcblx0XHRlID0gY29udGFpbnMuY2FsbChkc2NyLCBcImVcIik7XG5cdFx0dyA9IGNvbnRhaW5zLmNhbGwoZHNjciwgXCJ3XCIpO1xuXHR9IGVsc2Uge1xuXHRcdGMgPSB3ID0gdHJ1ZTtcblx0XHRlID0gZmFsc2U7XG5cdH1cblxuXHRkZXNjID0geyB2YWx1ZTogdmFsdWUsIGNvbmZpZ3VyYWJsZTogYywgZW51bWVyYWJsZTogZSwgd3JpdGFibGU6IHcgfTtcblx0cmV0dXJuICFvcHRpb25zID8gZGVzYyA6IGFzc2lnbihub3JtYWxpemVPcHRzKG9wdGlvbnMpLCBkZXNjKTtcbn0pO1xuXG5kLmdzID0gZnVuY3Rpb24gKGRzY3IsIGdldCwgc2V0LyosIG9wdGlvbnMqLykge1xuXHR2YXIgYywgZSwgb3B0aW9ucywgZGVzYztcblx0aWYgKHR5cGVvZiBkc2NyICE9PSBcInN0cmluZ1wiKSB7XG5cdFx0b3B0aW9ucyA9IHNldDtcblx0XHRzZXQgPSBnZXQ7XG5cdFx0Z2V0ID0gZHNjcjtcblx0XHRkc2NyID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHRvcHRpb25zID0gYXJndW1lbnRzWzNdO1xuXHR9XG5cdGlmICghaXNWYWx1ZShnZXQpKSB7XG5cdFx0Z2V0ID0gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKCFpc1BsYWluRnVuY3Rpb24oZ2V0KSkge1xuXHRcdG9wdGlvbnMgPSBnZXQ7XG5cdFx0Z2V0ID0gc2V0ID0gdW5kZWZpbmVkO1xuXHR9IGVsc2UgaWYgKCFpc1ZhbHVlKHNldCkpIHtcblx0XHRzZXQgPSB1bmRlZmluZWQ7XG5cdH0gZWxzZSBpZiAoIWlzUGxhaW5GdW5jdGlvbihzZXQpKSB7XG5cdFx0b3B0aW9ucyA9IHNldDtcblx0XHRzZXQgPSB1bmRlZmluZWQ7XG5cdH1cblx0aWYgKGlzVmFsdWUoZHNjcikpIHtcblx0XHRjID0gY29udGFpbnMuY2FsbChkc2NyLCBcImNcIik7XG5cdFx0ZSA9IGNvbnRhaW5zLmNhbGwoZHNjciwgXCJlXCIpO1xuXHR9IGVsc2Uge1xuXHRcdGMgPSB0cnVlO1xuXHRcdGUgPSBmYWxzZTtcblx0fVxuXG5cdGRlc2MgPSB7IGdldDogZ2V0LCBzZXQ6IHNldCwgY29uZmlndXJhYmxlOiBjLCBlbnVtZXJhYmxlOiBlIH07XG5cdHJldHVybiAhb3B0aW9ucyA/IGRlc2MgOiBhc3NpZ24obm9ybWFsaXplT3B0cyhvcHRpb25zKSwgZGVzYyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuKSB7XG5cdGlmICh0eXBlb2YgZm4gIT09IFwiZnVuY3Rpb25cIikgdGhyb3cgbmV3IFR5cGVFcnJvcihmbiArIFwiIGlzIG5vdCBhIGZ1bmN0aW9uXCIpO1xuXHRyZXR1cm4gZm47XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZCAgICAgICAgPSByZXF1aXJlKCdkJylcbiAgLCBjYWxsYWJsZSA9IHJlcXVpcmUoJ2VzNS1leHQvb2JqZWN0L3ZhbGlkLWNhbGxhYmxlJylcblxuICAsIGFwcGx5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LCBjYWxsID0gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGxcbiAgLCBjcmVhdGUgPSBPYmplY3QuY3JlYXRlLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxuICAsIGRlZmluZVByb3BlcnRpZXMgPSBPYmplY3QuZGVmaW5lUHJvcGVydGllc1xuICAsIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eVxuICAsIGRlc2NyaXB0b3IgPSB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlIH1cblxuICAsIG9uLCBvbmNlLCBvZmYsIGVtaXQsIG1ldGhvZHMsIGRlc2NyaXB0b3JzLCBiYXNlO1xuXG5vbiA9IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xuXHR2YXIgZGF0YTtcblxuXHRjYWxsYWJsZShsaXN0ZW5lcik7XG5cblx0aWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdfX2VlX18nKSkge1xuXHRcdGRhdGEgPSBkZXNjcmlwdG9yLnZhbHVlID0gY3JlYXRlKG51bGwpO1xuXHRcdGRlZmluZVByb3BlcnR5KHRoaXMsICdfX2VlX18nLCBkZXNjcmlwdG9yKTtcblx0XHRkZXNjcmlwdG9yLnZhbHVlID0gbnVsbDtcblx0fSBlbHNlIHtcblx0XHRkYXRhID0gdGhpcy5fX2VlX187XG5cdH1cblx0aWYgKCFkYXRhW3R5cGVdKSBkYXRhW3R5cGVdID0gbGlzdGVuZXI7XG5cdGVsc2UgaWYgKHR5cGVvZiBkYXRhW3R5cGVdID09PSAnb2JqZWN0JykgZGF0YVt0eXBlXS5wdXNoKGxpc3RlbmVyKTtcblx0ZWxzZSBkYXRhW3R5cGVdID0gW2RhdGFbdHlwZV0sIGxpc3RlbmVyXTtcblxuXHRyZXR1cm4gdGhpcztcbn07XG5cbm9uY2UgPSBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcblx0dmFyIG9uY2UsIHNlbGY7XG5cblx0Y2FsbGFibGUobGlzdGVuZXIpO1xuXHRzZWxmID0gdGhpcztcblx0b24uY2FsbCh0aGlzLCB0eXBlLCBvbmNlID0gZnVuY3Rpb24gKCkge1xuXHRcdG9mZi5jYWxsKHNlbGYsIHR5cGUsIG9uY2UpO1xuXHRcdGFwcGx5LmNhbGwobGlzdGVuZXIsIHRoaXMsIGFyZ3VtZW50cyk7XG5cdH0pO1xuXG5cdG9uY2UuX19lZU9uY2VMaXN0ZW5lcl9fID0gbGlzdGVuZXI7XG5cdHJldHVybiB0aGlzO1xufTtcblxub2ZmID0gZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG5cdHZhciBkYXRhLCBsaXN0ZW5lcnMsIGNhbmRpZGF0ZSwgaTtcblxuXHRjYWxsYWJsZShsaXN0ZW5lcik7XG5cblx0aWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdfX2VlX18nKSkgcmV0dXJuIHRoaXM7XG5cdGRhdGEgPSB0aGlzLl9fZWVfXztcblx0aWYgKCFkYXRhW3R5cGVdKSByZXR1cm4gdGhpcztcblx0bGlzdGVuZXJzID0gZGF0YVt0eXBlXTtcblxuXHRpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ29iamVjdCcpIHtcblx0XHRmb3IgKGkgPSAwOyAoY2FuZGlkYXRlID0gbGlzdGVuZXJzW2ldKTsgKytpKSB7XG5cdFx0XHRpZiAoKGNhbmRpZGF0ZSA9PT0gbGlzdGVuZXIpIHx8XG5cdFx0XHRcdFx0KGNhbmRpZGF0ZS5fX2VlT25jZUxpc3RlbmVyX18gPT09IGxpc3RlbmVyKSkge1xuXHRcdFx0XHRpZiAobGlzdGVuZXJzLmxlbmd0aCA9PT0gMikgZGF0YVt0eXBlXSA9IGxpc3RlbmVyc1tpID8gMCA6IDFdO1xuXHRcdFx0XHRlbHNlIGxpc3RlbmVycy5zcGxpY2UoaSwgMSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGlmICgobGlzdGVuZXJzID09PSBsaXN0ZW5lcikgfHxcblx0XHRcdFx0KGxpc3RlbmVycy5fX2VlT25jZUxpc3RlbmVyX18gPT09IGxpc3RlbmVyKSkge1xuXHRcdFx0ZGVsZXRlIGRhdGFbdHlwZV07XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRoaXM7XG59O1xuXG5lbWl0ID0gZnVuY3Rpb24gKHR5cGUpIHtcblx0dmFyIGksIGwsIGxpc3RlbmVyLCBsaXN0ZW5lcnMsIGFyZ3M7XG5cblx0aWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKHRoaXMsICdfX2VlX18nKSkgcmV0dXJuO1xuXHRsaXN0ZW5lcnMgPSB0aGlzLl9fZWVfX1t0eXBlXTtcblx0aWYgKCFsaXN0ZW5lcnMpIHJldHVybjtcblxuXHRpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ29iamVjdCcpIHtcblx0XHRsID0gYXJndW1lbnRzLmxlbmd0aDtcblx0XHRhcmdzID0gbmV3IEFycmF5KGwgLSAxKTtcblx0XHRmb3IgKGkgPSAxOyBpIDwgbDsgKytpKSBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblxuXHRcdGxpc3RlbmVycyA9IGxpc3RlbmVycy5zbGljZSgpO1xuXHRcdGZvciAoaSA9IDA7IChsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXSk7ICsraSkge1xuXHRcdFx0YXBwbHkuY2FsbChsaXN0ZW5lciwgdGhpcywgYXJncyk7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuXHRcdGNhc2UgMTpcblx0XHRcdGNhbGwuY2FsbChsaXN0ZW5lcnMsIHRoaXMpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSAyOlxuXHRcdFx0Y2FsbC5jYWxsKGxpc3RlbmVycywgdGhpcywgYXJndW1lbnRzWzFdKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgMzpcblx0XHRcdGNhbGwuY2FsbChsaXN0ZW5lcnMsIHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcblx0XHRcdGJyZWFrO1xuXHRcdGRlZmF1bHQ6XG5cdFx0XHRsID0gYXJndW1lbnRzLmxlbmd0aDtcblx0XHRcdGFyZ3MgPSBuZXcgQXJyYXkobCAtIDEpO1xuXHRcdFx0Zm9yIChpID0gMTsgaSA8IGw7ICsraSkge1xuXHRcdFx0XHRhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdH1cblx0XHRcdGFwcGx5LmNhbGwobGlzdGVuZXJzLCB0aGlzLCBhcmdzKTtcblx0XHR9XG5cdH1cbn07XG5cbm1ldGhvZHMgPSB7XG5cdG9uOiBvbixcblx0b25jZTogb25jZSxcblx0b2ZmOiBvZmYsXG5cdGVtaXQ6IGVtaXRcbn07XG5cbmRlc2NyaXB0b3JzID0ge1xuXHRvbjogZChvbiksXG5cdG9uY2U6IGQob25jZSksXG5cdG9mZjogZChvZmYpLFxuXHRlbWl0OiBkKGVtaXQpXG59O1xuXG5iYXNlID0gZGVmaW5lUHJvcGVydGllcyh7fSwgZGVzY3JpcHRvcnMpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSBmdW5jdGlvbiAobykge1xuXHRyZXR1cm4gKG8gPT0gbnVsbCkgPyBjcmVhdGUoYmFzZSkgOiBkZWZpbmVQcm9wZXJ0aWVzKE9iamVjdChvKSwgZGVzY3JpcHRvcnMpO1xufTtcbmV4cG9ydHMubWV0aG9kcyA9IG1ldGhvZHM7XG4iLCIvLyBUaGlzIGZpbGUgcmVwbGFjZXMgYGluZGV4LmpzYCBpbiBidW5kbGVycyBsaWtlIHdlYnBhY2sgb3IgUm9sbHVwLFxuLy8gYWNjb3JkaW5nIHRvIGBicm93c2VyYCBjb25maWcgaW4gYHBhY2thZ2UuanNvbmAuXG5cbmltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5cbmlmIChmYWxzZSkge1xuICAvLyBBbGwgYnVuZGxlcnMgd2lsbCByZW1vdmUgdGhpcyBibG9jayBpbiB0aGUgcHJvZHVjdGlvbiBidW5kbGUuXG4gIGlmIChcbiAgICB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIG5hdmlnYXRvci5wcm9kdWN0ID09PSAnUmVhY3ROYXRpdmUnICYmXG4gICAgdHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCdcbiAgKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ1JlYWN0IE5hdGl2ZSBkb2VzIG5vdCBoYXZlIGEgYnVpbHQtaW4gc2VjdXJlIHJhbmRvbSBnZW5lcmF0b3IuICcgK1xuICAgICAgICAnSWYgeW91IGRvbuKAmXQgbmVlZCB1bnByZWRpY3RhYmxlIElEcyB1c2UgYG5hbm9pZC9ub24tc2VjdXJlYC4gJyArXG4gICAgICAgICdGb3Igc2VjdXJlIElEcywgaW1wb3J0IGByZWFjdC1uYXRpdmUtZ2V0LXJhbmRvbS12YWx1ZXNgICcgK1xuICAgICAgICAnYmVmb3JlIE5hbm8gSUQuJ1xuICAgIClcbiAgfVxuICBpZiAodHlwZW9mIG1zQ3J5cHRvICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgY3J5cHRvID09PSAndW5kZWZpbmVkJykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdJbXBvcnQgZmlsZSB3aXRoIGBpZiAoIXdpbmRvdy5jcnlwdG8pIHdpbmRvdy5jcnlwdG8gPSB3aW5kb3cubXNDcnlwdG9gJyArXG4gICAgICAgICcgYmVmb3JlIGltcG9ydGluZyBOYW5vIElEIHRvIGZpeCBJRSAxMSBzdXBwb3J0J1xuICAgIClcbiAgfVxuICBpZiAodHlwZW9mIGNyeXB0byA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnWW91ciBicm93c2VyIGRvZXMgbm90IGhhdmUgc2VjdXJlIHJhbmRvbSBnZW5lcmF0b3IuICcgK1xuICAgICAgICAnSWYgeW91IGRvbuKAmXQgbmVlZCB1bnByZWRpY3RhYmxlIElEcywgeW91IGNhbiB1c2UgbmFub2lkL25vbi1zZWN1cmUuJ1xuICAgIClcbiAgfVxufVxuXG5sZXQgcmFuZG9tID0gYnl0ZXMgPT4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShieXRlcykpXG5cbmxldCBjdXN0b21SYW5kb20gPSAoYWxwaGFiZXQsIHNpemUsIGdldFJhbmRvbSkgPT4ge1xuICAvLyBGaXJzdCwgYSBiaXRtYXNrIGlzIG5lY2Vzc2FyeSB0byBnZW5lcmF0ZSB0aGUgSUQuIFRoZSBiaXRtYXNrIG1ha2VzIGJ5dGVzXG4gIC8vIHZhbHVlcyBjbG9zZXIgdG8gdGhlIGFscGhhYmV0IHNpemUuIFRoZSBiaXRtYXNrIGNhbGN1bGF0ZXMgdGhlIGNsb3Nlc3RcbiAgLy8gYDJeMzEgLSAxYCBudW1iZXIsIHdoaWNoIGV4Y2VlZHMgdGhlIGFscGhhYmV0IHNpemUuXG4gIC8vIEZvciBleGFtcGxlLCB0aGUgYml0bWFzayBmb3IgdGhlIGFscGhhYmV0IHNpemUgMzAgaXMgMzEgKDAwMDExMTExKS5cbiAgLy8gYE1hdGguY2x6MzJgIGlzIG5vdCB1c2VkLCBiZWNhdXNlIGl0IGlzIG5vdCBhdmFpbGFibGUgaW4gYnJvd3NlcnMuXG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgLy8gVGhvdWdoLCB0aGUgYml0bWFzayBzb2x1dGlvbiBpcyBub3QgcGVyZmVjdCBzaW5jZSB0aGUgYnl0ZXMgZXhjZWVkaW5nXG4gIC8vIHRoZSBhbHBoYWJldCBzaXplIGFyZSByZWZ1c2VkLiBUaGVyZWZvcmUsIHRvIHJlbGlhYmx5IGdlbmVyYXRlIHRoZSBJRCxcbiAgLy8gdGhlIHJhbmRvbSBieXRlcyByZWR1bmRhbmN5IGhhcyB0byBiZSBzYXRpc2ZpZWQuXG5cbiAgLy8gTm90ZTogZXZlcnkgaGFyZHdhcmUgcmFuZG9tIGdlbmVyYXRvciBjYWxsIGlzIHBlcmZvcm1hbmNlIGV4cGVuc2l2ZSxcbiAgLy8gYmVjYXVzZSB0aGUgc3lzdGVtIGNhbGwgZm9yIGVudHJvcHkgY29sbGVjdGlvbiB0YWtlcyBhIGxvdCBvZiB0aW1lLlxuICAvLyBTbywgdG8gYXZvaWQgYWRkaXRpb25hbCBzeXN0ZW0gY2FsbHMsIGV4dHJhIGJ5dGVzIGFyZSByZXF1ZXN0ZWQgaW4gYWR2YW5jZS5cblxuICAvLyBOZXh0LCBhIHN0ZXAgZGV0ZXJtaW5lcyBob3cgbWFueSByYW5kb20gYnl0ZXMgdG8gZ2VuZXJhdGUuXG4gIC8vIFRoZSBudW1iZXIgb2YgcmFuZG9tIGJ5dGVzIGdldHMgZGVjaWRlZCB1cG9uIHRoZSBJRCBzaXplLCBtYXNrLFxuICAvLyBhbHBoYWJldCBzaXplLCBhbmQgbWFnaWMgbnVtYmVyIDEuNiAodXNpbmcgMS42IHBlYWtzIGF0IHBlcmZvcm1hbmNlXG4gIC8vIGFjY29yZGluZyB0byBiZW5jaG1hcmtzKS5cblxuICAvLyBgLX5mID0+IE1hdGguY2VpbChmKWAgaWYgZiBpcyBhIGZsb2F0XG4gIC8vIGAtfmkgPT4gaSArIDFgIGlmIGkgaXMgYW4gaW50ZWdlclxuICBsZXQgc3RlcCA9IC1+KCgxLjYgKiBtYXNrICogc2l6ZSkgLyBhbHBoYWJldC5sZW5ndGgpXG5cbiAgcmV0dXJuICgpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIC8vIEEgY29tcGFjdCBhbHRlcm5hdGl2ZSBmb3IgYGZvciAodmFyIGkgPSAwOyBpIDwgc3RlcDsgaSsrKWAuXG4gICAgICBsZXQgaiA9IHN0ZXBcbiAgICAgIHdoaWxlIChqLS0pIHtcbiAgICAgICAgLy8gQWRkaW5nIGB8fCAnJ2AgcmVmdXNlcyBhIHJhbmRvbSBieXRlIHRoYXQgZXhjZWVkcyB0aGUgYWxwaGFiZXQgc2l6ZS5cbiAgICAgICAgaWQgKz0gYWxwaGFiZXRbYnl0ZXNbal0gJiBtYXNrXSB8fCAnJ1xuICAgICAgICBpZiAoaWQubGVuZ3RoID09PSBzaXplKSByZXR1cm4gaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxubGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplKSA9PiBjdXN0b21SYW5kb20oYWxwaGFiZXQsIHNpemUsIHJhbmRvbSlcblxubGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSlcblxuICAvLyBBIGNvbXBhY3QgYWx0ZXJuYXRpdmUgZm9yIGBmb3IgKHZhciBpID0gMDsgaSA8IHN0ZXA7IGkrKylgLlxuICB3aGlsZSAoc2l6ZS0tKSB7XG4gICAgLy8gSXQgaXMgaW5jb3JyZWN0IHRvIHVzZSBieXRlcyBleGNlZWRpbmcgdGhlIGFscGhhYmV0IHNpemUuXG4gICAgLy8gVGhlIGZvbGxvd2luZyBtYXNrIHJlZHVjZXMgdGhlIHJhbmRvbSBieXRlIGluIHRoZSAwLTI1NSB2YWx1ZVxuICAgIC8vIHJhbmdlIHRvIHRoZSAwLTYzIHZhbHVlIHJhbmdlLiBUaGVyZWZvcmUsIGFkZGluZyBoYWNrcywgc3VjaFxuICAgIC8vIGFzIGVtcHR5IHN0cmluZyBmYWxsYmFjayBvciBtYWdpYyBudW1iZXJzLCBpcyB1bm5lY2Nlc3NhcnkgYmVjYXVzZVxuICAgIC8vIHRoZSBiaXRtYXNrIHRyaW1zIGJ5dGVzIGRvd24gdG8gdGhlIGFscGhhYmV0IHNpemUuXG4gICAgbGV0IGJ5dGUgPSBieXRlc1tzaXplXSAmIDYzXG4gICAgaWYgKGJ5dGUgPCAzNikge1xuICAgICAgLy8gYDAtOWEtemBcbiAgICAgIGlkICs9IGJ5dGUudG9TdHJpbmcoMzYpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjIpIHtcbiAgICAgIC8vIGBBLVpgXG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYzKSB7XG4gICAgICBpZCArPSAnXydcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJy0nXG4gICAgfVxuICB9XG4gIHJldHVybiBpZFxufVxuXG5leHBvcnQgeyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwiZXZlbnQtZW1pdHRlclwiO1xuaW1wb3J0IHsgbmFub2lkIH0gZnJvbSBcIm5hbm9pZFwiO1xuXG4vKipcbiAqIOe7hOS7tuWfuuexu1xuICpcbiAqIEBjbGFzcyBDb21wb25lbnRcbiAqL1xuY2xhc3MgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgRXZlbnRFbWl0dGVyKHRoaXMpO1xuICAgIHRoaXMuaWQgPSBuYW5vaWQoOCk7XG4gIH1cblxuICBkZXN0cm95KCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29tcG9uZW50O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi4xMicgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIElTX1dSQVAgPSB0eXBlICYgJGV4cG9ydC5XO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV07XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIga2V5LCBvd24sIG91dDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAob3duICYmIGhhcyhleHBvcnRzLCBrZXkpKSBjb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uIChDKSB7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgQykge1xuICAgICAgICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEMoKTtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYgKElTX1BST1RPKSB7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYgKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0pIGhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsIi8vIDIyLjEuMi4yIC8gMTUuNC4zLjIgQXJyYXkuaXNBcnJheShhcmcpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ0FycmF5JywgeyBpc0FycmF5OiByZXF1aXJlKCcuL19pcy1hcnJheScpIH0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuYXJyYXkuaXMtYXJyYXknKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmlzQXJyYXk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvaXMtYXJyYXlcIik7IiwiaW1wb3J0IF9BcnJheSRpc0FycmF5IGZyb20gXCJAYmFiZWwvcnVudGltZS1jb3JlanMyL2NvcmUtanMvYXJyYXkvaXMtYXJyYXlcIjtcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcnJheVdpdGhIb2xlcyhhcnIpIHtcbiAgaWYgKF9BcnJheSRpc0FycmF5KGFycikpIHJldHVybiBhcnI7XG59IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19oaWRlJyk7XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBNRVRBID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHNldERlc2MgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGlkID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgc2V0RGVzYyhpdCwgTUVUQSwgeyB2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gfSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKSBzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogTUVUQSxcbiAgTkVFRDogZmFsc2UsXG4gIGZhc3RLZXk6IGZhc3RLZXksXG4gIGdldFdlYWs6IGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAyMCBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyICRTeW1ib2wgPSBjb3JlLlN5bWJvbCB8fCAoY29yZS5TeW1ib2wgPSBMSUJSQVJZID8ge30gOiBnbG9iYWwuU3ltYm9sIHx8IHt9KTtcbiAgaWYgKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpIGRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHsgdmFsdWU6IHdrc0V4dC5mKG5hbWUpIH0pO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCdrZXlzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuIHNoYXJlZFtrZXldIHx8IChzaGFyZWRba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHJlc3VsdCA9IGdldEtleXMoaXQpO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYgKGdldFN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpO1xuICAgIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAoc3ltYm9scy5sZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBNRVRBID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWTtcbnZhciAkZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgd2tzRGVmaW5lID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpO1xudmFyIGVudW1LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBfY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdPUE5FeHQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKTtcbnZhciAkR09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJyk7XG52YXIgJEdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyICREUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BEID0gJEdPUEQuZjtcbnZhciBkUCA9ICREUC5mO1xudmFyIGdPUE4gPSBnT1BORXh0LmY7XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJEpTT04gPSBnbG9iYWwuSlNPTjtcbnZhciBfc3RyaW5naWZ5ID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEhJRERFTiA9IHdrcygnX2hpZGRlbicpO1xudmFyIFRPX1BSSU1JVElWRSA9IHdrcygndG9QcmltaXRpdmUnKTtcbnZhciBpc0VudW0gPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9QU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgVVNFX05BVElWRSA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbicgJiYgISEkR09QUy5mO1xudmFyIFFPYmplY3QgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkUCh0aGlzLCAnYScsIHsgdmFsdWU6IDcgfSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbiAoaXQsIGtleSwgRCkge1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYgKHByb3RvRGVzYykgZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZiAocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bykgZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKSB7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8pICRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSkge1xuICAgIGlmICghRC5lbnVtZXJhYmxlKSB7XG4gICAgICBpZiAoIWhhcyhpdCwgSElEREVOKSkgZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pIGl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwgeyBlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKSB9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKSB7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IGtleXMubGVuZ3RoO1xuICB2YXIga2V5O1xuICB3aGlsZSAobCA+IGkpICRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApIHtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpIHtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gIGl0ID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmIChEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpIEQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgdmFyIG5hbWVzID0gZ09QTih0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gIHZhciBJU19PUCA9IGl0ID09PSBPYmplY3RQcm90bztcbiAgdmFyIG5hbWVzID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKSByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmICghVVNFX05BVElWRSkge1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCkgdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzID09PSBPYmplY3RQcm90bykgJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYgKERFU0NSSVBUT1JTICYmIHNldHRlcikgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0IH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAkR09QUy5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZiAoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSkge1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgU3ltYm9sOiAkU3ltYm9sIH0pO1xuXG5mb3IgKHZhciBlczZTeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGogPSAwOyBlczZTeW1ib2xzLmxlbmd0aCA+IGo7KXdrcyhlczZTeW1ib2xzW2orK10pO1xuXG5mb3IgKHZhciB3ZWxsS25vd25TeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgayA9IDA7IHdlbGxLbm93blN5bWJvbHMubGVuZ3RoID4gazspIHdrc0RlZmluZSh3ZWxsS25vd25TeW1ib2xzW2srK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKHN5bSkge1xuICAgIGlmICghaXNTeW1ib2woc3ltKSkgdGhyb3cgVHlwZUVycm9yKHN5bSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICAgIGZvciAodmFyIGtleSBpbiBTeW1ib2xSZWdpc3RyeSkgaWYgKFN5bWJvbFJlZ2lzdHJ5W2tleV0gPT09IHN5bSkgcmV0dXJuIGtleTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyBDaHJvbWUgMzggYW5kIDM5IGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzYCBmYWlscyBvbiBwcmltaXRpdmVzXG4vLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zNDQzXG52YXIgRkFJTFNfT05fUFJJTUlUSVZFUyA9ICRmYWlscyhmdW5jdGlvbiAoKSB7ICRHT1BTLmYoMSk7IH0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIEZBSUxTX09OX1BSSU1JVElWRVMsICdPYmplY3QnLCB7XG4gIGdldE93blByb3BlcnR5U3ltYm9sczogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gICAgcmV0dXJuICRHT1BTLmYodG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoeyBhOiBTIH0pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkge1xuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgICRyZXBsYWNlciA9IHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlcGxhY2VyKSAmJiBpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiAkcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykgdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xuIiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7XG4iLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ29ic2VydmFibGUnKTtcbiIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuU3ltYm9sO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG52YXIgRE9NSXRlcmFibGVzID0gKCdDU1NSdWxlTGlzdCxDU1NTdHlsZURlY2xhcmF0aW9uLENTU1ZhbHVlTGlzdCxDbGllbnRSZWN0TGlzdCxET01SZWN0TGlzdCxET01TdHJpbmdMaXN0LCcgK1xuICAnRE9NVG9rZW5MaXN0LERhdGFUcmFuc2Zlckl0ZW1MaXN0LEZpbGVMaXN0LEhUTUxBbGxDb2xsZWN0aW9uLEhUTUxDb2xsZWN0aW9uLEhUTUxGb3JtRWxlbWVudCxIVE1MU2VsZWN0RWxlbWVudCwnICtcbiAgJ01lZGlhTGlzdCxNaW1lVHlwZUFycmF5LE5hbWVkTm9kZU1hcCxOb2RlTGlzdCxQYWludFJlcXVlc3RMaXN0LFBsdWdpbixQbHVnaW5BcnJheSxTVkdMZW5ndGhMaXN0LFNWR051bWJlckxpc3QsJyArXG4gICdTVkdQYXRoU2VnTGlzdCxTVkdQb2ludExpc3QsU1ZHU3RyaW5nTGlzdCxTVkdUcmFuc2Zvcm1MaXN0LFNvdXJjZUJ1ZmZlckxpc3QsU3R5bGVTaGVldExpc3QsVGV4dFRyYWNrQ3VlTGlzdCwnICtcbiAgJ1RleHRUcmFja0xpc3QsVG91Y2hMaXN0Jykuc3BsaXQoJywnKTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBET01JdGVyYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIE5BTUUgPSBET01JdGVyYWJsZXNbaV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZiAocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufVxuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fd2tzLWV4dCcpLmYoJ2l0ZXJhdG9yJyk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yXCIpOyIsImltcG9ydCBfU3ltYm9sIGZyb20gXCJAYmFiZWwvcnVudGltZS1jb3JlanMyL2NvcmUtanMvc3ltYm9sXCI7XG5pbXBvcnQgX1N5bWJvbCRpdGVyYXRvciBmcm9tIFwiQGJhYmVsL3J1bnRpbWUtY29yZWpzMi9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvclwiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2l0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkge1xuICB2YXIgX2kgPSBhcnIgPT0gbnVsbCA/IG51bGwgOiB0eXBlb2YgX1N5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcnJbX1N5bWJvbCRpdGVyYXRvcl0gfHwgYXJyW1wiQEBpdGVyYXRvclwiXTtcblxuICBpZiAoX2kgPT0gbnVsbCkgcmV0dXJuO1xuICB2YXIgX2FyciA9IFtdO1xuICB2YXIgX24gPSB0cnVlO1xuICB2YXIgX2QgPSBmYWxzZTtcblxuICB2YXIgX3MsIF9lO1xuXG4gIHRyeSB7XG4gICAgZm9yIChfaSA9IF9pLmNhbGwoYXJyKTsgIShfbiA9IChfcyA9IF9pLm5leHQoKSkuZG9uZSk7IF9uID0gdHJ1ZSkge1xuICAgICAgX2Fyci5wdXNoKF9zLnZhbHVlKTtcblxuICAgICAgaWYgKGkgJiYgX2Fyci5sZW5ndGggPT09IGkpIGJyZWFrO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgX2QgPSB0cnVlO1xuICAgIF9lID0gZXJyO1xuICB9IGZpbmFsbHkge1xuICAgIHRyeSB7XG4gICAgICBpZiAoIV9uICYmIF9pW1wicmV0dXJuXCJdICE9IG51bGwpIF9pW1wicmV0dXJuXCJdKCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmIChfZCkgdGhyb3cgX2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIF9hcnI7XG59IiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkFycmF5LmZyb207XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vYXJyYXkvZnJvbVwiKTsiLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikge1xuICBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHtcbiAgICBhcnIyW2ldID0gYXJyW2ldO1xuICB9XG5cbiAgcmV0dXJuIGFycjI7XG59IiwiaW1wb3J0IF9BcnJheSRmcm9tIGZyb20gXCJAYmFiZWwvcnVudGltZS1jb3JlanMyL2NvcmUtanMvYXJyYXkvZnJvbVwiO1xuaW1wb3J0IGFycmF5TGlrZVRvQXJyYXkgZnJvbSBcIi4vYXJyYXlMaWtlVG9BcnJheS5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikge1xuICBpZiAoIW8pIHJldHVybjtcbiAgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBfQXJyYXkkZnJvbShvKTtcbiAgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBhcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX25vbkl0ZXJhYmxlUmVzdCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn0iLCJpbXBvcnQgYXJyYXlXaXRoSG9sZXMgZnJvbSBcIi4vYXJyYXlXaXRoSG9sZXMuanNcIjtcbmltcG9ydCBpdGVyYWJsZVRvQXJyYXlMaW1pdCBmcm9tIFwiLi9pdGVyYWJsZVRvQXJyYXlMaW1pdC5qc1wiO1xuaW1wb3J0IHVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IGZyb20gXCIuL3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5LmpzXCI7XG5pbXBvcnQgbm9uSXRlcmFibGVSZXN0IGZyb20gXCIuL25vbkl0ZXJhYmxlUmVzdC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3NsaWNlZFRvQXJyYXkoYXJyLCBpKSB7XG4gIHJldHVybiBhcnJheVdpdGhIb2xlcyhhcnIpIHx8IGl0ZXJhYmxlVG9BcnJheUxpbWl0KGFyciwgaSkgfHwgdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyLCBpKSB8fCBub25JdGVyYWJsZVJlc3QoKTtcbn0iLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRhcmdldCwgc3JjLCBzYWZlKSB7XG4gIGZvciAodmFyIGtleSBpbiBzcmMpIHtcbiAgICBpZiAoc2FmZSAmJiB0YXJnZXRba2V5XSkgdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBmYXN0S2V5ID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0laRSA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24gKHRoYXQsIGtleSkge1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpO1xuICB2YXIgZW50cnk7XG4gIGlmIChpbmRleCAhPT0gJ0YnKSByZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IgKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgIGlmIChlbnRyeS5rID09IGtleSkgcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uICh3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKSB7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0aGF0LCBpdGVyYWJsZSkge1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX3QgPSBOQU1FOyAgICAgICAgIC8vIGNvbGxlY3Rpb24gdHlwZVxuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGZvciAodmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKSwgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChlbnRyeS5wKSBlbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkubjtcbiAgICAgICAgICB2YXIgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKHByZXYpIHByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYgKG5leHQpIG5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYgKHRoYXQuX2YgPT0gZW50cnkpIHRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmICh0aGF0Ll9sID09IGVudHJ5KSB0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICAgICAgdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKTtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB3aGlsZSAoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKSB7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTkFNRSksIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHRoaXMsIE5BTUUpW1NJWkVdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICB2YXIgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZiAoIXRoYXQuX2YpIHRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uIChDLCBOQU1FLCBJU19NQVApIHtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gICAgICB0aGlzLl90ID0gdmFsaWRhdGUoaXRlcmF0ZWQsIE5BTUUpOyAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7ICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGtpbmQgPSB0aGF0Ll9rO1xuICAgICAgdmFyIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZiAoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSkge1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWwpKSB7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSkgQyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59O1xuIiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwsIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTtcbiIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBhc2MgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVFlQRSwgJGNyZWF0ZSkge1xuICB2YXIgSVNfTUFQID0gVFlQRSA9PSAxO1xuICB2YXIgSVNfRklMVEVSID0gVFlQRSA9PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT0gMztcbiAgdmFyIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICB2YXIgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNjtcbiAgdmFyIE5PX0hPTEVTID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHZhciBjcmVhdGUgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSU9iamVjdChPKTtcbiAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbCwgcmVzO1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgcmVzdWx0W2luZGV4XSA9IHJlczsgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZiAocmVzKSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYgKElTX0VWRVJZKSByZXR1cm4gZmFsc2U7IC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgZWFjaCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgwKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKSB7XG4gIHZhciBCYXNlID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgQyA9IEJhc2U7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBwcm90byA9IEMgJiYgQy5wcm90b3R5cGU7XG4gIHZhciBPID0ge307XG4gIGlmICghREVTQ1JJUFRPUlMgfHwgdHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0YXJnZXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSwgJ19jJyk7XG4gICAgICB0YXJnZXQuX2MgPSBuZXcgQmFzZSgpO1xuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGFyZ2V0W0FEREVSXSwgdGFyZ2V0KTtcbiAgICB9KTtcbiAgICBlYWNoKCdhZGQsY2xlYXIsZGVsZXRlLGZvckVhY2gsZ2V0LGhhcyxzZXQsa2V5cyx2YWx1ZXMsZW50cmllcyx0b0pTT04nLnNwbGl0KCcsJyksIGZ1bmN0aW9uIChLRVkpIHtcbiAgICAgIHZhciBJU19BRERFUiA9IEtFWSA9PSAnYWRkJyB8fCBLRVkgPT0gJ3NldCc7XG4gICAgICBpZiAoS0VZIGluIHByb3RvICYmICEoSVNfV0VBSyAmJiBLRVkgPT0gJ2NsZWFyJykpIGhpZGUoQy5wcm90b3R5cGUsIEtFWSwgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0aGlzLCBDLCBLRVkpO1xuICAgICAgICBpZiAoIUlTX0FEREVSICYmIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpKSByZXR1cm4gS0VZID09ICdnZXQnID8gdW5kZWZpbmVkIDogZmFsc2U7XG4gICAgICAgIHZhciByZXN1bHQgPSB0aGlzLl9jW0tFWV0oYSA9PT0gMCA/IDAgOiBhLCBiKTtcbiAgICAgICAgcmV0dXJuIElTX0FEREVSID8gdGhpcyA6IHJlc3VsdDtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIElTX1dFQUsgfHwgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jLnNpemU7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYsIE8pO1xuXG4gIGlmICghSVNfV0VBSykgY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXN0cm9uZycpO1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIE1BUCA9ICdNYXAnO1xuXG4vLyAyMy4xIE1hcCBPYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24nKShNQVAsIGZ1bmN0aW9uIChnZXQpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpIHsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE1BUCksIGtleSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XG4gIH0sXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXG4gIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7XG4iLCJ2YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlciwgSVRFUkFUT1IpIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBmb3JPZihpdGVyLCBmYWxzZSwgcmVzdWx0LnB1c2gsIHJlc3VsdCwgSVRFUkFUT1IpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIGZyb20gPSByZXF1aXJlKCcuL19hcnJheS1mcm9tLWl0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FKSB7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKSB7XG4gICAgaWYgKGNsYXNzb2YodGhpcykgIT0gTkFNRSkgdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICByZXR1cm4gZnJvbSh0aGlzKTtcbiAgfTtcbn07XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vRGF2aWRCcnVhbnQvTWFwLVNldC5wcm90b3R5cGUudG9KU09OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuUiwgJ01hcCcsIHsgdG9KU09OOiByZXF1aXJlKCcuL19jb2xsZWN0aW9uLXRvLWpzb24nKSgnTWFwJykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IG9mOiBmdW5jdGlvbiBvZigpIHtcbiAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgQSA9IG5ldyBBcnJheShsZW5ndGgpO1xuICAgIHdoaWxlIChsZW5ndGgtLSkgQVtsZW5ndGhdID0gYXJndW1lbnRzW2xlbmd0aF07XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLW1hcC5vZlxucmVxdWlyZSgnLi9fc2V0LWNvbGxlY3Rpb24tb2YnKSgnTWFwJyk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL3Byb3Bvc2FsLXNldG1hcC1vZmZyb20vXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT0xMRUNUSU9OKSB7XG4gICRleHBvcnQoJGV4cG9ydC5TLCBDT0xMRUNUSU9OLCB7IGZyb206IGZ1bmN0aW9uIGZyb20oc291cmNlIC8qICwgbWFwRm4sIHRoaXNBcmcgKi8pIHtcbiAgICB2YXIgbWFwRm4gPSBhcmd1bWVudHNbMV07XG4gICAgdmFyIG1hcHBpbmcsIEEsIG4sIGNiO1xuICAgIGFGdW5jdGlvbih0aGlzKTtcbiAgICBtYXBwaW5nID0gbWFwRm4gIT09IHVuZGVmaW5lZDtcbiAgICBpZiAobWFwcGluZykgYUZ1bmN0aW9uKG1hcEZuKTtcbiAgICBpZiAoc291cmNlID09IHVuZGVmaW5lZCkgcmV0dXJuIG5ldyB0aGlzKCk7XG4gICAgQSA9IFtdO1xuICAgIGlmIChtYXBwaW5nKSB7XG4gICAgICBuID0gMDtcbiAgICAgIGNiID0gY3R4KG1hcEZuLCBhcmd1bWVudHNbMl0sIDIpO1xuICAgICAgZm9yT2Yoc291cmNlLCBmYWxzZSwgZnVuY3Rpb24gKG5leHRJdGVtKSB7XG4gICAgICAgIEEucHVzaChjYihuZXh0SXRlbSwgbisrKSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yT2Yoc291cmNlLCBmYWxzZSwgQS5wdXNoLCBBKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyB0aGlzKEEpO1xuICB9IH0pO1xufTtcbiIsIi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vcHJvcG9zYWwtc2V0bWFwLW9mZnJvbS8jc2VjLW1hcC5mcm9tXG5yZXF1aXJlKCcuL19zZXQtY29sbGVjdGlvbi1mcm9tJykoJ01hcCcpO1xuIiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLnRvLWpzb24nKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM3Lm1hcC5vZicpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczcubWFwLmZyb20nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLk1hcDtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9tYXBcIik7IiwiZXhwb3J0IGNvbnN0IElOVEVSTkFMX0VWRU5UID0ge1xuICBFTlRFUl9GUkFNRTogXCJpbnRlcm5hbF9lbnRlcl9mcmFtZVwiLFxufTtcbiIsIi8vIDIwLjMuMy4xIC8gMTUuOS40LjQgRGF0ZS5ub3coKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdEYXRlJywgeyBub3c6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpOyB9IH0pO1xuIiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuZGF0ZS5ub3cnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLkRhdGUubm93O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2RhdGUvbm93XCIpOyIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcImV2ZW50LWVtaXR0ZXJcIjtcbmltcG9ydCB7IElOVEVSTkFMX0VWRU5UIH0gZnJvbSBcIi4vaW50ZXJuYWxcIjtcblxuY29uc3Qgc2VsZlJlcXVlc3RBbmltYXRpb25GcmFtZSA9IChjYWxsYmFjaykgPT4ge1xuICByZXR1cm4gc2V0SW50ZXJ2YWwoY2FsbGJhY2ssIDMwKTtcbn07XG5cbmNvbnN0IHNlbGZDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSAoaWQpID0+IHtcbiAgY2xlYXJJbnRlcnZhbChpZCk7XG59O1xuY29uc3QgUkFGID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCBzZWxmUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuY29uc3QgQ1JBRiA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fCBzZWxmQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuXG5jbGFzcyBTdGFnZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIEV2ZW50RW1pdHRlcih0aGlzKTtcbiAgICB0aGlzLl9mcHMgPSAzMDtcbiAgICB0aGlzLmZwc0ludGVydmFsID0gfn4xMDAwIC8gdGhpcy5fZnBzO1xuICAgIHRoaXMubGFzdFJlbmRlclRpbWUgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgY29uc3QgeyBsYXN0UmVuZGVyVGltZSwgZnBzSW50ZXJ2YWwgfSA9IHRoaXM7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICBjb25zdCBlbGFwc2VkID0gbm93IC0gbGFzdFJlbmRlclRpbWU7XG4gICAgaWYgKGVsYXBzZWQgPCBmcHNJbnRlcnZhbCkge1xuICAgICAgdGhpcy5yYWZJbnRlcnZhbCA9IFJBRih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RSZW5kZXJUaW1lID0gbm93O1xuICAgIHRoaXMuZW1pdChJTlRFUk5BTF9FVkVOVC5FTlRFUl9GUkFNRSk7XG4gICAgdGhpcy5yYWZJbnRlcnZhbCA9IFJBRih0aGlzLnJlbmRlci5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHNldCBmcHModmFsKSB7XG4gICAgaWYgKHRoaXMuZnBzID09PSArdmFsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fZnBzID0gK3ZhbDtcbiAgICBpZiAodmFsID09PSAwKSB7XG4gICAgICBDUkFGKHRoaXMucmFmSW50ZXJ2YWwpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZnBzSW50ZXJ2YWwgPSB+figxMDAwIC8gK3ZhbCk7XG4gIH1cblxuICBnZXQgZnBzKCkge1xuICAgIHJldHVybiB0aGlzLl9mcHM7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RhZ2U7XG4iLCJpbXBvcnQgeyBJTlRFUk5BTF9FVkVOVCB9IGZyb20gXCIuL2ludGVybmFsXCI7XG5pbXBvcnQgU3RhZ2UgZnJvbSBcIi4vc3RhZ2VcIjtcbmNsYXNzIFJlbmRlcmVyIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgUmVuZGVyZXIuXG4gICAqIEBwYXJhbSB7IFN0YWdlIH0gc3RhZ2VcbiAgICogQG1lbWJlcm9mIFJlbmRlcmVyXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdGFnZSkge1xuICAgIC8qKiDlu7bov5/muLLmn5PpmJ/liJcgKi9cbiAgICB0aGlzLmRlZmVycmVkUXVldWUgPSBuZXcgTWFwKCk7XG4gICAgLyoqIEB0eXBlIHsgU3RhZ2UgfSAqL1xuICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICB0aGlzLnN0YWdlLm9uKElOVEVSTkFMX0VWRU5ULkVOVEVSX0ZSQU1FLCB0aGlzLm9uVmFsaWRhdGUuYmluZCh0aGlzKSk7XG4gIH1cblxuICAvKipcbiAgICog5bCG5b6F5pu05paw5Ye95pWw5pS+5YWl5bu26L+f5riy5p+T6Zif5YiXXG4gICAqXG4gICAqIEBwYXJhbSB7Kn0gZm5cbiAgICogQHBhcmFtIHsqfSBhcmdzXG4gICAqIEBtZW1iZXJvZiBSZW5kZXJlclxuICAgKi9cbiAgaW52YWxpZGF0ZShmbiwgLi4uYXJncykge1xuICAgIHRoaXMuZGVmZXJyZWRRdWV1ZS5zZXQoZm4sIGFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIOeri+WNs+i/m+ihjOa4suafk1xuICAgKlxuICAgKiBAbWVtYmVyb2YgUmVuZGVyZXJcbiAgICovXG4gIHZhbGlkYXRlTm93KCkge1xuICAgIHRoaXMub25WYWxpZGF0ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIOeUn+aViOWHveaVsO+8jOivpeWHveaVsOmAmuW4uOiiq3N0YWdlLmVudGVyX2ZyYW1l5LqL5Lu2IOWSjCB2YWxpZGF0ZU5vdyDlh73mlbDosIPnlKjjgIJcbiAgICpcbiAgICogQHJldHVybiB7Kn1cbiAgICogQG1lbWJlcm9mIFJlbmRlcmVyXG4gICAqL1xuICBvblZhbGlkYXRlKCkge1xuICAgIGNvbnN0IHsgc2l6ZSB9ID0gdGhpcy5kZWZlcnJlZFF1ZXVlO1xuICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBbZm4sIHZhbHVlc10gb2YgdGhpcy5kZWZlcnJlZFF1ZXVlPy5lbnRyaWVzKCkpIHtcbiAgICAgIGZuPy4oLi4udmFsdWVzKTtcbiAgICAgIHRoaXMuZGVmZXJyZWRRdWV1ZS5kZWxldGUoZm4pO1xuICAgIH1cblxuICAgIC8vIOa4suafk+i/h+eoi+S4re+8jOWPiOadpeS6huaWsOeahFxuICAgIGNvbnN0IHsgc2l6ZTogcmVtYWluU2l6ZSB9ID0gdGhpcy5kZWZlcnJlZFF1ZXVlO1xuICAgIGlmIChyZW1haW5TaXplID4gMCkge1xuICAgICAgdGhpcy52YWxpZGF0ZU5vdygpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBSZW5kZXJlcjtcbiIsImltcG9ydCBDb21wb25lbnQgZnJvbSBcIi4vY29tcG9uZW50XCI7XG5pbXBvcnQgUmVuZGVyZXIgZnJvbSBcIi4vcmVuZGVyZXJcIjtcbmltcG9ydCBTdGFnZSBmcm9tIFwiLi9zdGFnZVwiO1xuXG5jbGFzcyBDb3JlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9uID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbiA9IG9wdGlvbjtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICBjb25zb2xlLmxvZyhcImluaXQgY29tcGxldGVkXCIpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBjb25zdCB7IG9wdGlvbiB9ID0gdGhpcztcbiAgICB0aGlzLnN0YWdlID0gbmV3IFN0YWdlKCk7XG4gICAgdGhpcy5zdGFnZS5mcHMgPSArb3B0aW9uLmZwcyB8fCAzMDtcbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKHRoaXMuc3RhZ2UpO1xuXG4gICAgY29uc3QgY29tID0gbmV3IENvbXBvbmVudCgpO1xuICAgIHdpbmRvdy5jb20gPSBjb207XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29yZTtcbiJdLCJuYW1lcyI6WyJfdW5kZWZpbmVkIiwiaXMiLCJpc1ZhbHVlIiwicmVxdWlyZSQkMCIsImlzT2JqZWN0IiwiaXNJbXBsZW1lbnRlZCIsImtleXMiLCJzaGltIiwicmVxdWlyZSQkMSIsIm1heCIsImFzc2lnbiIsImNyZWF0ZSIsImNvbnRhaW5zIiwicmVxdWlyZSQkMiIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwiZE1vZHVsZSIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwiRXZlbnRFbWl0dGVyIiwiaWQiLCJuYW5vaWQiLCJkZXN0cm95IiwiZ2xvYmFsIiwiX2dsb2JhbE1vZHVsZSIsImNvcmUiLCJfY29yZU1vZHVsZSIsImFGdW5jdGlvbiIsImRvY3VtZW50IiwiYW5PYmplY3QiLCJJRThfRE9NX0RFRklORSIsInRvUHJpbWl0aXZlIiwiZFAiLCJjcmVhdGVEZXNjIiwiaGFzT3duUHJvcGVydHkiLCJjdHgiLCJoaWRlIiwiaGFzIiwiUFJPVE9UWVBFIiwiJGV4cG9ydCIsInRvU3RyaW5nIiwiY29mIiwiaXNBcnJheSIsIl9BcnJheSRpc0FycmF5IiwiTUVUQSIsImZhc3RLZXkiLCJtZXRhIiwiX21ldGFNb2R1bGUiLCJzdG9yZSIsIl9zaGFyZWRNb2R1bGUiLCJ1aWQiLCJfd2tzTW9kdWxlIiwiVEFHIiwid2tzRXh0IiwiSU9iamVjdCIsImRlZmluZWQiLCJ0b0ludGVnZXIiLCJtaW4iLCJ0b0lPYmplY3QiLCJ0b0xlbmd0aCIsInNoYXJlZCIsIklFX1BST1RPIiwiJGtleXMiLCJlbnVtQnVnS2V5cyIsImdldEtleXMiLCJwSUUiLCJyZXF1aXJlJCQ1IiwiZ09QTiIsImdPUEQiLCJyZXF1aXJlJCQ2IiwiREVTQ1JJUFRPUlMiLCJyZWRlZmluZSIsInJlcXVpcmUkJDciLCJzZXRUb1N0cmluZ1RhZyIsInJlcXVpcmUkJDgiLCJyZXF1aXJlJCQ5IiwicmVxdWlyZSQkMTAiLCJyZXF1aXJlJCQxMSIsInJlcXVpcmUkJDEyIiwicmVxdWlyZSQkMTMiLCJyZXF1aXJlJCQxNCIsInJlcXVpcmUkJDE1IiwicmVxdWlyZSQkMTYiLCJ0b09iamVjdCIsInJlcXVpcmUkJDE3IiwicmVxdWlyZSQkMTgiLCJyZXF1aXJlJCQxOSIsInJlcXVpcmUkJDIwIiwicmVxdWlyZSQkMjEiLCJyZXF1aXJlJCQyMiIsInJlcXVpcmUkJDIzIiwicmVxdWlyZSQkMjQiLCJyZXF1aXJlJCQyNSIsInJlcXVpcmUkJDI2IiwiT2JqZWN0UHJvdG8iLCIkZGVmaW5lUHJvcGVydHkiLCJyZXF1aXJlJCQyNyIsInJlcXVpcmUkJDI4IiwicmVxdWlyZSQkMjkiLCJyZXF1aXJlJCQzMCIsInN5bWJvbCIsIkl0ZXJhdG9ycyIsIklURVJBVE9SIiwic3RlcCIsIml0ZXJhdG9yIiwiX1N5bWJvbCIsIl9TeW1ib2wkaXRlcmF0b3IiLCJjbGFzc29mIiwiY2FsbCIsImlzQXJyYXlJdGVyIiwiZ2V0SXRlckZuIiwiZnJvbSIsIl9hcnJheUxpa2VUb0FycmF5IiwiX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5IiwiYXJyYXlMaWtlVG9BcnJheSIsIl9BcnJheSRmcm9tIiwiYXJyYXlXaXRoSG9sZXMiLCJpdGVyYWJsZVRvQXJyYXlMaW1pdCIsInVuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5Iiwibm9uSXRlcmFibGVSZXN0IiwiZXhwb3J0cyIsIl9mb3JPZk1vZHVsZSIsIlNQRUNJRVMiLCJyZWRlZmluZUFsbCIsImFuSW5zdGFuY2UiLCJmb3JPZiIsInZhbGlkYXRlIiwibWFwIiwiSU5URVJOQUxfRVZFTlQiLCJFTlRFUl9GUkFNRSIsIm5vdyIsInNlbGZSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYWxsYmFjayIsInNldEludGVydmFsIiwic2VsZkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNsZWFySW50ZXJ2YWwiLCJSQUYiLCJ3aW5kb3ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJDUkFGIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJTdGFnZSIsIl9mcHMiLCJmcHNJbnRlcnZhbCIsImxhc3RSZW5kZXJUaW1lIiwiX0RhdGUkbm93IiwicmVuZGVyIiwiZWxhcHNlZCIsInJhZkludGVydmFsIiwiYmluZCIsImVtaXQiLCJmcHMiLCJ2YWwiLCJSZW5kZXJlciIsInN0YWdlIiwiZGVmZXJyZWRRdWV1ZSIsIm9uIiwib25WYWxpZGF0ZSIsImludmFsaWRhdGUiLCJmbiIsImFyZ3MiLCJzZXQiLCJ2YWxpZGF0ZU5vdyIsInNpemUiLCJlbnRyaWVzIiwidmFsdWVzIiwiZGVsZXRlIiwicmVtYWluU2l6ZSIsIkNvcmUiLCJvcHRpb24iLCJpbml0aWFsaXplIiwiY29uc29sZSIsImxvZyIsInJlbmRl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
