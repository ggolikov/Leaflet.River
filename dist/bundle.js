var leaflet = leaflet || {}; leaflet["leaflet-geometryutil"] =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(2);
	__webpack_require__(3);
	__webpack_require__(4);
	__webpack_require__(5);
	__webpack_require__(6);
	__webpack_require__(7);
	__webpack_require__(8);
	__webpack_require__(9);
	__webpack_require__(10);
	// require('./js/main.js');

	__webpack_require__(11);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	 Leaflet 1.0.1, a JS library for interactive maps. http://leafletjs.com
	 (c) 2010-2016 Vladimir Agafonkin, (c) 2010-2011 CloudMade
	*/
	(function (window, document, undefined) {
	var L = {
		version: "1.0.1"
	};

	function expose() {
		var oldL = window.L;

		L.noConflict = function () {
			window.L = oldL;
			return this;
		};

		window.L = L;
	}

	// define Leaflet for Node module pattern loaders, including Browserify
	if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = L;

	// define Leaflet as an AMD module
	} else if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (L), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}

	// define Leaflet as a global L variable, saving the original L to restore later if needed
	if (typeof window !== 'undefined') {
		expose();
	}



	/*
	 * @namespace Util
	 *
	 * Various utility functions, used by Leaflet internally.
	 */

	L.Util = {

		// @function extend(dest: Object, src?: Object): Object
		// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
		extend: function (dest) {
			var i, j, len, src;

			for (j = 1, len = arguments.length; j < len; j++) {
				src = arguments[j];
				for (i in src) {
					dest[i] = src[i];
				}
			}
			return dest;
		},

		// @function create(proto: Object, properties?: Object): Object
		// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
		create: Object.create || (function () {
			function F() {}
			return function (proto) {
				F.prototype = proto;
				return new F();
			};
		})(),

		// @function bind(fn: Function, …): Function
		// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
		// Has a `L.bind()` shortcut.
		bind: function (fn, obj) {
			var slice = Array.prototype.slice;

			if (fn.bind) {
				return fn.bind.apply(fn, slice.call(arguments, 1));
			}

			var args = slice.call(arguments, 2);

			return function () {
				return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
			};
		},

		// @function stamp(obj: Object): Number
		// Returns the unique ID of an object, assiging it one if it doesn't have it.
		stamp: function (obj) {
			/*eslint-disable */
			obj._leaflet_id = obj._leaflet_id || ++L.Util.lastId;
			return obj._leaflet_id;
			/*eslint-enable */
		},

		// @property lastId: Number
		// Last unique ID used by [`stamp()`](#util-stamp)
		lastId: 0,

		// @function throttle(fn: Function, time: Number, context: Object): Function
		// Returns a function which executes function `fn` with the given scope `context`
		// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
		// `fn` will be called no more than one time per given amount of `time`. The arguments
		// received by the bound function will be any arguments passed when binding the
		// function, followed by any arguments passed when invoking the bound function.
		// Has an `L.bind` shortcut.
		throttle: function (fn, time, context) {
			var lock, args, wrapperFn, later;

			later = function () {
				// reset lock and call if queued
				lock = false;
				if (args) {
					wrapperFn.apply(context, args);
					args = false;
				}
			};

			wrapperFn = function () {
				if (lock) {
					// called too soon, queue to call later
					args = arguments;

				} else {
					// call and lock until later
					fn.apply(context, arguments);
					setTimeout(later, time);
					lock = true;
				}
			};

			return wrapperFn;
		},

		// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
		// Returns the number `num` modulo `range` in such a way so it lies within
		// `range[0]` and `range[1]`. The returned value will be always smaller than
		// `range[1]` unless `includeMax` is set to `true`.
		wrapNum: function (x, range, includeMax) {
			var max = range[1],
			    min = range[0],
			    d = max - min;
			return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
		},

		// @function falseFn(): Function
		// Returns a function which always returns `false`.
		falseFn: function () { return false; },

		// @function formatNum(num: Number, digits?: Number): Number
		// Returns the number `num` rounded to `digits` decimals, or to 5 decimals by default.
		formatNum: function (num, digits) {
			var pow = Math.pow(10, digits || 5);
			return Math.round(num * pow) / pow;
		},

		// @function trim(str: String): String
		// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
		trim: function (str) {
			return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
		},

		// @function splitWords(str: String): String[]
		// Trims and splits the string on whitespace and returns the array of parts.
		splitWords: function (str) {
			return L.Util.trim(str).split(/\s+/);
		},

		// @function setOptions(obj: Object, options: Object): Object
		// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
		setOptions: function (obj, options) {
			if (!obj.hasOwnProperty('options')) {
				obj.options = obj.options ? L.Util.create(obj.options) : {};
			}
			for (var i in options) {
				obj.options[i] = options[i];
			}
			return obj.options;
		},

		// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
		// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
		// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
		// be appended at the end. If `uppercase` is `true`, the parameter names will
		// be uppercased (e.g. `'?A=foo&B=bar'`)
		getParamString: function (obj, existingUrl, uppercase) {
			var params = [];
			for (var i in obj) {
				params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
			}
			return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
		},

		// @function template(str: String, data: Object): String
		// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
		// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
		// `('Hello foo, bar')`. You can also specify functions instead of strings for
		// data values — they will be evaluated passing `data` as an argument.
		template: function (str, data) {
			return str.replace(L.Util.templateRe, function (str, key) {
				var value = data[key];

				if (value === undefined) {
					throw new Error('No value provided for variable ' + str);

				} else if (typeof value === 'function') {
					value = value(data);
				}
				return value;
			});
		},

		templateRe: /\{ *([\w_\-]+) *\}/g,

		// @function isArray(obj): Boolean
		// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
		isArray: Array.isArray || function (obj) {
			return (Object.prototype.toString.call(obj) === '[object Array]');
		},

		// @function indexOf(array: Array, el: Object): Number
		// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
		indexOf: function (array, el) {
			for (var i = 0; i < array.length; i++) {
				if (array[i] === el) { return i; }
			}
			return -1;
		},

		// @property emptyImageUrl: String
		// Data URI string containing a base64-encoded empty GIF image.
		// Used as a hack to free memory from unused images on WebKit-powered
		// mobile devices (by setting image `src` to this string).
		emptyImageUrl: 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
	};

	(function () {
		// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

		function getPrefixed(name) {
			return window['webkit' + name] || window['moz' + name] || window['ms' + name];
		}

		var lastTime = 0;

		// fallback for IE 7-8
		function timeoutDefer(fn) {
			var time = +new Date(),
			    timeToCall = Math.max(0, 16 - (time - lastTime));

			lastTime = time + timeToCall;
			return window.setTimeout(fn, timeToCall);
		}

		var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer,
		    cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		               getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };


		// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
		// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
		// `context` if given. When `immediate` is set, `fn` is called immediately if
		// the browser doesn't have native support for
		// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
		// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
		L.Util.requestAnimFrame = function (fn, context, immediate) {
			if (immediate && requestFn === timeoutDefer) {
				fn.call(context);
			} else {
				return requestFn.call(window, L.bind(fn, context));
			}
		};

		// @function cancelAnimFrame(id: Number): undefined
		// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
		L.Util.cancelAnimFrame = function (id) {
			if (id) {
				cancelFn.call(window, id);
			}
		};
	})();

	// shortcuts for most used utility functions
	L.extend = L.Util.extend;
	L.bind = L.Util.bind;
	L.stamp = L.Util.stamp;
	L.setOptions = L.Util.setOptions;




	// @class Class
	// @aka L.Class

	// @section
	// @uninheritable

	// Thanks to John Resig and Dean Edwards for inspiration!

	L.Class = function () {};

	L.Class.extend = function (props) {

		// @function extend(props: Object): Function
		// [Extends the current class](#class-inheritance) given the properties to be included.
		// Returns a Javascript function that is a class constructor (to be called with `new`).
		var NewClass = function () {

			// call the constructor
			if (this.initialize) {
				this.initialize.apply(this, arguments);
			}

			// call all constructor hooks
			this.callInitHooks();
		};

		var parentProto = NewClass.__super__ = this.prototype;

		var proto = L.Util.create(parentProto);
		proto.constructor = NewClass;

		NewClass.prototype = proto;

		// inherit parent's statics
		for (var i in this) {
			if (this.hasOwnProperty(i) && i !== 'prototype') {
				NewClass[i] = this[i];
			}
		}

		// mix static properties into the class
		if (props.statics) {
			L.extend(NewClass, props.statics);
			delete props.statics;
		}

		// mix includes into the prototype
		if (props.includes) {
			L.Util.extend.apply(null, [proto].concat(props.includes));
			delete props.includes;
		}

		// merge options
		if (proto.options) {
			props.options = L.Util.extend(L.Util.create(proto.options), props.options);
		}

		// mix given properties into the prototype
		L.extend(proto, props);

		proto._initHooks = [];

		// add method for calling all hooks
		proto.callInitHooks = function () {

			if (this._initHooksCalled) { return; }

			if (parentProto.callInitHooks) {
				parentProto.callInitHooks.call(this);
			}

			this._initHooksCalled = true;

			for (var i = 0, len = proto._initHooks.length; i < len; i++) {
				proto._initHooks[i].call(this);
			}
		};

		return NewClass;
	};


	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	L.Class.include = function (props) {
		L.extend(this.prototype, props);
		return this;
	};

	// @function mergeOptions(options: Object): this
	// [Merges `options`](#class-options) into the defaults of the class.
	L.Class.mergeOptions = function (options) {
		L.extend(this.prototype.options, options);
		return this;
	};

	// @function addInitHook(fn: Function): this
	// Adds a [constructor hook](#class-constructor-hooks) to the class.
	L.Class.addInitHook = function (fn) { // (Function) || (String, args...)
		var args = Array.prototype.slice.call(arguments, 1);

		var init = typeof fn === 'function' ? fn : function () {
			this[fn].apply(this, args);
		};

		this.prototype._initHooks = this.prototype._initHooks || [];
		this.prototype._initHooks.push(init);
		return this;
	};



	/*
	 * @class Evented
	 * @aka L.Evented
	 * @inherits Class
	 *
	 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
	 *
	 * @example
	 *
	 * ```js
	 * map.on('click', function(e) {
	 * 	alert(e.latlng);
	 * } );
	 * ```
	 *
	 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
	 *
	 * ```js
	 * function onClick(e) { ... }
	 *
	 * map.on('click', onClick);
	 * map.off('click', onClick);
	 * ```
	 */


	L.Evented = L.Class.extend({

		/* @method on(type: String, fn: Function, context?: Object): this
		 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
		 *
		 * @alternative
		 * @method on(eventMap: Object): this
		 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
		 */
		on: function (types, fn, context) {

			// types can be a map of types/handlers
			if (typeof types === 'object') {
				for (var type in types) {
					// we don't process space-separated events here for performance;
					// it's a hot path since Layer uses the on(obj) syntax
					this._on(type, types[type], fn);
				}

			} else {
				// types can be a string of space-separated words
				types = L.Util.splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._on(types[i], fn, context);
				}
			}

			return this;
		},

		/* @method off(type: String, fn?: Function, context?: Object): this
		 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
		 *
		 * @alternative
		 * @method off(eventMap: Object): this
		 * Removes a set of type/listener pairs.
		 *
		 * @alternative
		 * @method off: this
		 * Removes all listeners to all events on the object.
		 */
		off: function (types, fn, context) {

			if (!types) {
				// clear all listeners if called without arguments
				delete this._events;

			} else if (typeof types === 'object') {
				for (var type in types) {
					this._off(type, types[type], fn);
				}

			} else {
				types = L.Util.splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._off(types[i], fn, context);
				}
			}

			return this;
		},

		// attach listener (without syntactic sugar now)
		_on: function (type, fn, context) {
			this._events = this._events || {};

			/* get/init listeners for type */
			var typeListeners = this._events[type];
			if (!typeListeners) {
				typeListeners = [];
				this._events[type] = typeListeners;
			}

			if (context === this) {
				// Less memory footprint.
				context = undefined;
			}
			var newListener = {fn: fn, ctx: context},
			    listeners = typeListeners;

			// check if fn already there
			for (var i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i].fn === fn && listeners[i].ctx === context) {
					return;
				}
			}

			listeners.push(newListener);
			typeListeners.count++;
		},

		_off: function (type, fn, context) {
			var listeners,
			    i,
			    len;

			if (!this._events) { return; }

			listeners = this._events[type];

			if (!listeners) {
				return;
			}

			if (!fn) {
				// Set all removed listeners to noop so they are not called if remove happens in fire
				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn = L.Util.falseFn;
				}
				// clear all listeners for a type if function isn't specified
				delete this._events[type];
				return;
			}

			if (context === this) {
				context = undefined;
			}

			if (listeners) {

				// find fn and remove it
				for (i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					if (l.ctx !== context) { continue; }
					if (l.fn === fn) {

						// set the removed listener to noop so that's not called if remove happens in fire
						l.fn = L.Util.falseFn;

						if (this._firingCount) {
							/* copy array in case events are being fired */
							this._events[type] = listeners = listeners.slice();
						}
						listeners.splice(i, 1);

						return;
					}
				}
			}
		},

		// @method fire(type: String, data?: Object, propagate?: Boolean): this
		// Fires an event of the specified type. You can optionally provide an data
		// object — the first argument of the listener function will contain its
		// properties. The event might can optionally be propagated to event parents.
		fire: function (type, data, propagate) {
			if (!this.listens(type, propagate)) { return this; }

			var event = L.Util.extend({}, data, {type: type, target: this});

			if (this._events) {
				var listeners = this._events[type];

				if (listeners) {
					this._firingCount = (this._firingCount + 1) || 1;
					for (var i = 0, len = listeners.length; i < len; i++) {
						var l = listeners[i];
						l.fn.call(l.ctx || this, event);
					}

					this._firingCount--;
				}
			}

			if (propagate) {
				// propagate the event to parents (set with addEventParent)
				this._propagateEvent(event);
			}

			return this;
		},

		// @method listens(type: String): Boolean
		// Returns `true` if a particular event type has any listeners attached to it.
		listens: function (type, propagate) {
			var listeners = this._events && this._events[type];
			if (listeners && listeners.length) { return true; }

			if (propagate) {
				// also check parents for listeners if event propagates
				for (var id in this._eventParents) {
					if (this._eventParents[id].listens(type, propagate)) { return true; }
				}
			}
			return false;
		},

		// @method once(…): this
		// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
		once: function (types, fn, context) {

			if (typeof types === 'object') {
				for (var type in types) {
					this.once(type, types[type], fn);
				}
				return this;
			}

			var handler = L.bind(function () {
				this
				    .off(types, fn, context)
				    .off(types, handler, context);
			}, this);

			// add a listener that's executed once and removed after that
			return this
			    .on(types, fn, context)
			    .on(types, handler, context);
		},

		// @method addEventParent(obj: Evented): this
		// Adds an event parent - an `Evented` that will receive propagated events
		addEventParent: function (obj) {
			this._eventParents = this._eventParents || {};
			this._eventParents[L.stamp(obj)] = obj;
			return this;
		},

		// @method removeEventParent(obj: Evented): this
		// Removes an event parent, so it will stop receiving propagated events
		removeEventParent: function (obj) {
			if (this._eventParents) {
				delete this._eventParents[L.stamp(obj)];
			}
			return this;
		},

		_propagateEvent: function (e) {
			for (var id in this._eventParents) {
				this._eventParents[id].fire(e.type, L.extend({layer: e.target}, e), true);
			}
		}
	});

	var proto = L.Evented.prototype;

	// aliases; we should ditch those eventually

	// @method addEventListener(…): this
	// Alias to [`on(…)`](#evented-on)
	proto.addEventListener = proto.on;

	// @method removeEventListener(…): this
	// Alias to [`off(…)`](#evented-off)

	// @method clearAllEventListeners(…): this
	// Alias to [`off()`](#evented-off)
	proto.removeEventListener = proto.clearAllEventListeners = proto.off;

	// @method addOneTimeEventListener(…): this
	// Alias to [`once(…)`](#evented-once)
	proto.addOneTimeEventListener = proto.once;

	// @method fireEvent(…): this
	// Alias to [`fire(…)`](#evented-fire)
	proto.fireEvent = proto.fire;

	// @method hasEventListeners(…): Boolean
	// Alias to [`listens(…)`](#evented-listens)
	proto.hasEventListeners = proto.listens;

	L.Mixin = {Events: proto};



	/*
	 * @namespace Browser
	 * @aka L.Browser
	 *
	 * A namespace with static properties for browser/feature detection used by Leaflet internally.
	 *
	 * @example
	 *
	 * ```js
	 * if (L.Browser.ielt9) {
	 *   alert('Upgrade your browser, dude!');
	 * }
	 * ```
	 */

	(function () {

		var ua = navigator.userAgent.toLowerCase(),
		    doc = document.documentElement,

		    ie = 'ActiveXObject' in window,

		    webkit    = ua.indexOf('webkit') !== -1,
		    phantomjs = ua.indexOf('phantom') !== -1,
		    android23 = ua.search('android [23]') !== -1,
		    chrome    = ua.indexOf('chrome') !== -1,
		    gecko     = ua.indexOf('gecko') !== -1  && !webkit && !window.opera && !ie,

		    win = navigator.platform.indexOf('Win') === 0,

		    mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
		    msPointer = !window.PointerEvent && window.MSPointerEvent,
		    pointer = window.PointerEvent || msPointer,

		    ie3d = ie && ('transition' in doc.style),
		    webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
		    gecko3d = 'MozPerspective' in doc.style,
		    opera12 = 'OTransition' in doc.style;


		var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
				(window.DocumentTouch && document instanceof window.DocumentTouch));

		L.Browser = {

			// @property ie: Boolean
			// `true` for all Internet Explorer versions (not Edge).
			ie: ie,

			// @property ielt9: Boolean
			// `true` for Internet Explorer versions less than 9.
			ielt9: ie && !document.addEventListener,

			// @property edge: Boolean
			// `true` for the Edge web browser.
			edge: 'msLaunchUri' in navigator && !('documentMode' in document),

			// @property webkit: Boolean
			// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
			webkit: webkit,

			// @property gecko: Boolean
			// `true` for gecko-based browsers like Firefox.
			gecko: gecko,

			// @property android: Boolean
			// `true` for any browser running on an Android platform.
			android: ua.indexOf('android') !== -1,

			// @property android23: Boolean
			// `true` for browsers running on Android 2 or Android 3.
			android23: android23,

			// @property chrome: Boolean
			// `true` for the Chrome browser.
			chrome: chrome,

			// @property safari: Boolean
			// `true` for the Safari browser.
			safari: !chrome && ua.indexOf('safari') !== -1,


			// @property win: Boolean
			// `true` when the browser is running in a Windows platform
			win: win,


			// @property ie3d: Boolean
			// `true` for all Internet Explorer versions supporting CSS transforms.
			ie3d: ie3d,

			// @property webkit3d: Boolean
			// `true` for webkit-based browsers supporting CSS transforms.
			webkit3d: webkit3d,

			// @property gecko3d: Boolean
			// `true` for gecko-based browsers supporting CSS transforms.
			gecko3d: gecko3d,

			// @property opera12: Boolean
			// `true` for the Opera browser supporting CSS transforms (version 12 or later).
			opera12: opera12,

			// @property any3d: Boolean
			// `true` for all browsers supporting CSS transforms.
			any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs,


			// @property mobile: Boolean
			// `true` for all browsers running in a mobile device.
			mobile: mobile,

			// @property mobileWebkit: Boolean
			// `true` for all webkit-based browsers in a mobile device.
			mobileWebkit: mobile && webkit,

			// @property mobileWebkit3d: Boolean
			// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
			mobileWebkit3d: mobile && webkit3d,

			// @property mobileOpera: Boolean
			// `true` for the Opera browser in a mobile device.
			mobileOpera: mobile && window.opera,

			// @property mobileGecko: Boolean
			// `true` for gecko-based browsers running in a mobile device.
			mobileGecko: mobile && gecko,


			// @property touch: Boolean
			// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
			touch: !!touch,

			// @property msPointer: Boolean
			// `true` for browsers implementing the Microsoft touch events model (notably IE10).
			msPointer: !!msPointer,

			// @property pointer: Boolean
			// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
			pointer: !!pointer,


			// @property retina: Boolean
			// `true` for browsers on a high-resolution "retina" screen.
			retina: (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1
		};

	}());



	/*
	 * @class Point
	 * @aka L.Point
	 *
	 * Represents a point with `x` and `y` coordinates in pixels.
	 *
	 * @example
	 *
	 * ```js
	 * var point = L.point(200, 300);
	 * ```
	 *
	 * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
	 *
	 * ```js
	 * map.panBy([200, 300]);
	 * map.panBy(L.point(200, 300));
	 * ```
	 */

	L.Point = function (x, y, round) {
		this.x = (round ? Math.round(x) : x);
		this.y = (round ? Math.round(y) : y);
	};

	L.Point.prototype = {

		// @method clone(): Point
		// Returns a copy of the current point.
		clone: function () {
			return new L.Point(this.x, this.y);
		},

		// @method add(otherPoint: Point): Point
		// Returns the result of addition of the current and the given points.
		add: function (point) {
			// non-destructive, returns a new point
			return this.clone()._add(L.point(point));
		},

		_add: function (point) {
			// destructive, used directly for performance in situations where it's safe to modify existing point
			this.x += point.x;
			this.y += point.y;
			return this;
		},

		// @method subtract(otherPoint: Point): Point
		// Returns the result of subtraction of the given point from the current.
		subtract: function (point) {
			return this.clone()._subtract(L.point(point));
		},

		_subtract: function (point) {
			this.x -= point.x;
			this.y -= point.y;
			return this;
		},

		// @method divideBy(num: Number): Point
		// Returns the result of division of the current point by the given number.
		divideBy: function (num) {
			return this.clone()._divideBy(num);
		},

		_divideBy: function (num) {
			this.x /= num;
			this.y /= num;
			return this;
		},

		// @method multiplyBy(num: Number): Point
		// Returns the result of multiplication of the current point by the given number.
		multiplyBy: function (num) {
			return this.clone()._multiplyBy(num);
		},

		_multiplyBy: function (num) {
			this.x *= num;
			this.y *= num;
			return this;
		},

		// @method scaleBy(scale: Point): Point
		// Multiply each coordinate of the current point by each coordinate of
		// `scale`. In linear algebra terms, multiply the point by the
		// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
		// defined by `scale`.
		scaleBy: function (point) {
			return new L.Point(this.x * point.x, this.y * point.y);
		},

		// @method unscaleBy(scale: Point): Point
		// Inverse of `scaleBy`. Divide each coordinate of the current point by
		// each coordinate of `scale`.
		unscaleBy: function (point) {
			return new L.Point(this.x / point.x, this.y / point.y);
		},

		// @method round(): Point
		// Returns a copy of the current point with rounded coordinates.
		round: function () {
			return this.clone()._round();
		},

		_round: function () {
			this.x = Math.round(this.x);
			this.y = Math.round(this.y);
			return this;
		},

		// @method floor(): Point
		// Returns a copy of the current point with floored coordinates (rounded down).
		floor: function () {
			return this.clone()._floor();
		},

		_floor: function () {
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);
			return this;
		},

		// @method ceil(): Point
		// Returns a copy of the current point with ceiled coordinates (rounded up).
		ceil: function () {
			return this.clone()._ceil();
		},

		_ceil: function () {
			this.x = Math.ceil(this.x);
			this.y = Math.ceil(this.y);
			return this;
		},

		// @method distanceTo(otherPoint: Point): Number
		// Returns the cartesian distance between the current and the given points.
		distanceTo: function (point) {
			point = L.point(point);

			var x = point.x - this.x,
			    y = point.y - this.y;

			return Math.sqrt(x * x + y * y);
		},

		// @method equals(otherPoint: Point): Boolean
		// Returns `true` if the given point has the same coordinates.
		equals: function (point) {
			point = L.point(point);

			return point.x === this.x &&
			       point.y === this.y;
		},

		// @method contains(otherPoint: Point): Boolean
		// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
		contains: function (point) {
			point = L.point(point);

			return Math.abs(point.x) <= Math.abs(this.x) &&
			       Math.abs(point.y) <= Math.abs(this.y);
		},

		// @method toString(): String
		// Returns a string representation of the point for debugging purposes.
		toString: function () {
			return 'Point(' +
			        L.Util.formatNum(this.x) + ', ' +
			        L.Util.formatNum(this.y) + ')';
		}
	};

	// @factory L.point(x: Number, y: Number, round?: Boolean)
	// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

	// @alternative
	// @factory L.point(coords: Number[])
	// Expects an array of the form `[x, y]` instead.

	// @alternative
	// @factory L.point(coords: Object)
	// Expects a plain object of the form `{x: Number, y: Number}` instead.
	L.point = function (x, y, round) {
		if (x instanceof L.Point) {
			return x;
		}
		if (L.Util.isArray(x)) {
			return new L.Point(x[0], x[1]);
		}
		if (x === undefined || x === null) {
			return x;
		}
		if (typeof x === 'object' && 'x' in x && 'y' in x) {
			return new L.Point(x.x, x.y);
		}
		return new L.Point(x, y, round);
	};



	/*
	 * @class Bounds
	 * @aka L.Bounds
	 *
	 * Represents a rectangular area in pixel coordinates.
	 *
	 * @example
	 *
	 * ```js
	 * var p1 = L.point(10, 10),
	 * p2 = L.point(40, 60),
	 * bounds = L.bounds(p1, p2);
	 * ```
	 *
	 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
	 *
	 * ```js
	 * otherBounds.intersects([[10, 10], [40, 60]]);
	 * ```
	 */

	L.Bounds = function (a, b) {
		if (!a) { return; }

		var points = b ? [a, b] : a;

		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	};

	L.Bounds.prototype = {
		// @method extend(point: Point): this
		// Extends the bounds to contain the given point.
		extend: function (point) { // (Point)
			point = L.point(point);

			// @property min: Point
			// The top left corner of the rectangle.
			// @property max: Point
			// The bottom right corner of the rectangle.
			if (!this.min && !this.max) {
				this.min = point.clone();
				this.max = point.clone();
			} else {
				this.min.x = Math.min(point.x, this.min.x);
				this.max.x = Math.max(point.x, this.max.x);
				this.min.y = Math.min(point.y, this.min.y);
				this.max.y = Math.max(point.y, this.max.y);
			}
			return this;
		},

		// @method getCenter(round?: Boolean): Point
		// Returns the center point of the bounds.
		getCenter: function (round) {
			return new L.Point(
			        (this.min.x + this.max.x) / 2,
			        (this.min.y + this.max.y) / 2, round);
		},

		// @method getBottomLeft(): Point
		// Returns the bottom-left point of the bounds.
		getBottomLeft: function () {
			return new L.Point(this.min.x, this.max.y);
		},

		// @method getTopRight(): Point
		// Returns the top-right point of the bounds.
		getTopRight: function () { // -> Point
			return new L.Point(this.max.x, this.min.y);
		},

		// @method getSize(): Point
		// Returns the size of the given bounds
		getSize: function () {
			return this.max.subtract(this.min);
		},

		// @method contains(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle contains the given one.
		// @alternative
		// @method contains(point: Point): Boolean
		// Returns `true` if the rectangle contains the given point.
		contains: function (obj) {
			var min, max;

			if (typeof obj[0] === 'number' || obj instanceof L.Point) {
				obj = L.point(obj);
			} else {
				obj = L.bounds(obj);
			}

			if (obj instanceof L.Bounds) {
				min = obj.min;
				max = obj.max;
			} else {
				min = max = obj;
			}

			return (min.x >= this.min.x) &&
			       (max.x <= this.max.x) &&
			       (min.y >= this.min.y) &&
			       (max.y <= this.max.y);
		},

		// @method intersects(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle intersects the given bounds. Two bounds
		// intersect if they have at least one point in common.
		intersects: function (bounds) { // (Bounds) -> Boolean
			bounds = L.bounds(bounds);

			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
			    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

			return xIntersects && yIntersects;
		},

		// @method overlaps(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle overlaps the given bounds. Two bounds
		// overlap if their intersection is an area.
		overlaps: function (bounds) { // (Bounds) -> Boolean
			bounds = L.bounds(bounds);

			var min = this.min,
			    max = this.max,
			    min2 = bounds.min,
			    max2 = bounds.max,
			    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
			    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

			return xOverlaps && yOverlaps;
		},

		isValid: function () {
			return !!(this.min && this.max);
		}
	};


	// @factory L.bounds(topLeft: Point, bottomRight: Point)
	// Creates a Bounds object from two coordinates (usually top-left and bottom-right corners).
	// @alternative
	// @factory L.bounds(points: Point[])
	// Creates a Bounds object from the points it contains
	L.bounds = function (a, b) {
		if (!a || a instanceof L.Bounds) {
			return a;
		}
		return new L.Bounds(a, b);
	};



	/*
	 * @class Transformation
	 * @aka L.Transformation
	 *
	 * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
	 * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
	 * the reverse. Used by Leaflet in its projections code.
	 *
	 * @example
	 *
	 * ```js
	 * var transformation = new L.Transformation(2, 5, -1, 10),
	 * 	p = L.point(1, 2),
	 * 	p2 = transformation.transform(p), //  L.point(7, 8)
	 * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
	 * ```
	 */


	// factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
	// Creates a `Transformation` object with the given coefficients.
	L.Transformation = function (a, b, c, d) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	};

	L.Transformation.prototype = {
		// @method transform(point: Point, scale?: Number): Point
		// Returns a transformed point, optionally multiplied by the given scale.
		// Only accepts real `L.Point` instances, not arrays.
		transform: function (point, scale) { // (Point, Number) -> Point
			return this._transform(point.clone(), scale);
		},

		// destructive transform (faster)
		_transform: function (point, scale) {
			scale = scale || 1;
			point.x = scale * (this._a * point.x + this._b);
			point.y = scale * (this._c * point.y + this._d);
			return point;
		},

		// @method untransform(point: Point, scale?: Number): Point
		// Returns the reverse transformation of the given point, optionally divided
		// by the given scale. Only accepts real `L.Point` instances, not arrays.
		untransform: function (point, scale) {
			scale = scale || 1;
			return new L.Point(
			        (point.x / scale - this._b) / this._a,
			        (point.y / scale - this._d) / this._c);
		}
	};



	/*
	 * @namespace DomUtil
	 *
	 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
	 * tree, used by Leaflet internally.
	 *
	 * Most functions expecting or returning a `HTMLElement` also work for
	 * SVG elements. The only difference is that classes refer to CSS classes
	 * in HTML and SVG classes in SVG.
	 */

	L.DomUtil = {

		// @function get(id: String|HTMLElement): HTMLElement
		// Returns an element given its DOM id, or returns the element itself
		// if it was passed directly.
		get: function (id) {
			return typeof id === 'string' ? document.getElementById(id) : id;
		},

		// @function getStyle(el: HTMLElement, styleAttrib: String): String
		// Returns the value for a certain style attribute on an element,
		// including computed values or values set through CSS.
		getStyle: function (el, style) {

			var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
		// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
		create: function (tagName, className, container) {

			var el = document.createElement(tagName);
			el.className = className || '';

			if (container) {
				container.appendChild(el);
			}

			return el;
		},

		// @function remove(el: HTMLElement)
		// Removes `el` from its parent element
		remove: function (el) {
			var parent = el.parentNode;
			if (parent) {
				parent.removeChild(el);
			}
		},

		// @function empty(el: HTMLElement)
		// Removes all of `el`'s children elements from `el`
		empty: function (el) {
			while (el.firstChild) {
				el.removeChild(el.firstChild);
			}
		},

		// @function toFront(el: HTMLElement)
		// Makes `el` the last children of its parent, so it renders in front of the other children.
		toFront: function (el) {
			el.parentNode.appendChild(el);
		},

		// @function toBack(el: HTMLElement)
		// Makes `el` the first children of its parent, so it renders back from the other children.
		toBack: function (el) {
			var parent = el.parentNode;
			parent.insertBefore(el, parent.firstChild);
		},

		// @function hasClass(el: HTMLElement, name: String): Boolean
		// Returns `true` if the element's class attribute contains `name`.
		hasClass: function (el, name) {
			if (el.classList !== undefined) {
				return el.classList.contains(name);
			}
			var className = L.DomUtil.getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},

		// @function addClass(el: HTMLElement, name: String)
		// Adds `name` to the element's class attribute.
		addClass: function (el, name) {
			if (el.classList !== undefined) {
				var classes = L.Util.splitWords(name);
				for (var i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!L.DomUtil.hasClass(el, name)) {
				var className = L.DomUtil.getClass(el);
				L.DomUtil.setClass(el, (className ? className + ' ' : '') + name);
			}
		},

		// @function removeClass(el: HTMLElement, name: String)
		// Removes `name` from the element's class attribute.
		removeClass: function (el, name) {
			if (el.classList !== undefined) {
				el.classList.remove(name);
			} else {
				L.DomUtil.setClass(el, L.Util.trim((' ' + L.DomUtil.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		},

		// @function setClass(el: HTMLElement, name: String)
		// Sets the element's class.
		setClass: function (el, name) {
			if (el.className.baseVal === undefined) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},

		// @function getClass(el: HTMLElement): String
		// Returns the element's class.
		getClass: function (el) {
			return el.className.baseVal === undefined ? el.className : el.className.baseVal;
		},

		// @function setOpacity(el: HTMLElement, opacity: Number)
		// Set the opacity of an element (including old IE support).
		// `opacity` must be a number from `0` to `1`.
		setOpacity: function (el, value) {

			if ('opacity' in el.style) {
				el.style.opacity = value;

			} else if ('filter' in el.style) {
				L.DomUtil._setOpacityIE(el, value);
			}
		},

		_setOpacityIE: function (el, value) {
			var filter = false,
			    filterName = 'DXImageTransform.Microsoft.Alpha';

			// filters collection throws an error if we try to retrieve a filter that doesn't exist
			try {
				filter = el.filters.item(filterName);
			} catch (e) {
				// don't set opacity to 1 if we haven't already set an opacity,
				// it isn't needed and breaks transparent pngs.
				if (value === 1) { return; }
			}

			value = Math.round(value * 100);

			if (filter) {
				filter.Enabled = (value !== 100);
				filter.Opacity = value;
			} else {
				el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
			}
		},

		// @function testProp(props: String[]): String|false
		// Goes through the array of style names and returns the first name
		// that is a valid style name for an element. If no such name is found,
		// it returns false. Useful for vendor-prefixed styles like `transform`.
		testProp: function (props) {

			var style = document.documentElement.style;

			for (var i = 0; i < props.length; i++) {
				if (props[i] in style) {
					return props[i];
				}
			}
			return false;
		},

		// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
		// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
		// and optionally scaled by `scale`. Does not have an effect if the
		// browser doesn't support 3D CSS transforms.
		setTransform: function (el, offset, scale) {
			var pos = offset || new L.Point(0, 0);

			el.style[L.DomUtil.TRANSFORM] =
				(L.Browser.ie3d ?
					'translate(' + pos.x + 'px,' + pos.y + 'px)' :
					'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
				(scale ? ' scale(' + scale + ')' : '');
		},

		// @function setPosition(el: HTMLElement, position: Point)
		// Sets the position of `el` to coordinates specified by `position`,
		// using CSS translate or top/left positioning depending on the browser
		// (used by Leaflet internally to position its layers).
		setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])

			/*eslint-disable */
			el._leaflet_pos = point;
			/*eslint-enable */

			if (L.Browser.any3d) {
				L.DomUtil.setTransform(el, point);
			} else {
				el.style.left = point.x + 'px';
				el.style.top = point.y + 'px';
			}
		},

		// @function getPosition(el: HTMLElement): Point
		// Returns the coordinates of an element previously positioned with setPosition.
		getPosition: function (el) {
			// this method is only used for elements previously positioned using setPosition,
			// so it's safe to cache the position for performance

			return el._leaflet_pos || new L.Point(0, 0);
		}
	};


	(function () {
		// prefix style property names

		// @property TRANSFORM: String
		// Vendor-prefixed fransform style name (e.g. `'webkitTransform'` for WebKit).
		L.DomUtil.TRANSFORM = L.DomUtil.testProp(
				['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);


		// webkitTransition comes first because some browser versions that drop vendor prefix don't do
		// the same for the transitionend event, in particular the Android 4.1 stock browser

		// @property TRANSITION: String
		// Vendor-prefixed transform style name.
		var transition = L.DomUtil.TRANSITION = L.DomUtil.testProp(
				['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

		L.DomUtil.TRANSITION_END =
				transition === 'webkitTransition' || transition === 'OTransition' ? transition + 'End' : 'transitionend';

		// @function disableTextSelection()
		// Prevents the user from generating `selectstart` DOM events, usually generated
		// when the user drags the mouse through a page with text. Used internally
		// by Leaflet to override the behaviour of any click-and-drag interaction on
		// the map. Affects drag interactions on the whole document.

		// @function enableTextSelection()
		// Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
		if ('onselectstart' in document) {
			L.DomUtil.disableTextSelection = function () {
				L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
			};
			L.DomUtil.enableTextSelection = function () {
				L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
			};

		} else {
			var userSelectProperty = L.DomUtil.testProp(
				['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

			L.DomUtil.disableTextSelection = function () {
				if (userSelectProperty) {
					var style = document.documentElement.style;
					this._userSelect = style[userSelectProperty];
					style[userSelectProperty] = 'none';
				}
			};
			L.DomUtil.enableTextSelection = function () {
				if (userSelectProperty) {
					document.documentElement.style[userSelectProperty] = this._userSelect;
					delete this._userSelect;
				}
			};
		}

		// @function disableImageDrag()
		// As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
		// for `dragstart` DOM events, usually generated when the user drags an image.
		L.DomUtil.disableImageDrag = function () {
			L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
		};

		// @function enableImageDrag()
		// Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
		L.DomUtil.enableImageDrag = function () {
			L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
		};

		// @function preventOutline(el: HTMLElement)
		// Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
		// of the element `el` invisible. Used internally by Leaflet to prevent
		// focusable elements from displaying an outline when the user performs a
		// drag interaction on them.
		L.DomUtil.preventOutline = function (element) {
			while (element.tabIndex === -1) {
				element = element.parentNode;
			}
			if (!element || !element.style) { return; }
			L.DomUtil.restoreOutline();
			this._outlineElement = element;
			this._outlineStyle = element.style.outline;
			element.style.outline = 'none';
			L.DomEvent.on(window, 'keydown', L.DomUtil.restoreOutline, this);
		};

		// @function restoreOutline()
		// Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
		L.DomUtil.restoreOutline = function () {
			if (!this._outlineElement) { return; }
			this._outlineElement.style.outline = this._outlineStyle;
			delete this._outlineElement;
			delete this._outlineStyle;
			L.DomEvent.off(window, 'keydown', L.DomUtil.restoreOutline, this);
		};
	})();



	/* @class LatLng
	 * @aka L.LatLng
	 *
	 * Represents a geographical point with a certain latitude and longitude.
	 *
	 * @example
	 *
	 * ```
	 * var latlng = L.latLng(50.5, 30.5);
	 * ```
	 *
	 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
	 *
	 * ```
	 * map.panTo([50, 30]);
	 * map.panTo({lon: 30, lat: 50});
	 * map.panTo({lat: 50, lng: 30});
	 * map.panTo(L.latLng(50, 30));
	 * ```
	 */

	L.LatLng = function (lat, lng, alt) {
		if (isNaN(lat) || isNaN(lng)) {
			throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
		}

		// @property lat: Number
		// Latitude in degrees
		this.lat = +lat;

		// @property lng: Number
		// Longitude in degrees
		this.lng = +lng;

		// @property alt: Number
		// Altitude in meters (optional)
		if (alt !== undefined) {
			this.alt = +alt;
		}
	};

	L.LatLng.prototype = {
		// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
		// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overriden by setting `maxMargin` to a small number.
		equals: function (obj, maxMargin) {
			if (!obj) { return false; }

			obj = L.latLng(obj);

			var margin = Math.max(
			        Math.abs(this.lat - obj.lat),
			        Math.abs(this.lng - obj.lng));

			return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
		},

		// @method toString(): String
		// Returns a string representation of the point (for debugging purposes).
		toString: function (precision) {
			return 'LatLng(' +
			        L.Util.formatNum(this.lat, precision) + ', ' +
			        L.Util.formatNum(this.lng, precision) + ')';
		},

		// @method distanceTo(otherLatLng: LatLng): Number
		// Returns the distance (in meters) to the given `LatLng` calculated using the [Haversine formula](http://en.wikipedia.org/wiki/Haversine_formula).
		distanceTo: function (other) {
			return L.CRS.Earth.distance(this, L.latLng(other));
		},

		// @method wrap(): LatLng
		// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
		wrap: function () {
			return L.CRS.Earth.wrapLatLng(this);
		},

		// @method toBounds(sizeInMeters: Number): LatLngBounds
		// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters` meters apart from the `LatLng`.
		toBounds: function (sizeInMeters) {
			var latAccuracy = 180 * sizeInMeters / 40075017,
			    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

			return L.latLngBounds(
			        [this.lat - latAccuracy, this.lng - lngAccuracy],
			        [this.lat + latAccuracy, this.lng + lngAccuracy]);
		},

		clone: function () {
			return new L.LatLng(this.lat, this.lng, this.alt);
		}
	};



	// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
	// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

	// @alternative
	// @factory L.latLng(coords: Array): LatLng
	// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

	// @alternative
	// @factory L.latLng(coords: Object): LatLng
	// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

	L.latLng = function (a, b, c) {
		if (a instanceof L.LatLng) {
			return a;
		}
		if (L.Util.isArray(a) && typeof a[0] !== 'object') {
			if (a.length === 3) {
				return new L.LatLng(a[0], a[1], a[2]);
			}
			if (a.length === 2) {
				return new L.LatLng(a[0], a[1]);
			}
			return null;
		}
		if (a === undefined || a === null) {
			return a;
		}
		if (typeof a === 'object' && 'lat' in a) {
			return new L.LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
		}
		if (b === undefined) {
			return null;
		}
		return new L.LatLng(a, b, c);
	};



	/*
	 * @class LatLngBounds
	 * @aka L.LatLngBounds
	 *
	 * Represents a rectangular geographical area on a map.
	 *
	 * @example
	 *
	 * ```js
	 * var southWest = L.latLng(40.712, -74.227),
	 * northEast = L.latLng(40.774, -74.125),
	 * bounds = L.latLngBounds(southWest, northEast);
	 * ```
	 *
	 * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
	 *
	 * ```js
	 * map.fitBounds([
	 * 	[40.712, -74.227],
	 * 	[40.774, -74.125]
	 * ]);
	 * ```
	 */

	L.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
		if (!southWest) { return; }

		var latlngs = northEast ? [southWest, northEast] : southWest;

		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	};

	L.LatLngBounds.prototype = {

		// @method extend(latlng: LatLng): this
		// Extend the bounds to contain the given point

		// @alternative
		// @method extend(otherBounds: LatLngBounds): this
		// Extend the bounds to contain the given bounds
		extend: function (obj) {
			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;

			if (obj instanceof L.LatLng) {
				sw2 = obj;
				ne2 = obj;

			} else if (obj instanceof L.LatLngBounds) {
				sw2 = obj._southWest;
				ne2 = obj._northEast;

				if (!sw2 || !ne2) { return this; }

			} else {
				return obj ? this.extend(L.latLng(obj) || L.latLngBounds(obj)) : this;
			}

			if (!sw && !ne) {
				this._southWest = new L.LatLng(sw2.lat, sw2.lng);
				this._northEast = new L.LatLng(ne2.lat, ne2.lng);
			} else {
				sw.lat = Math.min(sw2.lat, sw.lat);
				sw.lng = Math.min(sw2.lng, sw.lng);
				ne.lat = Math.max(ne2.lat, ne.lat);
				ne.lng = Math.max(ne2.lng, ne.lng);
			}

			return this;
		},

		// @method pad(bufferRatio: Number): LatLngBounds
		// Returns bigger bounds created by extending the current bounds by a given percentage in each direction.
		pad: function (bufferRatio) {
			var sw = this._southWest,
			    ne = this._northEast,
			    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
			    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

			return new L.LatLngBounds(
			        new L.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
			        new L.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
		},

		// @method getCenter(): LatLng
		// Returns the center point of the bounds.
		getCenter: function () {
			return new L.LatLng(
			        (this._southWest.lat + this._northEast.lat) / 2,
			        (this._southWest.lng + this._northEast.lng) / 2);
		},

		// @method getSouthWest(): LatLng
		// Returns the south-west point of the bounds.
		getSouthWest: function () {
			return this._southWest;
		},

		// @method getNorthEast(): LatLng
		// Returns the north-east point of the bounds.
		getNorthEast: function () {
			return this._northEast;
		},

		// @method getNorthWest(): LatLng
		// Returns the north-west point of the bounds.
		getNorthWest: function () {
			return new L.LatLng(this.getNorth(), this.getWest());
		},

		// @method getSouthEast(): LatLng
		// Returns the south-east point of the bounds.
		getSouthEast: function () {
			return new L.LatLng(this.getSouth(), this.getEast());
		},

		// @method getWest(): Number
		// Returns the west longitude of the bounds
		getWest: function () {
			return this._southWest.lng;
		},

		// @method getSouth(): Number
		// Returns the south latitude of the bounds
		getSouth: function () {
			return this._southWest.lat;
		},

		// @method getEast(): Number
		// Returns the east longitude of the bounds
		getEast: function () {
			return this._northEast.lng;
		},

		// @method getNorth(): Number
		// Returns the north latitude of the bounds
		getNorth: function () {
			return this._northEast.lat;
		},

		// @method contains(otherBounds: LatLngBounds): Boolean
		// Returns `true` if the rectangle contains the given one.

		// @alternative
		// @method contains (latlng: LatLng): Boolean
		// Returns `true` if the rectangle contains the given point.
		contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
			if (typeof obj[0] === 'number' || obj instanceof L.LatLng) {
				obj = L.latLng(obj);
			} else {
				obj = L.latLngBounds(obj);
			}

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2, ne2;

			if (obj instanceof L.LatLngBounds) {
				sw2 = obj.getSouthWest();
				ne2 = obj.getNorthEast();
			} else {
				sw2 = ne2 = obj;
			}

			return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
			       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
		},

		// @method intersects(otherBounds: LatLngBounds): Boolean
		// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
		intersects: function (bounds) {
			bounds = L.latLngBounds(bounds);

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),

			    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
			    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

			return latIntersects && lngIntersects;
		},

		// @method overlaps(otherBounds: Bounds): Boolean
		// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
		overlaps: function (bounds) {
			bounds = L.latLngBounds(bounds);

			var sw = this._southWest,
			    ne = this._northEast,
			    sw2 = bounds.getSouthWest(),
			    ne2 = bounds.getNorthEast(),

			    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
			    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

			return latOverlaps && lngOverlaps;
		},

		// @method toBBoxString(): String
		// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
		toBBoxString: function () {
			return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
		},

		// @method equals(otherBounds: LatLngBounds): Boolean
		// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds.
		equals: function (bounds) {
			if (!bounds) { return false; }

			bounds = L.latLngBounds(bounds);

			return this._southWest.equals(bounds.getSouthWest()) &&
			       this._northEast.equals(bounds.getNorthEast());
		},

		// @method isValid(): Boolean
		// Returns `true` if the bounds are properly initialized.
		isValid: function () {
			return !!(this._southWest && this._northEast);
		}
	};

	// TODO International date line?

	// @factory L.latLngBounds(southWest: LatLng, northEast: LatLng)
	// Creates a `LatLngBounds` object by defining south-west and north-east corners of the rectangle.

	// @alternative
	// @factory L.latLngBounds(latlngs: LatLng[])
	// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
	L.latLngBounds = function (a, b) {
		if (a instanceof L.LatLngBounds) {
			return a;
		}
		return new L.LatLngBounds(a, b);
	};



	/*
	 * @namespace Projection
	 * @section
	 * Leaflet comes with a set of already defined Projections out of the box:
	 *
	 * @projection L.Projection.LonLat
	 *
	 * Equirectangular, or Plate Carree projection — the most simple projection,
	 * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
	 * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
	 * `EPSG:3395` and `Simple` CRS.
	 */

	L.Projection = {};

	L.Projection.LonLat = {
		project: function (latlng) {
			return new L.Point(latlng.lng, latlng.lat);
		},

		unproject: function (point) {
			return new L.LatLng(point.y, point.x);
		},

		bounds: L.bounds([-180, -90], [180, 90])
	};



	/*
	 * @namespace Projection
	 * @projection L.Projection.SphericalMercator
	 *
	 * Spherical Mercator projection — the most common projection for online maps,
	 * used by almost all free and commercial tile providers. Assumes that Earth is
	 * a sphere. Used by the `EPSG:3857` CRS.
	 */

	L.Projection.SphericalMercator = {

		R: 6378137,
		MAX_LATITUDE: 85.0511287798,

		project: function (latlng) {
			var d = Math.PI / 180,
			    max = this.MAX_LATITUDE,
			    lat = Math.max(Math.min(max, latlng.lat), -max),
			    sin = Math.sin(lat * d);

			return new L.Point(
					this.R * latlng.lng * d,
					this.R * Math.log((1 + sin) / (1 - sin)) / 2);
		},

		unproject: function (point) {
			var d = 180 / Math.PI;

			return new L.LatLng(
				(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
				point.x * d / this.R);
		},

		bounds: (function () {
			var d = 6378137 * Math.PI;
			return L.bounds([-d, -d], [d, d]);
		})()
	};



	/*
	 * @class CRS
	 * @aka L.CRS
	 * Abstract class that defines coordinate reference systems for projecting
	 * geographical points into pixel (screen) coordinates and back (and to
	 * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
	 * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
	 *
	 * Leaflet defines the most usual CRSs by default. If you want to use a
	 * CRS not defined by default, take a look at the
	 * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
	 */

	L.CRS = {
		// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
		// Projects geographical coordinates into pixel coordinates for a given zoom.
		latLngToPoint: function (latlng, zoom) {
			var projectedPoint = this.projection.project(latlng),
			    scale = this.scale(zoom);

			return this.transformation._transform(projectedPoint, scale);
		},

		// @method pointToLatLng(point: Point, zoom: Number): LatLng
		// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
		// zoom into geographical coordinates.
		pointToLatLng: function (point, zoom) {
			var scale = this.scale(zoom),
			    untransformedPoint = this.transformation.untransform(point, scale);

			return this.projection.unproject(untransformedPoint);
		},

		// @method project(latlng: LatLng): Point
		// Projects geographical coordinates into coordinates in units accepted for
		// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
		project: function (latlng) {
			return this.projection.project(latlng);
		},

		// @method unproject(point: Point): LatLng
		// Given a projected coordinate returns the corresponding LatLng.
		// The inverse of `project`.
		unproject: function (point) {
			return this.projection.unproject(point);
		},

		// @method scale(zoom: Number): Number
		// Returns the scale used when transforming projected coordinates into
		// pixel coordinates for a particular zoom. For example, it returns
		// `256 * 2^zoom` for Mercator-based CRS.
		scale: function (zoom) {
			return 256 * Math.pow(2, zoom);
		},

		// @method zoom(scale: Number): Number
		// Inverse of `scale()`, returns the zoom level corresponding to a scale
		// factor of `scale`.
		zoom: function (scale) {
			return Math.log(scale / 256) / Math.LN2;
		},

		// @method getProjectedBounds(zoom: Number): Bounds
		// Returns the projection's bounds scaled and transformed for the provided `zoom`.
		getProjectedBounds: function (zoom) {
			if (this.infinite) { return null; }

			var b = this.projection.bounds,
			    s = this.scale(zoom),
			    min = this.transformation.transform(b.min, s),
			    max = this.transformation.transform(b.max, s);

			return L.bounds(min, max);
		},

		// @method distance(latlng1: LatLng, latlng2: LatLng): Number
		// Returns the distance between two geographical coordinates.

		// @property code: String
		// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
		//
		// @property wrapLng: Number[]
		// An array of two numbers defining whether the longitude (horizontal) coordinate
		// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
		// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
		//
		// @property wrapLat: Number[]
		// Like `wrapLng`, but for the latitude (vertical) axis.

		// wrapLng: [min, max],
		// wrapLat: [min, max],

		// @property infinite: Boolean
		// If true, the coordinate space will be unbounded (infinite in both axes)
		infinite: false,

		// @method wrapLatLng(latlng: LatLng): LatLng
		// Returns a `LatLng` where lat and lng has been wrapped according to the
		// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
		wrapLatLng: function (latlng) {
			var lng = this.wrapLng ? L.Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
			    lat = this.wrapLat ? L.Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
			    alt = latlng.alt;

			return L.latLng(lat, lng, alt);
		}
	};



	/*
	 * @namespace CRS
	 * @crs L.CRS.Simple
	 *
	 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
	 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
	 * axis should still be inverted (going from bottom to top). `distance()` returns
	 * simple euclidean distance.
	 */

	L.CRS.Simple = L.extend({}, L.CRS, {
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1, 0, -1, 0),

		scale: function (zoom) {
			return Math.pow(2, zoom);
		},

		zoom: function (scale) {
			return Math.log(scale) / Math.LN2;
		},

		distance: function (latlng1, latlng2) {
			var dx = latlng2.lng - latlng1.lng,
			    dy = latlng2.lat - latlng1.lat;

			return Math.sqrt(dx * dx + dy * dy);
		},

		infinite: true
	});



	/*
	 * @namespace CRS
	 * @crs L.CRS.Earth
	 *
	 * Serves as the base for CRS that are global such that they cover the earth.
	 * Can only be used as the base for other CRS and cannot be used directly,
	 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
	 * meters.
	 */

	L.CRS.Earth = L.extend({}, L.CRS, {
		wrapLng: [-180, 180],

		// Mean Earth Radius, as recommended for use by
		// the International Union of Geodesy and Geophysics,
		// see http://rosettacode.org/wiki/Haversine_formula
		R: 6371000,

		// distance between two geographical points using spherical law of cosines approximation
		distance: function (latlng1, latlng2) {
			var rad = Math.PI / 180,
			    lat1 = latlng1.lat * rad,
			    lat2 = latlng2.lat * rad,
			    a = Math.sin(lat1) * Math.sin(lat2) +
			        Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

			return this.R * Math.acos(Math.min(a, 1));
		}
	});



	/*
	 * @namespace CRS
	 * @crs L.CRS.EPSG3857
	 *
	 * The most common CRS for online maps, used by almost all free and commercial
	 * tile providers. Uses Spherical Mercator projection. Set in by default in
	 * Map's `crs` option.
	 */

	L.CRS.EPSG3857 = L.extend({}, L.CRS.Earth, {
		code: 'EPSG:3857',
		projection: L.Projection.SphericalMercator,

		transformation: (function () {
			var scale = 0.5 / (Math.PI * L.Projection.SphericalMercator.R);
			return new L.Transformation(scale, 0.5, -scale, 0.5);
		}())
	});

	L.CRS.EPSG900913 = L.extend({}, L.CRS.EPSG3857, {
		code: 'EPSG:900913'
	});



	/*
	 * @namespace CRS
	 * @crs L.CRS.EPSG4326
	 *
	 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
	 */

	L.CRS.EPSG4326 = L.extend({}, L.CRS.Earth, {
		code: 'EPSG:4326',
		projection: L.Projection.LonLat,
		transformation: new L.Transformation(1 / 180, 1, -1 / 180, 0.5)
	});



	/*
	 * @class Map
	 * @aka L.Map
	 * @inherits Evented
	 *
	 * The central class of the API — it is used to create a map on a page and manipulate it.
	 *
	 * @example
	 *
	 * ```js
	 * // initialize the map on the "map" div with a given center and zoom
	 * var map = L.map('map', {
	 * 	center: [51.505, -0.09],
	 * 	zoom: 13
	 * });
	 * ```
	 *
	 */

	L.Map = L.Evented.extend({

		options: {
			// @section Map State Options
			// @option crs: CRS = L.CRS.EPSG3857
			// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
			// sure what it means.
			crs: L.CRS.EPSG3857,

			// @option center: LatLng = undefined
			// Initial geographic center of the map
			center: undefined,

			// @option zoom: Number = undefined
			// Initial map zoom level
			zoom: undefined,

			// @option minZoom: Number = undefined
			// Minimum zoom level of the map. Overrides any `minZoom` option set on map layers.
			minZoom: undefined,

			// @option maxZoom: Number = undefined
			// Maximum zoom level of the map. Overrides any `maxZoom` option set on map layers.
			maxZoom: undefined,

			// @option layers: Layer[] = []
			// Array of layers that will be added to the map initially
			layers: [],

			// @option maxBounds: LatLngBounds = null
			// When this option is set, the map restricts the view to the given
			// geographical bounds, bouncing the user back when he tries to pan
			// outside the view. To set the restriction dynamically, use
			// [`setMaxBounds`](#map-setmaxbounds) method.
			maxBounds: undefined,

			// @option renderer: Renderer = *
			// The default method for drawing vector layers on the map. `L.SVG`
			// or `L.Canvas` by default depending on browser support.
			renderer: undefined,


			// @section Animation Options
			// @option fadeAnimation: Boolean = true
			// Whether the tile fade animation is enabled. By default it's enabled
			// in all browsers that support CSS3 Transitions except Android.
			fadeAnimation: true,

			// @option markerZoomAnimation: Boolean = true
			// Whether markers animate their zoom with the zoom animation, if disabled
			// they will disappear for the length of the animation. By default it's
			// enabled in all browsers that support CSS3 Transitions except Android.
			markerZoomAnimation: true,

			// @option transform3DLimit: Number = 2^23
			// Defines the maximum size of a CSS translation transform. The default
			// value should not be changed unless a web browser positions layers in
			// the wrong place after doing a large `panBy`.
			transform3DLimit: 8388608, // Precision limit of a 32-bit float

			// @section Interaction Options
			// @option zoomSnap: Number = 1
			// Forces the map's zoom level to always be a multiple of this, particularly
			// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
			// By default, the zoom level snaps to the nearest integer; lower values
			// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
			// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
			zoomSnap: 1,

			// @option zoomDelta: Number = 1
			// Controls how much the map's zoom level will change after a
			// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
			// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
			// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
			zoomDelta: 1,

			// @option trackResize: Boolean = true
			// Whether the map automatically handles browser window resize to update itself.
			trackResize: true
		},

		initialize: function (id, options) { // (HTMLElement or String, Object)
			options = L.setOptions(this, options);

			this._initContainer(id);
			this._initLayout();

			// hack for https://github.com/Leaflet/Leaflet/issues/1980
			this._onResize = L.bind(this._onResize, this);

			this._initEvents();

			if (options.maxBounds) {
				this.setMaxBounds(options.maxBounds);
			}

			if (options.zoom !== undefined) {
				this._zoom = this._limitZoom(options.zoom);
			}

			if (options.center && options.zoom !== undefined) {
				this.setView(L.latLng(options.center), options.zoom, {reset: true});
			}

			this._handlers = [];
			this._layers = {};
			this._zoomBoundLayers = {};
			this._sizeChanged = true;

			this.callInitHooks();

			this._addLayers(this.options.layers);
		},


		// @section Methods for modifying map state

		// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
		// Sets the view of the map (geographical center and zoom) with the given
		// animation options.
		setView: function (center, zoom) {
			// replaced by animation-powered implementation in Map.PanAnimation.js
			zoom = zoom === undefined ? this.getZoom() : zoom;
			this._resetView(L.latLng(center), zoom);
			return this;
		},

		// @method setZoom(zoom: Number, options: Zoom/pan options): this
		// Sets the zoom of the map.
		setZoom: function (zoom, options) {
			if (!this._loaded) {
				this._zoom = zoom;
				return this;
			}
			return this.setView(this.getCenter(), zoom, {zoom: options});
		},

		// @method zoomIn(delta?: Number, options?: Zoom options): this
		// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
		zoomIn: function (delta, options) {
			delta = delta || (L.Browser.any3d ? this.options.zoomDelta : 1);
			return this.setZoom(this._zoom + delta, options);
		},

		// @method zoomOut(delta?: Number, options?: Zoom options): this
		// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
		zoomOut: function (delta, options) {
			delta = delta || (L.Browser.any3d ? this.options.zoomDelta : 1);
			return this.setZoom(this._zoom - delta, options);
		},

		// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
		// Zooms the map while keeping a specified geographical point on the map
		// stationary (e.g. used internally for scroll zoom and double-click zoom).
		// @alternative
		// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
		// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
		setZoomAround: function (latlng, zoom, options) {
			var scale = this.getZoomScale(zoom),
			    viewHalf = this.getSize().divideBy(2),
			    containerPoint = latlng instanceof L.Point ? latlng : this.latLngToContainerPoint(latlng),

			    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
			    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

			return this.setView(newCenter, zoom, {zoom: options});
		},

		_getBoundsCenterZoom: function (bounds, options) {

			options = options || {};
			bounds = bounds.getBounds ? bounds.getBounds() : L.latLngBounds(bounds);

			var paddingTL = L.point(options.paddingTopLeft || options.padding || [0, 0]),
			    paddingBR = L.point(options.paddingBottomRight || options.padding || [0, 0]),

			    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

			zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

			var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

			    swPoint = this.project(bounds.getSouthWest(), zoom),
			    nePoint = this.project(bounds.getNorthEast(), zoom),
			    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

			return {
				center: center,
				zoom: zoom
			};
		},

		// @method fitBounds(bounds: LatLngBounds, options: fitBounds options): this
		// Sets a map view that contains the given geographical bounds with the
		// maximum zoom level possible.
		fitBounds: function (bounds, options) {

			bounds = L.latLngBounds(bounds);

			if (!bounds.isValid()) {
				throw new Error('Bounds are not valid.');
			}

			var target = this._getBoundsCenterZoom(bounds, options);
			return this.setView(target.center, target.zoom, options);
		},

		// @method fitWorld(options?: fitBounds options): this
		// Sets a map view that mostly contains the whole world with the maximum
		// zoom level possible.
		fitWorld: function (options) {
			return this.fitBounds([[-90, -180], [90, 180]], options);
		},

		// @method panTo(latlng: LatLng, options?: Pan options): this
		// Pans the map to a given center.
		panTo: function (center, options) { // (LatLng)
			return this.setView(center, this._zoom, {pan: options});
		},

		// @method panBy(offset: Point): this
		// Pans the map by a given number of pixels (animated).
		panBy: function (offset) { // (Point)
			// replaced with animated panBy in Map.PanAnimation.js
			this.fire('movestart');

			this._rawPanBy(L.point(offset));

			this.fire('move');
			return this.fire('moveend');
		},

		// @method setMaxBounds(bounds: Bounds): this
		// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
		setMaxBounds: function (bounds) {
			bounds = L.latLngBounds(bounds);

			if (!bounds.isValid()) {
				this.options.maxBounds = null;
				return this.off('moveend', this._panInsideMaxBounds);
			} else if (this.options.maxBounds) {
				this.off('moveend', this._panInsideMaxBounds);
			}

			this.options.maxBounds = bounds;

			if (this._loaded) {
				this._panInsideMaxBounds();
			}

			return this.on('moveend', this._panInsideMaxBounds);
		},

		// @method setMinZoom(zoom: Number): this
		// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
		setMinZoom: function (zoom) {
			this.options.minZoom = zoom;

			if (this._loaded && this.getZoom() < this.options.minZoom) {
				return this.setZoom(zoom);
			}

			return this;
		},

		// @method setMaxZoom(zoom: Number): this
		// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
		setMaxZoom: function (zoom) {
			this.options.maxZoom = zoom;

			if (this._loaded && (this.getZoom() > this.options.maxZoom)) {
				return this.setZoom(zoom);
			}

			return this;
		},

		// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
		// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
		panInsideBounds: function (bounds, options) {
			this._enforcingBounds = true;
			var center = this.getCenter(),
			    newCenter = this._limitCenter(center, this._zoom, L.latLngBounds(bounds));

			if (!center.equals(newCenter)) {
				this.panTo(newCenter, options);
			}

			this._enforcingBounds = false;
			return this;
		},

		// @method invalidateSize(options: Zoom/Pan options): this
		// Checks if the map container size changed and updates the map if so —
		// call it after you've changed the map size dynamically, also animating
		// pan by default. If `options.pan` is `false`, panning will not occur.
		// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
		// that it doesn't happen often even if the method is called many
		// times in a row.

		// @alternative
		// @method invalidateSize(animate: Boolean): this
		// Checks if the map container size changed and updates the map if so —
		// call it after you've changed the map size dynamically, also animating
		// pan by default.
		invalidateSize: function (options) {
			if (!this._loaded) { return this; }

			options = L.extend({
				animate: false,
				pan: true
			}, options === true ? {animate: true} : options);

			var oldSize = this.getSize();
			this._sizeChanged = true;
			this._lastCenter = null;

			var newSize = this.getSize(),
			    oldCenter = oldSize.divideBy(2).round(),
			    newCenter = newSize.divideBy(2).round(),
			    offset = oldCenter.subtract(newCenter);

			if (!offset.x && !offset.y) { return this; }

			if (options.animate && options.pan) {
				this.panBy(offset);

			} else {
				if (options.pan) {
					this._rawPanBy(offset);
				}

				this.fire('move');

				if (options.debounceMoveend) {
					clearTimeout(this._sizeTimer);
					this._sizeTimer = setTimeout(L.bind(this.fire, this, 'moveend'), 200);
				} else {
					this.fire('moveend');
				}
			}

			// @section Map state change events
			// @event resize: ResizeEvent
			// Fired when the map is resized.
			return this.fire('resize', {
				oldSize: oldSize,
				newSize: newSize
			});
		},

		// @section Methods for modifying map state
		// @method stop(): this
		// Stops the currently running `panTo` or `flyTo` animation, if any.
		stop: function () {
			this.setZoom(this._limitZoom(this._zoom));
			if (!this.options.zoomSnap) {
				this.fire('viewreset');
			}
			return this._stop();
		},


		// TODO handler.addTo
		// TODO Appropiate docs section?
		// @section Other Methods
		// @method addHandler(name: String, HandlerClass: Function): this
		// Adds a new `Handler` to the map, given its name and constructor function.
		addHandler: function (name, HandlerClass) {
			if (!HandlerClass) { return this; }

			var handler = this[name] = new HandlerClass(this);

			this._handlers.push(handler);

			if (this.options[name]) {
				handler.enable();
			}

			return this;
		},

		// @method remove(): this
		// Destroys the map and clears all related event listeners.
		remove: function () {

			this._initEvents(true);

			if (this._containerId !== this._container._leaflet_id) {
				throw new Error('Map container is being reused by another instance');
			}

			try {
				// throws error in IE6-8
				delete this._container._leaflet_id;
				delete this._containerId;
			} catch (e) {
				/*eslint-disable */
				this._container._leaflet_id = undefined;
				/*eslint-enable */
				this._containerId = undefined;
			}

			L.DomUtil.remove(this._mapPane);

			if (this._clearControlPos) {
				this._clearControlPos();
			}

			this._clearHandlers();

			if (this._loaded) {
				// @section Map state change events
				// @event unload: Event
				// Fired when the map is destroyed with [remove](#map-remove) method.
				this.fire('unload');
			}

			for (var i in this._layers) {
				this._layers[i].remove();
			}

			return this;
		},

		// @section Other Methods
		// @method createPane(name: String, container?: HTMLElement): HTMLElement
		// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
		// then returns it. The pane is created as a children of `container`, or
		// as a children of the main map pane if not set.
		createPane: function (name, container) {
			var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
			    pane = L.DomUtil.create('div', className, container || this._mapPane);

			if (name) {
				this._panes[name] = pane;
			}
			return pane;
		},

		// @section Methods for Getting Map State

		// @method getCenter(): LatLng
		// Returns the geographical center of the map view
		getCenter: function () {
			this._checkIfLoaded();

			if (this._lastCenter && !this._moved()) {
				return this._lastCenter;
			}
			return this.layerPointToLatLng(this._getCenterLayerPoint());
		},

		// @method getZoom(): Number
		// Returns the current zoom level of the map view
		getZoom: function () {
			return this._zoom;
		},

		// @method getBounds(): LatLngBounds
		// Returns the geographical bounds visible in the current map view
		getBounds: function () {
			var bounds = this.getPixelBounds(),
			    sw = this.unproject(bounds.getBottomLeft()),
			    ne = this.unproject(bounds.getTopRight());

			return new L.LatLngBounds(sw, ne);
		},

		// @method getMinZoom(): Number
		// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
		getMinZoom: function () {
			return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
		},

		// @method getMaxZoom(): Number
		// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
		getMaxZoom: function () {
			return this.options.maxZoom === undefined ?
				(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
				this.options.maxZoom;
		},

		// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean): Number
		// Returns the maximum zoom level on which the given bounds fit to the map
		// view in its entirety. If `inside` (optional) is set to `true`, the method
		// instead returns the minimum zoom level on which the map view fits into
		// the given bounds in its entirety.
		getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
			bounds = L.latLngBounds(bounds);
			padding = L.point(padding || [0, 0]);

			var zoom = this.getZoom() || 0,
			    min = this.getMinZoom(),
			    max = this.getMaxZoom(),
			    nw = bounds.getNorthWest(),
			    se = bounds.getSouthEast(),
			    size = this.getSize().subtract(padding),
			    boundsSize = this.project(se, zoom).subtract(this.project(nw, zoom)),
			    snap = L.Browser.any3d ? this.options.zoomSnap : 1;

			var scale = Math.min(size.x / boundsSize.x, size.y / boundsSize.y);
			zoom = this.getScaleZoom(scale, zoom);

			if (snap) {
				zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
				zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
			}

			return Math.max(min, Math.min(max, zoom));
		},

		// @method getSize(): Point
		// Returns the current size of the map container (in pixels).
		getSize: function () {
			if (!this._size || this._sizeChanged) {
				this._size = new L.Point(
					this._container.clientWidth,
					this._container.clientHeight);

				this._sizeChanged = false;
			}
			return this._size.clone();
		},

		// @method getPixelBounds(): Bounds
		// Returns the bounds of the current map view in projected pixel
		// coordinates (sometimes useful in layer and overlay implementations).
		getPixelBounds: function (center, zoom) {
			var topLeftPoint = this._getTopLeftPoint(center, zoom);
			return new L.Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
		},

		// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
		// the map pane? "left point of the map layer" can be confusing, specially
		// since there can be negative offsets.
		// @method getPixelOrigin(): Point
		// Returns the projected pixel coordinates of the top left point of
		// the map layer (useful in custom layer and overlay implementations).
		getPixelOrigin: function () {
			this._checkIfLoaded();
			return this._pixelOrigin;
		},

		// @method getPixelWorldBounds(zoom?: Number): Bounds
		// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
		// If `zoom` is omitted, the map's current zoom level is used.
		getPixelWorldBounds: function (zoom) {
			return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
		},

		// @section Other Methods

		// @method getPane(pane: String|HTMLElement): HTMLElement
		// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
		getPane: function (pane) {
			return typeof pane === 'string' ? this._panes[pane] : pane;
		},

		// @method getPanes(): Object
		// Returns a plain object containing the names of all [panes](#map-pane) as keys and
		// the panes as values.
		getPanes: function () {
			return this._panes;
		},

		// @method getContainer: HTMLElement
		// Returns the HTML element that contains the map.
		getContainer: function () {
			return this._container;
		},


		// @section Conversion Methods

		// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
		// Returns the scale factor to be applied to a map transition from zoom level
		// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
		getZoomScale: function (toZoom, fromZoom) {
			// TODO replace with universal implementation after refactoring projections
			var crs = this.options.crs;
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			return crs.scale(toZoom) / crs.scale(fromZoom);
		},

		// @method getScaleZoom(scale: Number, fromZoom: Number): Number
		// Returns the zoom level that the map would end up at, if it is at `fromZoom`
		// level and everything is scaled by a factor of `scale`. Inverse of
		// [`getZoomScale`](#map-getZoomScale).
		getScaleZoom: function (scale, fromZoom) {
			var crs = this.options.crs;
			fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
			var zoom = crs.zoom(scale * crs.scale(fromZoom));
			return isNaN(zoom) ? Infinity : zoom;
		},

		// @method project(latlng: LatLng, zoom: Number): Point
		// Projects a geographical coordinate `LatLng` according to the projection
		// of the map's CRS, then scales it according to `zoom` and the CRS's
		// `Transformation`. The result is pixel coordinate relative to
		// the CRS origin.
		project: function (latlng, zoom) {
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.latLngToPoint(L.latLng(latlng), zoom);
		},

		// @method unproject(point: Point, zoom: Number): LatLng
		// Inverse of [`project`](#map-project).
		unproject: function (point, zoom) {
			zoom = zoom === undefined ? this._zoom : zoom;
			return this.options.crs.pointToLatLng(L.point(point), zoom);
		},

		// @method layerPointToLatLng(point: Point): LatLng
		// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
		// returns the corresponding geographical coordinate (for the current zoom level).
		layerPointToLatLng: function (point) {
			var projectedPoint = L.point(point).add(this.getPixelOrigin());
			return this.unproject(projectedPoint);
		},

		// @method latLngToLayerPoint(latlng: LatLng): Point
		// Given a geographical coordinate, returns the corresponding pixel coordinate
		// relative to the [origin pixel](#map-getpixelorigin).
		latLngToLayerPoint: function (latlng) {
			var projectedPoint = this.project(L.latLng(latlng))._round();
			return projectedPoint._subtract(this.getPixelOrigin());
		},

		// @method wrapLatLng(latlng: LatLng): LatLng
		// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
		// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
		// CRS's bounds.
		// By default this means longitude is wrapped around the dateline so its
		// value is between -180 and +180 degrees.
		wrapLatLng: function (latlng) {
			return this.options.crs.wrapLatLng(L.latLng(latlng));
		},

		// @method distance(latlng1: LatLng, latlng2: LatLng): Number
		// Returns the distance between two geographical coordinates according to
		// the map's CRS. By default this measures distance in meters.
		distance: function (latlng1, latlng2) {
			return this.options.crs.distance(L.latLng(latlng1), L.latLng(latlng2));
		},

		// @method containerPointToLayerPoint(point: Point): Point
		// Given a pixel coordinate relative to the map container, returns the corresponding
		// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
		containerPointToLayerPoint: function (point) { // (Point)
			return L.point(point).subtract(this._getMapPanePos());
		},

		// @method layerPointToContainerPoint(point: Point): Point
		// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
		// returns the corresponding pixel coordinate relative to the map container.
		layerPointToContainerPoint: function (point) { // (Point)
			return L.point(point).add(this._getMapPanePos());
		},

		// @method containerPointToLatLng(point: Point): Point
		// Given a pixel coordinate relative to the map container, returns
		// the corresponding geographical coordinate (for the current zoom level).
		containerPointToLatLng: function (point) {
			var layerPoint = this.containerPointToLayerPoint(L.point(point));
			return this.layerPointToLatLng(layerPoint);
		},

		// @method latLngToContainerPoint(latlng: LatLng): Point
		// Given a geographical coordinate, returns the corresponding pixel coordinate
		// relative to the map container.
		latLngToContainerPoint: function (latlng) {
			return this.layerPointToContainerPoint(this.latLngToLayerPoint(L.latLng(latlng)));
		},

		// @method mouseEventToContainerPoint(ev: MouseEvent): Point
		// Given a MouseEvent object, returns the pixel coordinate relative to the
		// map container where the event took place.
		mouseEventToContainerPoint: function (e) {
			return L.DomEvent.getMousePosition(e, this._container);
		},

		// @method mouseEventToLayerPoint(ev: MouseEvent): Point
		// Given a MouseEvent object, returns the pixel coordinate relative to
		// the [origin pixel](#map-getpixelorigin) where the event took place.
		mouseEventToLayerPoint: function (e) {
			return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
		},

		// @method mouseEventToLatLng(ev: MouseEvent): LatLng
		// Given a MouseEvent object, returns geographical coordinate where the
		// event took place.
		mouseEventToLatLng: function (e) { // (MouseEvent)
			return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
		},


		// map initialization methods

		_initContainer: function (id) {
			var container = this._container = L.DomUtil.get(id);

			if (!container) {
				throw new Error('Map container not found.');
			} else if (container._leaflet_id) {
				throw new Error('Map container is already initialized.');
			}

			L.DomEvent.addListener(container, 'scroll', this._onScroll, this);
			this._containerId = L.Util.stamp(container);
		},

		_initLayout: function () {
			var container = this._container;

			this._fadeAnimated = this.options.fadeAnimation && L.Browser.any3d;

			L.DomUtil.addClass(container, 'leaflet-container' +
				(L.Browser.touch ? ' leaflet-touch' : '') +
				(L.Browser.retina ? ' leaflet-retina' : '') +
				(L.Browser.ielt9 ? ' leaflet-oldie' : '') +
				(L.Browser.safari ? ' leaflet-safari' : '') +
				(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

			var position = L.DomUtil.getStyle(container, 'position');

			if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
				container.style.position = 'relative';
			}

			this._initPanes();

			if (this._initControlPos) {
				this._initControlPos();
			}
		},

		_initPanes: function () {
			var panes = this._panes = {};
			this._paneRenderers = {};

			// @section
			//
			// Panes are DOM elements used to control the ordering of layers on the map. You
			// can access panes with [`map.getPane`](#map-getpane) or
			// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
			// [`map.createPane`](#map-createpane) method.
			//
			// Every map has the following default panes that differ only in zIndex.
			//
			// @pane mapPane: HTMLElement = 'auto'
			// Pane that contains all other map panes

			this._mapPane = this.createPane('mapPane', this._container);
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));

			// @pane tilePane: HTMLElement = 200
			// Pane for `GridLayer`s and `TileLayer`s
			this.createPane('tilePane');
			// @pane overlayPane: HTMLElement = 400
			// Pane for vector overlays (`Path`s), like `Polyline`s and `Polygon`s
			this.createPane('shadowPane');
			// @pane shadowPane: HTMLElement = 500
			// Pane for overlay shadows (e.g. `Marker` shadows)
			this.createPane('overlayPane');
			// @pane markerPane: HTMLElement = 600
			// Pane for `Icon`s of `Marker`s
			this.createPane('markerPane');
			// @pane tooltipPane: HTMLElement = 650
			// Pane for tooltip.
			this.createPane('tooltipPane');
			// @pane popupPane: HTMLElement = 700
			// Pane for `Popup`s.
			this.createPane('popupPane');

			if (!this.options.markerZoomAnimation) {
				L.DomUtil.addClass(panes.markerPane, 'leaflet-zoom-hide');
				L.DomUtil.addClass(panes.shadowPane, 'leaflet-zoom-hide');
			}
		},


		// private methods that modify map state

		// @section Map state change events
		_resetView: function (center, zoom) {
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));

			var loading = !this._loaded;
			this._loaded = true;
			zoom = this._limitZoom(zoom);

			this.fire('viewprereset');

			var zoomChanged = this._zoom !== zoom;
			this
				._moveStart(zoomChanged)
				._move(center, zoom)
				._moveEnd(zoomChanged);

			// @event viewreset: Event
			// Fired when the map needs to redraw its content (this usually happens
			// on map zoom or load). Very useful for creating custom overlays.
			this.fire('viewreset');

			// @event load: Event
			// Fired when the map is initialized (when its center and zoom are set
			// for the first time).
			if (loading) {
				this.fire('load');
			}
		},

		_moveStart: function (zoomChanged) {
			// @event zoomstart: Event
			// Fired when the map zoom is about to change (e.g. before zoom animation).
			// @event movestart: Event
			// Fired when the view of the map starts changing (e.g. user starts dragging the map).
			if (zoomChanged) {
				this.fire('zoomstart');
			}
			return this.fire('movestart');
		},

		_move: function (center, zoom, data) {
			if (zoom === undefined) {
				zoom = this._zoom;
			}
			var zoomChanged = this._zoom !== zoom;

			this._zoom = zoom;
			this._lastCenter = center;
			this._pixelOrigin = this._getNewPixelOrigin(center);

			// @event zoom: Event
			// Fired repeatedly during any change in zoom level, including zoom
			// and fly animations.
			if (zoomChanged || (data && data.pinch)) {	// Always fire 'zoom' if pinching because #3530
				this.fire('zoom', data);
			}

			// @event move: Event
			// Fired repeatedly during any movement of the map, including pan and
			// fly animations.
			return this.fire('move', data);
		},

		_moveEnd: function (zoomChanged) {
			// @event zoomend: Event
			// Fired when the map has changed, after any animations.
			if (zoomChanged) {
				this.fire('zoomend');
			}

			// @event moveend: Event
			// Fired when the center of the map stops changing (e.g. user stopped
			// dragging the map).
			return this.fire('moveend');
		},

		_stop: function () {
			L.Util.cancelAnimFrame(this._flyToFrame);
			if (this._panAnim) {
				this._panAnim.stop();
			}
			return this;
		},

		_rawPanBy: function (offset) {
			L.DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
		},

		_getZoomSpan: function () {
			return this.getMaxZoom() - this.getMinZoom();
		},

		_panInsideMaxBounds: function () {
			if (!this._enforcingBounds) {
				this.panInsideBounds(this.options.maxBounds);
			}
		},

		_checkIfLoaded: function () {
			if (!this._loaded) {
				throw new Error('Set map center and zoom first.');
			}
		},

		// DOM event handling

		// @section Interaction events
		_initEvents: function (remove) {
			if (!L.DomEvent) { return; }

			this._targets = {};
			this._targets[L.stamp(this._container)] = this;

			var onOff = remove ? 'off' : 'on';

			// @event click: MouseEvent
			// Fired when the user clicks (or taps) the map.
			// @event dblclick: MouseEvent
			// Fired when the user double-clicks (or double-taps) the map.
			// @event mousedown: MouseEvent
			// Fired when the user pushes the mouse button on the map.
			// @event mouseup: MouseEvent
			// Fired when the user releases the mouse button on the map.
			// @event mouseover: MouseEvent
			// Fired when the mouse enters the map.
			// @event mouseout: MouseEvent
			// Fired when the mouse leaves the map.
			// @event mousemove: MouseEvent
			// Fired while the mouse moves over the map.
			// @event contextmenu: MouseEvent
			// Fired when the user pushes the right mouse button on the map, prevents
			// default browser context menu from showing if there are listeners on
			// this event. Also fired on mobile when the user holds a single touch
			// for a second (also called long press).
			// @event keypress: KeyboardEvent
			// Fired when the user presses a key from the keyboard while the map is focused.
			L.DomEvent[onOff](this._container, 'click dblclick mousedown mouseup ' +
				'mouseover mouseout mousemove contextmenu keypress', this._handleDOMEvent, this);

			if (this.options.trackResize) {
				L.DomEvent[onOff](window, 'resize', this._onResize, this);
			}

			if (L.Browser.any3d && this.options.transform3DLimit) {
				this[onOff]('moveend', this._onMoveEnd);
			}
		},

		_onResize: function () {
			L.Util.cancelAnimFrame(this._resizeRequest);
			this._resizeRequest = L.Util.requestAnimFrame(
			        function () { this.invalidateSize({debounceMoveend: true}); }, this);
		},

		_onScroll: function () {
			this._container.scrollTop  = 0;
			this._container.scrollLeft = 0;
		},

		_onMoveEnd: function () {
			var pos = this._getMapPanePos();
			if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
				// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
				// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
				this._resetView(this.getCenter(), this.getZoom());
			}
		},

		_findEventTargets: function (e, type) {
			var targets = [],
			    target,
			    isHover = type === 'mouseout' || type === 'mouseover',
			    src = e.target || e.srcElement,
			    dragging = false;

			while (src) {
				target = this._targets[L.stamp(src)];
				if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
					// Prevent firing click after you just dragged an object.
					dragging = true;
					break;
				}
				if (target && target.listens(type, true)) {
					if (isHover && !L.DomEvent._isExternalTarget(src, e)) { break; }
					targets.push(target);
					if (isHover) { break; }
				}
				if (src === this._container) { break; }
				src = src.parentNode;
			}
			if (!targets.length && !dragging && !isHover && L.DomEvent._isExternalTarget(src, e)) {
				targets = [this];
			}
			return targets;
		},

		_handleDOMEvent: function (e) {
			if (!this._loaded || L.DomEvent._skipped(e)) { return; }

			var type = e.type === 'keypress' && e.keyCode === 13 ? 'click' : e.type;

			if (type === 'mousedown') {
				// prevents outline when clicking on keyboard-focusable element
				L.DomUtil.preventOutline(e.target || e.srcElement);
			}

			this._fireDOMEvent(e, type);
		},

		_fireDOMEvent: function (e, type, targets) {

			if (e.type === 'click') {
				// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
				// @event preclick: MouseEvent
				// Fired before mouse click on the map (sometimes useful when you
				// want something to happen on click before any existing click
				// handlers start running).
				var synth = L.Util.extend({}, e);
				synth.type = 'preclick';
				this._fireDOMEvent(synth, synth.type, targets);
			}

			if (e._stopped) { return; }

			// Find the layer the event is propagating from and its parents.
			targets = (targets || []).concat(this._findEventTargets(e, type));

			if (!targets.length) { return; }

			var target = targets[0];
			if (type === 'contextmenu' && target.listens(type, true)) {
				L.DomEvent.preventDefault(e);
			}

			var data = {
				originalEvent: e
			};

			if (e.type !== 'keypress') {
				var isMarker = target instanceof L.Marker;
				data.containerPoint = isMarker ?
						this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
				data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
				data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
			}

			for (var i = 0; i < targets.length; i++) {
				targets[i].fire(type, data, true);
				if (data.originalEvent._stopped ||
					(targets[i].options.nonBubblingEvents && L.Util.indexOf(targets[i].options.nonBubblingEvents, type) !== -1)) { return; }
			}
		},

		_draggableMoved: function (obj) {
			obj = obj.dragging && obj.dragging.enabled() ? obj : this;
			return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
		},

		_clearHandlers: function () {
			for (var i = 0, len = this._handlers.length; i < len; i++) {
				this._handlers[i].disable();
			}
		},

		// @section Other Methods

		// @method whenReady(fn: Function, context?: Object): this
		// Runs the given function `fn` when the map gets initialized with
		// a view (center and zoom) and at least one layer, or immediately
		// if it's already initialized, optionally passing a function context.
		whenReady: function (callback, context) {
			if (this._loaded) {
				callback.call(context || this, {target: this});
			} else {
				this.on('load', callback, context);
			}
			return this;
		},


		// private methods for getting map state

		_getMapPanePos: function () {
			return L.DomUtil.getPosition(this._mapPane) || new L.Point(0, 0);
		},

		_moved: function () {
			var pos = this._getMapPanePos();
			return pos && !pos.equals([0, 0]);
		},

		_getTopLeftPoint: function (center, zoom) {
			var pixelOrigin = center && zoom !== undefined ?
				this._getNewPixelOrigin(center, zoom) :
				this.getPixelOrigin();
			return pixelOrigin.subtract(this._getMapPanePos());
		},

		_getNewPixelOrigin: function (center, zoom) {
			var viewHalf = this.getSize()._divideBy(2);
			return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
		},

		_latLngToNewLayerPoint: function (latlng, zoom, center) {
			var topLeft = this._getNewPixelOrigin(center, zoom);
			return this.project(latlng, zoom)._subtract(topLeft);
		},

		// layer point of the current center
		_getCenterLayerPoint: function () {
			return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
		},

		// offset of the specified place to the current center in pixels
		_getCenterOffset: function (latlng) {
			return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
		},

		// adjust center for view to get inside bounds
		_limitCenter: function (center, zoom, bounds) {

			if (!bounds) { return center; }

			var centerPoint = this.project(center, zoom),
			    viewHalf = this.getSize().divideBy(2),
			    viewBounds = new L.Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
			    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

			// If offset is less than a pixel, ignore.
			// This prevents unstable projections from getting into
			// an infinite loop of tiny offsets.
			if (offset.round().equals([0, 0])) {
				return center;
			}

			return this.unproject(centerPoint.add(offset), zoom);
		},

		// adjust offset for view to get inside bounds
		_limitOffset: function (offset, bounds) {
			if (!bounds) { return offset; }

			var viewBounds = this.getPixelBounds(),
			    newBounds = new L.Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

			return offset.add(this._getBoundsOffset(newBounds, bounds));
		},

		// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
		_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
			var projectedMaxBounds = L.bounds(
			        this.project(maxBounds.getNorthEast(), zoom),
			        this.project(maxBounds.getSouthWest(), zoom)
			    ),
			    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
			    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

			    dx = this._rebound(minOffset.x, -maxOffset.x),
			    dy = this._rebound(minOffset.y, -maxOffset.y);

			return new L.Point(dx, dy);
		},

		_rebound: function (left, right) {
			return left + right > 0 ?
				Math.round(left - right) / 2 :
				Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
		},

		_limitZoom: function (zoom) {
			var min = this.getMinZoom(),
			    max = this.getMaxZoom(),
			    snap = L.Browser.any3d ? this.options.zoomSnap : 1;
			if (snap) {
				zoom = Math.round(zoom / snap) * snap;
			}
			return Math.max(min, Math.min(max, zoom));
		}
	});

	// @section

	// @factory L.map(id: String, options?: Map options)
	// Instantiates a map object given the DOM ID of a `<div>` element
	// and optionally an object literal with `Map options`.
	//
	// @alternative
	// @factory L.map(el: HTMLElement, options?: Map options)
	// Instantiates a map object given an instance of a `<div>` HTML element
	// and optionally an object literal with `Map options`.
	L.map = function (id, options) {
		return new L.Map(id, options);
	};




	/*
	 * @class Layer
	 * @inherits Evented
	 * @aka L.Layer
	 * @aka ILayer
	 *
	 * A set of methods from the Layer base class that all Leaflet layers use.
	 * Inherits all methods, options and events from `L.Evented`.
	 *
	 * @example
	 *
	 * ```js
	 * var layer = L.Marker(latlng).addTo(map);
	 * layer.addTo(map);
	 * layer.remove();
	 * ```
	 *
	 * @event add: Event
	 * Fired after the layer is added to a map
	 *
	 * @event remove: Event
	 * Fired after the layer is removed from a map
	 */


	L.Layer = L.Evented.extend({

		// Classes extending `L.Layer` will inherit the following options:
		options: {
			// @option pane: String = 'overlayPane'
			// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
			pane: 'overlayPane',
			nonBubblingEvents: []  // Array of events that should not be bubbled to DOM parents (like the map)
		},

		/* @section
		 * Classes extending `L.Layer` will inherit the following methods:
		 *
		 * @method addTo(map: Map): this
		 * Adds the layer to the given map
		 */
		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		// @method remove: this
		// Removes the layer from the map it is currently active on.
		remove: function () {
			return this.removeFrom(this._map || this._mapToAdd);
		},

		// @method removeFrom(map: Map): this
		// Removes the layer from the given map
		removeFrom: function (obj) {
			if (obj) {
				obj.removeLayer(this);
			}
			return this;
		},

		// @method getPane(name? : String): HTMLElement
		// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
		getPane: function (name) {
			return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
		},

		addInteractiveTarget: function (targetEl) {
			this._map._targets[L.stamp(targetEl)] = this;
			return this;
		},

		removeInteractiveTarget: function (targetEl) {
			delete this._map._targets[L.stamp(targetEl)];
			return this;
		},

		_layerAdd: function (e) {
			var map = e.target;

			// check in case layer gets added and then removed before the map is ready
			if (!map.hasLayer(this)) { return; }

			this._map = map;
			this._zoomAnimated = map._zoomAnimated;

			if (this.getEvents) {
				var events = this.getEvents();
				map.on(events, this);
				this.once('remove', function () {
					map.off(events, this);
				}, this);
			}

			this.onAdd(map);

			if (this.getAttribution && this._map.attributionControl) {
				this._map.attributionControl.addAttribution(this.getAttribution());
			}

			this.fire('add');
			map.fire('layeradd', {layer: this});
		}
	});

	/* @section Extension methods
	 * @uninheritable
	 *
	 * Every layer should extend from `L.Layer` and (re-)implement the following methods.
	 *
	 * @method onAdd(map: Map): this
	 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
	 *
	 * @method onRemove(map: Map): this
	 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
	 *
	 * @method getEvents(): Object
	 * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
	 *
	 * @method getAttribution(): String
	 * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
	 *
	 * @method beforeAdd(map: Map): this
	 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
	 */


	/* @namespace Map
	 * @section Layer events
	 *
	 * @event layeradd: LayerEvent
	 * Fired when a new layer is added to the map.
	 *
	 * @event layerremove: LayerEvent
	 * Fired when some layer is removed from the map
	 *
	 * @section Methods for Layers and Controls
	 */
	L.Map.include({
		// @method addLayer(layer: Layer): this
		// Adds the given layer to the map
		addLayer: function (layer) {
			var id = L.stamp(layer);
			if (this._layers[id]) { return this; }
			this._layers[id] = layer;

			layer._mapToAdd = this;

			if (layer.beforeAdd) {
				layer.beforeAdd(this);
			}

			this.whenReady(layer._layerAdd, layer);

			return this;
		},

		// @method removeLayer(layer: Layer): this
		// Removes the given layer from the map.
		removeLayer: function (layer) {
			var id = L.stamp(layer);

			if (!this._layers[id]) { return this; }

			if (this._loaded) {
				layer.onRemove(this);
			}

			if (layer.getAttribution && this.attributionControl) {
				this.attributionControl.removeAttribution(layer.getAttribution());
			}

			delete this._layers[id];

			if (this._loaded) {
				this.fire('layerremove', {layer: layer});
				layer.fire('remove');
			}

			layer._map = layer._mapToAdd = null;

			return this;
		},

		// @method hasLayer(layer: Layer): Boolean
		// Returns `true` if the given layer is currently added to the map
		hasLayer: function (layer) {
			return !!layer && (L.stamp(layer) in this._layers);
		},

		/* @method eachLayer(fn: Function, context?: Object): this
		 * Iterates over the layers of the map, optionally specifying context of the iterator function.
		 * ```
		 * map.eachLayer(function(layer){
		 *     layer.bindPopup('Hello');
		 * });
		 * ```
		 */
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},

		_addLayers: function (layers) {
			layers = layers ? (L.Util.isArray(layers) ? layers : [layers]) : [];

			for (var i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		},

		_addZoomLimit: function (layer) {
			if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
				this._zoomBoundLayers[L.stamp(layer)] = layer;
				this._updateZoomLevels();
			}
		},

		_removeZoomLimit: function (layer) {
			var id = L.stamp(layer);

			if (this._zoomBoundLayers[id]) {
				delete this._zoomBoundLayers[id];
				this._updateZoomLevels();
			}
		},

		_updateZoomLevels: function () {
			var minZoom = Infinity,
			    maxZoom = -Infinity,
			    oldZoomSpan = this._getZoomSpan();

			for (var i in this._zoomBoundLayers) {
				var options = this._zoomBoundLayers[i].options;

				minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
				maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
			}

			this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
			this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

			// @section Map state change events
			// @event zoomlevelschange: Event
			// Fired when the number of zoomlevels on the map is changed due
			// to adding or removing a layer.
			if (oldZoomSpan !== this._getZoomSpan()) {
				this.fire('zoomlevelschange');
			}
		}
	});



	/*
	 * @namespace Projection
	 * @projection L.Projection.Mercator
	 *
	 * Elliptical Mercator projection — more complex than Spherical Mercator. Takes into account that Earth is a geoid, not a perfect sphere. Used by the EPSG:3395 CRS.
	 */

	L.Projection.Mercator = {
		R: 6378137,
		R_MINOR: 6356752.314245179,

		bounds: L.bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

		project: function (latlng) {
			var d = Math.PI / 180,
			    r = this.R,
			    y = latlng.lat * d,
			    tmp = this.R_MINOR / r,
			    e = Math.sqrt(1 - tmp * tmp),
			    con = e * Math.sin(y);

			var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
			y = -r * Math.log(Math.max(ts, 1E-10));

			return new L.Point(latlng.lng * d * r, y);
		},

		unproject: function (point) {
			var d = 180 / Math.PI,
			    r = this.R,
			    tmp = this.R_MINOR / r,
			    e = Math.sqrt(1 - tmp * tmp),
			    ts = Math.exp(-point.y / r),
			    phi = Math.PI / 2 - 2 * Math.atan(ts);

			for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
				con = e * Math.sin(phi);
				con = Math.pow((1 - con) / (1 + con), e / 2);
				dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
				phi += dphi;
			}

			return new L.LatLng(phi * d, point.x * d / r);
		}
	};



	/*
	 * @namespace CRS
	 * @crs L.CRS.EPSG3395
	 *
	 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
	 */

	L.CRS.EPSG3395 = L.extend({}, L.CRS.Earth, {
		code: 'EPSG:3395',
		projection: L.Projection.Mercator,

		transformation: (function () {
			var scale = 0.5 / (Math.PI * L.Projection.Mercator.R);
			return new L.Transformation(scale, 0.5, -scale, 0.5);
		}())
	});



	/*
	 * @class GridLayer
	 * @inherits Layer
	 * @aka L.GridLayer
	 *
	 * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
	 * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
	 *
	 *
	 * @section Synchronous usage
	 * @example
	 *
	 * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
	 *
	 * ```js
	 * var CanvasLayer = L.GridLayer.extend({
	 *     createTile: function(coords){
	 *         // create a <canvas> element for drawing
	 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	 *
	 *         // setup tile width and height according to the options
	 *         var size = this.getTileSize();
	 *         tile.width = size.x;
	 *         tile.height = size.y;
	 *
	 *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
	 *         var ctx = tile.getContext('2d');
	 *
	 *         // return the tile so it can be rendered on screen
	 *         return tile;
	 *     }
	 * });
	 * ```
	 *
	 * @section Asynchronous usage
	 * @example
	 *
	 * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
	 *
	 * ```js
	 * var CanvasLayer = L.GridLayer.extend({
	 *     createTile: function(coords, done){
	 *         var error;
	 *
	 *         // create a <canvas> element for drawing
	 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
	 *
	 *         // setup tile width and height according to the options
	 *         var size = this.getTileSize();
	 *         tile.width = size.x;
	 *         tile.height = size.y;
	 *
	 *         // draw something asynchronously and pass the tile to the done() callback
	 *         setTimeout(function() {
	 *             done(error, tile);
	 *         }, 1000);
	 *
	 *         return tile;
	 *     }
	 * });
	 * ```
	 *
	 * @section
	 */


	L.GridLayer = L.Layer.extend({

		// @section
		// @aka GridLayer options
		options: {
			// @option tileSize: Number|Point = 256
			// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
			tileSize: 256,

			// @option opacity: Number = 1.0
			// Opacity of the tiles. Can be used in the `createTile()` function.
			opacity: 1,

			// @option updateWhenIdle: Boolean = depends
			// If `false`, new tiles are loaded during panning, otherwise only after it (for better performance). `true` by default on mobile browsers, otherwise `false`.
			updateWhenIdle: L.Browser.mobile,

			// @option updateWhenZooming: Boolean = true
			// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
			updateWhenZooming: true,

			// @option updateInterval: Number = 200
			// Tiles will not update more than once every `updateInterval` milliseconds when panning.
			updateInterval: 200,

			// @option attribution: String = null
			// String to be shown in the attribution control, describes the layer data, e.g. "© Mapbox".
			attribution: null,

			// @option zIndex: Number = 1
			// The explicit zIndex of the tile layer.
			zIndex: 1,

			// @option bounds: LatLngBounds = undefined
			// If set, tiles will only be loaded inside the set `LatLngBounds`.
			bounds: null,

			// @option minZoom: Number = 0
			// The minimum zoom level that tiles will be loaded at. By default the entire map.
			minZoom: 0,

			// @option maxZoom: Number = undefined
			// The maximum zoom level that tiles will be loaded at.
			maxZoom: undefined,

			// @option noWrap: Boolean = false
			// Whether the layer is wrapped around the antimeridian. If `true`, the
			// GridLayer will only be displayed once at low zoom levels. Has no
			// effect when the [map CRS](#map-crs) doesn't wrap around.
			noWrap: false,

			// @option pane: String = 'tilePane'
			// `Map pane` where the grid layer will be added.
			pane: 'tilePane',

			// @option className: String = ''
			// A custom class name to assign to the tile layer. Empty by default.
			className: '',

			// @option keepBuffer: Number = 2
			// When panning the map, keep this many rows and columns of tiles before unloading them.
			keepBuffer: 2
		},

		initialize: function (options) {
			L.setOptions(this, options);
		},

		onAdd: function () {
			this._initContainer();

			this._levels = {};
			this._tiles = {};

			this._resetView();
			this._update();
		},

		beforeAdd: function (map) {
			map._addZoomLimit(this);
		},

		onRemove: function (map) {
			this._removeAllTiles();
			L.DomUtil.remove(this._container);
			map._removeZoomLimit(this);
			this._container = null;
			this._tileZoom = null;
		},

		// @method bringToFront: this
		// Brings the tile layer to the top of all tile layers.
		bringToFront: function () {
			if (this._map) {
				L.DomUtil.toFront(this._container);
				this._setAutoZIndex(Math.max);
			}
			return this;
		},

		// @method bringToBack: this
		// Brings the tile layer to the bottom of all tile layers.
		bringToBack: function () {
			if (this._map) {
				L.DomUtil.toBack(this._container);
				this._setAutoZIndex(Math.min);
			}
			return this;
		},

		// @method getAttribution: String
		// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
		getAttribution: function () {
			return this.options.attribution;
		},

		// @method getContainer: HTMLElement
		// Returns the HTML element that contains the tiles for this layer.
		getContainer: function () {
			return this._container;
		},

		// @method setOpacity(opacity: Number): this
		// Changes the [opacity](#gridlayer-opacity) of the grid layer.
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			this._updateOpacity();
			return this;
		},

		// @method setZIndex(zIndex: Number): this
		// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
		setZIndex: function (zIndex) {
			this.options.zIndex = zIndex;
			this._updateZIndex();

			return this;
		},

		// @method isLoading: Boolean
		// Returns `true` if any tile in the grid layer has not finished loading.
		isLoading: function () {
			return this._loading;
		},

		// @method redraw: this
		// Causes the layer to clear all the tiles and request them again.
		redraw: function () {
			if (this._map) {
				this._removeAllTiles();
				this._update();
			}
			return this;
		},

		getEvents: function () {
			var events = {
				viewprereset: this._invalidateAll,
				viewreset: this._resetView,
				zoom: this._resetView,
				moveend: this._onMoveEnd
			};

			if (!this.options.updateWhenIdle) {
				// update tiles on move, but not more often than once per given interval
				if (!this._onMove) {
					this._onMove = L.Util.throttle(this._onMoveEnd, this.options.updateInterval, this);
				}

				events.move = this._onMove;
			}

			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}

			return events;
		},

		// @section Extension methods
		// Layers extending `GridLayer` shall reimplement the following method.
		// @method createTile(coords: Object, done?: Function): HTMLElement
		// Called only internally, must be overriden by classes extending `GridLayer`.
		// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
		// is specified, it must be called when the tile has finished loading and drawing.
		createTile: function () {
			return document.createElement('div');
		},

		// @section
		// @method getTileSize: Point
		// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
		getTileSize: function () {
			var s = this.options.tileSize;
			return s instanceof L.Point ? s : new L.Point(s, s);
		},

		_updateZIndex: function () {
			if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
				this._container.style.zIndex = this.options.zIndex;
			}
		},

		_setAutoZIndex: function (compare) {
			// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

			var layers = this.getPane().children,
			    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

			for (var i = 0, len = layers.length, zIndex; i < len; i++) {

				zIndex = layers[i].style.zIndex;

				if (layers[i] !== this._container && zIndex) {
					edgeZIndex = compare(edgeZIndex, +zIndex);
				}
			}

			if (isFinite(edgeZIndex)) {
				this.options.zIndex = edgeZIndex + compare(-1, 1);
				this._updateZIndex();
			}
		},

		_updateOpacity: function () {
			if (!this._map) { return; }

			// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
			if (L.Browser.ielt9) { return; }

			L.DomUtil.setOpacity(this._container, this.options.opacity);

			var now = +new Date(),
			    nextFrame = false,
			    willPrune = false;

			for (var key in this._tiles) {
				var tile = this._tiles[key];
				if (!tile.current || !tile.loaded) { continue; }

				var fade = Math.min(1, (now - tile.loaded) / 200);

				L.DomUtil.setOpacity(tile.el, fade);
				if (fade < 1) {
					nextFrame = true;
				} else {
					if (tile.active) { willPrune = true; }
					tile.active = true;
				}
			}

			if (willPrune && !this._noPrune) { this._pruneTiles(); }

			if (nextFrame) {
				L.Util.cancelAnimFrame(this._fadeFrame);
				this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
			}
		},

		_initContainer: function () {
			if (this._container) { return; }

			this._container = L.DomUtil.create('div', 'leaflet-layer ' + (this.options.className || ''));
			this._updateZIndex();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}

			this.getPane().appendChild(this._container);
		},

		_updateLevels: function () {

			var zoom = this._tileZoom,
			    maxZoom = this.options.maxZoom;

			if (zoom === undefined) { return undefined; }

			for (var z in this._levels) {
				if (this._levels[z].el.children.length || z === zoom) {
					this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
				} else {
					L.DomUtil.remove(this._levels[z].el);
					this._removeTilesAtZoom(z);
					delete this._levels[z];
				}
			}

			var level = this._levels[zoom],
			    map = this._map;

			if (!level) {
				level = this._levels[zoom] = {};

				level.el = L.DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
				level.el.style.zIndex = maxZoom;

				level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
				level.zoom = zoom;

				this._setZoomTransform(level, map.getCenter(), map.getZoom());

				// force the browser to consider the newly added element for transition
				L.Util.falseFn(level.el.offsetWidth);
			}

			this._level = level;

			return level;
		},

		_pruneTiles: function () {
			if (!this._map) {
				return;
			}

			var key, tile;

			var zoom = this._map.getZoom();
			if (zoom > this.options.maxZoom ||
				zoom < this.options.minZoom) {
				this._removeAllTiles();
				return;
			}

			for (key in this._tiles) {
				tile = this._tiles[key];
				tile.retain = tile.current;
			}

			for (key in this._tiles) {
				tile = this._tiles[key];
				if (tile.current && !tile.active) {
					var coords = tile.coords;
					if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
						this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
					}
				}
			}

			for (key in this._tiles) {
				if (!this._tiles[key].retain) {
					this._removeTile(key);
				}
			}
		},

		_removeTilesAtZoom: function (zoom) {
			for (var key in this._tiles) {
				if (this._tiles[key].coords.z !== zoom) {
					continue;
				}
				this._removeTile(key);
			}
		},

		_removeAllTiles: function () {
			for (var key in this._tiles) {
				this._removeTile(key);
			}
		},

		_invalidateAll: function () {
			for (var z in this._levels) {
				L.DomUtil.remove(this._levels[z].el);
				delete this._levels[z];
			}
			this._removeAllTiles();

			this._tileZoom = null;
		},

		_retainParent: function (x, y, z, minZoom) {
			var x2 = Math.floor(x / 2),
			    y2 = Math.floor(y / 2),
			    z2 = z - 1,
			    coords2 = new L.Point(+x2, +y2);
			coords2.z = +z2;

			var key = this._tileCoordsToKey(coords2),
			    tile = this._tiles[key];

			if (tile && tile.active) {
				tile.retain = true;
				return true;

			} else if (tile && tile.loaded) {
				tile.retain = true;
			}

			if (z2 > minZoom) {
				return this._retainParent(x2, y2, z2, minZoom);
			}

			return false;
		},

		_retainChildren: function (x, y, z, maxZoom) {

			for (var i = 2 * x; i < 2 * x + 2; i++) {
				for (var j = 2 * y; j < 2 * y + 2; j++) {

					var coords = new L.Point(i, j);
					coords.z = z + 1;

					var key = this._tileCoordsToKey(coords),
					    tile = this._tiles[key];

					if (tile && tile.active) {
						tile.retain = true;
						continue;

					} else if (tile && tile.loaded) {
						tile.retain = true;
					}

					if (z + 1 < maxZoom) {
						this._retainChildren(i, j, z + 1, maxZoom);
					}
				}
			}
		},

		_resetView: function (e) {
			var animating = e && (e.pinch || e.flyTo);
			this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
		},

		_animateZoom: function (e) {
			this._setView(e.center, e.zoom, true, e.noUpdate);
		},

		_setView: function (center, zoom, noPrune, noUpdate) {
			var tileZoom = Math.round(zoom);
			if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
			    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
				tileZoom = undefined;
			}

			var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

			if (!noUpdate || tileZoomChanged) {

				this._tileZoom = tileZoom;

				if (this._abortLoading) {
					this._abortLoading();
				}

				this._updateLevels();
				this._resetGrid();

				if (tileZoom !== undefined) {
					this._update(center);
				}

				if (!noPrune) {
					this._pruneTiles();
				}

				// Flag to prevent _updateOpacity from pruning tiles during
				// a zoom anim or a pinch gesture
				this._noPrune = !!noPrune;
			}

			this._setZoomTransforms(center, zoom);
		},

		_setZoomTransforms: function (center, zoom) {
			for (var i in this._levels) {
				this._setZoomTransform(this._levels[i], center, zoom);
			}
		},

		_setZoomTransform: function (level, center, zoom) {
			var scale = this._map.getZoomScale(zoom, level.zoom),
			    translate = level.origin.multiplyBy(scale)
			        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

			if (L.Browser.any3d) {
				L.DomUtil.setTransform(level.el, translate, scale);
			} else {
				L.DomUtil.setPosition(level.el, translate);
			}
		},

		_resetGrid: function () {
			var map = this._map,
			    crs = map.options.crs,
			    tileSize = this._tileSize = this.getTileSize(),
			    tileZoom = this._tileZoom;

			var bounds = this._map.getPixelWorldBounds(this._tileZoom);
			if (bounds) {
				this._globalTileRange = this._pxBoundsToTileRange(bounds);
			}

			this._wrapX = crs.wrapLng && !this.options.noWrap && [
				Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
				Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
			];
			this._wrapY = crs.wrapLat && !this.options.noWrap && [
				Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
				Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
			];
		},

		_onMoveEnd: function () {
			if (!this._map || this._map._animatingZoom) { return; }

			this._update();
		},

		_getTiledPixelBounds: function (center) {
			var map = this._map,
			    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
			    scale = map.getZoomScale(mapZoom, this._tileZoom),
			    pixelCenter = map.project(center, this._tileZoom).floor(),
			    halfSize = map.getSize().divideBy(scale * 2);

			return new L.Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
		},

		// Private method to load tiles in the grid's active zoom level according to map bounds
		_update: function (center) {
			var map = this._map;
			if (!map) { return; }
			var zoom = map.getZoom();

			if (center === undefined) { center = map.getCenter(); }
			if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

			var pixelBounds = this._getTiledPixelBounds(center),
			    tileRange = this._pxBoundsToTileRange(pixelBounds),
			    tileCenter = tileRange.getCenter(),
			    queue = [],
			    margin = this.options.keepBuffer,
			    noPruneRange = new L.Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
			                              tileRange.getTopRight().add([margin, -margin]));

			for (var key in this._tiles) {
				var c = this._tiles[key].coords;
				if (c.z !== this._tileZoom || !noPruneRange.contains(L.point(c.x, c.y))) {
					this._tiles[key].current = false;
				}
			}

			// _update just loads more tiles. If the tile zoom level differs too much
			// from the map's, let _setView reset levels and prune old tiles.
			if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

			// create a queue of coordinates to load tiles from
			for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
				for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
					var coords = new L.Point(i, j);
					coords.z = this._tileZoom;

					if (!this._isValidTile(coords)) { continue; }

					var tile = this._tiles[this._tileCoordsToKey(coords)];
					if (tile) {
						tile.current = true;
					} else {
						queue.push(coords);
					}
				}
			}

			// sort tile queue to load tiles in order of their distance to center
			queue.sort(function (a, b) {
				return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
			});

			if (queue.length !== 0) {
				// if it's the first batch of tiles to load
				if (!this._loading) {
					this._loading = true;
					// @event loading: Event
					// Fired when the grid layer starts loading tiles.
					this.fire('loading');
				}

				// create DOM fragment to append tiles in one batch
				var fragment = document.createDocumentFragment();

				for (i = 0; i < queue.length; i++) {
					this._addTile(queue[i], fragment);
				}

				this._level.el.appendChild(fragment);
			}
		},

		_isValidTile: function (coords) {
			var crs = this._map.options.crs;

			if (!crs.infinite) {
				// don't load tile if it's out of bounds and not wrapped
				var bounds = this._globalTileRange;
				if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
				    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
			}

			if (!this.options.bounds) { return true; }

			// don't load tile if it doesn't intersect the bounds in options
			var tileBounds = this._tileCoordsToBounds(coords);
			return L.latLngBounds(this.options.bounds).overlaps(tileBounds);
		},

		_keyToBounds: function (key) {
			return this._tileCoordsToBounds(this._keyToTileCoords(key));
		},

		// converts tile coordinates to its geographical bounds
		_tileCoordsToBounds: function (coords) {

			var map = this._map,
			    tileSize = this.getTileSize(),

			    nwPoint = coords.scaleBy(tileSize),
			    sePoint = nwPoint.add(tileSize),

			    nw = map.unproject(nwPoint, coords.z),
			    se = map.unproject(sePoint, coords.z);

			if (!this.options.noWrap) {
				nw = map.wrapLatLng(nw);
				se = map.wrapLatLng(se);
			}

			return new L.LatLngBounds(nw, se);
		},

		// converts tile coordinates to key for the tile cache
		_tileCoordsToKey: function (coords) {
			return coords.x + ':' + coords.y + ':' + coords.z;
		},

		// converts tile cache key to coordinates
		_keyToTileCoords: function (key) {
			var k = key.split(':'),
			    coords = new L.Point(+k[0], +k[1]);
			coords.z = +k[2];
			return coords;
		},

		_removeTile: function (key) {
			var tile = this._tiles[key];
			if (!tile) { return; }

			L.DomUtil.remove(tile.el);

			delete this._tiles[key];

			// @event tileunload: TileEvent
			// Fired when a tile is removed (e.g. when a tile goes off the screen).
			this.fire('tileunload', {
				tile: tile.el,
				coords: this._keyToTileCoords(key)
			});
		},

		_initTile: function (tile) {
			L.DomUtil.addClass(tile, 'leaflet-tile');

			var tileSize = this.getTileSize();
			tile.style.width = tileSize.x + 'px';
			tile.style.height = tileSize.y + 'px';

			tile.onselectstart = L.Util.falseFn;
			tile.onmousemove = L.Util.falseFn;

			// update opacity on tiles in IE7-8 because of filter inheritance problems
			if (L.Browser.ielt9 && this.options.opacity < 1) {
				L.DomUtil.setOpacity(tile, this.options.opacity);
			}

			// without this hack, tiles disappear after zoom on Chrome for Android
			// https://github.com/Leaflet/Leaflet/issues/2078
			if (L.Browser.android && !L.Browser.android23) {
				tile.style.WebkitBackfaceVisibility = 'hidden';
			}
		},

		_addTile: function (coords, container) {
			var tilePos = this._getTilePos(coords),
			    key = this._tileCoordsToKey(coords);

			var tile = this.createTile(this._wrapCoords(coords), L.bind(this._tileReady, this, coords));

			this._initTile(tile);

			// if createTile is defined with a second argument ("done" callback),
			// we know that tile is async and will be ready later; otherwise
			if (this.createTile.length < 2) {
				// mark tile as ready, but delay one frame for opacity animation to happen
				L.Util.requestAnimFrame(L.bind(this._tileReady, this, coords, null, tile));
			}

			L.DomUtil.setPosition(tile, tilePos);

			// save tile in cache
			this._tiles[key] = {
				el: tile,
				coords: coords,
				current: true
			};

			container.appendChild(tile);
			// @event tileloadstart: TileEvent
			// Fired when a tile is requested and starts loading.
			this.fire('tileloadstart', {
				tile: tile,
				coords: coords
			});
		},

		_tileReady: function (coords, err, tile) {
			if (!this._map) { return; }

			if (err) {
				// @event tileerror: TileErrorEvent
				// Fired when there is an error loading a tile.
				this.fire('tileerror', {
					error: err,
					tile: tile,
					coords: coords
				});
			}

			var key = this._tileCoordsToKey(coords);

			tile = this._tiles[key];
			if (!tile) { return; }

			tile.loaded = +new Date();
			if (this._map._fadeAnimated) {
				L.DomUtil.setOpacity(tile.el, 0);
				L.Util.cancelAnimFrame(this._fadeFrame);
				this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
			} else {
				tile.active = true;
				this._pruneTiles();
			}

			if (!err) {
				L.DomUtil.addClass(tile.el, 'leaflet-tile-loaded');

				// @event tileload: TileEvent
				// Fired when a tile loads.
				this.fire('tileload', {
					tile: tile.el,
					coords: coords
				});
			}

			if (this._noTilesToLoad()) {
				this._loading = false;
				// @event load: Event
				// Fired when the grid layer loaded all visible tiles.
				this.fire('load');

				if (L.Browser.ielt9 || !this._map._fadeAnimated) {
					L.Util.requestAnimFrame(this._pruneTiles, this);
				} else {
					// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
					// to trigger a pruning.
					setTimeout(L.bind(this._pruneTiles, this), 250);
				}
			}
		},

		_getTilePos: function (coords) {
			return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
		},

		_wrapCoords: function (coords) {
			var newCoords = new L.Point(
				this._wrapX ? L.Util.wrapNum(coords.x, this._wrapX) : coords.x,
				this._wrapY ? L.Util.wrapNum(coords.y, this._wrapY) : coords.y);
			newCoords.z = coords.z;
			return newCoords;
		},

		_pxBoundsToTileRange: function (bounds) {
			var tileSize = this.getTileSize();
			return new L.Bounds(
				bounds.min.unscaleBy(tileSize).floor(),
				bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
		},

		_noTilesToLoad: function () {
			for (var key in this._tiles) {
				if (!this._tiles[key].loaded) { return false; }
			}
			return true;
		}
	});

	// @factory L.gridLayer(options?: GridLayer options)
	// Creates a new instance of GridLayer with the supplied options.
	L.gridLayer = function (options) {
		return new L.GridLayer(options);
	};



	/*
	 * @class TileLayer
	 * @inherits GridLayer
	 * @aka L.TileLayer
	 * Used to load and display tile layers on the map. Extends `GridLayer`.
	 *
	 * @example
	 *
	 * ```js
	 * L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
	 * ```
	 *
	 * @section URL template
	 * @example
	 *
	 * A string of the following form:
	 *
	 * ```
	 * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
	 * ```
	 *
	 * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add @2x to the URL to load retina tiles.
	 *
	 * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
	 *
	 * ```
	 * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
	 * ```
	 */


	L.TileLayer = L.GridLayer.extend({

		// @section
		// @aka TileLayer options
		options: {
			// @option minZoom: Number = 0
			// Minimum zoom number.
			minZoom: 0,

			// @option maxZoom: Number = 18
			// Maximum zoom number.
			maxZoom: 18,

			// @option maxNativeZoom: Number = null
			// Maximum zoom number the tile source has available. If it is specified,
			// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
			// from `maxNativeZoom` level and auto-scaled.
			maxNativeZoom: null,

			// @option subdomains: String|String[] = 'abc'
			// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
			subdomains: 'abc',

			// @option errorTileUrl: String = ''
			// URL to the tile image to show in place of the tile that failed to load.
			errorTileUrl: '',

			// @option zoomOffset: Number = 0
			// The zoom number used in tile URLs will be offset with this value.
			zoomOffset: 0,

			// @option tms: Boolean = false
			// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
			tms: false,

			// @option zoomReverse: Boolean = false
			// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
			zoomReverse: false,

			// @option detectRetina: Boolean = false
			// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
			detectRetina: false,

			// @option crossOrigin: Boolean = false
			// If true, all tiles will have their crossOrigin attribute set to ''. This is needed if you want to access tile pixel data.
			crossOrigin: false
		},

		initialize: function (url, options) {

			this._url = url;

			options = L.setOptions(this, options);

			// detecting retina displays, adjusting tileSize and zoom levels
			if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

				options.tileSize = Math.floor(options.tileSize / 2);

				if (!options.zoomReverse) {
					options.zoomOffset++;
					options.maxZoom--;
				} else {
					options.zoomOffset--;
					options.minZoom++;
				}

				options.minZoom = Math.max(0, options.minZoom);
			}

			if (typeof options.subdomains === 'string') {
				options.subdomains = options.subdomains.split('');
			}

			// for https://github.com/Leaflet/Leaflet/issues/137
			if (!L.Browser.android) {
				this.on('tileunload', this._onTileRemove);
			}
		},

		// @method setUrl(url: String, noRedraw?: Boolean): this
		// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
		setUrl: function (url, noRedraw) {
			this._url = url;

			if (!noRedraw) {
				this.redraw();
			}
			return this;
		},

		// @method createTile(coords: Object, done?: Function): HTMLElement
		// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
		// to return an `<img>` HTML element with the appropiate image URL given `coords`. The `done`
		// callback is called when the tile has been loaded.
		createTile: function (coords, done) {
			var tile = document.createElement('img');

			L.DomEvent.on(tile, 'load', L.bind(this._tileOnLoad, this, done, tile));
			L.DomEvent.on(tile, 'error', L.bind(this._tileOnError, this, done, tile));

			if (this.options.crossOrigin) {
				tile.crossOrigin = '';
			}

			/*
			 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
			 http://www.w3.org/TR/WCAG20-TECHS/H67
			*/
			tile.alt = '';

			tile.src = this.getTileUrl(coords);

			return tile;
		},

		// @section Extension methods
		// @uninheritable
		// Layers extending `TileLayer` might reimplement the following method.
		// @method getTileUrl(coords: Object): String
		// Called only internally, returns the URL for a tile given its coordinates.
		// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
		getTileUrl: function (coords) {
			var data = {
				r: L.Browser.retina ? '@2x' : '',
				s: this._getSubdomain(coords),
				x: coords.x,
				y: coords.y,
				z: this._getZoomForUrl()
			};
			if (this._map && !this._map.options.crs.infinite) {
				var invertedY = this._globalTileRange.max.y - coords.y;
				if (this.options.tms) {
					data['y'] = invertedY;
				}
				data['-y'] = invertedY;
			}

			return L.Util.template(this._url, L.extend(data, this.options));
		},

		_tileOnLoad: function (done, tile) {
			// For https://github.com/Leaflet/Leaflet/issues/3332
			if (L.Browser.ielt9) {
				setTimeout(L.bind(done, this, null, tile), 0);
			} else {
				done(null, tile);
			}
		},

		_tileOnError: function (done, tile, e) {
			var errorUrl = this.options.errorTileUrl;
			if (errorUrl) {
				tile.src = errorUrl;
			}
			done(e, tile);
		},

		getTileSize: function () {
			var map = this._map,
			    tileSize = L.GridLayer.prototype.getTileSize.call(this),
			    zoom = this._tileZoom + this.options.zoomOffset,
			    zoomN = this.options.maxNativeZoom;

			// increase tile size when overscaling
			return zoomN !== null && zoom > zoomN ?
					tileSize.divideBy(map.getZoomScale(zoomN, zoom)).round() :
					tileSize;
		},

		_onTileRemove: function (e) {
			e.tile.onload = null;
		},

		_getZoomForUrl: function () {

			var options = this.options,
			    zoom = this._tileZoom;

			if (options.zoomReverse) {
				zoom = options.maxZoom - zoom;
			}

			zoom += options.zoomOffset;

			return options.maxNativeZoom !== null ? Math.min(zoom, options.maxNativeZoom) : zoom;
		},

		_getSubdomain: function (tilePoint) {
			var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
			return this.options.subdomains[index];
		},

		// stops loading all tiles in the background layer
		_abortLoading: function () {
			var i, tile;
			for (i in this._tiles) {
				if (this._tiles[i].coords.z !== this._tileZoom) {
					tile = this._tiles[i].el;

					tile.onload = L.Util.falseFn;
					tile.onerror = L.Util.falseFn;

					if (!tile.complete) {
						tile.src = L.Util.emptyImageUrl;
						L.DomUtil.remove(tile);
					}
				}
			}
		}
	});


	// @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
	// Instantiates a tile layer object given a `URL template` and optionally an options object.

	L.tileLayer = function (url, options) {
		return new L.TileLayer(url, options);
	};



	/*
	 * @class TileLayer.WMS
	 * @inherits TileLayer
	 * @aka L.TileLayer.WMS
	 * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
	 *
	 * @example
	 *
	 * ```js
	 * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
	 * 	layers: 'nexrad-n0r-900913',
	 * 	format: 'image/png',
	 * 	transparent: true,
	 * 	attribution: "Weather data © 2012 IEM Nexrad"
	 * });
	 * ```
	 */

	L.TileLayer.WMS = L.TileLayer.extend({

		// @section
		// @aka TileLayer.WMS options
		// If any custom options not documented here are used, they will be sent to the
		// WMS server as extra parameters in each request URL. This can be useful for
		// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
		defaultWmsParams: {
			service: 'WMS',
			request: 'GetMap',

			// @option layers: String = ''
			// **(required)** Comma-separated list of WMS layers to show.
			layers: '',

			// @option styles: String = ''
			// Comma-separated list of WMS styles.
			styles: '',

			// @option format: String = 'image/jpeg'
			// WMS image format (use `'image/png'` for layers with transparency).
			format: 'image/jpeg',

			// @option transparent: Boolean = false
			// If `true`, the WMS service will return images with transparency.
			transparent: false,

			// @option version: String = '1.1.1'
			// Version of the WMS service to use
			version: '1.1.1'
		},

		options: {
			// @option crs: CRS = null
			// Coordinate Reference System to use for the WMS requests, defaults to
			// map CRS. Don't change this if you're not sure what it means.
			crs: null,

			// @option uppercase: Boolean = false
			// If `true`, WMS request parameter keys will be uppercase.
			uppercase: false
		},

		initialize: function (url, options) {

			this._url = url;

			var wmsParams = L.extend({}, this.defaultWmsParams);

			// all keys that are not TileLayer options go to WMS params
			for (var i in options) {
				if (!(i in this.options)) {
					wmsParams[i] = options[i];
				}
			}

			options = L.setOptions(this, options);

			wmsParams.width = wmsParams.height = options.tileSize * (options.detectRetina && L.Browser.retina ? 2 : 1);

			this.wmsParams = wmsParams;
		},

		onAdd: function (map) {

			this._crs = this.options.crs || map.options.crs;
			this._wmsVersion = parseFloat(this.wmsParams.version);

			var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
			this.wmsParams[projectionKey] = this._crs.code;

			L.TileLayer.prototype.onAdd.call(this, map);
		},

		getTileUrl: function (coords) {

			var tileBounds = this._tileCoordsToBounds(coords),
			    nw = this._crs.project(tileBounds.getNorthWest()),
			    se = this._crs.project(tileBounds.getSouthEast()),

			    bbox = (this._wmsVersion >= 1.3 && this._crs === L.CRS.EPSG4326 ?
				    [se.y, nw.x, nw.y, se.x] :
				    [nw.x, se.y, se.x, nw.y]).join(','),

			    url = L.TileLayer.prototype.getTileUrl.call(this, coords);

			return url +
				L.Util.getParamString(this.wmsParams, url, this.options.uppercase) +
				(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
		},

		// @method setParams(params: Object, noRedraw?: Boolean): this
		// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
		setParams: function (params, noRedraw) {

			L.extend(this.wmsParams, params);

			if (!noRedraw) {
				this.redraw();
			}

			return this;
		}
	});


	// @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
	// Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
	L.tileLayer.wms = function (url, options) {
		return new L.TileLayer.WMS(url, options);
	};



	/*
	 * @class ImageOverlay
	 * @aka L.ImageOverlay
	 * @inherits Interactive layer
	 *
	 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
	 *
	 * @example
	 *
	 * ```js
	 * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
	 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	 * L.imageOverlay(imageUrl, imageBounds).addTo(map);
	 * ```
	 */

	L.ImageOverlay = L.Layer.extend({

		// @section
		// @aka ImageOverlay options
		options: {
			// @option opacity: Number = 1.0
			// The opacity of the image overlay.
			opacity: 1,

			// @option alt: String = ''
			// Text for the `alt` attribute of the image (useful for accessibility).
			alt: '',

			// @option interactive: Boolean = false
			// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
			interactive: false,

			// @option attribution: String = null
			// An optional string containing HTML to be shown on the `Attribution control`
			attribution: null,

			// @option crossOrigin: Boolean = false
			// If true, the image will have its crossOrigin attribute set to ''. This is needed if you want to access image pixel data.
			crossOrigin: false
		},

		initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
			this._url = url;
			this._bounds = L.latLngBounds(bounds);

			L.setOptions(this, options);
		},

		onAdd: function () {
			if (!this._image) {
				this._initImage();

				if (this.options.opacity < 1) {
					this._updateOpacity();
				}
			}

			if (this.options.interactive) {
				L.DomUtil.addClass(this._image, 'leaflet-interactive');
				this.addInteractiveTarget(this._image);
			}

			this.getPane().appendChild(this._image);
			this._reset();
		},

		onRemove: function () {
			L.DomUtil.remove(this._image);
			if (this.options.interactive) {
				this.removeInteractiveTarget(this._image);
			}
		},

		// @method setOpacity(opacity: Number): this
		// Sets the opacity of the overlay.
		setOpacity: function (opacity) {
			this.options.opacity = opacity;

			if (this._image) {
				this._updateOpacity();
			}
			return this;
		},

		setStyle: function (styleOpts) {
			if (styleOpts.opacity) {
				this.setOpacity(styleOpts.opacity);
			}
			return this;
		},

		// @method bringToFront(): this
		// Brings the layer to the top of all overlays.
		bringToFront: function () {
			if (this._map) {
				L.DomUtil.toFront(this._image);
			}
			return this;
		},

		// @method bringToBack(): this
		// Brings the layer to the bottom of all overlays.
		bringToBack: function () {
			if (this._map) {
				L.DomUtil.toBack(this._image);
			}
			return this;
		},

		// @method setUrl(url: String): this
		// Changes the URL of the image.
		setUrl: function (url) {
			this._url = url;

			if (this._image) {
				this._image.src = url;
			}
			return this;
		},

		setBounds: function (bounds) {
			this._bounds = bounds;

			if (this._map) {
				this._reset();
			}
			return this;
		},

		getAttribution: function () {
			return this.options.attribution;
		},

		getEvents: function () {
			var events = {
				zoom: this._reset,
				viewreset: this._reset
			};

			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}

			return events;
		},

		getBounds: function () {
			return this._bounds;
		},

		getElement: function () {
			return this._image;
		},

		_initImage: function () {
			var img = this._image = L.DomUtil.create('img',
					'leaflet-image-layer ' + (this._zoomAnimated ? 'leaflet-zoom-animated' : ''));

			img.onselectstart = L.Util.falseFn;
			img.onmousemove = L.Util.falseFn;

			img.onload = L.bind(this.fire, this, 'load');

			if (this.options.crossOrigin) {
				img.crossOrigin = '';
			}

			img.src = this._url;
			img.alt = this.options.alt;
		},

		_animateZoom: function (e) {
			var scale = this._map.getZoomScale(e.zoom),
			    offset = this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center);

			L.DomUtil.setTransform(this._image, offset, scale);
		},

		_reset: function () {
			var image = this._image,
			    bounds = new L.Bounds(
			        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
			    size = bounds.getSize();

			L.DomUtil.setPosition(image, bounds.min);

			image.style.width  = size.x + 'px';
			image.style.height = size.y + 'px';
		},

		_updateOpacity: function () {
			L.DomUtil.setOpacity(this._image, this.options.opacity);
		}
	});

	// @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
	// Instantiates an image overlay object given the URL of the image and the
	// geographical bounds it is tied to.
	L.imageOverlay = function (url, bounds, options) {
		return new L.ImageOverlay(url, bounds, options);
	};



	/*
	 * @class Icon
	 * @aka L.Icon
	 * @inherits Layer
	 *
	 * Represents an icon to provide when creating a marker.
	 *
	 * @example
	 *
	 * ```js
	 * var myIcon = L.icon({
	 *     iconUrl: 'my-icon.png',
	 *     iconRetinaUrl: 'my-icon@2x.png',
	 *     iconSize: [38, 95],
	 *     iconAnchor: [22, 94],
	 *     popupAnchor: [-3, -76],
	 *     shadowUrl: 'my-icon-shadow.png',
	 *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
	 *     shadowSize: [68, 95],
	 *     shadowAnchor: [22, 94]
	 * });
	 *
	 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
	 * ```
	 *
	 * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
	 *
	 */

	L.Icon = L.Class.extend({

		/* @section
		 * @aka Icon options
		 *
		 * @option iconUrl: String = null
		 * **(required)** The URL to the icon image (absolute or relative to your script path).
		 *
		 * @option iconRetinaUrl: String = null
		 * The URL to a retina sized version of the icon image (absolute or relative to your
		 * script path). Used for Retina screen devices.
		 *
		 * @option iconSize: Point = null
		 * Size of the icon image in pixels.
		 *
		 * @option iconAnchor: Point = null
		 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
		 * will be aligned so that this point is at the marker's geographical location. Centered
		 * by default if size is specified, also can be set in CSS with negative margins.
		 *
		 * @option popupAnchor: Point = null
		 * The coordinates of the point from which popups will "open", relative to the icon anchor.
		 *
		 * @option shadowUrl: String = null
		 * The URL to the icon shadow image. If not specified, no shadow image will be created.
		 *
		 * @option shadowRetinaUrl: String = null
		 *
		 * @option shadowSize: Point = null
		 * Size of the shadow image in pixels.
		 *
		 * @option shadowAnchor: Point = null
		 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
		 * as iconAnchor if not specified).
		 *
		 * @option className: String = ''
		 * A custom class name to assign to both icon and shadow images. Empty by default.
		 */

		initialize: function (options) {
			L.setOptions(this, options);
		},

		// @method createIcon(oldIcon?: HTMLElement): HTMLElement
		// Called internally when the icon has to be shown, returns a `<img>` HTML element
		// styled according to the options.
		createIcon: function (oldIcon) {
			return this._createIcon('icon', oldIcon);
		},

		// @method createShadow(oldIcon?: HTMLElement): HTMLElement
		// As `createIcon`, but for the shadow beneath it.
		createShadow: function (oldIcon) {
			return this._createIcon('shadow', oldIcon);
		},

		_createIcon: function (name, oldIcon) {
			var src = this._getIconUrl(name);

			if (!src) {
				if (name === 'icon') {
					throw new Error('iconUrl not set in Icon options (see the docs).');
				}
				return null;
			}

			var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
			this._setIconStyles(img, name);

			return img;
		},

		_setIconStyles: function (img, name) {
			var options = this.options;
			var sizeOption = options[name + 'Size'];

			if (typeof sizeOption === 'number') {
				sizeOption = [sizeOption, sizeOption];
			}

			var size = L.point(sizeOption),
			    anchor = L.point(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
			            size && size.divideBy(2, true));

			img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

			if (anchor) {
				img.style.marginLeft = (-anchor.x) + 'px';
				img.style.marginTop  = (-anchor.y) + 'px';
			}

			if (size) {
				img.style.width  = size.x + 'px';
				img.style.height = size.y + 'px';
			}
		},

		_createImg: function (src, el) {
			el = el || document.createElement('img');
			el.src = src;
			return el;
		},

		_getIconUrl: function (name) {
			return L.Browser.retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
		}
	});


	// @factory L.icon(options: Icon options)
	// Creates an icon instance with the given options.
	L.icon = function (options) {
		return new L.Icon(options);
	};



	/*
	 * @miniclass Icon.Default (Icon)
	 * @aka L.Icon.Default
	 * @section
	 *
	 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
	 * no icon is specified. Points to the blue marker image distributed with Leaflet
	 * releases.
	 *
	 * In order to change the default icon, just change the properties of `L.Icon.Default.prototype.options`
	 * (which is a set of `Icon options`).
	 */

	L.Icon.Default = L.Icon.extend({

		options: {
			iconUrl:       'marker-icon.png',
			iconRetinaUrl: 'marker-icon-2x.png',
			shadowUrl:     'marker-shadow.png',
			iconSize:    [25, 41],
			iconAnchor:  [12, 41],
			popupAnchor: [1, -34],
			tooltipAnchor: [16, -28],
			shadowSize:  [41, 41]
		},

		_getIconUrl: function (name) {
			if (!L.Icon.Default.imagePath) {	// Deprecated, backwards-compatibility only
				L.Icon.Default.imagePath = this._detectIconPath();
			}

			// @option imagePath: String
			// `L.Icon.Default` will try to auto-detect the absolute location of the
			// blue icon images. If you are placing these images in a non-standard
			// way, set this option to point to the right absolute path.
			return (this.options.imagePath || L.Icon.Default.imagePath) + L.Icon.prototype._getIconUrl.call(this, name);
		},

		_detectIconPath: function () {
			var el = L.DomUtil.create('div',  'leaflet-default-icon-path', document.body);
			var path = L.DomUtil.getStyle(el, 'background-image') ||
			           L.DomUtil.getStyle(el, 'backgroundImage');	// IE8

			document.body.removeChild(el);

			return path.indexOf('url') === 0 ?
				path.replace(/^url\([\"\']?/, '').replace(/marker-icon\.png[\"\']?\)$/, '') : '';
		}
	});



	/*
	 * @class Marker
	 * @inherits Interactive layer
	 * @aka L.Marker
	 * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
	 *
	 * @example
	 *
	 * ```js
	 * L.marker([50.5, 30.5]).addTo(map);
	 * ```
	 */

	L.Marker = L.Layer.extend({

		// @section
		// @aka Marker options
		options: {
			// @option icon: Icon = *
			// Icon class to use for rendering the marker. See [Icon documentation](#L.Icon) for details on how to customize the marker icon. If not specified, a new `L.Icon.Default` is used.
			icon: new L.Icon.Default(),

			// Option inherited from "Interactive layer" abstract class
			interactive: true,

			// @option draggable: Boolean = false
			// Whether the marker is draggable with mouse/touch or not.
			draggable: false,

			// @option keyboard: Boolean = true
			// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
			keyboard: true,

			// @option title: String = ''
			// Text for the browser tooltip that appear on marker hover (no tooltip by default).
			title: '',

			// @option alt: String = ''
			// Text for the `alt` attribute of the icon image (useful for accessibility).
			alt: '',

			// @option zIndexOffset: Number = 0
			// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
			zIndexOffset: 0,

			// @option opacity: Number = 1.0
			// The opacity of the marker.
			opacity: 1,

			// @option riseOnHover: Boolean = false
			// If `true`, the marker will get on top of others when you hover the mouse over it.
			riseOnHover: false,

			// @option riseOffset: Number = 250
			// The z-index offset used for the `riseOnHover` feature.
			riseOffset: 250,

			// @option pane: String = 'markerPane'
			// `Map pane` where the markers icon will be added.
			pane: 'markerPane',

			// FIXME: shadowPane is no longer a valid option
			nonBubblingEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu']
		},

		/* @section
		 *
		 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
		 */

		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
		},

		onAdd: function (map) {
			this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

			if (this._zoomAnimated) {
				map.on('zoomanim', this._animateZoom, this);
			}

			this._initIcon();
			this.update();
		},

		onRemove: function (map) {
			if (this.dragging && this.dragging.enabled()) {
				this.options.draggable = true;
				this.dragging.removeHooks();
			}

			if (this._zoomAnimated) {
				map.off('zoomanim', this._animateZoom, this);
			}

			this._removeIcon();
			this._removeShadow();
		},

		getEvents: function () {
			return {
				zoom: this.update,
				viewreset: this.update
			};
		},

		// @method getLatLng: LatLng
		// Returns the current geographical position of the marker.
		getLatLng: function () {
			return this._latlng;
		},

		// @method setLatLng(latlng: LatLng): this
		// Changes the marker position to the given point.
		setLatLng: function (latlng) {
			var oldLatLng = this._latlng;
			this._latlng = L.latLng(latlng);
			this.update();

			// @event move: Event
			// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
			return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
		},

		// @method setZIndexOffset(offset: Number): this
		// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
		setZIndexOffset: function (offset) {
			this.options.zIndexOffset = offset;
			return this.update();
		},

		// @method setIcon(icon: Icon): this
		// Changes the marker icon.
		setIcon: function (icon) {

			this.options.icon = icon;

			if (this._map) {
				this._initIcon();
				this.update();
			}

			if (this._popup) {
				this.bindPopup(this._popup, this._popup.options);
			}

			return this;
		},

		getElement: function () {
			return this._icon;
		},

		update: function () {

			if (this._icon) {
				var pos = this._map.latLngToLayerPoint(this._latlng).round();
				this._setPos(pos);
			}

			return this;
		},

		_initIcon: function () {
			var options = this.options,
			    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

			var icon = options.icon.createIcon(this._icon),
			    addIcon = false;

			// if we're not reusing the icon, remove the old one and init new one
			if (icon !== this._icon) {
				if (this._icon) {
					this._removeIcon();
				}
				addIcon = true;

				if (options.title) {
					icon.title = options.title;
				}
				if (options.alt) {
					icon.alt = options.alt;
				}
			}

			L.DomUtil.addClass(icon, classToAdd);

			if (options.keyboard) {
				icon.tabIndex = '0';
			}

			this._icon = icon;

			if (options.riseOnHover) {
				this.on({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				});
			}

			var newShadow = options.icon.createShadow(this._shadow),
			    addShadow = false;

			if (newShadow !== this._shadow) {
				this._removeShadow();
				addShadow = true;
			}

			if (newShadow) {
				L.DomUtil.addClass(newShadow, classToAdd);
			}
			this._shadow = newShadow;


			if (options.opacity < 1) {
				this._updateOpacity();
			}


			if (addIcon) {
				this.getPane().appendChild(this._icon);
			}
			this._initInteraction();
			if (newShadow && addShadow) {
				this.getPane('shadowPane').appendChild(this._shadow);
			}
		},

		_removeIcon: function () {
			if (this.options.riseOnHover) {
				this.off({
					mouseover: this._bringToFront,
					mouseout: this._resetZIndex
				});
			}

			L.DomUtil.remove(this._icon);
			this.removeInteractiveTarget(this._icon);

			this._icon = null;
		},

		_removeShadow: function () {
			if (this._shadow) {
				L.DomUtil.remove(this._shadow);
			}
			this._shadow = null;
		},

		_setPos: function (pos) {
			L.DomUtil.setPosition(this._icon, pos);

			if (this._shadow) {
				L.DomUtil.setPosition(this._shadow, pos);
			}

			this._zIndex = pos.y + this.options.zIndexOffset;

			this._resetZIndex();
		},

		_updateZIndex: function (offset) {
			this._icon.style.zIndex = this._zIndex + offset;
		},

		_animateZoom: function (opt) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

			this._setPos(pos);
		},

		_initInteraction: function () {

			if (!this.options.interactive) { return; }

			L.DomUtil.addClass(this._icon, 'leaflet-interactive');

			this.addInteractiveTarget(this._icon);

			if (L.Handler.MarkerDrag) {
				var draggable = this.options.draggable;
				if (this.dragging) {
					draggable = this.dragging.enabled();
					this.dragging.disable();
				}

				this.dragging = new L.Handler.MarkerDrag(this);

				if (draggable) {
					this.dragging.enable();
				}
			}
		},

		// @method setOpacity(opacity: Number): this
		// Changes the opacity of the marker.
		setOpacity: function (opacity) {
			this.options.opacity = opacity;
			if (this._map) {
				this._updateOpacity();
			}

			return this;
		},

		_updateOpacity: function () {
			var opacity = this.options.opacity;

			L.DomUtil.setOpacity(this._icon, opacity);

			if (this._shadow) {
				L.DomUtil.setOpacity(this._shadow, opacity);
			}
		},

		_bringToFront: function () {
			this._updateZIndex(this.options.riseOffset);
		},

		_resetZIndex: function () {
			this._updateZIndex(0);
		}
	});


	// factory L.marker(latlng: LatLng, options? : Marker options)

	// @factory L.marker(latlng: LatLng, options? : Marker options)
	// Instantiates a Marker object given a geographical point and optionally an options object.
	L.marker = function (latlng, options) {
		return new L.Marker(latlng, options);
	};



	/*
	 * @class DivIcon
	 * @aka L.DivIcon
	 * @inherits Icon
	 *
	 * Represents a lightweight icon for markers that uses a simple `<div>`
	 * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
	 *
	 * @example
	 * ```js
	 * var myIcon = L.divIcon({className: 'my-div-icon'});
	 * // you can set .my-div-icon styles in CSS
	 *
	 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
	 * ```
	 *
	 * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
	 */

	L.DivIcon = L.Icon.extend({
		options: {
			// @section
			// @aka DivIcon options
			iconSize: [12, 12], // also can be set through CSS

			// iconAnchor: (Point),
			// popupAnchor: (Point),

			// @option html: String = ''
			// Custom HTML code to put inside the div element, empty by default.
			html: false,

			// @option bgPos: Point = [0, 0]
			// Optional relative position of the background, in pixels
			bgPos: null,

			className: 'leaflet-div-icon'
		},

		createIcon: function (oldIcon) {
			var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
			    options = this.options;

			div.innerHTML = options.html !== false ? options.html : '';

			if (options.bgPos) {
				var bgPos = L.point(options.bgPos);
				div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
			}
			this._setIconStyles(div, 'icon');

			return div;
		},

		createShadow: function () {
			return null;
		}
	});

	// @factory L.divIcon(options: DivIcon options)
	// Creates a `DivIcon` instance with the given options.
	L.divIcon = function (options) {
		return new L.DivIcon(options);
	};



	/*
	 * @class DivOverlay
	 * @inherits Layer
	 * @aka L.DivOverlay
	 * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
	 */

	// @namespace DivOverlay
	L.DivOverlay = L.Layer.extend({

		// @section
		// @aka DivOverlay options
		options: {
			// @option offset: Point = Point(0, 7)
			// The offset of the popup position. Useful to control the anchor
			// of the popup when opening it on some overlays.
			offset: [0, 7],

			// @option className: String = ''
			// A custom CSS class name to assign to the popup.
			className: '',

			// @option pane: String = 'popupPane'
			// `Map pane` where the popup will be added.
			pane: 'popupPane'
		},

		initialize: function (options, source) {
			L.setOptions(this, options);

			this._source = source;
		},

		onAdd: function (map) {
			this._zoomAnimated = map._zoomAnimated;

			if (!this._container) {
				this._initLayout();
			}

			if (map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, 0);
			}

			clearTimeout(this._removeTimeout);
			this.getPane().appendChild(this._container);
			this.update();

			if (map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, 1);
			}

			this.bringToFront();
		},

		onRemove: function (map) {
			if (map._fadeAnimated) {
				L.DomUtil.setOpacity(this._container, 0);
				this._removeTimeout = setTimeout(L.bind(L.DomUtil.remove, L.DomUtil, this._container), 200);
			} else {
				L.DomUtil.remove(this._container);
			}
		},

		// @namespace Popup
		// @method getLatLng: LatLng
		// Returns the geographical point of popup.
		getLatLng: function () {
			return this._latlng;
		},

		// @method setLatLng(latlng: LatLng): this
		// Sets the geographical point where the popup will open.
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			if (this._map) {
				this._updatePosition();
				this._adjustPan();
			}
			return this;
		},

		// @method getContent: String|HTMLElement
		// Returns the content of the popup.
		getContent: function () {
			return this._content;
		},

		// @method setContent(htmlContent: String|HTMLElement|Function): this
		// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
		setContent: function (content) {
			this._content = content;
			this.update();
			return this;
		},

		// @method getElement: String|HTMLElement
		// Alias for [getContent()](#popup-getcontent)
		getElement: function () {
			return this._container;
		},

		// @method update: null
		// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
		update: function () {
			if (!this._map) { return; }

			this._container.style.visibility = 'hidden';

			this._updateContent();
			this._updateLayout();
			this._updatePosition();

			this._container.style.visibility = '';

			this._adjustPan();
		},

		getEvents: function () {
			var events = {
				zoom: this._updatePosition,
				viewreset: this._updatePosition
			};

			if (this._zoomAnimated) {
				events.zoomanim = this._animateZoom;
			}
			return events;
		},

		// @method isOpen: Boolean
		// Returns `true` when the popup is visible on the map.
		isOpen: function () {
			return !!this._map && this._map.hasLayer(this);
		},

		// @method bringToFront: this
		// Brings this popup in front of other popups (in the same map pane).
		bringToFront: function () {
			if (this._map) {
				L.DomUtil.toFront(this._container);
			}
			return this;
		},

		// @method bringToBack: this
		// Brings this popup to the back of other popups (in the same map pane).
		bringToBack: function () {
			if (this._map) {
				L.DomUtil.toBack(this._container);
			}
			return this;
		},

		_updateContent: function () {
			if (!this._content) { return; }

			var node = this._contentNode;
			var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

			if (typeof content === 'string') {
				node.innerHTML = content;
			} else {
				while (node.hasChildNodes()) {
					node.removeChild(node.firstChild);
				}
				node.appendChild(content);
			}
			this.fire('contentupdate');
		},

		_updatePosition: function () {
			if (!this._map) { return; }

			var pos = this._map.latLngToLayerPoint(this._latlng),
			    offset = L.point(this.options.offset),
			    anchor = this._getAnchor();

			if (this._zoomAnimated) {
				L.DomUtil.setPosition(this._container, pos.add(anchor));
			} else {
				offset = offset.add(pos).add(anchor);
			}

			var bottom = this._containerBottom = -offset.y,
			    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

			// bottom position the popup in case the height of the popup changes (images loading etc)
			this._container.style.bottom = bottom + 'px';
			this._container.style.left = left + 'px';
		},

		_getAnchor: function () {
			return [0, 0];
		}

	});



	/*
	 * @class Popup
	 * @inherits DivOverlay
	 * @aka L.Popup
	 * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
	 * open popups while making sure that only one popup is open at one time
	 * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
	 *
	 * @example
	 *
	 * If you want to just bind a popup to marker click and then open it, it's really easy:
	 *
	 * ```js
	 * marker.bindPopup(popupContent).openPopup();
	 * ```
	 * Path overlays like polylines also have a `bindPopup` method.
	 * Here's a more complicated way to open a popup on a map:
	 *
	 * ```js
	 * var popup = L.popup()
	 * 	.setLatLng(latlng)
	 * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
	 * 	.openOn(map);
	 * ```
	 */


	// @namespace Popup
	L.Popup = L.DivOverlay.extend({

		// @section
		// @aka Popup options
		options: {
			// @option maxWidth: Number = 300
			// Max width of the popup, in pixels.
			maxWidth: 300,

			// @option minWidth: Number = 50
			// Min width of the popup, in pixels.
			minWidth: 50,

			// @option maxHeight: Number = null
			// If set, creates a scrollable container of the given height
			// inside a popup if its content exceeds it.
			maxHeight: null,

			// @option autoPan: Boolean = true
			// Set it to `false` if you don't want the map to do panning animation
			// to fit the opened popup.
			autoPan: true,

			// @option autoPanPaddingTopLeft: Point = null
			// The margin between the popup and the top left corner of the map
			// view after autopanning was performed.
			autoPanPaddingTopLeft: null,

			// @option autoPanPaddingBottomRight: Point = null
			// The margin between the popup and the bottom right corner of the map
			// view after autopanning was performed.
			autoPanPaddingBottomRight: null,

			// @option autoPanPadding: Point = Point(5, 5)
			// Equivalent of setting both top left and bottom right autopan padding to the same value.
			autoPanPadding: [5, 5],

			// @option keepInView: Boolean = false
			// Set it to `true` if you want to prevent users from panning the popup
			// off of the screen while it is open.
			keepInView: false,

			// @option closeButton: Boolean = true
			// Controls the presence of a close button in the popup.
			closeButton: true,

			// @option autoClose: Boolean = true
			// Set it to `false` if you want to override the default behavior of
			// the popup closing when user clicks the map (set globally by
			// the Map's [closePopupOnClick](#map-closepopuponclick) option).
			autoClose: true,

			// @option className: String = ''
			// A custom CSS class name to assign to the popup.
			className: ''
		},

		// @namespace Popup
		// @method openOn(map: Map): this
		// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
		openOn: function (map) {
			map.openPopup(this);
			return this;
		},

		onAdd: function (map) {
			L.DivOverlay.prototype.onAdd.call(this, map);

			// @namespace Map
			// @section Popup events
			// @event popupopen: PopupEvent
			// Fired when a popup is opened in the map
			map.fire('popupopen', {popup: this});

			if (this._source) {
				// @namespace Layer
				// @section Popup events
				// @event popupopen: PopupEvent
				// Fired when a popup bound to this layer is opened
				this._source.fire('popupopen', {popup: this}, true);
				// For non-path layers, we toggle the popup when clicking
				// again the layer, so prevent the map to reopen it.
				if (!(this._source instanceof L.Path)) {
					this._source.on('preclick', L.DomEvent.stopPropagation);
				}
			}
		},

		onRemove: function (map) {
			L.DivOverlay.prototype.onRemove.call(this, map);

			// @namespace Map
			// @section Popup events
			// @event popupclose: PopupEvent
			// Fired when a popup in the map is closed
			map.fire('popupclose', {popup: this});

			if (this._source) {
				// @namespace Layer
				// @section Popup events
				// @event popupclose: PopupEvent
				// Fired when a popup bound to this layer is closed
				this._source.fire('popupclose', {popup: this}, true);
				if (!(this._source instanceof L.Path)) {
					this._source.off('preclick', L.DomEvent.stopPropagation);
				}
			}
		},

		getEvents: function () {
			var events = L.DivOverlay.prototype.getEvents.call(this);

			if ('closeOnClick' in this.options ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
				events.preclick = this._close;
			}

			if (this.options.keepInView) {
				events.moveend = this._adjustPan;
			}

			return events;
		},

		_close: function () {
			if (this._map) {
				this._map.closePopup(this);
			}
		},

		_initLayout: function () {
			var prefix = 'leaflet-popup',
			    container = this._container = L.DomUtil.create('div',
				prefix + ' ' + (this.options.className || '') +
				' leaflet-zoom-animated');

			if (this.options.closeButton) {
				var closeButton = this._closeButton = L.DomUtil.create('a', prefix + '-close-button', container);
				closeButton.href = '#close';
				closeButton.innerHTML = '&#215;';

				L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
			}

			var wrapper = this._wrapper = L.DomUtil.create('div', prefix + '-content-wrapper', container);
			this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

			L.DomEvent
				.disableClickPropagation(wrapper)
				.disableScrollPropagation(this._contentNode)
				.on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);

			this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
			this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
		},

		_updateLayout: function () {
			var container = this._contentNode,
			    style = container.style;

			style.width = '';
			style.whiteSpace = 'nowrap';

			var width = container.offsetWidth;
			width = Math.min(width, this.options.maxWidth);
			width = Math.max(width, this.options.minWidth);

			style.width = (width + 1) + 'px';
			style.whiteSpace = '';

			style.height = '';

			var height = container.offsetHeight,
			    maxHeight = this.options.maxHeight,
			    scrolledClass = 'leaflet-popup-scrolled';

			if (maxHeight && height > maxHeight) {
				style.height = maxHeight + 'px';
				L.DomUtil.addClass(container, scrolledClass);
			} else {
				L.DomUtil.removeClass(container, scrolledClass);
			}

			this._containerWidth = this._container.offsetWidth;
		},

		_animateZoom: function (e) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
			    anchor = this._getAnchor();
			L.DomUtil.setPosition(this._container, pos.add(anchor));
		},

		_adjustPan: function () {
			if (!this.options.autoPan || (this._map._panAnim && this._map._panAnim._inProgress)) { return; }

			var map = this._map,
			    marginBottom = parseInt(L.DomUtil.getStyle(this._container, 'marginBottom'), 10) || 0,
			    containerHeight = this._container.offsetHeight + marginBottom,
			    containerWidth = this._containerWidth,
			    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

			layerPos._add(L.DomUtil.getPosition(this._container));

			var containerPos = map.layerPointToContainerPoint(layerPos),
			    padding = L.point(this.options.autoPanPadding),
			    paddingTL = L.point(this.options.autoPanPaddingTopLeft || padding),
			    paddingBR = L.point(this.options.autoPanPaddingBottomRight || padding),
			    size = map.getSize(),
			    dx = 0,
			    dy = 0;

			if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
				dx = containerPos.x + containerWidth - size.x + paddingBR.x;
			}
			if (containerPos.x - dx - paddingTL.x < 0) { // left
				dx = containerPos.x - paddingTL.x;
			}
			if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
				dy = containerPos.y + containerHeight - size.y + paddingBR.y;
			}
			if (containerPos.y - dy - paddingTL.y < 0) { // top
				dy = containerPos.y - paddingTL.y;
			}

			// @namespace Map
			// @section Popup events
			// @event autopanstart: Event
			// Fired when the map starts autopanning when opening a popup.
			if (dx || dy) {
				map
				    .fire('autopanstart')
				    .panBy([dx, dy]);
			}
		},

		_onCloseButtonClick: function (e) {
			this._close();
			L.DomEvent.stop(e);
		},

		_getAnchor: function () {
			// Where should we anchor the popup on the source layer?
			return L.point(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
		}

	});

	// @namespace Popup
	// @factory L.popup(options?: Popup options, source?: Layer)
	// Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
	L.popup = function (options, source) {
		return new L.Popup(options, source);
	};


	/* @namespace Map
	 * @section Interaction Options
	 * @option closePopupOnClick: Boolean = true
	 * Set it to `false` if you don't want popups to close when user clicks the map.
	 */
	L.Map.mergeOptions({
		closePopupOnClick: true
	});


	// @namespace Map
	// @section Methods for Layers and Controls
	L.Map.include({
		// @method openPopup(popup: Popup): this
		// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
		// @alternative
		// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
		// Creates a popup with the specified content and options and opens it in the given point on a map.
		openPopup: function (popup, latlng, options) {
			if (!(popup instanceof L.Popup)) {
				popup = new L.Popup(options).setContent(popup);
			}

			if (latlng) {
				popup.setLatLng(latlng);
			}

			if (this.hasLayer(popup)) {
				return this;
			}

			if (this._popup && this._popup.options.autoClose) {
				this.closePopup();
			}

			this._popup = popup;
			return this.addLayer(popup);
		},

		// @method closePopup(popup?: Popup): this
		// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
		closePopup: function (popup) {
			if (!popup || popup === this._popup) {
				popup = this._popup;
				this._popup = null;
			}
			if (popup) {
				this.removeLayer(popup);
			}
			return this;
		}
	});



	/*
	 * @namespace Layer
	 * @section Popup methods example
	 *
	 * All layers share a set of methods convenient for binding popups to it.
	 *
	 * ```js
	 * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
	 * layer.openPopup();
	 * layer.closePopup();
	 * ```
	 *
	 * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
	 */

	// @section Popup methods
	L.Layer.include({

		// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
		// Binds a popup to the layer with the passed `content` and sets up the
		// neccessary event listeners. If a `Function` is passed it will receive
		// the layer as the first argument and should return a `String` or `HTMLElement`.
		bindPopup: function (content, options) {

			if (content instanceof L.Popup) {
				L.setOptions(content, options);
				this._popup = content;
				content._source = this;
			} else {
				if (!this._popup || options) {
					this._popup = new L.Popup(options, this);
				}
				this._popup.setContent(content);
			}

			if (!this._popupHandlersAdded) {
				this.on({
					click: this._openPopup,
					remove: this.closePopup,
					move: this._movePopup
				});
				this._popupHandlersAdded = true;
			}

			return this;
		},

		// @method unbindPopup(): this
		// Removes the popup previously bound with `bindPopup`.
		unbindPopup: function () {
			if (this._popup) {
				this.off({
					click: this._openPopup,
					remove: this.closePopup,
					move: this._movePopup
				});
				this._popupHandlersAdded = false;
				this._popup = null;
			}
			return this;
		},

		// @method openPopup(latlng?: LatLng): this
		// Opens the bound popup at the specificed `latlng` or at the default popup anchor if no `latlng` is passed.
		openPopup: function (layer, latlng) {
			if (!(layer instanceof L.Layer)) {
				latlng = layer;
				layer = this;
			}

			if (layer instanceof L.FeatureGroup) {
				for (var id in this._layers) {
					layer = this._layers[id];
					break;
				}
			}

			if (!latlng) {
				latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
			}

			if (this._popup && this._map) {
				// set popup source to this layer
				this._popup._source = layer;

				// update the popup (content, layout, ect...)
				this._popup.update();

				// open the popup on the map
				this._map.openPopup(this._popup, latlng);
			}

			return this;
		},

		// @method closePopup(): this
		// Closes the popup bound to this layer if it is open.
		closePopup: function () {
			if (this._popup) {
				this._popup._close();
			}
			return this;
		},

		// @method togglePopup(): this
		// Opens or closes the popup bound to this layer depending on its current state.
		togglePopup: function (target) {
			if (this._popup) {
				if (this._popup._map) {
					this.closePopup();
				} else {
					this.openPopup(target);
				}
			}
			return this;
		},

		// @method isPopupOpen(): boolean
		// Returns `true` if the popup bound to this layer is currently open.
		isPopupOpen: function () {
			return this._popup.isOpen();
		},

		// @method setPopupContent(content: String|HTMLElement|Popup): this
		// Sets the content of the popup bound to this layer.
		setPopupContent: function (content) {
			if (this._popup) {
				this._popup.setContent(content);
			}
			return this;
		},

		// @method getPopup(): Popup
		// Returns the popup bound to this layer.
		getPopup: function () {
			return this._popup;
		},

		_openPopup: function (e) {
			var layer = e.layer || e.target;

			if (!this._popup) {
				return;
			}

			if (!this._map) {
				return;
			}

			// prevent map click
			L.DomEvent.stop(e);

			// if this inherits from Path its a vector and we can just
			// open the popup at the new location
			if (layer instanceof L.Path) {
				this.openPopup(e.layer || e.target, e.latlng);
				return;
			}

			// otherwise treat it like a marker and figure out
			// if we should toggle it open/closed
			if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
				this.closePopup();
			} else {
				this.openPopup(layer, e.latlng);
			}
		},

		_movePopup: function (e) {
			this._popup.setLatLng(e.latlng);
		}
	});



	/*
	 * Popup extension to L.Marker, adding popup-related methods.
	 */

	L.Marker.include({
		_getPopupAnchor: function () {
			return this.options.icon.options.popupAnchor || [0, 0];
		}
	});



	/*
	 * @class Tooltip
	 * @inherits DivOverlay
	 * @aka L.Tooltip
	 * Used to display small texts on top of map layers.
	 *
	 * @example
	 *
	 * ```js
	 * marker.bindTooltip("my tooltip text").openTooltip();
	 * ```
	 * Note about tooltip offset. Leaflet takes two options in consideration
	 * for computing tooltip offseting:
	 * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
	 *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
	 *   move it to the bottom. Negatives will move to the left and top.
	 * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
	 *   should adapt this value if you use a custom icon.
	 */


	// @namespace Tooltip
	L.Tooltip = L.DivOverlay.extend({

		// @section
		// @aka Tooltip options
		options: {
			// @option pane: String = 'tooltipPane'
			// `Map pane` where the tooltip will be added.
			pane: 'tooltipPane',

			// @option offset: Point = Point(0, 0)
			// Optional offset of the tooltip position.
			offset: [0, 0],

			// @option direction: String = 'auto'
			// Direction where to open the tooltip. Possible values are: `right`, `left`,
			// `top`, `bottom`, `center`, `auto`.
			// `auto` will dynamicaly switch between `right` and `left` according to the tooltip
			// position on the map.
			direction: 'auto',

			// @option permanent: Boolean = false
			// Whether to open the tooltip permanently or only on mouseover.
			permanent: false,

			// @option sticky: Boolean = false
			// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
			sticky: false,

			// @option interactive: Boolean = false
			// If true, the tooltip will listen to the feature events.
			interactive: false,

			// @option opacity: Number = 0.9
			// Tooltip container opacity.
			opacity: 0.9
		},

		onAdd: function (map) {
			L.DivOverlay.prototype.onAdd.call(this, map);
			this.setOpacity(this.options.opacity);

			// @namespace Map
			// @section Tooltip events
			// @event tooltipopen: TooltipEvent
			// Fired when a tooltip is opened in the map.
			map.fire('tooltipopen', {tooltip: this});

			if (this._source) {
				// @namespace Layer
				// @section Tooltip events
				// @event tooltipopen: TooltipEvent
				// Fired when a tooltip bound to this layer is opened.
				this._source.fire('tooltipopen', {tooltip: this}, true);
			}
		},

		onRemove: function (map) {
			L.DivOverlay.prototype.onRemove.call(this, map);

			// @namespace Map
			// @section Tooltip events
			// @event tooltipclose: TooltipEvent
			// Fired when a tooltip in the map is closed.
			map.fire('tooltipclose', {tooltip: this});

			if (this._source) {
				// @namespace Layer
				// @section Tooltip events
				// @event tooltipclose: TooltipEvent
				// Fired when a tooltip bound to this layer is closed.
				this._source.fire('tooltipclose', {tooltip: this}, true);
			}
		},

		getEvents: function () {
			var events = L.DivOverlay.prototype.getEvents.call(this);

			if (L.Browser.touch && !this.options.permanent) {
				events.preclick = this._close;
			}

			return events;
		},

		_close: function () {
			if (this._map) {
				this._map.closeTooltip(this);
			}
		},

		_initLayout: function () {
			var prefix = 'leaflet-tooltip',
			    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

			this._contentNode = this._container = L.DomUtil.create('div', className);
		},

		_updateLayout: function () {},

		_adjustPan: function () {},

		_setPosition: function (pos) {
			var map = this._map,
			    container = this._container,
			    centerPoint = map.latLngToContainerPoint(map.getCenter()),
			    tooltipPoint = map.layerPointToContainerPoint(pos),
			    direction = this.options.direction,
			    tooltipWidth = container.offsetWidth,
			    tooltipHeight = container.offsetHeight,
			    offset = L.point(this.options.offset),
			    anchor = this._getAnchor();

			if (direction === 'top') {
				pos = pos.add(L.point(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y));
			} else if (direction === 'bottom') {
				pos = pos.subtract(L.point(tooltipWidth / 2 - offset.x, -offset.y));
			} else if (direction === 'center') {
				pos = pos.subtract(L.point(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y));
			} else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
				direction = 'right';
				pos = pos.add([offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y]);
			} else {
				direction = 'left';
				pos = pos.subtract(L.point(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y));
			}

			L.DomUtil.removeClass(container, 'leaflet-tooltip-right');
			L.DomUtil.removeClass(container, 'leaflet-tooltip-left');
			L.DomUtil.removeClass(container, 'leaflet-tooltip-top');
			L.DomUtil.removeClass(container, 'leaflet-tooltip-bottom');
			L.DomUtil.addClass(container, 'leaflet-tooltip-' + direction);
			L.DomUtil.setPosition(container, pos);
		},

		_updatePosition: function () {
			var pos = this._map.latLngToLayerPoint(this._latlng);
			this._setPosition(pos);
		},

		setOpacity: function (opacity) {
			this.options.opacity = opacity;

			if (this._container) {
				L.DomUtil.setOpacity(this._container, opacity);
			}
		},

		_animateZoom: function (e) {
			var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
			this._setPosition(pos);
		},

		_getAnchor: function () {
			// Where should we anchor the tooltip on the source layer?
			return L.point(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
		}

	});

	// @namespace Tooltip
	// @factory L.tooltip(options?: Tooltip options, source?: Layer)
	// Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
	L.tooltip = function (options, source) {
		return new L.Tooltip(options, source);
	};

	// @namespace Map
	// @section Methods for Layers and Controls
	L.Map.include({

		// @method openTooltip(tooltip: Tooltip): this
		// Opens the specified tooltip.
		// @alternative
		// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
		// Creates a tooltip with the specified content and options and open it.
		openTooltip: function (tooltip, latlng, options) {
			if (!(tooltip instanceof L.Tooltip)) {
				tooltip = new L.Tooltip(options).setContent(tooltip);
			}

			if (latlng) {
				tooltip.setLatLng(latlng);
			}

			if (this.hasLayer(tooltip)) {
				return this;
			}

			return this.addLayer(tooltip);
		},

		// @method closeTooltip(tooltip?: Tooltip): this
		// Closes the tooltip given as parameter.
		closeTooltip: function (tooltip) {
			if (tooltip) {
				this.removeLayer(tooltip);
			}
			return this;
		}

	});



	/*
	 * @namespace Layer
	 * @section Tooltip methods example
	 *
	 * All layers share a set of methods convenient for binding tooltips to it.
	 *
	 * ```js
	 * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
	 * layer.openTooltip();
	 * layer.closeTooltip();
	 * ```
	 */

	// @section Tooltip methods
	L.Layer.include({

		// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
		// Binds a tooltip to the layer with the passed `content` and sets up the
		// neccessary event listeners. If a `Function` is passed it will receive
		// the layer as the first argument and should return a `String` or `HTMLElement`.
		bindTooltip: function (content, options) {

			if (content instanceof L.Tooltip) {
				L.setOptions(content, options);
				this._tooltip = content;
				content._source = this;
			} else {
				if (!this._tooltip || options) {
					this._tooltip = L.tooltip(options, this);
				}
				this._tooltip.setContent(content);

			}

			this._initTooltipInteractions();

			if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
				this.openTooltip();
			}

			return this;
		},

		// @method unbindTooltip(): this
		// Removes the tooltip previously bound with `bindTooltip`.
		unbindTooltip: function () {
			if (this._tooltip) {
				this._initTooltipInteractions(true);
				this.closeTooltip();
				this._tooltip = null;
			}
			return this;
		},

		_initTooltipInteractions: function (remove) {
			if (!remove && this._tooltipHandlersAdded) { return; }
			var onOff = remove ? 'off' : 'on',
			    events = {
				remove: this.closeTooltip,
				move: this._moveTooltip
			    };
			if (!this._tooltip.options.permanent) {
				events.mouseover = this._openTooltip;
				events.mouseout = this.closeTooltip;
				if (this._tooltip.options.sticky) {
					events.mousemove = this._moveTooltip;
				}
				if (L.Browser.touch) {
					events.click = this._openTooltip;
				}
			} else {
				events.add = this._openTooltip;
			}
			this[onOff](events);
			this._tooltipHandlersAdded = !remove;
		},

		// @method openTooltip(latlng?: LatLng): this
		// Opens the bound tooltip at the specificed `latlng` or at the default tooltip anchor if no `latlng` is passed.
		openTooltip: function (layer, latlng) {
			if (!(layer instanceof L.Layer)) {
				latlng = layer;
				layer = this;
			}

			if (layer instanceof L.FeatureGroup) {
				for (var id in this._layers) {
					layer = this._layers[id];
					break;
				}
			}

			if (!latlng) {
				latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
			}

			if (this._tooltip && this._map) {

				// set tooltip source to this layer
				this._tooltip._source = layer;

				// update the tooltip (content, layout, ect...)
				this._tooltip.update();

				// open the tooltip on the map
				this._map.openTooltip(this._tooltip, latlng);

				// Tooltip container may not be defined if not permanent and never
				// opened.
				if (this._tooltip.options.interactive && this._tooltip._container) {
					L.DomUtil.addClass(this._tooltip._container, 'leaflet-clickable');
					this.addInteractiveTarget(this._tooltip._container);
				}
			}

			return this;
		},

		// @method closeTooltip(): this
		// Closes the tooltip bound to this layer if it is open.
		closeTooltip: function () {
			if (this._tooltip) {
				this._tooltip._close();
				if (this._tooltip.options.interactive && this._tooltip._container) {
					L.DomUtil.removeClass(this._tooltip._container, 'leaflet-clickable');
					this.removeInteractiveTarget(this._tooltip._container);
				}
			}
			return this;
		},

		// @method toggleTooltip(): this
		// Opens or closes the tooltip bound to this layer depending on its current state.
		toggleTooltip: function (target) {
			if (this._tooltip) {
				if (this._tooltip._map) {
					this.closeTooltip();
				} else {
					this.openTooltip(target);
				}
			}
			return this;
		},

		// @method isTooltipOpen(): boolean
		// Returns `true` if the tooltip bound to this layer is currently open.
		isTooltipOpen: function () {
			return this._tooltip.isOpen();
		},

		// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
		// Sets the content of the tooltip bound to this layer.
		setTooltipContent: function (content) {
			if (this._tooltip) {
				this._tooltip.setContent(content);
			}
			return this;
		},

		// @method getTooltip(): Tooltip
		// Returns the tooltip bound to this layer.
		getTooltip: function () {
			return this._tooltip;
		},

		_openTooltip: function (e) {
			var layer = e.layer || e.target;

			if (!this._tooltip || !this._map) {
				return;
			}
			this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
		},

		_moveTooltip: function (e) {
			var latlng = e.latlng, containerPoint, layerPoint;
			if (this._tooltip.options.sticky && e.originalEvent) {
				containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
				layerPoint = this._map.containerPointToLayerPoint(containerPoint);
				latlng = this._map.layerPointToLatLng(layerPoint);
			}
			this._tooltip.setLatLng(latlng);
		}
	});



	/*
	 * Tooltip extension to L.Marker, adding tooltip-related methods.
	 */

	L.Marker.include({
		_getTooltipAnchor: function () {
			return this.options.icon.options.tooltipAnchor || [0, 0];
		}
	});



	/*
	 * @class LayerGroup
	 * @aka L.LayerGroup
	 * @inherits Layer
	 *
	 * Used to group several layers and handle them as one. If you add it to the map,
	 * any layers added or removed from the group will be added/removed on the map as
	 * well. Extends `Layer`.
	 *
	 * @example
	 *
	 * ```js
	 * L.layerGroup([marker1, marker2])
	 * 	.addLayer(polyline)
	 * 	.addTo(map);
	 * ```
	 */

	L.LayerGroup = L.Layer.extend({

		initialize: function (layers) {
			this._layers = {};

			var i, len;

			if (layers) {
				for (i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			}
		},

		// @method addLayer(layer: Layer): this
		// Adds the given layer to the group.
		addLayer: function (layer) {
			var id = this.getLayerId(layer);

			this._layers[id] = layer;

			if (this._map) {
				this._map.addLayer(layer);
			}

			return this;
		},

		// @method removeLayer(layer: Layer): this
		// Removes the given layer from the group.
		// @alternative
		// @method removeLayer(id: Number): this
		// Removes the layer with the given internal ID from the group.
		removeLayer: function (layer) {
			var id = layer in this._layers ? layer : this.getLayerId(layer);

			if (this._map && this._layers[id]) {
				this._map.removeLayer(this._layers[id]);
			}

			delete this._layers[id];

			return this;
		},

		// @method hasLayer(layer: Layer): Boolean
		// Returns `true` if the given layer is currently added to the group.
		hasLayer: function (layer) {
			return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
		},

		// @method clearLayers(): this
		// Removes all the layers from the group.
		clearLayers: function () {
			for (var i in this._layers) {
				this.removeLayer(this._layers[i]);
			}
			return this;
		},

		// @method invoke(methodName: String, …): this
		// Calls `methodName` on every layer contained in this group, passing any
		// additional parameters. Has no effect if the layers contained do not
		// implement `methodName`.
		invoke: function (methodName) {
			var args = Array.prototype.slice.call(arguments, 1),
			    i, layer;

			for (i in this._layers) {
				layer = this._layers[i];

				if (layer[methodName]) {
					layer[methodName].apply(layer, args);
				}
			}

			return this;
		},

		onAdd: function (map) {
			for (var i in this._layers) {
				map.addLayer(this._layers[i]);
			}
		},

		onRemove: function (map) {
			for (var i in this._layers) {
				map.removeLayer(this._layers[i]);
			}
		},

		// @method eachLayer(fn: Function, context?: Object): this
		// Iterates over the layers of the group, optionally specifying context of the iterator function.
		// ```js
		// group.eachLayer(function (layer) {
		// 	layer.bindPopup('Hello');
		// });
		// ```
		eachLayer: function (method, context) {
			for (var i in this._layers) {
				method.call(context, this._layers[i]);
			}
			return this;
		},

		// @method getLayer(id: Number): Layer
		// Returns the layer with the given internal ID.
		getLayer: function (id) {
			return this._layers[id];
		},

		// @method getLayers(): Layer[]
		// Returns an array of all the layers added to the group.
		getLayers: function () {
			var layers = [];

			for (var i in this._layers) {
				layers.push(this._layers[i]);
			}
			return layers;
		},

		// @method setZIndex(zIndex: Number): this
		// Calls `setZIndex` on every layer contained in this group, passing the z-index.
		setZIndex: function (zIndex) {
			return this.invoke('setZIndex', zIndex);
		},

		// @method getLayerId(layer: Layer): Number
		// Returns the internal ID for a layer
		getLayerId: function (layer) {
			return L.stamp(layer);
		}
	});


	// @factory L.layerGroup(layers: Layer[])
	// Create a layer group, optionally given an initial set of layers.
	L.layerGroup = function (layers) {
		return new L.LayerGroup(layers);
	};



	/*
	 * @class FeatureGroup
	 * @aka L.FeatureGroup
	 * @inherits LayerGroup
	 *
	 * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
	 *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
	 *  * Events are propagated to the `FeatureGroup`, so if the group has an event
	 * handler, it will handle events from any of the layers. This includes mouse events
	 * and custom events.
	 *  * Has `layeradd` and `layerremove` events
	 *
	 * @example
	 *
	 * ```js
	 * L.featureGroup([marker1, marker2, polyline])
	 * 	.bindPopup('Hello world!')
	 * 	.on('click', function() { alert('Clicked on a member of the group!'); })
	 * 	.addTo(map);
	 * ```
	 */

	L.FeatureGroup = L.LayerGroup.extend({

		addLayer: function (layer) {
			if (this.hasLayer(layer)) {
				return this;
			}

			layer.addEventParent(this);

			L.LayerGroup.prototype.addLayer.call(this, layer);

			// @event layeradd: LayerEvent
			// Fired when a layer is added to this `FeatureGroup`
			return this.fire('layeradd', {layer: layer});
		},

		removeLayer: function (layer) {
			if (!this.hasLayer(layer)) {
				return this;
			}
			if (layer in this._layers) {
				layer = this._layers[layer];
			}

			layer.removeEventParent(this);

			L.LayerGroup.prototype.removeLayer.call(this, layer);

			// @event layerremove: LayerEvent
			// Fired when a layer is removed from this `FeatureGroup`
			return this.fire('layerremove', {layer: layer});
		},

		// @method setStyle(style: Path options): this
		// Sets the given path options to each layer of the group that has a `setStyle` method.
		setStyle: function (style) {
			return this.invoke('setStyle', style);
		},

		// @method bringToFront(): this
		// Brings the layer group to the top of all other layers
		bringToFront: function () {
			return this.invoke('bringToFront');
		},

		// @method bringToBack(): this
		// Brings the layer group to the top of all other layers
		bringToBack: function () {
			return this.invoke('bringToBack');
		},

		// @method getBounds(): LatLngBounds
		// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
		getBounds: function () {
			var bounds = new L.LatLngBounds();

			for (var id in this._layers) {
				var layer = this._layers[id];
				bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
			}
			return bounds;
		}
	});

	// @factory L.featureGroup(layers: Layer[])
	// Create a feature group, optionally given an initial set of layers.
	L.featureGroup = function (layers) {
		return new L.FeatureGroup(layers);
	};



	/*
	 * @class Renderer
	 * @inherits Layer
	 * @aka L.Renderer
	 *
	 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
	 * DOM container of the renderer, its bounds, and its zoom animation.
	 *
	 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
	 * itself can be added or removed to the map. All paths use a renderer, which can
	 * be implicit (the map will decide the type of renderer and use it automatically)
	 * or explicit (using the [`renderer`](#path-renderer) option of the path).
	 *
	 * Do not use this class directly, use `SVG` and `Canvas` instead.
	 *
	 * @event update: Event
	 * Fired when the renderer updates its bounds, center and zoom, for example when
	 * its map has moved
	 */

	L.Renderer = L.Layer.extend({

		// @section
		// @aka Renderer options
		options: {
			// @option padding: Number = 0.1
			// How much to extend the clip area around the map view (relative to its size)
			// e.g. 0.1 would be 10% of map view in each direction
			padding: 0.1
		},

		initialize: function (options) {
			L.setOptions(this, options);
			L.stamp(this);
		},

		onAdd: function () {
			if (!this._container) {
				this._initContainer(); // defined by renderer implementations

				if (this._zoomAnimated) {
					L.DomUtil.addClass(this._container, 'leaflet-zoom-animated');
				}
			}

			this.getPane().appendChild(this._container);
			this._update();
		},

		onRemove: function () {
			L.DomUtil.remove(this._container);
		},

		getEvents: function () {
			var events = {
				viewreset: this._reset,
				zoom: this._onZoom,
				moveend: this._update
			};
			if (this._zoomAnimated) {
				events.zoomanim = this._onAnimZoom;
			}
			return events;
		},

		_onAnimZoom: function (ev) {
			this._updateTransform(ev.center, ev.zoom);
		},

		_onZoom: function () {
			this._updateTransform(this._map.getCenter(), this._map.getZoom());
		},

		_updateTransform: function (center, zoom) {
			var scale = this._map.getZoomScale(zoom, this._zoom),
			    position = L.DomUtil.getPosition(this._container),
			    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
			    currentCenterPoint = this._map.project(this._center, zoom),
			    destCenterPoint = this._map.project(center, zoom),
			    centerOffset = destCenterPoint.subtract(currentCenterPoint),

			    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

			if (L.Browser.any3d) {
				L.DomUtil.setTransform(this._container, topLeftOffset, scale);
			} else {
				L.DomUtil.setPosition(this._container, topLeftOffset);
			}
		},

		_reset: function () {
			this._update();
			this._updateTransform(this._center, this._zoom);
		},

		_update: function () {
			// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
			// Subclasses are responsible of firing the 'update' event.
			var p = this.options.padding,
			    size = this._map.getSize(),
			    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

			this._bounds = new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

			this._center = this._map.getCenter();
			this._zoom = this._map.getZoom();
		}
	});


	L.Map.include({
		// @namespace Map; @method getRenderer(layer: Path): Renderer
		// Returns the instance of `Renderer` that should be used to render the given
		// `Path`. It will ensure that the `renderer` options of the map and paths
		// are respected, and that the renderers do exist on the map.
		getRenderer: function (layer) {
			// @namespace Path; @option renderer: Renderer
			// Use this specific instance of `Renderer` for this path. Takes
			// precedence over the map's [default renderer](#map-renderer).
			var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

			if (!renderer) {
				// @namespace Map; @option preferCanvas: Boolean = false
				// Whether `Path`s should be rendered on a `Canvas` renderer.
				// By default, all `Path`s are rendered in a `SVG` renderer.
				renderer = this._renderer = (this.options.preferCanvas && L.canvas()) || L.svg();
			}

			if (!this.hasLayer(renderer)) {
				this.addLayer(renderer);
			}
			return renderer;
		},

		_getPaneRenderer: function (name) {
			if (name === 'overlayPane' || name === undefined) {
				return false;
			}

			var renderer = this._paneRenderers[name];
			if (renderer === undefined) {
				renderer = (L.SVG && L.svg({pane: name})) || (L.Canvas && L.canvas({pane: name}));
				this._paneRenderers[name] = renderer;
			}
			return renderer;
		}
	});



	/*
	 * @class Path
	 * @aka L.Path
	 * @inherits Interactive layer
	 *
	 * An abstract class that contains options and constants shared between vector
	 * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
	 */

	L.Path = L.Layer.extend({

		// @section
		// @aka Path options
		options: {
			// @option stroke: Boolean = true
			// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
			stroke: true,

			// @option color: String = '#3388ff'
			// Stroke color
			color: '#3388ff',

			// @option weight: Number = 3
			// Stroke width in pixels
			weight: 3,

			// @option opacity: Number = 1.0
			// Stroke opacity
			opacity: 1,

			// @option lineCap: String= 'round'
			// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
			lineCap: 'round',

			// @option lineJoin: String = 'round'
			// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
			lineJoin: 'round',

			// @option dashArray: String = null
			// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
			dashArray: null,

			// @option dashOffset: String = null
			// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
			dashOffset: null,

			// @option fill: Boolean = depends
			// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
			fill: false,

			// @option fillColor: String = *
			// Fill color. Defaults to the value of the [`color`](#path-color) option
			fillColor: null,

			// @option fillOpacity: Number = 0.2
			// Fill opacity.
			fillOpacity: 0.2,

			// @option fillRule: String = 'evenodd'
			// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
			fillRule: 'evenodd',

			// className: '',

			// Option inherited from "Interactive layer" abstract class
			interactive: true
		},

		beforeAdd: function (map) {
			// Renderer is set here because we need to call renderer.getEvents
			// before this.getEvents.
			this._renderer = map.getRenderer(this);
		},

		onAdd: function () {
			this._renderer._initPath(this);
			this._reset();
			this._renderer._addPath(this);
			this._renderer.on('update', this._update, this);
		},

		onRemove: function () {
			this._renderer._removePath(this);
			this._renderer.off('update', this._update, this);
		},

		getEvents: function () {
			return {
				zoomend: this._project,
				viewreset: this._reset
			};
		},

		// @method redraw(): this
		// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
		redraw: function () {
			if (this._map) {
				this._renderer._updatePath(this);
			}
			return this;
		},

		// @method setStyle(style: Path options): this
		// Changes the appearance of a Path based on the options in the `Path options` object.
		setStyle: function (style) {
			L.setOptions(this, style);
			if (this._renderer) {
				this._renderer._updateStyle(this);
			}
			return this;
		},

		// @method bringToFront(): this
		// Brings the layer to the top of all path layers.
		bringToFront: function () {
			if (this._renderer) {
				this._renderer._bringToFront(this);
			}
			return this;
		},

		// @method bringToBack(): this
		// Brings the layer to the bottom of all path layers.
		bringToBack: function () {
			if (this._renderer) {
				this._renderer._bringToBack(this);
			}
			return this;
		},

		getElement: function () {
			return this._path;
		},

		_reset: function () {
			// defined in children classes
			this._project();
			this._update();
		},

		_clickTolerance: function () {
			// used when doing hit detection for Canvas layers
			return (this.options.stroke ? this.options.weight / 2 : 0) + (L.Browser.touch ? 10 : 0);
		}
	});



	/*
	 * @namespace LineUtil
	 *
	 * Various utility functions for polyine points processing, used by Leaflet internally to make polylines lightning-fast.
	 */

	L.LineUtil = {

		// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
		// Improves rendering performance dramatically by lessening the number of points to draw.

		// @function simplify(points: Point[], tolerance: Number): Point[]
		// Dramatically reduces the number of points in a polyline while retaining
		// its shape and returns a new array of simplified points, using the
		// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
		// Used for a huge performance boost when processing/displaying Leaflet polylines for
		// each zoom level and also reducing visual noise. tolerance affects the amount of
		// simplification (lesser value means higher quality but slower and with more points).
		// Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
		simplify: function (points, tolerance) {
			if (!tolerance || !points.length) {
				return points.slice();
			}

			var sqTolerance = tolerance * tolerance;

			// stage 1: vertex reduction
			points = this._reducePoints(points, sqTolerance);

			// stage 2: Douglas-Peucker simplification
			points = this._simplifyDP(points, sqTolerance);

			return points;
		},

		// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
		// Returns the distance between point `p` and segment `p1` to `p2`.
		pointToSegmentDistance:  function (p, p1, p2) {
			return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
		},

		// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
		// Returns the closest point from a point `p` on a segment `p1` to `p2`.
		closestPointOnSegment: function (p, p1, p2) {
			return this._sqClosestPointOnSegment(p, p1, p2);
		},

		// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
		_simplifyDP: function (points, sqTolerance) {

			var len = points.length,
			    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
			    markers = new ArrayConstructor(len);

			markers[0] = markers[len - 1] = 1;

			this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

			var i,
			    newPoints = [];

			for (i = 0; i < len; i++) {
				if (markers[i]) {
					newPoints.push(points[i]);
				}
			}

			return newPoints;
		},

		_simplifyDPStep: function (points, markers, sqTolerance, first, last) {

			var maxSqDist = 0,
			    index, i, sqDist;

			for (i = first + 1; i <= last - 1; i++) {
				sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

				if (sqDist > maxSqDist) {
					index = i;
					maxSqDist = sqDist;
				}
			}

			if (maxSqDist > sqTolerance) {
				markers[index] = 1;

				this._simplifyDPStep(points, markers, sqTolerance, first, index);
				this._simplifyDPStep(points, markers, sqTolerance, index, last);
			}
		},

		// reduce points that are too close to each other to a single point
		_reducePoints: function (points, sqTolerance) {
			var reducedPoints = [points[0]];

			for (var i = 1, prev = 0, len = points.length; i < len; i++) {
				if (this._sqDist(points[i], points[prev]) > sqTolerance) {
					reducedPoints.push(points[i]);
					prev = i;
				}
			}
			if (prev < len - 1) {
				reducedPoints.push(points[len - 1]);
			}
			return reducedPoints;
		},


		// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
		// Clips the segment a to b by rectangular bounds with the
		// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
		// (modifying the segment points directly!). Used by Leaflet to only show polyline
		// points that are on the screen or near, increasing performance.
		clipSegment: function (a, b, bounds, useLastCode, round) {
			var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			    codeB = this._getBitCode(b, bounds),

			    codeOut, p, newCode;

			// save 2nd code to avoid calculating it on the next segment
			this._lastCode = codeB;

			while (true) {
				// if a,b is inside the clip window (trivial accept)
				if (!(codeA | codeB)) {
					return [a, b];
				}

				// if a,b is outside the clip window (trivial reject)
				if (codeA & codeB) {
					return false;
				}

				// other cases
				codeOut = codeA || codeB;
				p = this._getEdgeIntersection(a, b, codeOut, bounds, round);
				newCode = this._getBitCode(p, bounds);

				if (codeOut === codeA) {
					a = p;
					codeA = newCode;
				} else {
					b = p;
					codeB = newCode;
				}
			}
		},

		_getEdgeIntersection: function (a, b, code, bounds, round) {
			var dx = b.x - a.x,
			    dy = b.y - a.y,
			    min = bounds.min,
			    max = bounds.max,
			    x, y;

			if (code & 8) { // top
				x = a.x + dx * (max.y - a.y) / dy;
				y = max.y;

			} else if (code & 4) { // bottom
				x = a.x + dx * (min.y - a.y) / dy;
				y = min.y;

			} else if (code & 2) { // right
				x = max.x;
				y = a.y + dy * (max.x - a.x) / dx;

			} else if (code & 1) { // left
				x = min.x;
				y = a.y + dy * (min.x - a.x) / dx;
			}

			return new L.Point(x, y, round);
		},

		_getBitCode: function (p, bounds) {
			var code = 0;

			if (p.x < bounds.min.x) { // left
				code |= 1;
			} else if (p.x > bounds.max.x) { // right
				code |= 2;
			}

			if (p.y < bounds.min.y) { // bottom
				code |= 4;
			} else if (p.y > bounds.max.y) { // top
				code |= 8;
			}

			return code;
		},

		// square distance (to avoid unnecessary Math.sqrt calls)
		_sqDist: function (p1, p2) {
			var dx = p2.x - p1.x,
			    dy = p2.y - p1.y;
			return dx * dx + dy * dy;
		},

		// return closest point on segment or distance to that point
		_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
			var x = p1.x,
			    y = p1.y,
			    dx = p2.x - x,
			    dy = p2.y - y,
			    dot = dx * dx + dy * dy,
			    t;

			if (dot > 0) {
				t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

				if (t > 1) {
					x = p2.x;
					y = p2.y;
				} else if (t > 0) {
					x += dx * t;
					y += dy * t;
				}
			}

			dx = p.x - x;
			dy = p.y - y;

			return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
		}
	};



	/*
	 * @class Polyline
	 * @aka L.Polyline
	 * @inherits Path
	 *
	 * A class for drawing polyline overlays on a map. Extends `Path`.
	 *
	 * @example
	 *
	 * ```js
	 * // create a red polyline from an array of LatLng points
	 * var latlngs = [
	 * 	[-122.68, 45.51],
	 * 	[-122.43, 37.77],
	 * 	[-118.2, 34.04]
	 * ];
	 *
	 * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
	 *
	 * // zoom the map to the polyline
	 * map.fitBounds(polyline.getBounds());
	 * ```
	 *
	 * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
	 *
	 * ```js
	 * // create a red polyline from an array of arrays of LatLng points
	 * var latlngs = [
	 * 	[[-122.68, 45.51],
	 * 	 [-122.43, 37.77],
	 * 	 [-118.2, 34.04]],
	 * 	[[-73.91, 40.78],
	 * 	 [-87.62, 41.83],
	 * 	 [-96.72, 32.76]]
	 * ];
	 * ```
	 */

	L.Polyline = L.Path.extend({

		// @section
		// @aka Polyline options
		options: {
			// @option smoothFactor: Number = 1.0
			// How much to simplify the polyline on each zoom level. More means
			// better performance and smoother look, and less means more accurate representation.
			smoothFactor: 1.0,

			// @option noClip: Boolean = false
			// Disable polyline clipping.
			noClip: false
		},

		initialize: function (latlngs, options) {
			L.setOptions(this, options);
			this._setLatLngs(latlngs);
		},

		// @method getLatLngs(): LatLng[]
		// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
		getLatLngs: function () {
			return this._latlngs;
		},

		// @method setLatLngs(latlngs: LatLng[]): this
		// Replaces all the points in the polyline with the given array of geographical points.
		setLatLngs: function (latlngs) {
			this._setLatLngs(latlngs);
			return this.redraw();
		},

		// @method isEmpty(): Boolean
		// Returns `true` if the Polyline has no LatLngs.
		isEmpty: function () {
			return !this._latlngs.length;
		},

		closestLayerPoint: function (p) {
			var minDistance = Infinity,
			    minPoint = null,
			    closest = L.LineUtil._sqClosestPointOnSegment,
			    p1, p2;

			for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
				var points = this._parts[j];

				for (var i = 1, len = points.length; i < len; i++) {
					p1 = points[i - 1];
					p2 = points[i];

					var sqDist = closest(p, p1, p2, true);

					if (sqDist < minDistance) {
						minDistance = sqDist;
						minPoint = closest(p, p1, p2);
					}
				}
			}
			if (minPoint) {
				minPoint.distance = Math.sqrt(minDistance);
			}
			return minPoint;
		},

		// @method getCenter(): LatLng
		// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
		getCenter: function () {
			// throws error when not yet added to map as this center calculation requires projected coordinates
			if (!this._map) {
				throw new Error('Must add layer to map before using getCenter()');
			}

			var i, halfDist, segDist, dist, p1, p2, ratio,
			    points = this._rings[0],
			    len = points.length;

			if (!len) { return null; }

			// polyline centroid algorithm; only uses the first ring if there are multiple

			for (i = 0, halfDist = 0; i < len - 1; i++) {
				halfDist += points[i].distanceTo(points[i + 1]) / 2;
			}

			// The line is so small in the current view that all points are on the same pixel.
			if (halfDist === 0) {
				return this._map.layerPointToLatLng(points[0]);
			}

			for (i = 0, dist = 0; i < len - 1; i++) {
				p1 = points[i];
				p2 = points[i + 1];
				segDist = p1.distanceTo(p2);
				dist += segDist;

				if (dist > halfDist) {
					ratio = (dist - halfDist) / segDist;
					return this._map.layerPointToLatLng([
						p2.x - ratio * (p2.x - p1.x),
						p2.y - ratio * (p2.y - p1.y)
					]);
				}
			}
		},

		// @method getBounds(): LatLngBounds
		// Returns the `LatLngBounds` of the path.
		getBounds: function () {
			return this._bounds;
		},

		// @method addLatLng(latlng: LatLng, latlngs? LatLng[]): this
		// Adds a given point to the polyline. By default, adds to the first ring of
		// the polyline in case of a multi-polyline, but can be overridden by passing
		// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
		addLatLng: function (latlng, latlngs) {
			latlngs = latlngs || this._defaultShape();
			latlng = L.latLng(latlng);
			latlngs.push(latlng);
			this._bounds.extend(latlng);
			return this.redraw();
		},

		_setLatLngs: function (latlngs) {
			this._bounds = new L.LatLngBounds();
			this._latlngs = this._convertLatLngs(latlngs);
		},

		_defaultShape: function () {
			return L.Polyline._flat(this._latlngs) ? this._latlngs : this._latlngs[0];
		},

		// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
		_convertLatLngs: function (latlngs) {
			var result = [],
			    flat = L.Polyline._flat(latlngs);

			for (var i = 0, len = latlngs.length; i < len; i++) {
				if (flat) {
					result[i] = L.latLng(latlngs[i]);
					this._bounds.extend(result[i]);
				} else {
					result[i] = this._convertLatLngs(latlngs[i]);
				}
			}

			return result;
		},

		_project: function () {
			var pxBounds = new L.Bounds();
			this._rings = [];
			this._projectLatlngs(this._latlngs, this._rings, pxBounds);

			var w = this._clickTolerance(),
			    p = new L.Point(w, w);

			if (this._bounds.isValid() && pxBounds.isValid()) {
				pxBounds.min._subtract(p);
				pxBounds.max._add(p);
				this._pxBounds = pxBounds;
			}
		},

		// recursively turns latlngs into a set of rings with projected coordinates
		_projectLatlngs: function (latlngs, result, projectedBounds) {
			var flat = latlngs[0] instanceof L.LatLng,
			    len = latlngs.length,
			    i, ring;

			if (flat) {
				ring = [];
				for (i = 0; i < len; i++) {
					ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
					projectedBounds.extend(ring[i]);
				}
				result.push(ring);
			} else {
				for (i = 0; i < len; i++) {
					this._projectLatlngs(latlngs[i], result, projectedBounds);
				}
			}
		},

		// clip polyline by renderer bounds so that we have less to render for performance
		_clipPoints: function () {
			var bounds = this._renderer._bounds;

			this._parts = [];
			if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
				return;
			}

			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}

			var parts = this._parts,
			    i, j, k, len, len2, segment, points;

			for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
				points = this._rings[i];

				for (j = 0, len2 = points.length; j < len2 - 1; j++) {
					segment = L.LineUtil.clipSegment(points[j], points[j + 1], bounds, j, true);

					if (!segment) { continue; }

					parts[k] = parts[k] || [];
					parts[k].push(segment[0]);

					// if segment goes out of screen, or it's the last one, it's the end of the line part
					if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
						parts[k].push(segment[1]);
						k++;
					}
				}
			}
		},

		// simplify each clipped part of the polyline for performance
		_simplifyPoints: function () {
			var parts = this._parts,
			    tolerance = this.options.smoothFactor;

			for (var i = 0, len = parts.length; i < len; i++) {
				parts[i] = L.LineUtil.simplify(parts[i], tolerance);
			}
		},

		_update: function () {
			if (!this._map) { return; }

			this._clipPoints();
			this._simplifyPoints();
			this._updatePath();
		},

		_updatePath: function () {
			this._renderer._updatePoly(this);
		}
	});

	// @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
	// Instantiates a polyline object given an array of geographical points and
	// optionally an options object. You can create a `Polyline` object with
	// multiple separate lines (`MultiPolyline`) by passing an array of arrays
	// of geographic points.
	L.polyline = function (latlngs, options) {
		return new L.Polyline(latlngs, options);
	};

	L.Polyline._flat = function (latlngs) {
		// true if it's a flat array of latlngs; false if nested
		return !L.Util.isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
	};



	/*
	 * @namespace PolyUtil
	 * Various utility functions for polygon geometries.
	 */

	L.PolyUtil = {};

	/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
	 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgeman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
	 * Used by Leaflet to only show polygon points that are on the screen or near, increasing
	 * performance. Note that polygon points needs different algorithm for clipping
	 * than polyline, so there's a seperate method for it.
	 */
	L.PolyUtil.clipPolygon = function (points, bounds, round) {
		var clippedPoints,
		    edges = [1, 4, 2, 8],
		    i, j, k,
		    a, b,
		    len, edge, p,
		    lu = L.LineUtil;

		for (i = 0, len = points.length; i < len; i++) {
			points[i]._code = lu._getBitCode(points[i], bounds);
		}

		// for each edge (left, bottom, right, top)
		for (k = 0; k < 4; k++) {
			edge = edges[k];
			clippedPoints = [];

			for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				a = points[i];
				b = points[j];

				// if a is inside the clip window
				if (!(a._code & edge)) {
					// if b is outside the clip window (a->b goes out of screen)
					if (b._code & edge) {
						p = lu._getEdgeIntersection(b, a, edge, bounds, round);
						p._code = lu._getBitCode(p, bounds);
						clippedPoints.push(p);
					}
					clippedPoints.push(a);

				// else if b is inside the clip window (a->b enters the screen)
				} else if (!(b._code & edge)) {
					p = lu._getEdgeIntersection(b, a, edge, bounds, round);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
			}
			points = clippedPoints;
		}

		return points;
	};



	/*
	 * @class Polygon
	 * @aka L.Polygon
	 * @inherits Polyline
	 *
	 * A class for drawing polygon overlays on a map. Extends `Polyline`.
	 *
	 * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
	 *
	 *
	 * @example
	 *
	 * ```js
	 * // create a red polygon from an array of LatLng points
	 * var latlngs = [[-111.03, 41],[-111.04, 45],[-104.05, 45],[-104.05, 41]];
	 *
	 * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
	 *
	 * // zoom the map to the polygon
	 * map.fitBounds(polygon.getBounds());
	 * ```
	 *
	 * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
	 *
	 * ```js
	 * var latlngs = [
	 *   [[-111.03, 41],[-111.04, 45],[-104.05, 45],[-104.05, 41]], // outer ring
	 *   [[-108.58,37.29],[-108.58,40.71],[-102.50,40.71],[-102.50,37.29]] // hole
	 * ];
	 * ```
	 *
	 * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
	 *
	 * ```js
	 * var latlngs = [
	 *   [ // first polygon
	 *     [[-111.03, 41],[-111.04, 45],[-104.05, 45],[-104.05, 41]], // outer ring
	 *     [[-108.58,37.29],[-108.58,40.71],[-102.50,40.71],[-102.50,37.29]] // hole
	 *   ],
	 *   [ // second polygon
	 *     [[-109.05, 37],[-109.03, 41],[-102.05, 41],[-102.04, 37],[-109.05, 38]]
	 *   ]
	 * ];
	 * ```
	 */

	L.Polygon = L.Polyline.extend({

		options: {
			fill: true
		},

		isEmpty: function () {
			return !this._latlngs.length || !this._latlngs[0].length;
		},

		getCenter: function () {
			// throws error when not yet added to map as this center calculation requires projected coordinates
			if (!this._map) {
				throw new Error('Must add layer to map before using getCenter()');
			}

			var i, j, p1, p2, f, area, x, y, center,
			    points = this._rings[0],
			    len = points.length;

			if (!len) { return null; }

			// polygon centroid algorithm; only uses the first ring if there are multiple

			area = x = y = 0;

			for (i = 0, j = len - 1; i < len; j = i++) {
				p1 = points[i];
				p2 = points[j];

				f = p1.y * p2.x - p2.y * p1.x;
				x += (p1.x + p2.x) * f;
				y += (p1.y + p2.y) * f;
				area += f * 3;
			}

			if (area === 0) {
				// Polygon is so small that all points are on same pixel.
				center = points[0];
			} else {
				center = [x / area, y / area];
			}
			return this._map.layerPointToLatLng(center);
		},

		_convertLatLngs: function (latlngs) {
			var result = L.Polyline.prototype._convertLatLngs.call(this, latlngs),
			    len = result.length;

			// remove last point if it equals first one
			if (len >= 2 && result[0] instanceof L.LatLng && result[0].equals(result[len - 1])) {
				result.pop();
			}
			return result;
		},

		_setLatLngs: function (latlngs) {
			L.Polyline.prototype._setLatLngs.call(this, latlngs);
			if (L.Polyline._flat(this._latlngs)) {
				this._latlngs = [this._latlngs];
			}
		},

		_defaultShape: function () {
			return L.Polyline._flat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
		},

		_clipPoints: function () {
			// polygons need a different clipping algorithm so we redefine that

			var bounds = this._renderer._bounds,
			    w = this.options.weight,
			    p = new L.Point(w, w);

			// increase clip padding by stroke width to avoid stroke on clip edges
			bounds = new L.Bounds(bounds.min.subtract(p), bounds.max.add(p));

			this._parts = [];
			if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
				return;
			}

			if (this.options.noClip) {
				this._parts = this._rings;
				return;
			}

			for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
				clipped = L.PolyUtil.clipPolygon(this._rings[i], bounds, true);
				if (clipped.length) {
					this._parts.push(clipped);
				}
			}
		},

		_updatePath: function () {
			this._renderer._updatePoly(this, true);
		}
	});


	// @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
	L.polygon = function (latlngs, options) {
		return new L.Polygon(latlngs, options);
	};



	/*
	 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
	 */

	/*
	 * @class Rectangle
	 * @aka L.Retangle
	 * @inherits Polygon
	 *
	 * A class for drawing rectangle overlays on a map. Extends `Polygon`.
	 *
	 * @example
	 *
	 * ```js
	 * // define rectangle geographical bounds
	 * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
	 *
	 * // create an orange rectangle
	 * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
	 *
	 * // zoom the map to the rectangle bounds
	 * map.fitBounds(bounds);
	 * ```
	 *
	 */


	L.Rectangle = L.Polygon.extend({
		initialize: function (latLngBounds, options) {
			L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
		},

		// @method setBounds(latLngBounds: LatLngBounds): this
		// Redraws the rectangle with the passed bounds.
		setBounds: function (latLngBounds) {
			return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
		},

		_boundsToLatLngs: function (latLngBounds) {
			latLngBounds = L.latLngBounds(latLngBounds);
			return [
				latLngBounds.getSouthWest(),
				latLngBounds.getNorthWest(),
				latLngBounds.getNorthEast(),
				latLngBounds.getSouthEast()
			];
		}
	});


	// @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
	L.rectangle = function (latLngBounds, options) {
		return new L.Rectangle(latLngBounds, options);
	};



	/*
	 * @class CircleMarker
	 * @aka L.CircleMarker
	 * @inherits Path
	 *
	 * A circle of a fixed size with radius specified in pixels. Extends `Path`.
	 */

	L.CircleMarker = L.Path.extend({

		// @section
		// @aka CircleMarker options
		options: {
			fill: true,

			// @option radius: Number = 10
			// Radius of the circle marker, in pixels
			radius: 10
		},

		initialize: function (latlng, options) {
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);
			this._radius = this.options.radius;
		},

		// @method setLatLng(latLng: LatLng): this
		// Sets the position of a circle marker to a new location.
		setLatLng: function (latlng) {
			this._latlng = L.latLng(latlng);
			this.redraw();
			return this.fire('move', {latlng: this._latlng});
		},

		// @method getLatLng(): LatLng
		// Returns the current geographical position of the circle marker
		getLatLng: function () {
			return this._latlng;
		},

		// @method setRadius(radius: Number): this
		// Sets the radius of a circle marker. Units are in pixels.
		setRadius: function (radius) {
			this.options.radius = this._radius = radius;
			return this.redraw();
		},

		// @method getRadius(): Number
		// Returns the current radius of the circle
		getRadius: function () {
			return this._radius;
		},

		setStyle : function (options) {
			var radius = options && options.radius || this._radius;
			L.Path.prototype.setStyle.call(this, options);
			this.setRadius(radius);
			return this;
		},

		_project: function () {
			this._point = this._map.latLngToLayerPoint(this._latlng);
			this._updateBounds();
		},

		_updateBounds: function () {
			var r = this._radius,
			    r2 = this._radiusY || r,
			    w = this._clickTolerance(),
			    p = [r + w, r2 + w];
			this._pxBounds = new L.Bounds(this._point.subtract(p), this._point.add(p));
		},

		_update: function () {
			if (this._map) {
				this._updatePath();
			}
		},

		_updatePath: function () {
			this._renderer._updateCircle(this);
		},

		_empty: function () {
			return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
		}
	});


	// @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
	// Instantiates a circle marker object given a geographical point, and an optional options object.
	L.circleMarker = function (latlng, options) {
		return new L.CircleMarker(latlng, options);
	};



	/*
	 * @class Circle
	 * @aka L.Circle
	 * @inherits CircleMarker
	 *
	 * A class for drawing circle overlays on a map. Extends `CircleMarker`.
	 *
	 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
	 *
	 * @example
	 *
	 * ```js
	 * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
	 * ```
	 */

	L.Circle = L.CircleMarker.extend({

		initialize: function (latlng, options, legacyOptions) {
			if (typeof options === 'number') {
				// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
				options = L.extend({}, legacyOptions, {radius: options});
			}
			L.setOptions(this, options);
			this._latlng = L.latLng(latlng);

			if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

			// @section
			// @aka Circle options
			// @option radius: Number; Radius of the circle, in meters.
			this._mRadius = this.options.radius;
		},

		// @method setRadius(radius: Number): this
		// Sets the radius of a circle. Units are in meters.
		setRadius: function (radius) {
			this._mRadius = radius;
			return this.redraw();
		},

		// @method getRadius(): Number
		// Returns the current radius of a circle. Units are in meters.
		getRadius: function () {
			return this._mRadius;
		},

		// @method getBounds(): LatLngBounds
		// Returns the `LatLngBounds` of the path.
		getBounds: function () {
			var half = [this._radius, this._radiusY || this._radius];

			return new L.LatLngBounds(
				this._map.layerPointToLatLng(this._point.subtract(half)),
				this._map.layerPointToLatLng(this._point.add(half)));
		},

		setStyle: L.Path.prototype.setStyle,

		_project: function () {

			var lng = this._latlng.lng,
			    lat = this._latlng.lat,
			    map = this._map,
			    crs = map.options.crs;

			if (crs.distance === L.CRS.Earth.distance) {
				var d = Math.PI / 180,
				    latR = (this._mRadius / L.CRS.Earth.R) / d,
				    top = map.project([lat + latR, lng]),
				    bottom = map.project([lat - latR, lng]),
				    p = top.add(bottom).divideBy(2),
				    lat2 = map.unproject(p).lat,
				    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
				            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

				if (isNaN(lngR) || lngR === 0) {
					lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
				}

				this._point = p.subtract(map.getPixelOrigin());
				this._radius = isNaN(lngR) ? 0 : Math.max(Math.round(p.x - map.project([lat2, lng - lngR]).x), 1);
				this._radiusY = Math.max(Math.round(p.y - top.y), 1);

			} else {
				var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

				this._point = map.latLngToLayerPoint(this._latlng);
				this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
			}

			this._updateBounds();
		}
	});

	// @factory L.circle(latlng: LatLng, options?: Circle options)
	// Instantiates a circle object given a geographical point, and an options object
	// which contains the circle radius.
	// @alternative
	// @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
	// Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
	// Do not use in new applications or plugins.
	L.circle = function (latlng, options, legacyOptions) {
		return new L.Circle(latlng, options, legacyOptions);
	};



	/*
	 * @class SVG
	 * @inherits Renderer
	 * @aka L.SVG
	 *
	 * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
	 * Inherits `Renderer`.
	 *
	 * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
	 * available in all web browsers, notably Android 2.x and 3.x.
	 *
	 * Although SVG is not available on IE7 and IE8, these browsers support
	 * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
	 * (a now deprecated technology), and the SVG renderer will fall back to VML in
	 * this case.
	 *
	 * @example
	 *
	 * Use SVG by default for all paths in the map:
	 *
	 * ```js
	 * var map = L.map('map', {
	 * 	renderer: L.svg()
	 * });
	 * ```
	 *
	 * Use a SVG renderer with extra padding for specific vector geometries:
	 *
	 * ```js
	 * var map = L.map('map');
	 * var myRenderer = L.svg({ padding: 0.5 });
	 * var line = L.polyline( coordinates, { renderer: myRenderer } );
	 * var circle = L.circle( center, { renderer: myRenderer } );
	 * ```
	 */

	L.SVG = L.Renderer.extend({

		getEvents: function () {
			var events = L.Renderer.prototype.getEvents.call(this);
			events.zoomstart = this._onZoomStart;
			return events;
		},

		_initContainer: function () {
			this._container = L.SVG.create('svg');

			// makes it possible to click through svg root; we'll reset it back in individual paths
			this._container.setAttribute('pointer-events', 'none');

			this._rootGroup = L.SVG.create('g');
			this._container.appendChild(this._rootGroup);
		},

		_onZoomStart: function () {
			// Drag-then-pinch interactions might mess up the center and zoom.
			// In this case, the easiest way to prevent this is re-do the renderer
			//   bounds and padding when the zooming starts.
			this._update();
		},

		_update: function () {
			if (this._map._animatingZoom && this._bounds) { return; }

			L.Renderer.prototype._update.call(this);

			var b = this._bounds,
			    size = b.getSize(),
			    container = this._container;

			// set size of svg-container if changed
			if (!this._svgSize || !this._svgSize.equals(size)) {
				this._svgSize = size;
				container.setAttribute('width', size.x);
				container.setAttribute('height', size.y);
			}

			// movement: update container viewBox so that we don't have to change coordinates of individual layers
			L.DomUtil.setPosition(container, b.min);
			container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

			this.fire('update');
		},

		// methods below are called by vector layers implementations

		_initPath: function (layer) {
			var path = layer._path = L.SVG.create('path');

			// @namespace Path
			// @option className: String = null
			// Custom class name set on an element. Only for SVG renderer.
			if (layer.options.className) {
				L.DomUtil.addClass(path, layer.options.className);
			}

			if (layer.options.interactive) {
				L.DomUtil.addClass(path, 'leaflet-interactive');
			}

			this._updateStyle(layer);
		},

		_addPath: function (layer) {
			this._rootGroup.appendChild(layer._path);
			layer.addInteractiveTarget(layer._path);
		},

		_removePath: function (layer) {
			L.DomUtil.remove(layer._path);
			layer.removeInteractiveTarget(layer._path);
		},

		_updatePath: function (layer) {
			layer._project();
			layer._update();
		},

		_updateStyle: function (layer) {
			var path = layer._path,
			    options = layer.options;

			if (!path) { return; }

			if (options.stroke) {
				path.setAttribute('stroke', options.color);
				path.setAttribute('stroke-opacity', options.opacity);
				path.setAttribute('stroke-width', options.weight);
				path.setAttribute('stroke-linecap', options.lineCap);
				path.setAttribute('stroke-linejoin', options.lineJoin);

				if (options.dashArray) {
					path.setAttribute('stroke-dasharray', options.dashArray);
				} else {
					path.removeAttribute('stroke-dasharray');
				}

				if (options.dashOffset) {
					path.setAttribute('stroke-dashoffset', options.dashOffset);
				} else {
					path.removeAttribute('stroke-dashoffset');
				}
			} else {
				path.setAttribute('stroke', 'none');
			}

			if (options.fill) {
				path.setAttribute('fill', options.fillColor || options.color);
				path.setAttribute('fill-opacity', options.fillOpacity);
				path.setAttribute('fill-rule', options.fillRule || 'evenodd');
			} else {
				path.setAttribute('fill', 'none');
			}
		},

		_updatePoly: function (layer, closed) {
			this._setPath(layer, L.SVG.pointsToPath(layer._parts, closed));
		},

		_updateCircle: function (layer) {
			var p = layer._point,
			    r = layer._radius,
			    r2 = layer._radiusY || r,
			    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

			// drawing a circle with two half-arcs
			var d = layer._empty() ? 'M0 0' :
					'M' + (p.x - r) + ',' + p.y +
					arc + (r * 2) + ',0 ' +
					arc + (-r * 2) + ',0 ';

			this._setPath(layer, d);
		},

		_setPath: function (layer, path) {
			layer._path.setAttribute('d', path);
		},

		// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
		_bringToFront: function (layer) {
			L.DomUtil.toFront(layer._path);
		},

		_bringToBack: function (layer) {
			L.DomUtil.toBack(layer._path);
		}
	});


	// @namespace SVG; @section
	// There are several static functions which can be called without instantiating L.SVG:
	L.extend(L.SVG, {
		// @function create(name: String): SVGElement
		// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
		// corresponding to the class name passed. For example, using 'line' will return
		// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
		create: function (name) {
			return document.createElementNS('http://www.w3.org/2000/svg', name);
		},

		// @function pointsToPath(rings: Point[], closed: Boolean): String
		// Generates a SVG path string for multiple rings, with each ring turning
		// into "M..L..L.." instructions
		pointsToPath: function (rings, closed) {
			var str = '',
			    i, j, len, len2, points, p;

			for (i = 0, len = rings.length; i < len; i++) {
				points = rings[i];

				for (j = 0, len2 = points.length; j < len2; j++) {
					p = points[j];
					str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
				}

				// closes the ring for polygons; "x" is VML syntax
				str += closed ? (L.Browser.svg ? 'z' : 'x') : '';
			}

			// SVG complains about empty path strings
			return str || 'M0 0';
		}
	});

	// @namespace Browser; @property svg: Boolean
	// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
	L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);


	// @namespace SVG
	// @factory L.svg(options?: Renderer options)
	// Creates a SVG renderer with the given options.
	L.svg = function (options) {
		return L.Browser.svg || L.Browser.vml ? new L.SVG(options) : null;
	};



	/*
	 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
	 */

	/*
	 * @class SVG
	 *
	 * Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.
	 *
	 * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
	 * with old versions of Internet Explorer.
	 */

	// @namespace Browser; @property vml: Boolean
	// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
	L.Browser.vml = !L.Browser.svg && (function () {
		try {
			var div = document.createElement('div');
			div.innerHTML = '<v:shape adj="1"/>';

			var shape = div.firstChild;
			shape.style.behavior = 'url(#default#VML)';

			return shape && (typeof shape.adj === 'object');

		} catch (e) {
			return false;
		}
	}());

	// redefine some SVG methods to handle VML syntax which is similar but with some differences
	L.SVG.include(!L.Browser.vml ? {} : {

		_initContainer: function () {
			this._container = L.DomUtil.create('div', 'leaflet-vml-container');
		},

		_update: function () {
			if (this._map._animatingZoom) { return; }
			L.Renderer.prototype._update.call(this);
			this.fire('update');
		},

		_initPath: function (layer) {
			var container = layer._container = L.SVG.create('shape');

			L.DomUtil.addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

			container.coordsize = '1 1';

			layer._path = L.SVG.create('path');
			container.appendChild(layer._path);

			this._updateStyle(layer);
		},

		_addPath: function (layer) {
			var container = layer._container;
			this._container.appendChild(container);

			if (layer.options.interactive) {
				layer.addInteractiveTarget(container);
			}
		},

		_removePath: function (layer) {
			var container = layer._container;
			L.DomUtil.remove(container);
			layer.removeInteractiveTarget(container);
		},

		_updateStyle: function (layer) {
			var stroke = layer._stroke,
			    fill = layer._fill,
			    options = layer.options,
			    container = layer._container;

			container.stroked = !!options.stroke;
			container.filled = !!options.fill;

			if (options.stroke) {
				if (!stroke) {
					stroke = layer._stroke = L.SVG.create('stroke');
				}
				container.appendChild(stroke);
				stroke.weight = options.weight + 'px';
				stroke.color = options.color;
				stroke.opacity = options.opacity;

				if (options.dashArray) {
					stroke.dashStyle = L.Util.isArray(options.dashArray) ?
					    options.dashArray.join(' ') :
					    options.dashArray.replace(/( *, *)/g, ' ');
				} else {
					stroke.dashStyle = '';
				}
				stroke.endcap = options.lineCap.replace('butt', 'flat');
				stroke.joinstyle = options.lineJoin;

			} else if (stroke) {
				container.removeChild(stroke);
				layer._stroke = null;
			}

			if (options.fill) {
				if (!fill) {
					fill = layer._fill = L.SVG.create('fill');
				}
				container.appendChild(fill);
				fill.color = options.fillColor || options.color;
				fill.opacity = options.fillOpacity;

			} else if (fill) {
				container.removeChild(fill);
				layer._fill = null;
			}
		},

		_updateCircle: function (layer) {
			var p = layer._point.round(),
			    r = Math.round(layer._radius),
			    r2 = Math.round(layer._radiusY || r);

			this._setPath(layer, layer._empty() ? 'M0 0' :
					'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
		},

		_setPath: function (layer, path) {
			layer._path.v = path;
		},

		_bringToFront: function (layer) {
			L.DomUtil.toFront(layer._container);
		},

		_bringToBack: function (layer) {
			L.DomUtil.toBack(layer._container);
		}
	});

	if (L.Browser.vml) {
		L.SVG.create = (function () {
			try {
				document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
				return function (name) {
					return document.createElement('<lvml:' + name + ' class="lvml">');
				};
			} catch (e) {
				return function (name) {
					return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
				};
			}
		})();
	}



	/*
	 * @class Canvas
	 * @inherits Renderer
	 * @aka L.Canvas
	 *
	 * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
	 * Inherits `Renderer`.
	 *
	 * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
	 * available in all web browsers, notably IE8, and overlapping geometries might
	 * not display properly in some edge cases.
	 *
	 * @example
	 *
	 * Use Canvas by default for all paths in the map:
	 *
	 * ```js
	 * var map = L.map('map', {
	 * 	renderer: L.canvas()
	 * });
	 * ```
	 *
	 * Use a Canvas renderer with extra padding for specific vector geometries:
	 *
	 * ```js
	 * var map = L.map('map');
	 * var myRenderer = L.canvas({ padding: 0.5 });
	 * var line = L.polyline( coordinates, { renderer: myRenderer } );
	 * var circle = L.circle( center, { renderer: myRenderer } );
	 * ```
	 */

	L.Canvas = L.Renderer.extend({

		onAdd: function () {
			L.Renderer.prototype.onAdd.call(this);

			this._layers = this._layers || {};

			// Redraw vectors since canvas is cleared upon removal,
			// in case of removing the renderer itself from the map.
			this._draw();
		},

		_initContainer: function () {
			var container = this._container = document.createElement('canvas');

			L.DomEvent
				.on(container, 'mousemove', L.Util.throttle(this._onMouseMove, 32, this), this)
				.on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this)
				.on(container, 'mouseout', this._handleMouseOut, this);

			this._ctx = container.getContext('2d');
		},

		_update: function () {
			if (this._map._animatingZoom && this._bounds) { return; }

			this._drawnLayers = {};

			L.Renderer.prototype._update.call(this);

			var b = this._bounds,
			    container = this._container,
			    size = b.getSize(),
			    m = L.Browser.retina ? 2 : 1;

			L.DomUtil.setPosition(container, b.min);

			// set canvas size (also clearing it); use double size on retina
			container.width = m * size.x;
			container.height = m * size.y;
			container.style.width = size.x + 'px';
			container.style.height = size.y + 'px';

			if (L.Browser.retina) {
				this._ctx.scale(2, 2);
			}

			// translate so we use the same path coordinates after canvas element moves
			this._ctx.translate(-b.min.x, -b.min.y);

			// Tell paths to redraw themselves
			this.fire('update');
		},

		_initPath: function (layer) {
			this._updateDashArray(layer);
			this._layers[L.stamp(layer)] = layer;
		},

		_addPath: L.Util.falseFn,

		_removePath: function (layer) {
			layer._removed = true;
			this._requestRedraw(layer);
		},

		_updatePath: function (layer) {
			this._redrawBounds = layer._pxBounds;
			this._draw(true);
			layer._project();
			layer._update();
			this._draw();
			this._redrawBounds = null;
		},

		_updateStyle: function (layer) {
			this._updateDashArray(layer);
			this._requestRedraw(layer);
		},

		_updateDashArray: function (layer) {
			if (layer.options.dashArray) {
				var parts = layer.options.dashArray.split(','),
				    dashArray = [],
				    i;
				for (i = 0; i < parts.length; i++) {
					dashArray.push(Number(parts[i]));
				}
				layer.options._dashArray = dashArray;
			}
		},

		_requestRedraw: function (layer) {
			if (!this._map) { return; }

			var padding = (layer.options.weight || 0) + 1;
			this._redrawBounds = this._redrawBounds || new L.Bounds();
			this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
			this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));

			this._redrawRequest = this._redrawRequest || L.Util.requestAnimFrame(this._redraw, this);
		},

		_redraw: function () {
			this._redrawRequest = null;

			this._draw(true); // clear layers in redraw bounds
			this._draw(); // draw layers

			this._redrawBounds = null;
		},

		_draw: function (clear) {
			this._clear = clear;
			var layer, bounds = this._redrawBounds;
			this._ctx.save();
			if (bounds) {
				this._ctx.beginPath();
				this._ctx.rect(bounds.min.x, bounds.min.y, bounds.max.x - bounds.min.x, bounds.max.y - bounds.min.y);
				this._ctx.clip();
			}

			for (var id in this._layers) {
				layer = this._layers[id];
				if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
					layer._updatePath();
				}
				if (clear && layer._removed) {
					delete layer._removed;
					delete this._layers[id];
				}
			}
			this._ctx.restore();  // Restore state before clipping.
		},

		_updatePoly: function (layer, closed) {

			var i, j, len2, p,
			    parts = layer._parts,
			    len = parts.length,
			    ctx = this._ctx;

			if (!len) { return; }

			this._drawnLayers[layer._leaflet_id] = layer;

			ctx.beginPath();

			if (ctx.setLineDash) {
				ctx.setLineDash(layer.options && layer.options._dashArray || []);
			}

			for (i = 0; i < len; i++) {
				for (j = 0, len2 = parts[i].length; j < len2; j++) {
					p = parts[i][j];
					ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
				}
				if (closed) {
					ctx.closePath();
				}
			}

			this._fillStroke(ctx, layer);

			// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
		},

		_updateCircle: function (layer) {

			if (layer._empty()) { return; }

			var p = layer._point,
			    ctx = this._ctx,
			    r = layer._radius,
			    s = (layer._radiusY || r) / r;

			this._drawnLayers[layer._leaflet_id] = layer;

			if (s !== 1) {
				ctx.save();
				ctx.scale(1, s);
			}

			ctx.beginPath();
			ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

			if (s !== 1) {
				ctx.restore();
			}

			this._fillStroke(ctx, layer);
		},

		_fillStroke: function (ctx, layer) {
			var clear = this._clear,
			    options = layer.options;

			ctx.globalCompositeOperation = clear ? 'destination-out' : 'source-over';

			if (options.fill) {
				ctx.globalAlpha = clear ? 1 : options.fillOpacity;
				ctx.fillStyle = options.fillColor || options.color;
				ctx.fill(options.fillRule || 'evenodd');
			}

			if (options.stroke && options.weight !== 0) {
				ctx.globalAlpha = clear ? 1 : options.opacity;

				// if clearing shape, do it with the previously drawn line width
				layer._prevWeight = ctx.lineWidth = clear ? layer._prevWeight + 1 : options.weight;

				ctx.strokeStyle = options.color;
				ctx.lineCap = options.lineCap;
				ctx.lineJoin = options.lineJoin;
				ctx.stroke();
			}
		},

		// Canvas obviously doesn't have mouse events for individual drawn objects,
		// so we emulate that by calculating what's under the mouse on mousemove/click manually

		_onClick: function (e) {
			var point = this._map.mouseEventToLayerPoint(e), layers = [], layer;

			for (var id in this._layers) {
				layer = this._layers[id];
				if (layer.options.interactive && layer._containsPoint(point) && !this._map._draggableMoved(layer)) {
					L.DomEvent._fakeStop(e);
					layers.push(layer);
				}
			}
			if (layers.length)  {
				this._fireEvent(layers, e);
			}
		},

		_onMouseMove: function (e) {
			if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

			var point = this._map.mouseEventToLayerPoint(e);
			this._handleMouseOut(e, point);
			this._handleMouseHover(e, point);
		},


		_handleMouseOut: function (e, point) {
			var layer = this._hoveredLayer;
			if (layer && (e.type === 'mouseout' || !layer._containsPoint(point))) {
				// if we're leaving the layer, fire mouseout
				L.DomUtil.removeClass(this._container, 'leaflet-interactive');
				this._fireEvent([layer], e, 'mouseout');
				this._hoveredLayer = null;
			}
		},

		_handleMouseHover: function (e, point) {
			var id, layer;

			for (id in this._drawnLayers) {
				layer = this._drawnLayers[id];
				if (layer.options.interactive && layer._containsPoint(point)) {
					L.DomUtil.addClass(this._container, 'leaflet-interactive'); // change cursor
					this._fireEvent([layer], e, 'mouseover');
					this._hoveredLayer = layer;
				}
			}

			if (this._hoveredLayer) {
				this._fireEvent([this._hoveredLayer], e);
			}
		},

		_fireEvent: function (layers, e, type) {
			this._map._fireDOMEvent(e, type || e.type, layers);
		},

		// TODO _bringToFront & _bringToBack, pretty tricky

		_bringToFront: L.Util.falseFn,
		_bringToBack: L.Util.falseFn
	});

	// @namespace Browser; @property canvas: Boolean
	// `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
	L.Browser.canvas = (function () {
		return !!document.createElement('canvas').getContext;
	}());

	// @namespace Canvas
	// @factory L.canvas(options?: Renderer options)
	// Creates a Canvas renderer with the given options.
	L.canvas = function (options) {
		return L.Browser.canvas ? new L.Canvas(options) : null;
	};

	L.Polyline.prototype._containsPoint = function (p, closed) {
		var i, j, k, len, len2, part,
		    w = this._clickTolerance();

		if (!this._pxBounds.contains(p)) { return false; }

		// hit detection for polylines
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }

				if (L.LineUtil.pointToSegmentDistance(p, part[k], part[j]) <= w) {
					return true;
				}
			}
		}
		return false;
	};

	L.Polygon.prototype._containsPoint = function (p) {
		var inside = false,
		    part, p1, p2, i, j, k, len, len2;

		if (!this._pxBounds.contains(p)) { return false; }

		// ray casting algorithm for detecting if point is in polygon
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		// also check if it's on polygon stroke
		return inside || L.Polyline.prototype._containsPoint.call(this, p, true);
	};

	L.CircleMarker.prototype._containsPoint = function (p) {
		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
	};



	/*
	 * @class GeoJSON
	 * @aka L.GeoJSON
	 * @inherits FeatureGroup
	 *
	 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
	 * GeoJSON data and display it on the map. Extends `FeatureGroup`.
	 *
	 * @example
	 *
	 * ```js
	 * L.geoJSON(data, {
	 * 	style: function (feature) {
	 * 		return {color: feature.properties.color};
	 * 	}
	 * }).bindPopup(function (layer) {
	 * 	return layer.feature.properties.description;
	 * }).addTo(map);
	 * ```
	 */

	L.GeoJSON = L.FeatureGroup.extend({

		/* @section
		 * @aka GeoJSON options
		 *
		 * @option pointToLayer: Function = *
		 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
		 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
		 * The default is to spawn a default `Marker`:
		 * ```js
		 * function(geoJsonPoint, latlng) {
		 * 	return L.marker(latlng);
		 * }
		 * ```
		 *
		 * @option style: Function = *
		 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
		 * called internally when data is added.
		 * The default value is to not override any defaults:
		 * ```js
		 * function (geoJsonFeature) {
		 * 	return {}
		 * }
		 * ```
		 *
		 * @option onEachFeature: Function = *
		 * A `Function` that will be called once for each created `Feature`, after it has
		 * been created and styled. Useful for attaching events and popups to features.
		 * The default is to do nothing with the newly created layers:
		 * ```js
		 * function (feature, layer) {}
		 * ```
		 *
		 * @option filter: Function = *
		 * A `Function` that will be used to decide whether to include a feature or not.
		 * The default is to include all features:
		 * ```js
		 * function (geoJsonFeature) {
		 * 	return true;
		 * }
		 * ```
		 * Note: dynamically changing the `filter` option will have effect only on newly
		 * added data. It will _not_ re-evaluate already included features.
		 *
		 * @option coordsToLatLng: Function = *
		 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
		 * The default is the `coordsToLatLng` static method.
		 */

		initialize: function (geojson, options) {
			L.setOptions(this, options);

			this._layers = {};

			if (geojson) {
				this.addData(geojson);
			}
		},

		// @method addData( <GeoJSON> data ): Layer
		// Adds a GeoJSON object to the layer.
		addData: function (geojson) {
			var features = L.Util.isArray(geojson) ? geojson : geojson.features,
			    i, len, feature;

			if (features) {
				for (i = 0, len = features.length; i < len; i++) {
					// only add this if geometry or geometries are set and not null
					feature = features[i];
					if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
						this.addData(feature);
					}
				}
				return this;
			}

			var options = this.options;

			if (options.filter && !options.filter(geojson)) { return this; }

			var layer = L.GeoJSON.geometryToLayer(geojson, options);
			if (!layer) {
				return this;
			}
			layer.feature = L.GeoJSON.asFeature(geojson);

			layer.defaultOptions = layer.options;
			this.resetStyle(layer);

			if (options.onEachFeature) {
				options.onEachFeature(geojson, layer);
			}

			return this.addLayer(layer);
		},

		// @method resetStyle( <Path> layer ): Layer
		// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
		resetStyle: function (layer) {
			// reset any custom styles
			layer.options = L.Util.extend({}, layer.defaultOptions);
			this._setLayerStyle(layer, this.options.style);
			return this;
		},

		// @method setStyle( <Function> style ): Layer
		// Changes styles of GeoJSON vector layers with the given style function.
		setStyle: function (style) {
			return this.eachLayer(function (layer) {
				this._setLayerStyle(layer, style);
			}, this);
		},

		_setLayerStyle: function (layer, style) {
			if (typeof style === 'function') {
				style = style(layer.feature);
			}
			if (layer.setStyle) {
				layer.setStyle(style);
			}
		}
	});

	// @section
	// There are several static functions which can be called without instantiating L.GeoJSON:
	L.extend(L.GeoJSON, {
		// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
		// Creates a `Layer` from a given GeoJSON feature. Can use a custom
		// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
		// functions if provided as options.
		geometryToLayer: function (geojson, options) {

			var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
			    coords = geometry ? geometry.coordinates : null,
			    layers = [],
			    pointToLayer = options && options.pointToLayer,
			    coordsToLatLng = options && options.coordsToLatLng || this.coordsToLatLng,
			    latlng, latlngs, i, len;

			if (!coords && !geometry) {
				return null;
			}

			switch (geometry.type) {
			case 'Point':
				latlng = coordsToLatLng(coords);
				return pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng);

			case 'MultiPoint':
				for (i = 0, len = coords.length; i < len; i++) {
					latlng = coordsToLatLng(coords[i]);
					layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new L.Marker(latlng));
				}
				return new L.FeatureGroup(layers);

			case 'LineString':
			case 'MultiLineString':
				latlngs = this.coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, coordsToLatLng);
				return new L.Polyline(latlngs, options);

			case 'Polygon':
			case 'MultiPolygon':
				latlngs = this.coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, coordsToLatLng);
				return new L.Polygon(latlngs, options);

			case 'GeometryCollection':
				for (i = 0, len = geometry.geometries.length; i < len; i++) {
					var layer = this.geometryToLayer({
						geometry: geometry.geometries[i],
						type: 'Feature',
						properties: geojson.properties
					}, options);

					if (layer) {
						layers.push(layer);
					}
				}
				return new L.FeatureGroup(layers);

			default:
				throw new Error('Invalid GeoJSON object.');
			}
		},

		// @function coordsToLatLng(coords: Array): LatLng
		// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
		// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
		coordsToLatLng: function (coords) {
			return new L.LatLng(coords[1], coords[0], coords[2]);
		},

		// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
		// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
		// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
		// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
		coordsToLatLngs: function (coords, levelsDeep, coordsToLatLng) {
			var latlngs = [];

			for (var i = 0, len = coords.length, latlng; i < len; i++) {
				latlng = levelsDeep ?
				        this.coordsToLatLngs(coords[i], levelsDeep - 1, coordsToLatLng) :
				        (coordsToLatLng || this.coordsToLatLng)(coords[i]);

				latlngs.push(latlng);
			}

			return latlngs;
		},

		// @function latLngToCoords(latlng: LatLng): Array
		// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
		latLngToCoords: function (latlng) {
			return latlng.alt !== undefined ?
					[latlng.lng, latlng.lat, latlng.alt] :
					[latlng.lng, latlng.lat];
		},

		// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
		// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
		// `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
		latLngsToCoords: function (latlngs, levelsDeep, closed) {
			var coords = [];

			for (var i = 0, len = latlngs.length; i < len; i++) {
				coords.push(levelsDeep ?
					L.GeoJSON.latLngsToCoords(latlngs[i], levelsDeep - 1, closed) :
					L.GeoJSON.latLngToCoords(latlngs[i]));
			}

			if (!levelsDeep && closed) {
				coords.push(coords[0]);
			}

			return coords;
		},

		getFeature: function (layer, newGeometry) {
			return layer.feature ?
					L.extend({}, layer.feature, {geometry: newGeometry}) :
					L.GeoJSON.asFeature(newGeometry);
		},

		// @function asFeature(geojson: Object): Object
		// Normalize GeoJSON geometries/features into GeoJSON features.
		asFeature: function (geojson) {
			if (geojson.type === 'Feature') {
				return geojson;
			}

			return {
				type: 'Feature',
				properties: {},
				geometry: geojson
			};
		}
	});

	var PointToGeoJSON = {
		toGeoJSON: function () {
			return L.GeoJSON.getFeature(this, {
				type: 'Point',
				coordinates: L.GeoJSON.latLngToCoords(this.getLatLng())
			});
		}
	};

	L.Marker.include(PointToGeoJSON);

	// @namespace CircleMarker
	// @method toGeoJSON(): Object
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
	L.Circle.include(PointToGeoJSON);
	L.CircleMarker.include(PointToGeoJSON);


	// @namespace Polyline
	// @method toGeoJSON(): Object
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
	L.Polyline.prototype.toGeoJSON = function () {
		var multi = !L.Polyline._flat(this._latlngs);

		var coords = L.GeoJSON.latLngsToCoords(this._latlngs, multi ? 1 : 0);

		return L.GeoJSON.getFeature(this, {
			type: (multi ? 'Multi' : '') + 'LineString',
			coordinates: coords
		});
	};

	// @namespace Polygon
	// @method toGeoJSON(): Object
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
	L.Polygon.prototype.toGeoJSON = function () {
		var holes = !L.Polyline._flat(this._latlngs),
		    multi = holes && !L.Polyline._flat(this._latlngs[0]);

		var coords = L.GeoJSON.latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true);

		if (!holes) {
			coords = [coords];
		}

		return L.GeoJSON.getFeature(this, {
			type: (multi ? 'Multi' : '') + 'Polygon',
			coordinates: coords
		});
	};


	// @namespace LayerGroup
	L.LayerGroup.include({
		toMultiPoint: function () {
			var coords = [];

			this.eachLayer(function (layer) {
				coords.push(layer.toGeoJSON().geometry.coordinates);
			});

			return L.GeoJSON.getFeature(this, {
				type: 'MultiPoint',
				coordinates: coords
			});
		},

		// @method toGeoJSON(): Object
		// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `GeometryCollection`).
		toGeoJSON: function () {

			var type = this.feature && this.feature.geometry && this.feature.geometry.type;

			if (type === 'MultiPoint') {
				return this.toMultiPoint();
			}

			var isGeometryCollection = type === 'GeometryCollection',
			    jsons = [];

			this.eachLayer(function (layer) {
				if (layer.toGeoJSON) {
					var json = layer.toGeoJSON();
					jsons.push(isGeometryCollection ? json.geometry : L.GeoJSON.asFeature(json));
				}
			});

			if (isGeometryCollection) {
				return L.GeoJSON.getFeature(this, {
					geometries: jsons,
					type: 'GeometryCollection'
				});
			}

			return {
				type: 'FeatureCollection',
				features: jsons
			};
		}
	});

	// @namespace GeoJSON
	// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
	// Creates a GeoJSON layer. Optionally accepts an object in
	// [GeoJSON format](http://geojson.org/geojson-spec.html) to display on the map
	// (you can alternatively add it later with `addData` method) and an `options` object.
	L.geoJSON = function (geojson, options) {
		return new L.GeoJSON(geojson, options);
	};
	// Backward compatibility.
	L.geoJson = L.geoJSON;



	/*
	 * @namespace DomEvent
	 * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
	 */

	// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.



	var eventsKey = '_leaflet_events';

	L.DomEvent = {

		// @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
		// Adds a listener function (`fn`) to a particular DOM event type of the
		// element `el`. You can optionally specify the context of the listener
		// (object the `this` keyword will point to). You can also pass several
		// space-separated types (e.g. `'click dblclick'`).

		// @alternative
		// @function on(el: HTMLElement, eventMap: Object, context?: Object): this
		// Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
		on: function (obj, types, fn, context) {

			if (typeof types === 'object') {
				for (var type in types) {
					this._on(obj, type, types[type], fn);
				}
			} else {
				types = L.Util.splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._on(obj, types[i], fn, context);
				}
			}

			return this;
		},

		// @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
		// Removes a previously added listener function. If no function is specified,
		// it will remove all the listeners of that particular DOM event from the element.
		// Note that if you passed a custom context to on, you must pass the same
		// context to `off` in order to remove the listener.

		// @alternative
		// @function off(el: HTMLElement, eventMap: Object, context?: Object): this
		// Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
		off: function (obj, types, fn, context) {

			if (typeof types === 'object') {
				for (var type in types) {
					this._off(obj, type, types[type], fn);
				}
			} else {
				types = L.Util.splitWords(types);

				for (var i = 0, len = types.length; i < len; i++) {
					this._off(obj, types[i], fn, context);
				}
			}

			return this;
		},

		_on: function (obj, type, fn, context) {
			var id = type + L.stamp(fn) + (context ? '_' + L.stamp(context) : '');

			if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

			var handler = function (e) {
				return fn.call(context || obj, e || window.event);
			};

			var originalHandler = handler;

			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				this.addPointerListener(obj, type, handler, id);

			} else if (L.Browser.touch && (type === 'dblclick') && this.addDoubleTapListener) {
				this.addDoubleTapListener(obj, handler, id);

			} else if ('addEventListener' in obj) {

				if (type === 'mousewheel') {
					obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

				} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
					handler = function (e) {
						e = e || window.event;
						if (L.DomEvent._isExternalTarget(obj, e)) {
							originalHandler(e);
						}
					};
					obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

				} else {
					if (type === 'click' && L.Browser.android) {
						handler = function (e) {
							return L.DomEvent._filterClick(e, originalHandler);
						};
					}
					obj.addEventListener(type, handler, false);
				}

			} else if ('attachEvent' in obj) {
				obj.attachEvent('on' + type, handler);
			}

			obj[eventsKey] = obj[eventsKey] || {};
			obj[eventsKey][id] = handler;

			return this;
		},

		_off: function (obj, type, fn, context) {

			var id = type + L.stamp(fn) + (context ? '_' + L.stamp(context) : ''),
			    handler = obj[eventsKey] && obj[eventsKey][id];

			if (!handler) { return this; }

			if (L.Browser.pointer && type.indexOf('touch') === 0) {
				this.removePointerListener(obj, type, id);

			} else if (L.Browser.touch && (type === 'dblclick') && this.removeDoubleTapListener) {
				this.removeDoubleTapListener(obj, id);

			} else if ('removeEventListener' in obj) {

				if (type === 'mousewheel') {
					obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

				} else {
					obj.removeEventListener(
						type === 'mouseenter' ? 'mouseover' :
						type === 'mouseleave' ? 'mouseout' : type, handler, false);
				}

			} else if ('detachEvent' in obj) {
				obj.detachEvent('on' + type, handler);
			}

			obj[eventsKey][id] = null;

			return this;
		},

		// @function stopPropagation(ev: DOMEvent): this
		// Stop the given event from propagation to parent elements. Used inside the listener functions:
		// ```js
		// L.DomEvent.on(div, 'click', function (ev) {
		// 	L.DomEvent.stopPropagation(ev);
		// });
		// ```
		stopPropagation: function (e) {

			if (e.stopPropagation) {
				e.stopPropagation();
			} else if (e.originalEvent) {  // In case of Leaflet event.
				e.originalEvent._stopped = true;
			} else {
				e.cancelBubble = true;
			}
			L.DomEvent._skipped(e);

			return this;
		},

		// @function disableScrollPropagation(el: HTMLElement): this
		// Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
		disableScrollPropagation: function (el) {
			return L.DomEvent.on(el, 'mousewheel', L.DomEvent.stopPropagation);
		},

		// @function disableClickPropagation(el: HTMLElement): this
		// Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
		// `'mousedown'` and `'touchstart'` events (plus browser variants).
		disableClickPropagation: function (el) {
			var stop = L.DomEvent.stopPropagation;

			L.DomEvent.on(el, L.Draggable.START.join(' '), stop);

			return L.DomEvent.on(el, {
				click: L.DomEvent._fakeStop,
				dblclick: stop
			});
		},

		// @function preventDefault(ev: DOMEvent): this
		// Prevents the default action of the DOM Event `ev` from happening (such as
		// following a link in the href of the a element, or doing a POST request
		// with page reload when a `<form>` is submitted).
		// Use it inside listener functions.
		preventDefault: function (e) {

			if (e.preventDefault) {
				e.preventDefault();
			} else {
				e.returnValue = false;
			}
			return this;
		},

		// @function stop(ev): this
		// Does `stopPropagation` and `preventDefault` at the same time.
		stop: function (e) {
			return L.DomEvent
				.preventDefault(e)
				.stopPropagation(e);
		},

		// @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
		// Gets normalized mouse position from a DOM event relative to the
		// `container` or to the whole page if not specified.
		getMousePosition: function (e, container) {
			if (!container) {
				return new L.Point(e.clientX, e.clientY);
			}

			var rect = container.getBoundingClientRect();

			return new L.Point(
				e.clientX - rect.left - container.clientLeft,
				e.clientY - rect.top - container.clientTop);
		},

		// Chrome on Win scrolls double the pixels as in other platforms (see #4538),
		// and Firefox scrolls device pixels, not CSS pixels
		_wheelPxFactor: (L.Browser.win && L.Browser.chrome) ? 2 :
		                L.Browser.gecko ? window.devicePixelRatio :
		                1,

		// @function getWheelDelta(ev: DOMEvent): Number
		// Gets normalized wheel delta from a mousewheel DOM event, in vertical
		// pixels scrolled (negative if scrolling down).
		// Events from pointing devices without precise scrolling are mapped to
		// a best guess of 60 pixels.
		getWheelDelta: function (e) {
			return (L.Browser.edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
			       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / L.DomEvent._wheelPxFactor : // Pixels
			       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
			       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
			       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
			       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
			       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
			       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
			       0;
		},

		_skipEvents: {},

		_fakeStop: function (e) {
			// fakes stopPropagation by setting a special event flag, checked/reset with L.DomEvent._skipped(e)
			L.DomEvent._skipEvents[e.type] = true;
		},

		_skipped: function (e) {
			var skipped = this._skipEvents[e.type];
			// reset when checking, as it's only used in map container and propagates outside of the map
			this._skipEvents[e.type] = false;
			return skipped;
		},

		// check if element really left/entered the event target (for mouseenter/mouseleave)
		_isExternalTarget: function (el, e) {

			var related = e.relatedTarget;

			if (!related) { return true; }

			try {
				while (related && (related !== el)) {
					related = related.parentNode;
				}
			} catch (err) {
				return false;
			}
			return (related !== el);
		},

		// this is a horrible workaround for a bug in Android where a single touch triggers two click events
		_filterClick: function (e, handler) {
			var timeStamp = (e.timeStamp || (e.originalEvent && e.originalEvent.timeStamp)),
			    elapsed = L.DomEvent._lastClick && (timeStamp - L.DomEvent._lastClick);

			// are they closer together than 500ms yet more than 100ms?
			// Android typically triggers them ~300ms apart while multiple listeners
			// on the same event should be triggered far faster;
			// or check if click is simulated on the element, and if it is, reject any non-simulated events

			if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
				L.DomEvent.stop(e);
				return;
			}
			L.DomEvent._lastClick = timeStamp;

			handler(e);
		}
	};

	// @function addListener(…): this
	// Alias to [`L.DomEvent.on`](#domevent-on)
	L.DomEvent.addListener = L.DomEvent.on;

	// @function removeListener(…): this
	// Alias to [`L.DomEvent.off`](#domevent-off)
	L.DomEvent.removeListener = L.DomEvent.off;



	/*
	 * @class Draggable
	 * @aka L.Draggable
	 * @inherits Evented
	 *
	 * A class for making DOM elements draggable (including touch support).
	 * Used internally for map and marker dragging. Only works for elements
	 * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
	 *
	 * @example
	 * ```js
	 * var draggable = new L.Draggable(elementToDrag);
	 * draggable.enable();
	 * ```
	 */

	L.Draggable = L.Evented.extend({

		options: {
			// @option clickTolerance: Number = 3
			// The max number of pixels a user can shift the mouse pointer during a click
			// for it to be considered a valid click (as opposed to a mouse drag).
			clickTolerance: 3
		},

		statics: {
			START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
			END: {
				mousedown: 'mouseup',
				touchstart: 'touchend',
				pointerdown: 'touchend',
				MSPointerDown: 'touchend'
			},
			MOVE: {
				mousedown: 'mousemove',
				touchstart: 'touchmove',
				pointerdown: 'touchmove',
				MSPointerDown: 'touchmove'
			}
		},

		// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline: Boolean)
		// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
		initialize: function (element, dragStartTarget, preventOutline) {
			this._element = element;
			this._dragStartTarget = dragStartTarget || element;
			this._preventOutline = preventOutline;
		},

		// @method enable()
		// Enables the dragging ability
		enable: function () {
			if (this._enabled) { return; }

			L.DomEvent.on(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);

			this._enabled = true;
		},

		// @method disable()
		// Disables the dragging ability
		disable: function () {
			if (!this._enabled) { return; }

			L.DomEvent.off(this._dragStartTarget, L.Draggable.START.join(' '), this._onDown, this);

			this._enabled = false;
			this._moved = false;
		},

		_onDown: function (e) {
			// Ignore simulated events, since we handle both touch and
			// mouse explicitly; otherwise we risk getting duplicates of
			// touch events, see #4315.
			// Also ignore the event if disabled; this happens in IE11
			// under some circumstances, see #3666.
			if (e._simulated || !this._enabled) { return; }

			this._moved = false;

			if (L.DomUtil.hasClass(this._element, 'leaflet-zoom-anim')) { return; }

			if (L.Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches) || !this._enabled) { return; }
			L.Draggable._dragging = true;  // Prevent dragging multiple objects at once.

			if (this._preventOutline) {
				L.DomUtil.preventOutline(this._element);
			}

			L.DomUtil.disableImageDrag();
			L.DomUtil.disableTextSelection();

			if (this._moving) { return; }

			// @event down: Event
			// Fired when a drag is about to start.
			this.fire('down');

			var first = e.touches ? e.touches[0] : e;

			this._startPoint = new L.Point(first.clientX, first.clientY);

			L.DomEvent
				.on(document, L.Draggable.MOVE[e.type], this._onMove, this)
				.on(document, L.Draggable.END[e.type], this._onUp, this);
		},

		_onMove: function (e) {
			// Ignore simulated events, since we handle both touch and
			// mouse explicitly; otherwise we risk getting duplicates of
			// touch events, see #4315.
			// Also ignore the event if disabled; this happens in IE11
			// under some circumstances, see #3666.
			if (e._simulated || !this._enabled) { return; }

			if (e.touches && e.touches.length > 1) {
				this._moved = true;
				return;
			}

			var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			    newPoint = new L.Point(first.clientX, first.clientY),
			    offset = newPoint.subtract(this._startPoint);

			if (!offset.x && !offset.y) { return; }
			if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

			L.DomEvent.preventDefault(e);

			if (!this._moved) {
				// @event dragstart: Event
				// Fired when a drag starts
				this.fire('dragstart');

				this._moved = true;
				this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

				L.DomUtil.addClass(document.body, 'leaflet-dragging');

				this._lastTarget = e.target || e.srcElement;
				// IE and Edge do not give the <use> element, so fetch it
				// if necessary
				if ((window.SVGElementInstance) && (this._lastTarget instanceof SVGElementInstance)) {
					this._lastTarget = this._lastTarget.correspondingUseElement;
				}
				L.DomUtil.addClass(this._lastTarget, 'leaflet-drag-target');
			}

			this._newPos = this._startPos.add(offset);
			this._moving = true;

			L.Util.cancelAnimFrame(this._animRequest);
			this._lastEvent = e;
			this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true);
		},

		_updatePosition: function () {
			var e = {originalEvent: this._lastEvent};

			// @event predrag: Event
			// Fired continuously during dragging *before* each corresponding
			// update of the element's position.
			this.fire('predrag', e);
			L.DomUtil.setPosition(this._element, this._newPos);

			// @event drag: Event
			// Fired continuously during dragging.
			this.fire('drag', e);
		},

		_onUp: function (e) {
			// Ignore simulated events, since we handle both touch and
			// mouse explicitly; otherwise we risk getting duplicates of
			// touch events, see #4315.
			// Also ignore the event if disabled; this happens in IE11
			// under some circumstances, see #3666.
			if (e._simulated || !this._enabled) { return; }

			L.DomUtil.removeClass(document.body, 'leaflet-dragging');

			if (this._lastTarget) {
				L.DomUtil.removeClass(this._lastTarget, 'leaflet-drag-target');
				this._lastTarget = null;
			}

			for (var i in L.Draggable.MOVE) {
				L.DomEvent
					.off(document, L.Draggable.MOVE[i], this._onMove, this)
					.off(document, L.Draggable.END[i], this._onUp, this);
			}

			L.DomUtil.enableImageDrag();
			L.DomUtil.enableTextSelection();

			if (this._moved && this._moving) {
				// ensure drag is not fired after dragend
				L.Util.cancelAnimFrame(this._animRequest);

				// @event dragend: DragEndEvent
				// Fired when the drag ends.
				this.fire('dragend', {
					distance: this._newPos.distanceTo(this._startPos)
				});
			}

			this._moving = false;
			L.Draggable._dragging = false;
		}
	});



	/*
		L.Handler is a base class for handler classes that are used internally to inject
		interaction features like dragging to classes like Map and Marker.
	*/

	// @class Handler
	// @aka L.Handler
	// Abstract class for map interaction handlers

	L.Handler = L.Class.extend({
		initialize: function (map) {
			this._map = map;
		},

		// @method enable(): this
		// Enables the handler
		enable: function () {
			if (this._enabled) { return this; }

			this._enabled = true;
			this.addHooks();
			return this;
		},

		// @method disable(): this
		// Disables the handler
		disable: function () {
			if (!this._enabled) { return this; }

			this._enabled = false;
			this.removeHooks();
			return this;
		},

		// @method enabled(): Boolean
		// Returns `true` if the handler is enabled
		enabled: function () {
			return !!this._enabled;
		}

		// @section Extension methods
		// Classes inheriting from `Handler` must implement the two following methods:
		// @method addHooks()
		// Called when the handler is enabled, should add event hooks.
		// @method removeHooks()
		// Called when the handler is disabled, should remove the event hooks added previously.
	});



	/*
	 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
	 */

	// @namespace Map
	// @section Interaction Options
	L.Map.mergeOptions({
		// @option dragging: Boolean = true
		// Whether the map be draggable with mouse/touch or not.
		dragging: true,

		// @section Panning Inertia Options
		// @option inertia: Boolean = *
		// If enabled, panning of the map will have an inertia effect where
		// the map builds momentum while dragging and continues moving in
		// the same direction for some time. Feels especially nice on touch
		// devices. Enabled by default unless running on old Android devices.
		inertia: !L.Browser.android23,

		// @option inertiaDeceleration: Number = 3000
		// The rate with which the inertial movement slows down, in pixels/second².
		inertiaDeceleration: 3400, // px/s^2

		// @option inertiaMaxSpeed: Number = Infinity
		// Max speed of the inertial movement, in pixels/second.
		inertiaMaxSpeed: Infinity, // px/s

		// @option easeLinearity: Number = 0.2
		easeLinearity: 0.2,

		// TODO refactor, move to CRS
		// @option worldCopyJump: Boolean = false
		// With this option enabled, the map tracks when you pan to another "copy"
		// of the world and seamlessly jumps to the original one so that all overlays
		// like markers and vector layers are still visible.
		worldCopyJump: false,

		// @option maxBoundsViscosity: Number = 0.0
		// If `maxBounds` is set, this option will control how solid the bounds
		// are when dragging the map around. The default value of `0.0` allows the
		// user to drag outside the bounds at normal speed, higher values will
		// slow down map dragging outside bounds, and `1.0` makes the bounds fully
		// solid, preventing the user from dragging outside the bounds.
		maxBoundsViscosity: 0.0
	});

	L.Map.Drag = L.Handler.extend({
		addHooks: function () {
			if (!this._draggable) {
				var map = this._map;

				this._draggable = new L.Draggable(map._mapPane, map._container);

				this._draggable.on({
					down: this._onDown,
					dragstart: this._onDragStart,
					drag: this._onDrag,
					dragend: this._onDragEnd
				}, this);

				this._draggable.on('predrag', this._onPreDragLimit, this);
				if (map.options.worldCopyJump) {
					this._draggable.on('predrag', this._onPreDragWrap, this);
					map.on('zoomend', this._onZoomEnd, this);

					map.whenReady(this._onZoomEnd, this);
				}
			}
			L.DomUtil.addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
			this._draggable.enable();
			this._positions = [];
			this._times = [];
		},

		removeHooks: function () {
			L.DomUtil.removeClass(this._map._container, 'leaflet-grab');
			L.DomUtil.removeClass(this._map._container, 'leaflet-touch-drag');
			this._draggable.disable();
		},

		moved: function () {
			return this._draggable && this._draggable._moved;
		},

		moving: function () {
			return this._draggable && this._draggable._moving;
		},

		_onDown: function () {
			this._map._stop();
		},

		_onDragStart: function () {
			var map = this._map;

			if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
				var bounds = L.latLngBounds(this._map.options.maxBounds);

				this._offsetLimit = L.bounds(
					this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
					this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
						.add(this._map.getSize()));

				this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
			} else {
				this._offsetLimit = null;
			}

			map
			    .fire('movestart')
			    .fire('dragstart');

			if (map.options.inertia) {
				this._positions = [];
				this._times = [];
			}
		},

		_onDrag: function (e) {
			if (this._map.options.inertia) {
				var time = this._lastTime = +new Date(),
				    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

				this._positions.push(pos);
				this._times.push(time);

				if (time - this._times[0] > 50) {
					this._positions.shift();
					this._times.shift();
				}
			}

			this._map
			    .fire('move', e)
			    .fire('drag', e);
		},

		_onZoomEnd: function () {
			var pxCenter = this._map.getSize().divideBy(2),
			    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

			this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
			this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
		},

		_viscousLimit: function (value, threshold) {
			return value - (value - threshold) * this._viscosity;
		},

		_onPreDragLimit: function () {
			if (!this._viscosity || !this._offsetLimit) { return; }

			var offset = this._draggable._newPos.subtract(this._draggable._startPos);

			var limit = this._offsetLimit;
			if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
			if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
			if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
			if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

			this._draggable._newPos = this._draggable._startPos.add(offset);
		},

		_onPreDragWrap: function () {
			// TODO refactor to be able to adjust map pane position after zoom
			var worldWidth = this._worldWidth,
			    halfWidth = Math.round(worldWidth / 2),
			    dx = this._initialWorldOffset,
			    x = this._draggable._newPos.x,
			    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
			    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
			    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

			this._draggable._absPos = this._draggable._newPos.clone();
			this._draggable._newPos.x = newX;
		},

		_onDragEnd: function (e) {
			var map = this._map,
			    options = map.options,

			    noInertia = !options.inertia || this._times.length < 2;

			map.fire('dragend', e);

			if (noInertia) {
				map.fire('moveend');

			} else {

				var direction = this._lastPos.subtract(this._positions[0]),
				    duration = (this._lastTime - this._times[0]) / 1000,
				    ease = options.easeLinearity,

				    speedVector = direction.multiplyBy(ease / duration),
				    speed = speedVector.distanceTo([0, 0]),

				    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
				    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

				    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
				    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

				if (!offset.x && !offset.y) {
					map.fire('moveend');

				} else {
					offset = map._limitOffset(offset, map.options.maxBounds);

					L.Util.requestAnimFrame(function () {
						map.panBy(offset, {
							duration: decelerationDuration,
							easeLinearity: ease,
							noMoveStart: true,
							animate: true
						});
					});
				}
			}
		}
	});

	// @section Handlers
	// @property dragging: Handler
	// Map dragging handler (by both mouse and touch).
	L.Map.addInitHook('addHandler', 'dragging', L.Map.Drag);



	/*
	 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
	 */

	// @namespace Map
	// @section Interaction Options

	L.Map.mergeOptions({
		// @option doubleClickZoom: Boolean|String = true
		// Whether the map can be zoomed in by double clicking on it and
		// zoomed out by double clicking while holding shift. If passed
		// `'center'`, double-click zoom will zoom to the center of the
		//  view regardless of where the mouse was.
		doubleClickZoom: true
	});

	L.Map.DoubleClickZoom = L.Handler.extend({
		addHooks: function () {
			this._map.on('dblclick', this._onDoubleClick, this);
		},

		removeHooks: function () {
			this._map.off('dblclick', this._onDoubleClick, this);
		},

		_onDoubleClick: function (e) {
			var map = this._map,
			    oldZoom = map.getZoom(),
			    delta = map.options.zoomDelta,
			    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

			if (map.options.doubleClickZoom === 'center') {
				map.setZoom(zoom);
			} else {
				map.setZoomAround(e.containerPoint, zoom);
			}
		}
	});

	// @section Handlers
	//
	// Map properties include interaction handlers that allow you to control
	// interaction behavior in runtime, enabling or disabling certain features such
	// as dragging or touch zoom (see `Handler` methods). For example:
	//
	// ```js
	// map.doubleClickZoom.disable();
	// ```
	//
	// @property doubleClickZoom: Handler
	// Double click zoom handler.
	L.Map.addInitHook('addHandler', 'doubleClickZoom', L.Map.DoubleClickZoom);



	/*
	 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
	 */

	// @namespace Map
	// @section Interaction Options
	L.Map.mergeOptions({
		// @section Mousewheel options
		// @option scrollWheelZoom: Boolean|String = true
		// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
		// it will zoom to the center of the view regardless of where the mouse was.
		scrollWheelZoom: true,

		// @option wheelDebounceTime: Number = 40
		// Limits the rate at which a wheel can fire (in milliseconds). By default
		// user can't zoom via wheel more often than once per 40 ms.
		wheelDebounceTime: 40,

		// @option wheelPxPerZoomLevel: Number = 60
		// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
		// mean a change of one full zoom level. Smaller values will make wheel-zooming
		// faster (and vice versa).
		wheelPxPerZoomLevel: 60
	});

	L.Map.ScrollWheelZoom = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'mousewheel', this._onWheelScroll, this);

			this._delta = 0;
		},

		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'mousewheel', this._onWheelScroll, this);
		},

		_onWheelScroll: function (e) {
			var delta = L.DomEvent.getWheelDelta(e);

			var debounce = this._map.options.wheelDebounceTime;

			this._delta += delta;
			this._lastMousePos = this._map.mouseEventToContainerPoint(e);

			if (!this._startTime) {
				this._startTime = +new Date();
			}

			var left = Math.max(debounce - (+new Date() - this._startTime), 0);

			clearTimeout(this._timer);
			this._timer = setTimeout(L.bind(this._performZoom, this), left);

			L.DomEvent.stop(e);
		},

		_performZoom: function () {
			var map = this._map,
			    zoom = map.getZoom(),
			    snap = this._map.options.zoomSnap || 0;

			map._stop(); // stop panning and fly animations if any

			// map the delta with a sigmoid function to -4..4 range leaning on -1..1
			var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
			    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
			    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
			    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

			this._delta = 0;
			this._startTime = null;

			if (!delta) { return; }

			if (map.options.scrollWheelZoom === 'center') {
				map.setZoom(zoom + delta);
			} else {
				map.setZoomAround(this._lastMousePos, zoom + delta);
			}
		}
	});

	// @section Handlers
	// @property scrollWheelZoom: Handler
	// Scroll wheel zoom handler.
	L.Map.addInitHook('addHandler', 'scrollWheelZoom', L.Map.ScrollWheelZoom);



	/*
	 * Extends the event handling code with double tap support for mobile browsers.
	 */

	L.extend(L.DomEvent, {

		_touchstart: L.Browser.msPointer ? 'MSPointerDown' : L.Browser.pointer ? 'pointerdown' : 'touchstart',
		_touchend: L.Browser.msPointer ? 'MSPointerUp' : L.Browser.pointer ? 'pointerup' : 'touchend',

		// inspired by Zepto touch code by Thomas Fuchs
		addDoubleTapListener: function (obj, handler, id) {
			var last, touch,
			    doubleTap = false,
			    delay = 250;

			function onTouchStart(e) {
				var count;

				if (L.Browser.pointer) {
					count = L.DomEvent._pointersCount;
				} else {
					count = e.touches.length;
				}

				if (count > 1) { return; }

				var now = Date.now(),
				    delta = now - (last || now);

				touch = e.touches ? e.touches[0] : e;
				doubleTap = (delta > 0 && delta <= delay);
				last = now;
			}

			function onTouchEnd() {
				if (doubleTap && !touch.cancelBubble) {
					if (L.Browser.pointer) {
						// work around .type being readonly with MSPointer* events
						var newTouch = {},
						    prop, i;

						for (i in touch) {
							prop = touch[i];
							newTouch[i] = prop && prop.bind ? prop.bind(touch) : prop;
						}
						touch = newTouch;
					}
					touch.type = 'dblclick';
					handler(touch);
					last = null;
				}
			}

			var pre = '_leaflet_',
			    touchstart = this._touchstart,
			    touchend = this._touchend;

			obj[pre + touchstart + id] = onTouchStart;
			obj[pre + touchend + id] = onTouchEnd;
			obj[pre + 'dblclick' + id] = handler;

			obj.addEventListener(touchstart, onTouchStart, false);
			obj.addEventListener(touchend, onTouchEnd, false);

			// On some platforms (notably, chrome on win10 + touchscreen + mouse),
			// the browser doesn't fire touchend/pointerup events but does fire
			// native dblclicks. See #4127.
			if (!L.Browser.edge) {
				obj.addEventListener('dblclick', handler, false);
			}

			return this;
		},

		removeDoubleTapListener: function (obj, id) {
			var pre = '_leaflet_',
			    touchstart = obj[pre + this._touchstart + id],
			    touchend = obj[pre + this._touchend + id],
			    dblclick = obj[pre + 'dblclick' + id];

			obj.removeEventListener(this._touchstart, touchstart, false);
			obj.removeEventListener(this._touchend, touchend, false);
			if (!L.Browser.edge) {
				obj.removeEventListener('dblclick', dblclick, false);
			}

			return this;
		}
	});



	/*
	 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
	 */

	L.extend(L.DomEvent, {

		POINTER_DOWN:   L.Browser.msPointer ? 'MSPointerDown'   : 'pointerdown',
		POINTER_MOVE:   L.Browser.msPointer ? 'MSPointerMove'   : 'pointermove',
		POINTER_UP:     L.Browser.msPointer ? 'MSPointerUp'     : 'pointerup',
		POINTER_CANCEL: L.Browser.msPointer ? 'MSPointerCancel' : 'pointercancel',
		TAG_WHITE_LIST: ['INPUT', 'SELECT', 'OPTION'],

		_pointers: {},
		_pointersCount: 0,

		// Provides a touch events wrapper for (ms)pointer events.
		// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

		addPointerListener: function (obj, type, handler, id) {

			if (type === 'touchstart') {
				this._addPointerStart(obj, handler, id);

			} else if (type === 'touchmove') {
				this._addPointerMove(obj, handler, id);

			} else if (type === 'touchend') {
				this._addPointerEnd(obj, handler, id);
			}

			return this;
		},

		removePointerListener: function (obj, type, id) {
			var handler = obj['_leaflet_' + type + id];

			if (type === 'touchstart') {
				obj.removeEventListener(this.POINTER_DOWN, handler, false);

			} else if (type === 'touchmove') {
				obj.removeEventListener(this.POINTER_MOVE, handler, false);

			} else if (type === 'touchend') {
				obj.removeEventListener(this.POINTER_UP, handler, false);
				obj.removeEventListener(this.POINTER_CANCEL, handler, false);
			}

			return this;
		},

		_addPointerStart: function (obj, handler, id) {
			var onDown = L.bind(function (e) {
				if (e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
					// In IE11, some touch events needs to fire for form controls, or
					// the controls will stop working. We keep a whitelist of tag names that
					// need these events. For other target tags, we prevent default on the event.
					if (this.TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
						L.DomEvent.preventDefault(e);
					} else {
						return;
					}
				}

				this._handlePointer(e, handler);
			}, this);

			obj['_leaflet_touchstart' + id] = onDown;
			obj.addEventListener(this.POINTER_DOWN, onDown, false);

			// need to keep track of what pointers and how many are active to provide e.touches emulation
			if (!this._pointerDocListener) {
				var pointerUp = L.bind(this._globalPointerUp, this);

				// we listen documentElement as any drags that end by moving the touch off the screen get fired there
				document.documentElement.addEventListener(this.POINTER_DOWN, L.bind(this._globalPointerDown, this), true);
				document.documentElement.addEventListener(this.POINTER_MOVE, L.bind(this._globalPointerMove, this), true);
				document.documentElement.addEventListener(this.POINTER_UP, pointerUp, true);
				document.documentElement.addEventListener(this.POINTER_CANCEL, pointerUp, true);

				this._pointerDocListener = true;
			}
		},

		_globalPointerDown: function (e) {
			this._pointers[e.pointerId] = e;
			this._pointersCount++;
		},

		_globalPointerMove: function (e) {
			if (this._pointers[e.pointerId]) {
				this._pointers[e.pointerId] = e;
			}
		},

		_globalPointerUp: function (e) {
			delete this._pointers[e.pointerId];
			this._pointersCount--;
		},

		_handlePointer: function (e, handler) {
			e.touches = [];
			for (var i in this._pointers) {
				e.touches.push(this._pointers[i]);
			}
			e.changedTouches = [e];

			handler(e);
		},

		_addPointerMove: function (obj, handler, id) {
			var onMove = L.bind(function (e) {
				// don't fire touch moves when mouse isn't down
				if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

				this._handlePointer(e, handler);
			}, this);

			obj['_leaflet_touchmove' + id] = onMove;
			obj.addEventListener(this.POINTER_MOVE, onMove, false);
		},

		_addPointerEnd: function (obj, handler, id) {
			var onUp = L.bind(function (e) {
				this._handlePointer(e, handler);
			}, this);

			obj['_leaflet_touchend' + id] = onUp;
			obj.addEventListener(this.POINTER_UP, onUp, false);
			obj.addEventListener(this.POINTER_CANCEL, onUp, false);
		}
	});



	/*
	 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
	 */

	// @namespace Map
	// @section Interaction Options
	L.Map.mergeOptions({
		// @section Touch interaction options
		// @option touchZoom: Boolean|String = *
		// Whether the map can be zoomed by touch-dragging with two fingers. If
		// passed `'center'`, it will zoom to the center of the view regardless of
		// where the touch events (fingers) were. Enabled for touch-capable web
		// browsers except for old Androids.
		touchZoom: L.Browser.touch && !L.Browser.android23,

		// @option bounceAtZoomLimits: Boolean = true
		// Set it to false if you don't want the map to zoom beyond min/max zoom
		// and then bounce back when pinch-zooming.
		bounceAtZoomLimits: true
	});

	L.Map.TouchZoom = L.Handler.extend({
		addHooks: function () {
			L.DomUtil.addClass(this._map._container, 'leaflet-touch-zoom');
			L.DomEvent.on(this._map._container, 'touchstart', this._onTouchStart, this);
		},

		removeHooks: function () {
			L.DomUtil.removeClass(this._map._container, 'leaflet-touch-zoom');
			L.DomEvent.off(this._map._container, 'touchstart', this._onTouchStart, this);
		},

		_onTouchStart: function (e) {
			var map = this._map;
			if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

			var p1 = map.mouseEventToContainerPoint(e.touches[0]),
			    p2 = map.mouseEventToContainerPoint(e.touches[1]);

			this._centerPoint = map.getSize()._divideBy(2);
			this._startLatLng = map.containerPointToLatLng(this._centerPoint);
			if (map.options.touchZoom !== 'center') {
				this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
			}

			this._startDist = p1.distanceTo(p2);
			this._startZoom = map.getZoom();

			this._moved = false;
			this._zooming = true;

			map._stop();

			L.DomEvent
			    .on(document, 'touchmove', this._onTouchMove, this)
			    .on(document, 'touchend', this._onTouchEnd, this);

			L.DomEvent.preventDefault(e);
		},

		_onTouchMove: function (e) {
			if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

			var map = this._map,
			    p1 = map.mouseEventToContainerPoint(e.touches[0]),
			    p2 = map.mouseEventToContainerPoint(e.touches[1]),
			    scale = p1.distanceTo(p2) / this._startDist;


			this._zoom = map.getScaleZoom(scale, this._startZoom);

			if (!map.options.bounceAtZoomLimits && (
				(this._zoom < map.getMinZoom() && scale < 1) ||
				(this._zoom > map.getMaxZoom() && scale > 1))) {
				this._zoom = map._limitZoom(this._zoom);
			}

			if (map.options.touchZoom === 'center') {
				this._center = this._startLatLng;
				if (scale === 1) { return; }
			} else {
				// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
				var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
				if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
				this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
			}

			if (!this._moved) {
				map._moveStart(true);
				this._moved = true;
			}

			L.Util.cancelAnimFrame(this._animRequest);

			var moveFn = L.bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
			this._animRequest = L.Util.requestAnimFrame(moveFn, this, true);

			L.DomEvent.preventDefault(e);
		},

		_onTouchEnd: function () {
			if (!this._moved || !this._zooming) {
				this._zooming = false;
				return;
			}

			this._zooming = false;
			L.Util.cancelAnimFrame(this._animRequest);

			L.DomEvent
			    .off(document, 'touchmove', this._onTouchMove)
			    .off(document, 'touchend', this._onTouchEnd);

			// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
			if (this._map.options.zoomAnimation) {
				this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
			} else {
				this._map._resetView(this._center, this._map._limitZoom(this._zoom));
			}
		}
	});

	// @section Handlers
	// @property touchZoom: Handler
	// Touch zoom handler.
	L.Map.addInitHook('addHandler', 'touchZoom', L.Map.TouchZoom);



	/*
	 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
	 */

	// @namespace Map
	// @section Interaction Options
	L.Map.mergeOptions({
		// @section Touch interaction options
		// @option tap: Boolean = true
		// Enables mobile hacks for supporting instant taps (fixing 200ms click
		// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
		tap: true,

		// @option tapTolerance: Number = 15
		// The max number of pixels a user can shift his finger during touch
		// for it to be considered a valid tap.
		tapTolerance: 15
	});

	L.Map.Tap = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
		},

		removeHooks: function () {
			L.DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
		},

		_onDown: function (e) {
			if (!e.touches) { return; }

			L.DomEvent.preventDefault(e);

			this._fireClick = true;

			// don't simulate click or track longpress if more than 1 touch
			if (e.touches.length > 1) {
				this._fireClick = false;
				clearTimeout(this._holdTimeout);
				return;
			}

			var first = e.touches[0],
			    el = first.target;

			this._startPos = this._newPos = new L.Point(first.clientX, first.clientY);

			// if touching a link, highlight it
			if (el.tagName && el.tagName.toLowerCase() === 'a') {
				L.DomUtil.addClass(el, 'leaflet-active');
			}

			// simulate long hold but setting a timeout
			this._holdTimeout = setTimeout(L.bind(function () {
				if (this._isTapValid()) {
					this._fireClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);

			this._simulateEvent('mousedown', first);

			L.DomEvent.on(document, {
				touchmove: this._onMove,
				touchend: this._onUp
			}, this);
		},

		_onUp: function (e) {
			clearTimeout(this._holdTimeout);

			L.DomEvent.off(document, {
				touchmove: this._onMove,
				touchend: this._onUp
			}, this);

			if (this._fireClick && e && e.changedTouches) {

				var first = e.changedTouches[0],
				    el = first.target;

				if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
					L.DomUtil.removeClass(el, 'leaflet-active');
				}

				this._simulateEvent('mouseup', first);

				// simulate click if the touch didn't move too much
				if (this._isTapValid()) {
					this._simulateEvent('click', first);
				}
			}
		},

		_isTapValid: function () {
			return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
		},

		_onMove: function (e) {
			var first = e.touches[0];
			this._newPos = new L.Point(first.clientX, first.clientY);
			this._simulateEvent('mousemove', first);
		},

		_simulateEvent: function (type, e) {
			var simulatedEvent = document.createEvent('MouseEvents');

			simulatedEvent._simulated = true;
			e.target._simulatedClick = true;

			simulatedEvent.initMouseEvent(
			        type, true, true, window, 1,
			        e.screenX, e.screenY,
			        e.clientX, e.clientY,
			        false, false, false, false, 0, null);

			e.target.dispatchEvent(simulatedEvent);
		}
	});

	// @section Handlers
	// @property tap: Handler
	// Mobile touch hacks (quick tap and touch hold) handler.
	if (L.Browser.touch && !L.Browser.pointer) {
		L.Map.addInitHook('addHandler', 'tap', L.Map.Tap);
	}



	/*
	 * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
	 * (zoom to a selected bounding box), enabled by default.
	 */

	// @namespace Map
	// @section Interaction Options
	L.Map.mergeOptions({
		// @option boxZoom: Boolean = true
		// Whether the map can be zoomed to a rectangular area specified by
		// dragging the mouse while pressing the shift key.
		boxZoom: true
	});

	L.Map.BoxZoom = L.Handler.extend({
		initialize: function (map) {
			this._map = map;
			this._container = map._container;
			this._pane = map._panes.overlayPane;
		},

		addHooks: function () {
			L.DomEvent.on(this._container, 'mousedown', this._onMouseDown, this);
		},

		removeHooks: function () {
			L.DomEvent.off(this._container, 'mousedown', this._onMouseDown, this);
		},

		moved: function () {
			return this._moved;
		},

		_resetState: function () {
			this._moved = false;
		},

		_onMouseDown: function (e) {
			if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

			this._resetState();

			L.DomUtil.disableTextSelection();
			L.DomUtil.disableImageDrag();

			this._startPoint = this._map.mouseEventToContainerPoint(e);

			L.DomEvent.on(document, {
				contextmenu: L.DomEvent.stop,
				mousemove: this._onMouseMove,
				mouseup: this._onMouseUp,
				keydown: this._onKeyDown
			}, this);
		},

		_onMouseMove: function (e) {
			if (!this._moved) {
				this._moved = true;

				this._box = L.DomUtil.create('div', 'leaflet-zoom-box', this._container);
				L.DomUtil.addClass(this._container, 'leaflet-crosshair');

				this._map.fire('boxzoomstart');
			}

			this._point = this._map.mouseEventToContainerPoint(e);

			var bounds = new L.Bounds(this._point, this._startPoint),
			    size = bounds.getSize();

			L.DomUtil.setPosition(this._box, bounds.min);

			this._box.style.width  = size.x + 'px';
			this._box.style.height = size.y + 'px';
		},

		_finish: function () {
			if (this._moved) {
				L.DomUtil.remove(this._box);
				L.DomUtil.removeClass(this._container, 'leaflet-crosshair');
			}

			L.DomUtil.enableTextSelection();
			L.DomUtil.enableImageDrag();

			L.DomEvent.off(document, {
				contextmenu: L.DomEvent.stop,
				mousemove: this._onMouseMove,
				mouseup: this._onMouseUp,
				keydown: this._onKeyDown
			}, this);
		},

		_onMouseUp: function (e) {
			if ((e.which !== 1) && (e.button !== 1)) { return; }

			this._finish();

			if (!this._moved) { return; }
			// Postpone to next JS tick so internal click event handling
			// still see it as "moved".
			setTimeout(L.bind(this._resetState, this), 0);

			var bounds = new L.LatLngBounds(
			        this._map.containerPointToLatLng(this._startPoint),
			        this._map.containerPointToLatLng(this._point));

			this._map
				.fitBounds(bounds)
				.fire('boxzoomend', {boxZoomBounds: bounds});
		},

		_onKeyDown: function (e) {
			if (e.keyCode === 27) {
				this._finish();
			}
		}
	});

	// @section Handlers
	// @property boxZoom: Handler
	// Box (shift-drag with mouse) zoom handler.
	L.Map.addInitHook('addHandler', 'boxZoom', L.Map.BoxZoom);



	/*
	 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
	 */

	// @namespace Map
	// @section Keyboard Navigation Options
	L.Map.mergeOptions({
		// @option keyboard: Boolean = true
		// Makes the map focusable and allows users to navigate the map with keyboard
		// arrows and `+`/`-` keys.
		keyboard: true,

		// @option keyboardPanDelta: Number = 80
		// Amount of pixels to pan when pressing an arrow key.
		keyboardPanDelta: 80
	});

	L.Map.Keyboard = L.Handler.extend({

		keyCodes: {
			left:    [37],
			right:   [39],
			down:    [40],
			up:      [38],
			zoomIn:  [187, 107, 61, 171],
			zoomOut: [189, 109, 54, 173]
		},

		initialize: function (map) {
			this._map = map;

			this._setPanDelta(map.options.keyboardPanDelta);
			this._setZoomDelta(map.options.zoomDelta);
		},

		addHooks: function () {
			var container = this._map._container;

			// make the container focusable by tabbing
			if (container.tabIndex <= 0) {
				container.tabIndex = '0';
			}

			L.DomEvent.on(container, {
				focus: this._onFocus,
				blur: this._onBlur,
				mousedown: this._onMouseDown
			}, this);

			this._map.on({
				focus: this._addHooks,
				blur: this._removeHooks
			}, this);
		},

		removeHooks: function () {
			this._removeHooks();

			L.DomEvent.off(this._map._container, {
				focus: this._onFocus,
				blur: this._onBlur,
				mousedown: this._onMouseDown
			}, this);

			this._map.off({
				focus: this._addHooks,
				blur: this._removeHooks
			}, this);
		},

		_onMouseDown: function () {
			if (this._focused) { return; }

			var body = document.body,
			    docEl = document.documentElement,
			    top = body.scrollTop || docEl.scrollTop,
			    left = body.scrollLeft || docEl.scrollLeft;

			this._map._container.focus();

			window.scrollTo(left, top);
		},

		_onFocus: function () {
			this._focused = true;
			this._map.fire('focus');
		},

		_onBlur: function () {
			this._focused = false;
			this._map.fire('blur');
		},

		_setPanDelta: function (panDelta) {
			var keys = this._panKeys = {},
			    codes = this.keyCodes,
			    i, len;

			for (i = 0, len = codes.left.length; i < len; i++) {
				keys[codes.left[i]] = [-1 * panDelta, 0];
			}
			for (i = 0, len = codes.right.length; i < len; i++) {
				keys[codes.right[i]] = [panDelta, 0];
			}
			for (i = 0, len = codes.down.length; i < len; i++) {
				keys[codes.down[i]] = [0, panDelta];
			}
			for (i = 0, len = codes.up.length; i < len; i++) {
				keys[codes.up[i]] = [0, -1 * panDelta];
			}
		},

		_setZoomDelta: function (zoomDelta) {
			var keys = this._zoomKeys = {},
			    codes = this.keyCodes,
			    i, len;

			for (i = 0, len = codes.zoomIn.length; i < len; i++) {
				keys[codes.zoomIn[i]] = zoomDelta;
			}
			for (i = 0, len = codes.zoomOut.length; i < len; i++) {
				keys[codes.zoomOut[i]] = -zoomDelta;
			}
		},

		_addHooks: function () {
			L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
		},

		_removeHooks: function () {
			L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
		},

		_onKeyDown: function (e) {
			if (e.altKey || e.ctrlKey || e.metaKey) { return; }

			var key = e.keyCode,
			    map = this._map,
			    offset;

			if (key in this._panKeys) {

				if (map._panAnim && map._panAnim._inProgress) { return; }

				offset = this._panKeys[key];
				if (e.shiftKey) {
					offset = L.point(offset).multiplyBy(3);
				}

				map.panBy(offset);

				if (map.options.maxBounds) {
					map.panInsideBounds(map.options.maxBounds);
				}

			} else if (key in this._zoomKeys) {
				map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

			} else if (key === 27) {
				map.closePopup();

			} else {
				return;
			}

			L.DomEvent.stop(e);
		}
	});

	// @section Handlers
	// @section Handlers
	// @property keyboard: Handler
	// Keyboard navigation handler.
	L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);



	/*
	 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
	 */


	/* @namespace Marker
	 * @section Interaction handlers
	 *
	 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
	 *
	 * ```js
	 * marker.dragging.disable();
	 * ```
	 *
	 * @property dragging: Handler
	 * Marker dragging handler (by both mouse and touch).
	 */

	L.Handler.MarkerDrag = L.Handler.extend({
		initialize: function (marker) {
			this._marker = marker;
		},

		addHooks: function () {
			var icon = this._marker._icon;

			if (!this._draggable) {
				this._draggable = new L.Draggable(icon, icon, true);
			}

			this._draggable.on({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this).enable();

			L.DomUtil.addClass(icon, 'leaflet-marker-draggable');
		},

		removeHooks: function () {
			this._draggable.off({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this).disable();

			if (this._marker._icon) {
				L.DomUtil.removeClass(this._marker._icon, 'leaflet-marker-draggable');
			}
		},

		moved: function () {
			return this._draggable && this._draggable._moved;
		},

		_onDragStart: function () {
			// @section Dragging events
			// @event dragstart: Event
			// Fired when the user starts dragging the marker.

			// @event movestart: Event
			// Fired when the marker starts moving (because of dragging).

			this._oldLatLng = this._marker.getLatLng();
			this._marker
			    .closePopup()
			    .fire('movestart')
			    .fire('dragstart');
		},

		_onDrag: function (e) {
			var marker = this._marker,
			    shadow = marker._shadow,
			    iconPos = L.DomUtil.getPosition(marker._icon),
			    latlng = marker._map.layerPointToLatLng(iconPos);

			// update shadow position
			if (shadow) {
				L.DomUtil.setPosition(shadow, iconPos);
			}

			marker._latlng = latlng;
			e.latlng = latlng;
			e.oldLatLng = this._oldLatLng;

			// @event drag: Event
			// Fired repeatedly while the user drags the marker.
			marker
			    .fire('move', e)
			    .fire('drag', e);
		},

		_onDragEnd: function (e) {
			// @event dragend: DragEndEvent
			// Fired when the user stops dragging the marker.

			// @event moveend: Event
			// Fired when the marker stops moving (because of dragging).
			delete this._oldLatLng;
			this._marker
			    .fire('moveend')
			    .fire('dragend', e);
		}
	});



	/*
	 * @class Control
	 * @aka L.Control
	 *
	 * L.Control is a base class for implementing map controls. Handles positioning.
	 * All other controls extend from this class.
	 */

	L.Control = L.Class.extend({
		// @section
		// @aka Control options
		options: {
			// @option position: String = 'topright'
			// The position of the control (one of the map corners). Possible values are `'topleft'`,
			// `'topright'`, `'bottomleft'` or `'bottomright'`
			position: 'topright'
		},

		initialize: function (options) {
			L.setOptions(this, options);
		},

		/* @section
		 * Classes extending L.Control will inherit the following methods:
		 *
		 * @method getPosition: string
		 * Returns the position of the control.
		 */
		getPosition: function () {
			return this.options.position;
		},

		// @method setPosition(position: string): this
		// Sets the position of the control.
		setPosition: function (position) {
			var map = this._map;

			if (map) {
				map.removeControl(this);
			}

			this.options.position = position;

			if (map) {
				map.addControl(this);
			}

			return this;
		},

		// @method getContainer: HTMLElement
		// Returns the HTMLElement that contains the control.
		getContainer: function () {
			return this._container;
		},

		// @method addTo(map: Map): this
		// Adds the control to the given map.
		addTo: function (map) {
			this.remove();
			this._map = map;

			var container = this._container = this.onAdd(map),
			    pos = this.getPosition(),
			    corner = map._controlCorners[pos];

			L.DomUtil.addClass(container, 'leaflet-control');

			if (pos.indexOf('bottom') !== -1) {
				corner.insertBefore(container, corner.firstChild);
			} else {
				corner.appendChild(container);
			}

			return this;
		},

		// @method remove: this
		// Removes the control from the map it is currently active on.
		remove: function () {
			if (!this._map) {
				return this;
			}

			L.DomUtil.remove(this._container);

			if (this.onRemove) {
				this.onRemove(this._map);
			}

			this._map = null;

			return this;
		},

		_refocusOnMap: function (e) {
			// if map exists and event is not a keyboard event
			if (this._map && e && e.screenX > 0 && e.screenY > 0) {
				this._map.getContainer().focus();
			}
		}
	});

	L.control = function (options) {
		return new L.Control(options);
	};

	/* @section Extension methods
	 * @uninheritable
	 *
	 * Every control should extend from `L.Control` and (re-)implement the following methods.
	 *
	 * @method onAdd(map: Map): HTMLElement
	 * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
	 *
	 * @method onRemove(map: Map)
	 * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
	 */

	/* @namespace Map
	 * @section Methods for Layers and Controls
	 */
	L.Map.include({
		// @method addControl(control: Control): this
		// Adds the given control to the map
		addControl: function (control) {
			control.addTo(this);
			return this;
		},

		// @method removeControl(control: Control): this
		// Removes the given control from the map
		removeControl: function (control) {
			control.remove();
			return this;
		},

		_initControlPos: function () {
			var corners = this._controlCorners = {},
			    l = 'leaflet-',
			    container = this._controlContainer =
			            L.DomUtil.create('div', l + 'control-container', this._container);

			function createCorner(vSide, hSide) {
				var className = l + vSide + ' ' + l + hSide;

				corners[vSide + hSide] = L.DomUtil.create('div', className, container);
			}

			createCorner('top', 'left');
			createCorner('top', 'right');
			createCorner('bottom', 'left');
			createCorner('bottom', 'right');
		},

		_clearControlPos: function () {
			L.DomUtil.remove(this._controlContainer);
		}
	});



	/*
	 * @class Control.Zoom
	 * @aka L.Control.Zoom
	 * @inherits Control
	 *
	 * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
	 */

	L.Control.Zoom = L.Control.extend({
		// @section
		// @aka Control.Zoom options
		options: {
			position: 'topleft',

			// @option zoomInText: String = '+'
			// The text set on the 'zoom in' button.
			zoomInText: '+',

			// @option zoomInTitle: String = 'Zoom in'
			// The title set on the 'zoom in' button.
			zoomInTitle: 'Zoom in',

			// @option zoomOutText: String = '-'
			// The text set on the 'zoom out' button.
			zoomOutText: '-',

			// @option zoomOutTitle: String = 'Zoom out'
			// The title set on the 'zoom out' button.
			zoomOutTitle: 'Zoom out'
		},

		onAdd: function (map) {
			var zoomName = 'leaflet-control-zoom',
			    container = L.DomUtil.create('div', zoomName + ' leaflet-bar'),
			    options = this.options;

			this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
			        zoomName + '-in',  container, this._zoomIn);
			this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
			        zoomName + '-out', container, this._zoomOut);

			this._updateDisabled();
			map.on('zoomend zoomlevelschange', this._updateDisabled, this);

			return container;
		},

		onRemove: function (map) {
			map.off('zoomend zoomlevelschange', this._updateDisabled, this);
		},

		disable: function () {
			this._disabled = true;
			this._updateDisabled();
			return this;
		},

		enable: function () {
			this._disabled = false;
			this._updateDisabled();
			return this;
		},

		_zoomIn: function (e) {
			if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
				this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
			}
		},

		_zoomOut: function (e) {
			if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
				this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
			}
		},

		_createButton: function (html, title, className, container, fn) {
			var link = L.DomUtil.create('a', className, container);
			link.innerHTML = html;
			link.href = '#';
			link.title = title;

			L.DomEvent
			    .on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
			    .on(link, 'click', L.DomEvent.stop)
			    .on(link, 'click', fn, this)
			    .on(link, 'click', this._refocusOnMap, this);

			return link;
		},

		_updateDisabled: function () {
			var map = this._map,
			    className = 'leaflet-disabled';

			L.DomUtil.removeClass(this._zoomInButton, className);
			L.DomUtil.removeClass(this._zoomOutButton, className);

			if (this._disabled || map._zoom === map.getMinZoom()) {
				L.DomUtil.addClass(this._zoomOutButton, className);
			}
			if (this._disabled || map._zoom === map.getMaxZoom()) {
				L.DomUtil.addClass(this._zoomInButton, className);
			}
		}
	});

	// @namespace Map
	// @section Control options
	// @option zoomControl: Boolean = true
	// Whether a [zoom control](#control-zoom) is added to the map by default.
	L.Map.mergeOptions({
		zoomControl: true
	});

	L.Map.addInitHook(function () {
		if (this.options.zoomControl) {
			this.zoomControl = new L.Control.Zoom();
			this.addControl(this.zoomControl);
		}
	});

	// @namespace Control.Zoom
	// @factory L.control.zoom(options: Control.Zoom options)
	// Creates a zoom control
	L.control.zoom = function (options) {
		return new L.Control.Zoom(options);
	};



	/*
	 * @class Control.Attribution
	 * @aka L.Control.Attribution
	 * @inherits Control
	 *
	 * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
	 */

	L.Control.Attribution = L.Control.extend({
		// @section
		// @aka Control.Attribution options
		options: {
			position: 'bottomright',

			// @option prefix: String = 'Leaflet'
			// The HTML text shown before the attributions. Pass `false` to disable.
			prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
		},

		initialize: function (options) {
			L.setOptions(this, options);

			this._attributions = {};
		},

		onAdd: function (map) {
			map.attributionControl = this;
			this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
			if (L.DomEvent) {
				L.DomEvent.disableClickPropagation(this._container);
			}

			// TODO ugly, refactor
			for (var i in map._layers) {
				if (map._layers[i].getAttribution) {
					this.addAttribution(map._layers[i].getAttribution());
				}
			}

			this._update();

			return this._container;
		},

		// @method setPrefix(prefix: String): this
		// Sets the text before the attributions.
		setPrefix: function (prefix) {
			this.options.prefix = prefix;
			this._update();
			return this;
		},

		// @method addAttribution(text: String): this
		// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
		addAttribution: function (text) {
			if (!text) { return this; }

			if (!this._attributions[text]) {
				this._attributions[text] = 0;
			}
			this._attributions[text]++;

			this._update();

			return this;
		},

		// @method removeAttribution(text: String): this
		// Removes an attribution text.
		removeAttribution: function (text) {
			if (!text) { return this; }

			if (this._attributions[text]) {
				this._attributions[text]--;
				this._update();
			}

			return this;
		},

		_update: function () {
			if (!this._map) { return; }

			var attribs = [];

			for (var i in this._attributions) {
				if (this._attributions[i]) {
					attribs.push(i);
				}
			}

			var prefixAndAttribs = [];

			if (this.options.prefix) {
				prefixAndAttribs.push(this.options.prefix);
			}
			if (attribs.length) {
				prefixAndAttribs.push(attribs.join(', '));
			}

			this._container.innerHTML = prefixAndAttribs.join(' | ');
		}
	});

	// @namespace Map
	// @section Control options
	// @option attributionControl: Boolean = true
	// Whether a [attribution control](#control-attribution) is added to the map by default.
	L.Map.mergeOptions({
		attributionControl: true
	});

	L.Map.addInitHook(function () {
		if (this.options.attributionControl) {
			new L.Control.Attribution().addTo(this);
		}
	});

	// @namespace Control.Attribution
	// @factory L.control.attribution(options: Control.Attribution options)
	// Creates an attribution control.
	L.control.attribution = function (options) {
		return new L.Control.Attribution(options);
	};



	/*
	 * @class Control.Scale
	 * @aka L.Control.Scale
	 * @inherits Control
	 *
	 * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
	 *
	 * @example
	 *
	 * ```js
	 * L.control.scale().addTo(map);
	 * ```
	 */

	L.Control.Scale = L.Control.extend({
		// @section
		// @aka Control.Scale options
		options: {
			position: 'bottomleft',

			// @option maxWidth: Number = 100
			// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
			maxWidth: 100,

			// @option metric: Boolean = True
			// Whether to show the metric scale line (m/km).
			metric: true,

			// @option imperial: Boolean = True
			// Whether to show the imperial scale line (mi/ft).
			imperial: true

			// @option updateWhenIdle: Boolean = false
			// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
		},

		onAdd: function (map) {
			var className = 'leaflet-control-scale',
			    container = L.DomUtil.create('div', className),
			    options = this.options;

			this._addScales(options, className + '-line', container);

			map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
			map.whenReady(this._update, this);

			return container;
		},

		onRemove: function (map) {
			map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		},

		_addScales: function (options, className, container) {
			if (options.metric) {
				this._mScale = L.DomUtil.create('div', className, container);
			}
			if (options.imperial) {
				this._iScale = L.DomUtil.create('div', className, container);
			}
		},

		_update: function () {
			var map = this._map,
			    y = map.getSize().y / 2;

			var maxMeters = map.distance(
					map.containerPointToLatLng([0, y]),
					map.containerPointToLatLng([this.options.maxWidth, y]));

			this._updateScales(maxMeters);
		},

		_updateScales: function (maxMeters) {
			if (this.options.metric && maxMeters) {
				this._updateMetric(maxMeters);
			}
			if (this.options.imperial && maxMeters) {
				this._updateImperial(maxMeters);
			}
		},

		_updateMetric: function (maxMeters) {
			var meters = this._getRoundNum(maxMeters),
			    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

			this._updateScale(this._mScale, label, meters / maxMeters);
		},

		_updateImperial: function (maxMeters) {
			var maxFeet = maxMeters * 3.2808399,
			    maxMiles, miles, feet;

			if (maxFeet > 5280) {
				maxMiles = maxFeet / 5280;
				miles = this._getRoundNum(maxMiles);
				this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

			} else {
				feet = this._getRoundNum(maxFeet);
				this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
			}
		},

		_updateScale: function (scale, text, ratio) {
			scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
			scale.innerHTML = text;
		},

		_getRoundNum: function (num) {
			var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
			    d = num / pow10;

			d = d >= 10 ? 10 :
			    d >= 5 ? 5 :
			    d >= 3 ? 3 :
			    d >= 2 ? 2 : 1;

			return pow10 * d;
		}
	});


	// @factory L.control.scale(options?: Control.Scale options)
	// Creates an scale control with the given options.
	L.control.scale = function (options) {
		return new L.Control.Scale(options);
	};



	/*
	 * @class Control.Layers
	 * @aka L.Control.Layers
	 * @inherits Control
	 *
	 * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control.html)). Extends `Control`.
	 *
	 * @example
	 *
	 * ```js
	 * var baseLayers = {
	 * 	"Mapbox": mapbox,
	 * 	"OpenStreetMap": osm
	 * };
	 *
	 * var overlays = {
	 * 	"Marker": marker,
	 * 	"Roads": roadsLayer
	 * };
	 *
	 * L.control.layers(baseLayers, overlays).addTo(map);
	 * ```
	 *
	 * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
	 *
	 * ```js
	 * {
	 *     "<someName1>": layer1,
	 *     "<someName2>": layer2
	 * }
	 * ```
	 *
	 * The layer names can contain HTML, which allows you to add additional styling to the items:
	 *
	 * ```js
	 * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
	 * ```
	 */


	L.Control.Layers = L.Control.extend({
		// @section
		// @aka Control.Layers options
		options: {
			// @option collapsed: Boolean = true
			// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
			collapsed: true,
			position: 'topright',

			// @option autoZIndex: Boolean = true
			// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
			autoZIndex: true,

			// @option hideSingleBase: Boolean = false
			// If `true`, the base layers in the control will be hidden when there is only one.
			hideSingleBase: false
		},

		initialize: function (baseLayers, overlays, options) {
			L.setOptions(this, options);

			this._layers = [];
			this._lastZIndex = 0;
			this._handlingClick = false;

			for (var i in baseLayers) {
				this._addLayer(baseLayers[i], i);
			}

			for (i in overlays) {
				this._addLayer(overlays[i], i, true);
			}
		},

		onAdd: function (map) {
			this._initLayout();
			this._update();

			this._map = map;
			map.on('zoomend', this._checkDisabledLayers, this);

			return this._container;
		},

		onRemove: function () {
			this._map.off('zoomend', this._checkDisabledLayers, this);

			for (var i = 0; i < this._layers.length; i++) {
				this._layers[i].layer.off('add remove', this._onLayerChange, this);
			}
		},

		// @method addBaseLayer(layer: Layer, name: String): this
		// Adds a base layer (radio button entry) with the given name to the control.
		addBaseLayer: function (layer, name) {
			this._addLayer(layer, name);
			return (this._map) ? this._update() : this;
		},

		// @method addOverlay(layer: Layer, name: String): this
		// Adds an overlay (checkbox entry) with the given name to the control.
		addOverlay: function (layer, name) {
			this._addLayer(layer, name, true);
			return (this._map) ? this._update() : this;
		},

		// @method removeLayer(layer: Layer): this
		// Remove the given layer from the control.
		removeLayer: function (layer) {
			layer.off('add remove', this._onLayerChange, this);

			var obj = this._getLayer(L.stamp(layer));
			if (obj) {
				this._layers.splice(this._layers.indexOf(obj), 1);
			}
			return (this._map) ? this._update() : this;
		},

		// @method expand(): this
		// Expand the control container if collapsed.
		expand: function () {
			L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
			this._form.style.height = null;
			var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
			if (acceptableHeight < this._form.clientHeight) {
				L.DomUtil.addClass(this._form, 'leaflet-control-layers-scrollbar');
				this._form.style.height = acceptableHeight + 'px';
			} else {
				L.DomUtil.removeClass(this._form, 'leaflet-control-layers-scrollbar');
			}
			this._checkDisabledLayers();
			return this;
		},

		// @method collapse(): this
		// Collapse the control container if expanded.
		collapse: function () {
			L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
			return this;
		},

		_initLayout: function () {
			var className = 'leaflet-control-layers',
			    container = this._container = L.DomUtil.create('div', className);

			// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
			container.setAttribute('aria-haspopup', true);

			L.DomEvent.disableClickPropagation(container);
			if (!L.Browser.touch) {
				L.DomEvent.disableScrollPropagation(container);
			}

			var form = this._form = L.DomUtil.create('form', className + '-list');

			if (this.options.collapsed) {
				if (!L.Browser.android) {
					L.DomEvent.on(container, {
						mouseenter: this.expand,
						mouseleave: this.collapse
					}, this);
				}

				var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
				link.href = '#';
				link.title = 'Layers';

				if (L.Browser.touch) {
					L.DomEvent
					    .on(link, 'click', L.DomEvent.stop)
					    .on(link, 'click', this.expand, this);
				} else {
					L.DomEvent.on(link, 'focus', this.expand, this);
				}

				// work around for Firefox Android issue https://github.com/Leaflet/Leaflet/issues/2033
				L.DomEvent.on(form, 'click', function () {
					setTimeout(L.bind(this._onInputClick, this), 0);
				}, this);

				this._map.on('click', this.collapse, this);
				// TODO keyboard accessibility
			} else {
				this.expand();
			}

			this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
			this._separator = L.DomUtil.create('div', className + '-separator', form);
			this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

			container.appendChild(form);
		},

		_getLayer: function (id) {
			for (var i = 0; i < this._layers.length; i++) {

				if (this._layers[i] && L.stamp(this._layers[i].layer) === id) {
					return this._layers[i];
				}
			}
		},

		_addLayer: function (layer, name, overlay) {
			layer.on('add remove', this._onLayerChange, this);

			this._layers.push({
				layer: layer,
				name: name,
				overlay: overlay
			});

			if (this.options.autoZIndex && layer.setZIndex) {
				this._lastZIndex++;
				layer.setZIndex(this._lastZIndex);
			}
		},

		_update: function () {
			if (!this._container) { return this; }

			L.DomUtil.empty(this._baseLayersList);
			L.DomUtil.empty(this._overlaysList);

			var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

			for (i = 0; i < this._layers.length; i++) {
				obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
				baseLayersCount += !obj.overlay ? 1 : 0;
			}

			// Hide base layers section if there's only one layer.
			if (this.options.hideSingleBase) {
				baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
				this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
			}

			this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

			return this;
		},

		_onLayerChange: function (e) {
			if (!this._handlingClick) {
				this._update();
			}

			var obj = this._getLayer(L.stamp(e.target));

			// @namespace Map
			// @section Layer events
			// @event baselayerchange: LayersControlEvent
			// Fired when the base layer is changed through the [layer control](#control-layers).
			// @event overlayadd: LayersControlEvent
			// Fired when an overlay is selected through the [layer control](#control-layers).
			// @event overlayremove: LayersControlEvent
			// Fired when an overlay is deselected through the [layer control](#control-layers).
			// @namespace Control.Layers
			var type = obj.overlay ?
				(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
				(e.type === 'add' ? 'baselayerchange' : null);

			if (type) {
				this._map.fire(type, obj);
			}
		},

		// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
		_createRadioElement: function (name, checked) {

			var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
					name + '"' + (checked ? ' checked="checked"' : '') + '/>';

			var radioFragment = document.createElement('div');
			radioFragment.innerHTML = radioHtml;

			return radioFragment.firstChild;
		},

		_addItem: function (obj) {
			var label = document.createElement('label'),
			    checked = this._map.hasLayer(obj.layer),
			    input;

			if (obj.overlay) {
				input = document.createElement('input');
				input.type = 'checkbox';
				input.className = 'leaflet-control-layers-selector';
				input.defaultChecked = checked;
			} else {
				input = this._createRadioElement('leaflet-base-layers', checked);
			}

			input.layerId = L.stamp(obj.layer);

			L.DomEvent.on(input, 'click', this._onInputClick, this);

			var name = document.createElement('span');
			name.innerHTML = ' ' + obj.name;

			// Helps from preventing layer control flicker when checkboxes are disabled
			// https://github.com/Leaflet/Leaflet/issues/2771
			var holder = document.createElement('div');

			label.appendChild(holder);
			holder.appendChild(input);
			holder.appendChild(name);

			var container = obj.overlay ? this._overlaysList : this._baseLayersList;
			container.appendChild(label);

			this._checkDisabledLayers();
			return label;
		},

		_onInputClick: function () {
			var inputs = this._form.getElementsByTagName('input'),
			    input, layer, hasLayer;
			var addedLayers = [],
			    removedLayers = [];

			this._handlingClick = true;

			for (var i = inputs.length - 1; i >= 0; i--) {
				input = inputs[i];
				layer = this._getLayer(input.layerId).layer;
				hasLayer = this._map.hasLayer(layer);

				if (input.checked && !hasLayer) {
					addedLayers.push(layer);

				} else if (!input.checked && hasLayer) {
					removedLayers.push(layer);
				}
			}

			// Bugfix issue 2318: Should remove all old layers before readding new ones
			for (i = 0; i < removedLayers.length; i++) {
				this._map.removeLayer(removedLayers[i]);
			}
			for (i = 0; i < addedLayers.length; i++) {
				this._map.addLayer(addedLayers[i]);
			}

			this._handlingClick = false;

			this._refocusOnMap();
		},

		_checkDisabledLayers: function () {
			var inputs = this._form.getElementsByTagName('input'),
			    input,
			    layer,
			    zoom = this._map.getZoom();

			for (var i = inputs.length - 1; i >= 0; i--) {
				input = inputs[i];
				layer = this._getLayer(input.layerId).layer;
				input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
				                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

			}
		},

		_expand: function () {
			// Backward compatibility, remove me in 1.1.
			return this.expand();
		},

		_collapse: function () {
			// Backward compatibility, remove me in 1.1.
			return this.collapse();
		}

	});


	// @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
	// Creates an attribution control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
	L.control.layers = function (baseLayers, overlays, options) {
		return new L.Control.Layers(baseLayers, overlays, options);
	};



	/*
	 * @class PosAnimation
	 * @aka L.PosAnimation
	 * @inherits Evented
	 * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
	 *
	 * @example
	 * ```js
	 * var fx = new L.PosAnimation();
	 * fx.run(el, [300, 500], 0.5);
	 * ```
	 *
	 * @constructor L.PosAnimation()
	 * Creates a `PosAnimation` object.
	 *
	 */

	L.PosAnimation = L.Evented.extend({

		// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
		// Run an animation of a given element to a new position, optionally setting
		// duration in seconds (`0.25` by default) and easing linearity factor (3rd
		// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
		// `0.5` by default).
		run: function (el, newPos, duration, easeLinearity) {
			this.stop();

			this._el = el;
			this._inProgress = true;
			this._duration = duration || 0.25;
			this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

			this._startPos = L.DomUtil.getPosition(el);
			this._offset = newPos.subtract(this._startPos);
			this._startTime = +new Date();

			// @event start: Event
			// Fired when the animation starts
			this.fire('start');

			this._animate();
		},

		// @method stop()
		// Stops the animation (if currently running).
		stop: function () {
			if (!this._inProgress) { return; }

			this._step(true);
			this._complete();
		},

		_animate: function () {
			// animation loop
			this._animId = L.Util.requestAnimFrame(this._animate, this);
			this._step();
		},

		_step: function (round) {
			var elapsed = (+new Date()) - this._startTime,
			    duration = this._duration * 1000;

			if (elapsed < duration) {
				this._runFrame(this._easeOut(elapsed / duration), round);
			} else {
				this._runFrame(1);
				this._complete();
			}
		},

		_runFrame: function (progress, round) {
			var pos = this._startPos.add(this._offset.multiplyBy(progress));
			if (round) {
				pos._round();
			}
			L.DomUtil.setPosition(this._el, pos);

			// @event step: Event
			// Fired continuously during the animation.
			this.fire('step');
		},

		_complete: function () {
			L.Util.cancelAnimFrame(this._animId);

			this._inProgress = false;
			// @event end: Event
			// Fired when the animation ends.
			this.fire('end');
		},

		_easeOut: function (t) {
			return 1 - Math.pow(1 - t, this._easeOutPower);
		}
	});



	/*
	 * Extends L.Map to handle panning animations.
	 */

	L.Map.include({

		setView: function (center, zoom, options) {

			zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
			center = this._limitCenter(L.latLng(center), zoom, this.options.maxBounds);
			options = options || {};

			this._stop();

			if (this._loaded && !options.reset && options !== true) {

				if (options.animate !== undefined) {
					options.zoom = L.extend({animate: options.animate}, options.zoom);
					options.pan = L.extend({animate: options.animate, duration: options.duration}, options.pan);
				}

				// try animating pan or zoom
				var moved = (this._zoom !== zoom) ?
					this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
					this._tryAnimatedPan(center, options.pan);

				if (moved) {
					// prevent resize handler call, the view will refresh after animation anyway
					clearTimeout(this._sizeTimer);
					return this;
				}
			}

			// animation didn't start, just reset the map view
			this._resetView(center, zoom);

			return this;
		},

		panBy: function (offset, options) {
			offset = L.point(offset).round();
			options = options || {};

			if (!offset.x && !offset.y) {
				return this.fire('moveend');
			}
			// If we pan too far, Chrome gets issues with tiles
			// and makes them disappear or appear in the wrong place (slightly offset) #2602
			if (options.animate !== true && !this.getSize().contains(offset)) {
				this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
				return this;
			}

			if (!this._panAnim) {
				this._panAnim = new L.PosAnimation();

				this._panAnim.on({
					'step': this._onPanTransitionStep,
					'end': this._onPanTransitionEnd
				}, this);
			}

			// don't fire movestart if animating inertia
			if (!options.noMoveStart) {
				this.fire('movestart');
			}

			// animate pan unless animate: false specified
			if (options.animate !== false) {
				L.DomUtil.addClass(this._mapPane, 'leaflet-pan-anim');

				var newPos = this._getMapPanePos().subtract(offset).round();
				this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
			} else {
				this._rawPanBy(offset);
				this.fire('move').fire('moveend');
			}

			return this;
		},

		_onPanTransitionStep: function () {
			this.fire('move');
		},

		_onPanTransitionEnd: function () {
			L.DomUtil.removeClass(this._mapPane, 'leaflet-pan-anim');
			this.fire('moveend');
		},

		_tryAnimatedPan: function (center, options) {
			// difference between the new and current centers in pixels
			var offset = this._getCenterOffset(center)._floor();

			// don't animate too far unless animate: true specified in options
			if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

			this.panBy(offset, options);

			return true;
		}
	});



	/*
	 * Extends L.Map to handle zoom animations.
	 */

	// @namespace Map
	// @section Animation Options
	L.Map.mergeOptions({
		// @option zoomAnimation: Boolean = true
		// Whether the map zoom animation is enabled. By default it's enabled
		// in all browsers that support CSS3 Transitions except Android.
		zoomAnimation: true,

		// @option zoomAnimationThreshold: Number = 4
		// Won't animate zoom if the zoom difference exceeds this value.
		zoomAnimationThreshold: 4
	});

	var zoomAnimated = L.DomUtil.TRANSITION && L.Browser.any3d && !L.Browser.mobileOpera;

	if (zoomAnimated) {

		L.Map.addInitHook(function () {
			// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
			this._zoomAnimated = this.options.zoomAnimation;

			// zoom transitions run with the same duration for all layers, so if one of transitionend events
			// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
			if (this._zoomAnimated) {

				this._createAnimProxy();

				L.DomEvent.on(this._proxy, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
			}
		});
	}

	L.Map.include(!zoomAnimated ? {} : {

		_createAnimProxy: function () {

			var proxy = this._proxy = L.DomUtil.create('div', 'leaflet-proxy leaflet-zoom-animated');
			this._panes.mapPane.appendChild(proxy);

			this.on('zoomanim', function (e) {
				var prop = L.DomUtil.TRANSFORM,
				    transform = proxy.style[prop];

				L.DomUtil.setTransform(proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

				// workaround for case when transform is the same and so transitionend event is not fired
				if (transform === proxy.style[prop] && this._animatingZoom) {
					this._onZoomTransitionEnd();
				}
			}, this);

			this.on('load moveend', function () {
				var c = this.getCenter(),
				    z = this.getZoom();
				L.DomUtil.setTransform(proxy, this.project(c, z), this.getZoomScale(z, 1));
			}, this);
		},

		_catchTransitionEnd: function (e) {
			if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
				this._onZoomTransitionEnd();
			}
		},

		_nothingToAnimate: function () {
			return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
		},

		_tryAnimatedZoom: function (center, zoom, options) {

			if (this._animatingZoom) { return true; }

			options = options || {};

			// don't animate if disabled, not supported or zoom difference is too large
			if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
			        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

			// offset is the pixel coords of the zoom origin relative to the current center
			var scale = this.getZoomScale(zoom),
			    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

			// don't animate if the zoom origin isn't within one screen from the current center, unless forced
			if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

			L.Util.requestAnimFrame(function () {
				this
				    ._moveStart(true)
				    ._animateZoom(center, zoom, true);
			}, this);

			return true;
		},

		_animateZoom: function (center, zoom, startAnim, noUpdate) {
			if (startAnim) {
				this._animatingZoom = true;

				// remember what center/zoom to set after animation
				this._animateToCenter = center;
				this._animateToZoom = zoom;

				L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');
			}

			// @event zoomanim: ZoomAnimEvent
			// Fired on every frame of a zoom animation
			this.fire('zoomanim', {
				center: center,
				zoom: zoom,
				noUpdate: noUpdate
			});

			// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
			setTimeout(L.bind(this._onZoomTransitionEnd, this), 250);
		},

		_onZoomTransitionEnd: function () {
			if (!this._animatingZoom) { return; }

			L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');

			this._animatingZoom = false;

			this._move(this._animateToCenter, this._animateToZoom);

			// This anim frame should prevent an obscure iOS webkit tile loading race condition.
			L.Util.requestAnimFrame(function () {
				this._moveEnd(true);
			}, this);
		}
	});



	// @namespace Map
	// @section Methods for modifying map state
	L.Map.include({

		// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
		// Sets the view of the map (geographical center and zoom) performing a smooth
		// pan-zoom animation.
		flyTo: function (targetCenter, targetZoom, options) {

			options = options || {};
			if (options.animate === false || !L.Browser.any3d) {
				return this.setView(targetCenter, targetZoom, options);
			}

			this._stop();

			var from = this.project(this.getCenter()),
			    to = this.project(targetCenter),
			    size = this.getSize(),
			    startZoom = this._zoom;

			targetCenter = L.latLng(targetCenter);
			targetZoom = targetZoom === undefined ? startZoom : targetZoom;

			var w0 = Math.max(size.x, size.y),
			    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
			    u1 = (to.distanceTo(from)) || 1,
			    rho = 1.42,
			    rho2 = rho * rho;

			function r(i) {
				var s1 = i ? -1 : 1,
				    s2 = i ? w1 : w0,
				    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
				    b1 = 2 * s2 * rho2 * u1,
				    b = t1 / b1,
				    sq = Math.sqrt(b * b + 1) - b;

				    // workaround for floating point precision bug when sq = 0, log = -Infinite,
				    // thus triggering an infinite loop in flyTo
				    var log = sq < 0.000000001 ? -18 : Math.log(sq);

				return log;
			}

			function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
			function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
			function tanh(n) { return sinh(n) / cosh(n); }

			var r0 = r(0);

			function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
			function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

			function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

			var start = Date.now(),
			    S = (r(1) - r0) / rho,
			    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

			function frame() {
				var t = (Date.now() - start) / duration,
				    s = easeOut(t) * S;

				if (t <= 1) {
					this._flyToFrame = L.Util.requestAnimFrame(frame, this);

					this._move(
						this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
						this.getScaleZoom(w0 / w(s), startZoom),
						{flyTo: true});

				} else {
					this
						._move(targetCenter, targetZoom)
						._moveEnd(true);
				}
			}

			this._moveStart(true);

			frame.call(this);
			return this;
		},

		// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
		// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
		// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
		flyToBounds: function (bounds, options) {
			var target = this._getBoundsCenterZoom(bounds, options);
			return this.flyTo(target.center, target.zoom, options);
		}
	});



	/*
	 * Provides L.Map with convenient shortcuts for using browser geolocation features.
	 */

	// @namespace Map

	L.Map.include({
		// @section Geolocation methods
		_defaultLocateOptions: {
			timeout: 10000,
			watch: false
			// setView: false
			// maxZoom: <Number>
			// maximumAge: 0
			// enableHighAccuracy: false
		},

		// @method locate(options?: Locate options): this
		// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
		// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
		// and optionally sets the map view to the user's location with respect to
		// detection accuracy (or to the world view if geolocation failed).
		// Note that, if your page doesn't use HTTPS, this method will fail in
		// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
		// See `Locate options` for more details.
		locate: function (options) {

			options = this._locateOptions = L.extend({}, this._defaultLocateOptions, options);

			if (!('geolocation' in navigator)) {
				this._handleGeolocationError({
					code: 0,
					message: 'Geolocation not supported.'
				});
				return this;
			}

			var onResponse = L.bind(this._handleGeolocationResponse, this),
			    onError = L.bind(this._handleGeolocationError, this);

			if (options.watch) {
				this._locationWatchId =
				        navigator.geolocation.watchPosition(onResponse, onError, options);
			} else {
				navigator.geolocation.getCurrentPosition(onResponse, onError, options);
			}
			return this;
		},

		// @method stopLocate(): this
		// Stops watching location previously initiated by `map.locate({watch: true})`
		// and aborts resetting the map view if map.locate was called with
		// `{setView: true}`.
		stopLocate: function () {
			if (navigator.geolocation && navigator.geolocation.clearWatch) {
				navigator.geolocation.clearWatch(this._locationWatchId);
			}
			if (this._locateOptions) {
				this._locateOptions.setView = false;
			}
			return this;
		},

		_handleGeolocationError: function (error) {
			var c = error.code,
			    message = error.message ||
			            (c === 1 ? 'permission denied' :
			            (c === 2 ? 'position unavailable' : 'timeout'));

			if (this._locateOptions.setView && !this._loaded) {
				this.fitWorld();
			}

			// @section Location events
			// @event locationerror: ErrorEvent
			// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
			this.fire('locationerror', {
				code: c,
				message: 'Geolocation error: ' + message + '.'
			});
		},

		_handleGeolocationResponse: function (pos) {
			var lat = pos.coords.latitude,
			    lng = pos.coords.longitude,
			    latlng = new L.LatLng(lat, lng),
			    bounds = latlng.toBounds(pos.coords.accuracy),
			    options = this._locateOptions;

			if (options.setView) {
				var zoom = this.getBoundsZoom(bounds);
				this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
			}

			var data = {
				latlng: latlng,
				bounds: bounds,
				timestamp: pos.timestamp
			};

			for (var i in pos.coords) {
				if (typeof pos.coords[i] === 'number') {
					data[i] = pos.coords[i];
				}
			}

			// @event locationfound: LocationEvent
			// Fired when geolocation (using the [`locate`](#map-locate) method)
			// went successfully.
			this.fire('locationfound', data);
		}
	});



	}(window, document));
	//# sourceMappingURL=leaflet-src.map

/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
	 Leaflet.draw 0.4.3, a plugin that adds drawing and editing tools to Leaflet powered maps.
	 (c) 2012-2017, Jacob Toye, Jon West, Smartrak, Leaflet

	 https://github.com/Leaflet/Leaflet.draw
	 http://leafletjs.com
	 */
	!function(t,e,i){L.drawVersion="0.4.3",L.Draw={},L.drawLocal={draw:{toolbar:{actions:{title:"Cancel drawing",text:"Cancel"},finish:{title:"Finish drawing",text:"Finish"},undo:{title:"Delete last point drawn",text:"Delete last point"},buttons:{polyline:"Draw a polyline",polygon:"Draw a polygon",rectangle:"Draw a rectangle",circle:"Draw a circle",marker:"Draw a marker"}},handlers:{circle:{tooltip:{start:"Click and drag to draw circle."},radius:"Radius"},marker:{tooltip:{start:"Click map to place marker."}},polygon:{tooltip:{start:"Click to start drawing shape.",cont:"Click to continue drawing shape.",end:"Click first point to close this shape."}},polyline:{error:"<strong>Error:</strong> shape edges cannot cross!",tooltip:{start:"Click to start drawing line.",cont:"Click to continue drawing line.",end:"Click last point to finish line."}},rectangle:{tooltip:{start:"Click and drag to draw rectangle."}},simpleshape:{tooltip:{end:"Release mouse to finish drawing."}}}},edit:{toolbar:{actions:{save:{title:"Save changes.",text:"Save"},cancel:{title:"Cancel editing, discards all changes.",text:"Cancel"}},buttons:{edit:"Edit layers.",editDisabled:"No layers to edit.",remove:"Delete layers.",removeDisabled:"No layers to delete."}},handlers:{edit:{tooltip:{text:"Drag handles, or marker to edit feature.",subtext:"Click cancel to undo changes."}},remove:{tooltip:{text:"Click on a feature to remove"}}}}},L.Draw.Event={},L.Draw.Event.CREATED="draw:created",L.Draw.Event.EDITED="draw:edited",L.Draw.Event.DELETED="draw:deleted",L.Draw.Event.DRAWSTART="draw:drawstart",L.Draw.Event.DRAWSTOP="draw:drawstop",L.Draw.Event.DRAWVERTEX="draw:drawvertex",L.Draw.Event.EDITSTART="draw:editstart",L.Draw.Event.EDITMOVE="draw:editmove",L.Draw.Event.EDITRESIZE="draw:editresize",L.Draw.Event.EDITVERTEX="draw:editvertex",L.Draw.Event.EDITSTOP="draw:editstop",L.Draw.Event.DELETESTART="draw:deletestart",L.Draw.Event.DELETESTOP="draw:deletestop",L.Draw=L.Draw||{},L.Draw.Feature=L.Handler.extend({includes:L.Mixin.Events,initialize:function(t,e){this._map=t,this._container=t._container,this._overlayPane=t._panes.overlayPane,this._popupPane=t._panes.popupPane,e&&e.shapeOptions&&(e.shapeOptions=L.Util.extend({},this.options.shapeOptions,e.shapeOptions)),L.setOptions(this,e)},enable:function(){this._enabled||(L.Handler.prototype.enable.call(this),this.fire("enabled",{handler:this.type}),this._map.fire(L.Draw.Event.DRAWSTART,{layerType:this.type}))},disable:function(){this._enabled&&(L.Handler.prototype.disable.call(this),this._map.fire(L.Draw.Event.DRAWSTOP,{layerType:this.type}),this.fire("disabled",{handler:this.type}))},addHooks:function(){var t=this._map;t&&(L.DomUtil.disableTextSelection(),t.getContainer().focus(),this._tooltip=new L.Draw.Tooltip(this._map),L.DomEvent.on(this._container,"keyup",this._cancelDrawing,this))},removeHooks:function(){this._map&&(L.DomUtil.enableTextSelection(),this._tooltip.dispose(),this._tooltip=null,L.DomEvent.off(this._container,"keyup",this._cancelDrawing,this))},setOptions:function(t){L.setOptions(this,t)},_fireCreatedEvent:function(t){this._map.fire(L.Draw.Event.CREATED,{layer:t,layerType:this.type})},_cancelDrawing:function(t){this._map.fire("draw:canceled",{layerType:this.type}),27===t.keyCode&&this.disable()}}),L.Draw.Polyline=L.Draw.Feature.extend({statics:{TYPE:"polyline"},Poly:L.Polyline,options:{allowIntersection:!0,repeatMode:!1,drawError:{color:"#b00b00",timeout:2500},icon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon"}),touchIcon:new L.DivIcon({iconSize:new L.Point(20,20),className:"leaflet-div-icon leaflet-editing-icon leaflet-touch-icon"}),guidelineDistance:20,maxGuideLineLength:4e3,shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!1,clickable:!0},metric:!0,feet:!0,showLength:!0,zIndexOffset:2e3},initialize:function(t,e){L.Browser.touch&&(this.options.icon=this.options.touchIcon),this.options.drawError.message=L.drawLocal.draw.handlers.polyline.error,e&&e.drawError&&(e.drawError=L.Util.extend({},this.options.drawError,e.drawError)),this.type=L.Draw.Polyline.TYPE,L.Draw.Feature.prototype.initialize.call(this,t,e)},addHooks:function(){L.Draw.Feature.prototype.addHooks.call(this),this._map&&(this._markers=[],this._markerGroup=new L.LayerGroup,this._map.addLayer(this._markerGroup),this._poly=new L.Polyline([],this.options.shapeOptions),this._tooltip.updateContent(this._getTooltipText()),this._mouseMarker||(this._mouseMarker=L.marker(this._map.getCenter(),{icon:L.divIcon({className:"leaflet-mouse-marker",iconAnchor:[20,20],iconSize:[40,40]}),opacity:0,zIndexOffset:this.options.zIndexOffset})),L.Browser.touch||this._map.on("mouseup",this._onMouseUp,this),this._mouseMarker.on("mousedown",this._onMouseDown,this).on("mouseout",this._onMouseOut,this).on("mouseup",this._onMouseUp,this).on("mousemove",this._onMouseMove,this).addTo(this._map),this._map.on("mouseup",this._onMouseUp,this).on("mousemove",this._onMouseMove,this).on("zoomlevelschange",this._onZoomEnd,this).on("click",this._onTouch,this).on("zoomend",this._onZoomEnd,this))},removeHooks:function(){L.Draw.Feature.prototype.removeHooks.call(this),this._clearHideErrorTimeout(),this._cleanUpShape(),this._map.removeLayer(this._markerGroup),delete this._markerGroup,delete this._markers,this._map.removeLayer(this._poly),delete this._poly,this._mouseMarker.off("mousedown",this._onMouseDown,this).off("mouseout",this._onMouseOut,this).off("mouseup",this._onMouseUp,this).off("mousemove",this._onMouseMove,this),this._map.removeLayer(this._mouseMarker),delete this._mouseMarker,this._clearGuides(),this._map.off("mouseup",this._onMouseUp,this).off("mousemove",this._onMouseMove,this).off("zoomlevelschange",this._onZoomEnd,this).off("zoomend",this._onZoomEnd,this).off("click",this._onTouch,this)},deleteLastVertex:function(){if(!(this._markers.length<=1)){var t=this._markers.pop(),e=this._poly,i=e.getLatLngs(),o=i.splice(-1,1)[0];this._poly.setLatLngs(i),this._markerGroup.removeLayer(t),e.getLatLngs().length<2&&this._map.removeLayer(e),this._vertexChanged(o,!1)}},addVertex:function(t){var e=this._markers.length;return e>0&&!this.options.allowIntersection&&this._poly.newLatLngIntersects(t)?void this._showErrorTooltip():(this._errorShown&&this._hideErrorTooltip(),this._markers.push(this._createMarker(t)),this._poly.addLatLng(t),2===this._poly.getLatLngs().length&&this._map.addLayer(this._poly),void this._vertexChanged(t,!0))},completeShape:function(){this._markers.length<=1||(this._fireCreatedEvent(),this.disable(),this.options.repeatMode&&this.enable())},_finishShape:function(){var t=this._poly._defaultShape?this._poly._defaultShape():this._poly.getLatLngs(),e=this._poly.newLatLngIntersects(t[t.length-1]);return!this.options.allowIntersection&&e||!this._shapeIsValid()?void this._showErrorTooltip():(this._fireCreatedEvent(),this.disable(),void(this.options.repeatMode&&this.enable()))},_shapeIsValid:function(){return!0},_onZoomEnd:function(){null!==this._markers&&this._updateGuide()},_onMouseMove:function(t){var e=this._map.mouseEventToLayerPoint(t.originalEvent),i=this._map.layerPointToLatLng(e);this._currentLatLng=i,this._updateTooltip(i),this._updateGuide(e),this._mouseMarker.setLatLng(i),L.DomEvent.preventDefault(t.originalEvent)},_vertexChanged:function(t,e){this._map.fire(L.Draw.Event.DRAWVERTEX,{layers:this._markerGroup}),this._updateFinishHandler(),this._updateRunningMeasure(t,e),this._clearGuides(),this._updateTooltip()},_onMouseDown:function(t){var e=t.originalEvent;this._mouseDownOrigin=L.point(e.clientX,e.clientY)},_onMouseUp:function(e){if(this._mouseDownOrigin){var i=L.point(e.originalEvent.clientX,e.originalEvent.clientY).distanceTo(this._mouseDownOrigin);Math.abs(i)<9*(t.devicePixelRatio||1)&&this.addVertex(e.latlng)}this._mouseDownOrigin=null},_onTouch:function(t){L.Browser.touch&&(this._onMouseDown(t),this._onMouseUp(t))},_onMouseOut:function(){this._tooltip&&this._tooltip._onMouseOut.call(this._tooltip)},_updateFinishHandler:function(){var t=this._markers.length;t>1&&this._markers[t-1].on("click",this._finishShape,this),t>2&&this._markers[t-2].off("click",this._finishShape,this)},_createMarker:function(t){var e=new L.Marker(t,{icon:this.options.icon,zIndexOffset:2*this.options.zIndexOffset});return this._markerGroup.addLayer(e),e},_updateGuide:function(t){var e=this._markers?this._markers.length:0;e>0&&(t=t||this._map.latLngToLayerPoint(this._currentLatLng),this._clearGuides(),this._drawGuide(this._map.latLngToLayerPoint(this._markers[e-1].getLatLng()),t))},_updateTooltip:function(t){var e=this._getTooltipText();t&&this._tooltip.updatePosition(t),this._errorShown||this._tooltip.updateContent(e)},_drawGuide:function(t,e){var i,o,n,s=Math.floor(Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))),a=this.options.guidelineDistance,r=this.options.maxGuideLineLength,h=s>r?s-r:a;for(this._guidesContainer||(this._guidesContainer=L.DomUtil.create("div","leaflet-draw-guides",this._overlayPane));h<s;h+=this.options.guidelineDistance)i=h/s,o={x:Math.floor(t.x*(1-i)+i*e.x),y:Math.floor(t.y*(1-i)+i*e.y)},n=L.DomUtil.create("div","leaflet-draw-guide-dash",this._guidesContainer),n.style.backgroundColor=this._errorShown?this.options.drawError.color:this.options.shapeOptions.color,L.DomUtil.setPosition(n,o)},_updateGuideColor:function(t){if(this._guidesContainer)for(var e=0,i=this._guidesContainer.childNodes.length;e<i;e++)this._guidesContainer.childNodes[e].style.backgroundColor=t},_clearGuides:function(){if(this._guidesContainer)for(;this._guidesContainer.firstChild;)this._guidesContainer.removeChild(this._guidesContainer.firstChild)},_getTooltipText:function(){var t,e,i=this.options.showLength;return 0===this._markers.length?t={text:L.drawLocal.draw.handlers.polyline.tooltip.start}:(e=i?this._getMeasurementString():"",t=1===this._markers.length?{text:L.drawLocal.draw.handlers.polyline.tooltip.cont,subtext:e}:{text:L.drawLocal.draw.handlers.polyline.tooltip.end,subtext:e}),t},_updateRunningMeasure:function(t,e){var i,o,n=this._markers.length;1===this._markers.length?this._measurementRunningTotal=0:(i=n-(e?2:1),o=t.distanceTo(this._markers[i].getLatLng()),this._measurementRunningTotal+=o*(e?1:-1))},_getMeasurementString:function(){var t,e=this._currentLatLng,i=this._markers[this._markers.length-1].getLatLng();return t=this._measurementRunningTotal+e.distanceTo(i),L.GeometryUtil.readableDistance(t,this.options.metric,this.options.feet)},_showErrorTooltip:function(){this._errorShown=!0,this._tooltip.showAsError().updateContent({text:this.options.drawError.message}),this._updateGuideColor(this.options.drawError.color),this._poly.setStyle({color:this.options.drawError.color}),this._clearHideErrorTimeout(),this._hideErrorTimeout=setTimeout(L.Util.bind(this._hideErrorTooltip,this),this.options.drawError.timeout)},_hideErrorTooltip:function(){this._errorShown=!1,this._clearHideErrorTimeout(),this._tooltip.removeError().updateContent(this._getTooltipText()),this._updateGuideColor(this.options.shapeOptions.color),this._poly.setStyle({color:this.options.shapeOptions.color})},_clearHideErrorTimeout:function(){this._hideErrorTimeout&&(clearTimeout(this._hideErrorTimeout),this._hideErrorTimeout=null)},_cleanUpShape:function(){this._markers.length>1&&this._markers[this._markers.length-1].off("click",this._finishShape,this)},_fireCreatedEvent:function(){var t=new this.Poly(this._poly.getLatLngs(),this.options.shapeOptions);L.Draw.Feature.prototype._fireCreatedEvent.call(this,t)}}),L.Draw.Polygon=L.Draw.Polyline.extend({statics:{TYPE:"polygon"},Poly:L.Polygon,options:{showArea:!1,shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!0,fillColor:null,fillOpacity:.2,clickable:!0},metric:!0},initialize:function(t,e){L.Draw.Polyline.prototype.initialize.call(this,t,e),this.type=L.Draw.Polygon.TYPE},_updateFinishHandler:function(){var t=this._markers.length;1===t&&this._markers[0].on("click",this._finishShape,this),t>2&&(this._markers[t-1].on("dblclick",this._finishShape,this),t>3&&this._markers[t-2].off("dblclick",this._finishShape,this))},_getTooltipText:function(){var t,e;return 0===this._markers.length?t=L.drawLocal.draw.handlers.polygon.tooltip.start:this._markers.length<3?t=L.drawLocal.draw.handlers.polygon.tooltip.cont:(t=L.drawLocal.draw.handlers.polygon.tooltip.end,e=this._getMeasurementString()),{text:t,subtext:e}},_getMeasurementString:function(){var t=this._area;return t?L.GeometryUtil.readableArea(t,this.options.metric):null},_shapeIsValid:function(){return this._markers.length>=3},_vertexChanged:function(t,e){var i;!this.options.allowIntersection&&this.options.showArea&&(i=this._poly.getLatLngs(),this._area=L.GeometryUtil.geodesicArea(i)),L.Draw.Polyline.prototype._vertexChanged.call(this,t,e)},_cleanUpShape:function(){var t=this._markers.length;t>0&&(this._markers[0].off("click",this._finishShape,this),t>2&&this._markers[t-1].off("dblclick",this._finishShape,this))}}),L.SimpleShape={},L.Draw.SimpleShape=L.Draw.Feature.extend({options:{repeatMode:!1},initialize:function(t,e){this._endLabelText=L.drawLocal.draw.handlers.simpleshape.tooltip.end,L.Draw.Feature.prototype.initialize.call(this,t,e)},addHooks:function(){L.Draw.Feature.prototype.addHooks.call(this),this._map&&(this._mapDraggable=this._map.dragging.enabled(),this._mapDraggable&&this._map.dragging.disable(),this._container.style.cursor="crosshair",this._tooltip.updateContent({text:this._initialLabelText}),this._map.on("mousedown",this._onMouseDown,this).on("mousemove",this._onMouseMove,this).on("touchstart",this._onMouseDown,this).on("touchmove",this._onMouseMove,this))},removeHooks:function(){L.Draw.Feature.prototype.removeHooks.call(this),this._map&&(this._mapDraggable&&this._map.dragging.enable(),this._container.style.cursor="",this._map.off("mousedown",this._onMouseDown,this).off("mousemove",this._onMouseMove,this).off("touchstart",this._onMouseDown,this).off("touchmove",this._onMouseMove,this),L.DomEvent.off(e,"mouseup",this._onMouseUp,this),L.DomEvent.off(e,"touchend",this._onMouseUp,this),this._shape&&(this._map.removeLayer(this._shape),delete this._shape)),this._isDrawing=!1},_getTooltipText:function(){return{text:this._endLabelText}},_onMouseDown:function(t){this._isDrawing=!0,this._startLatLng=t.latlng,L.DomEvent.on(e,"mouseup",this._onMouseUp,this).on(e,"touchend",this._onMouseUp,this).preventDefault(t.originalEvent)},_onMouseMove:function(t){var e=t.latlng;this._tooltip.updatePosition(e),this._isDrawing&&(this._tooltip.updateContent(this._getTooltipText()),this._drawShape(e))},_onMouseUp:function(){this._shape&&this._fireCreatedEvent(),this.disable(),this.options.repeatMode&&this.enable()}}),L.Draw.Rectangle=L.Draw.SimpleShape.extend({statics:{TYPE:"rectangle"},options:{shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!0,fillColor:null,fillOpacity:.2,showArea:!0,clickable:!0},metric:!0},initialize:function(t,e){this.type=L.Draw.Rectangle.TYPE,this._initialLabelText=L.drawLocal.draw.handlers.rectangle.tooltip.start,L.Draw.SimpleShape.prototype.initialize.call(this,t,e)},_drawShape:function(t){this._shape?this._shape.setBounds(new L.LatLngBounds(this._startLatLng,t)):(this._shape=new L.Rectangle(new L.LatLngBounds(this._startLatLng,t),this.options.shapeOptions),this._map.addLayer(this._shape))},_fireCreatedEvent:function(){var t=new L.Rectangle(this._shape.getBounds(),this.options.shapeOptions);L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this,t)},_getTooltipText:function(){var t,e,i,o=L.Draw.SimpleShape.prototype._getTooltipText.call(this),n=this._shape,s=this.options.showArea;return n&&(t=this._shape._defaultShape?this._shape._defaultShape():this._shape.getLatLngs(),e=L.GeometryUtil.geodesicArea(t),i=s?L.GeometryUtil.readableArea(e,this.options.metric):""),{text:o.text,subtext:i}}}),L.Draw.Circle=L.Draw.SimpleShape.extend({statics:{TYPE:"circle"},options:{shapeOptions:{stroke:!0,color:"#f06eaa",weight:4,opacity:.5,fill:!0,fillColor:null,fillOpacity:.2,clickable:!0},showRadius:!0,metric:!0,feet:!0},initialize:function(t,e){this.type=L.Draw.Circle.TYPE,this._initialLabelText=L.drawLocal.draw.handlers.circle.tooltip.start,L.Draw.SimpleShape.prototype.initialize.call(this,t,e)},_drawShape:function(t){this._shape?this._shape.setRadius(this._startLatLng.distanceTo(t)):(this._shape=new L.Circle(this._startLatLng,this._startLatLng.distanceTo(t),this.options.shapeOptions),this._map.addLayer(this._shape))},_fireCreatedEvent:function(){var t=new L.Circle(this._startLatLng,this._shape.getRadius(),this.options.shapeOptions);L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this,t)},_onMouseMove:function(t){var e,i=t.latlng,o=this.options.showRadius,n=this.options.metric;this._tooltip.updatePosition(i),this._isDrawing&&(this._drawShape(i),e=this._shape.getRadius().toFixed(1),this._tooltip.updateContent({text:this._endLabelText,subtext:o?L.drawLocal.draw.handlers.circle.radius+": "+L.GeometryUtil.readableDistance(e,n,this.options.feet):""}))}}),L.Draw.Marker=L.Draw.Feature.extend({statics:{TYPE:"marker"},options:{icon:new L.Icon.Default,repeatMode:!1,zIndexOffset:2e3},initialize:function(t,e){this.type=L.Draw.Marker.TYPE,L.Draw.Feature.prototype.initialize.call(this,t,e)},addHooks:function(){L.Draw.Feature.prototype.addHooks.call(this),this._map&&(this._tooltip.updateContent({text:L.drawLocal.draw.handlers.marker.tooltip.start}),this._mouseMarker||(this._mouseMarker=L.marker(this._map.getCenter(),{icon:L.divIcon({className:"leaflet-mouse-marker",iconAnchor:[20,20],iconSize:[40,40]}),opacity:0,zIndexOffset:this.options.zIndexOffset})),this._mouseMarker.on("click",this._onClick,this).addTo(this._map),this._map.on("mousemove",this._onMouseMove,this),this._map.on("click",this._onTouch,this))},removeHooks:function(){L.Draw.Feature.prototype.removeHooks.call(this),this._map&&(this._marker&&(this._marker.off("click",this._onClick,this),this._map.off("click",this._onClick,this).off("click",this._onTouch,this).removeLayer(this._marker),delete this._marker),this._mouseMarker.off("click",this._onClick,this),this._map.removeLayer(this._mouseMarker),delete this._mouseMarker,this._map.off("mousemove",this._onMouseMove,this))},_onMouseMove:function(t){var e=t.latlng;this._tooltip.updatePosition(e),this._mouseMarker.setLatLng(e),this._marker?(e=this._mouseMarker.getLatLng(),this._marker.setLatLng(e)):(this._marker=new L.Marker(e,{icon:this.options.icon,zIndexOffset:this.options.zIndexOffset}),this._marker.on("click",this._onClick,this),this._map.on("click",this._onClick,this).addLayer(this._marker))},_onClick:function(){this._fireCreatedEvent(),this.disable(),this.options.repeatMode&&this.enable()},_onTouch:function(t){this._onMouseMove(t),this._onClick()},_fireCreatedEvent:function(){var t=new L.Marker.Touch(this._marker.getLatLng(),{icon:this.options.icon});L.Draw.Feature.prototype._fireCreatedEvent.call(this,t)}}),L.Edit=L.Edit||{},L.Edit.Marker=L.Handler.extend({initialize:function(t,e){this._marker=t,L.setOptions(this,e)},addHooks:function(){var t=this._marker;t.dragging.enable(),t.on("dragend",this._onDragEnd,t),this._toggleMarkerHighlight()},removeHooks:function(){var t=this._marker;t.dragging.disable(),t.off("dragend",this._onDragEnd,t),this._toggleMarkerHighlight()},_onDragEnd:function(t){var e=t.target;e.edited=!0,this._map.fire(L.Draw.Event.EDITMOVE,{layer:e})},_toggleMarkerHighlight:function(){var t=this._marker._icon;t&&(t.style.display="none",L.DomUtil.hasClass(t,"leaflet-edit-marker-selected")?(L.DomUtil.removeClass(t,"leaflet-edit-marker-selected"),this._offsetMarker(t,-4)):(L.DomUtil.addClass(t,"leaflet-edit-marker-selected"),this._offsetMarker(t,4)),t.style.display="")},_offsetMarker:function(t,e){var i=parseInt(t.style.marginTop,10)-e,o=parseInt(t.style.marginLeft,10)-e;t.style.marginTop=i+"px",t.style.marginLeft=o+"px"}}),L.Marker.addInitHook(function(){L.Edit.Marker&&(this.editing=new L.Edit.Marker(this),this.options.editable&&this.editing.enable())}),L.Edit=L.Edit||{},L.Edit.Poly=L.Handler.extend({options:{},initialize:function(t,e){this.latlngs=[t._latlngs],t._holes&&(this.latlngs=this.latlngs.concat(t._holes)),this._poly=t,L.setOptions(this,e),this._poly.on("revert-edited",this._updateLatLngs,this)},_defaultShape:function(){return L.Polyline._flat?L.Polyline._flat(this._poly._latlngs)?this._poly._latlngs:this._poly._latlngs[0]:this._poly._latlngs},_eachVertexHandler:function(t){for(var e=0;e<this._verticesHandlers.length;e++)t(this._verticesHandlers[e])},addHooks:function(){this._initHandlers(),this._eachVertexHandler(function(t){t.addHooks()})},removeHooks:function(){this._eachVertexHandler(function(t){t.removeHooks()})},updateMarkers:function(){this._eachVertexHandler(function(t){t.updateMarkers()})},_initHandlers:function(){this._verticesHandlers=[];for(var t=0;t<this.latlngs.length;t++)this._verticesHandlers.push(new L.Edit.PolyVerticesEdit(this._poly,this.latlngs[t],this.options))},_updateLatLngs:function(t){this.latlngs=[t.layer._latlngs],t.layer._holes&&(this.latlngs=this.latlngs.concat(t.layer._holes))}}),L.Edit.PolyVerticesEdit=L.Handler.extend({options:{icon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon"}),touchIcon:new L.DivIcon({iconSize:new L.Point(20,20),className:"leaflet-div-icon leaflet-editing-icon leaflet-touch-icon"}),drawError:{color:"#b00b00",timeout:1e3}},initialize:function(t,e,i){L.Browser.touch&&(this.options.icon=this.options.touchIcon),this._poly=t,i&&i.drawError&&(i.drawError=L.Util.extend({},this.options.drawError,i.drawError)),this._latlngs=e,L.setOptions(this,i)},_defaultShape:function(){return L.Polyline._flat?L.Polyline._flat(this._latlngs)?this._latlngs:this._latlngs[0]:this._latlngs},addHooks:function(){var t=this._poly;t instanceof L.Polygon||(t.options.fill=!1,t.options.editing&&(t.options.editing.fill=!1)),t.setStyle(t.options.editing),this._poly._map&&(this._map=this._poly._map,this._markerGroup||this._initMarkers(),this._poly._map.addLayer(this._markerGroup))},removeHooks:function(){var t=this._poly;t.setStyle(t.options.original),t._map&&(t._map.removeLayer(this._markerGroup),delete this._markerGroup,delete this._markers)},updateMarkers:function(){this._markerGroup.clearLayers(),this._initMarkers()},_initMarkers:function(){this._markerGroup||(this._markerGroup=new L.LayerGroup),this._markers=[];var t,e,i,o,n=this._defaultShape();for(t=0,i=n.length;t<i;t++)o=this._createMarker(n[t],t),o.on("click",this._onMarkerClick,this),this._markers.push(o);var s,a;for(t=0,e=i-1;t<i;e=t++)(0!==t||L.Polygon&&this._poly instanceof L.Polygon)&&(s=this._markers[e],a=this._markers[t],this._createMiddleMarker(s,a),this._updatePrevNext(s,a))},_createMarker:function(t,e){var i=new L.Marker.Touch(t,{draggable:!0,icon:this.options.icon});return i._origLatLng=t,i._index=e,i.on("dragstart",this._onMarkerDragStart,this).on("drag",this._onMarkerDrag,this).on("dragend",this._fireEdit,this).on("touchmove",this._onTouchMove,this).on("touchend",this._fireEdit,this).on("MSPointerMove",this._onTouchMove,this).on("MSPointerUp",this._fireEdit,this),this._markerGroup.addLayer(i),i},_onMarkerDragStart:function(){this._poly.fire("editstart")},_spliceLatLngs:function(){var t=this._defaultShape(),e=[].splice.apply(t,arguments);return this._poly._convertLatLngs(t,!0),this._poly.redraw(),e},_removeMarker:function(t){var e=t._index;this._markerGroup.removeLayer(t),this._markers.splice(e,1),this._spliceLatLngs(e,1),this._updateIndexes(e,-1),t.off("dragstart",this._onMarkerDragStart,this).off("drag",this._onMarkerDrag,this).off("dragend",this._fireEdit,this).off("touchmove",this._onMarkerDrag,this).off("touchend",this._fireEdit,this).off("click",this._onMarkerClick,this).off("MSPointerMove",this._onTouchMove,this).off("MSPointerUp",this._fireEdit,this)},_fireEdit:function(){this._poly.edited=!0,this._poly.fire("edit"),this._poly._map.fire(L.Draw.Event.EDITVERTEX,{layers:this._markerGroup})},_onMarkerDrag:function(t){var e=t.target,i=this._poly;if(L.extend(e._origLatLng,e._latlng),e._middleLeft&&e._middleLeft.setLatLng(this._getMiddleLatLng(e._prev,e)),e._middleRight&&e._middleRight.setLatLng(this._getMiddleLatLng(e,e._next)),i.options.poly){var o=i._map._editTooltip;if(!i.options.poly.allowIntersection&&i.intersects()){var n=i.options.color;i.setStyle({color:this.options.drawError.color}),0!==L.version.indexOf("0.7")&&e.dragging._draggable._onUp(t),this._onMarkerClick(t),o&&o.updateContent({text:L.drawLocal.draw.handlers.polyline.error}),setTimeout(function(){i.setStyle({color:n}),o&&o.updateContent({text:L.drawLocal.edit.handlers.edit.tooltip.text,subtext:L.drawLocal.edit.handlers.edit.tooltip.subtext})},1e3)}}this._poly.redraw(),this._poly.fire("editdrag")},_onMarkerClick:function(t){var e=L.Polygon&&this._poly instanceof L.Polygon?4:3,i=t.target;this._defaultShape().length<e||(this._removeMarker(i),this._updatePrevNext(i._prev,i._next),i._middleLeft&&this._markerGroup.removeLayer(i._middleLeft),i._middleRight&&this._markerGroup.removeLayer(i._middleRight),i._prev&&i._next?this._createMiddleMarker(i._prev,i._next):i._prev?i._next||(i._prev._middleRight=null):i._next._middleLeft=null,this._fireEdit())},_onTouchMove:function(t){var e=this._map.mouseEventToLayerPoint(t.originalEvent.touches[0]),i=this._map.layerPointToLatLng(e),o=t.target;L.extend(o._origLatLng,i),o._middleLeft&&o._middleLeft.setLatLng(this._getMiddleLatLng(o._prev,o)),o._middleRight&&o._middleRight.setLatLng(this._getMiddleLatLng(o,o._next)),this._poly.redraw(),this.updateMarkers()},_updateIndexes:function(t,e){this._markerGroup.eachLayer(function(i){i._index>t&&(i._index+=e)})},_createMiddleMarker:function(t,e){var i,o,n,s=this._getMiddleLatLng(t,e),a=this._createMarker(s);a.setOpacity(.6),t._middleRight=e._middleLeft=a,o=function(){a.off("touchmove",o,this);var n=e._index;a._index=n,a.off("click",i,this).on("click",this._onMarkerClick,this),s.lat=a.getLatLng().lat,s.lng=a.getLatLng().lng,this._spliceLatLngs(n,0,s),this._markers.splice(n,0,a),a.setOpacity(1),this._updateIndexes(n,1),e._index++,this._updatePrevNext(t,a),this._updatePrevNext(a,e),this._poly.fire("editstart")},n=function(){a.off("dragstart",o,this),a.off("dragend",n,this),a.off("touchmove",o,this),this._createMiddleMarker(t,a),this._createMiddleMarker(a,e)},i=function(){o.call(this),n.call(this),this._fireEdit()},a.on("click",i,this).on("dragstart",o,this).on("dragend",n,this).on("touchmove",o,this),this._markerGroup.addLayer(a)},_updatePrevNext:function(t,e){t&&(t._next=e),e&&(e._prev=t)},_getMiddleLatLng:function(t,e){var i=this._poly._map,o=i.project(t.getLatLng()),n=i.project(e.getLatLng());return i.unproject(o._add(n)._divideBy(2))}}),L.Polyline.addInitHook(function(){this.editing||(L.Edit.Poly&&(this.editing=new L.Edit.Poly(this,this.options.poly),this.options.editable&&this.editing.enable()),this.on("add",function(){this.editing&&this.editing.enabled()&&this.editing.addHooks()}),this.on("remove",function(){this.editing&&this.editing.enabled()&&this.editing.removeHooks()}))}),L.Edit=L.Edit||{},L.Edit.SimpleShape=L.Handler.extend({options:{moveIcon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-move"}),resizeIcon:new L.DivIcon({iconSize:new L.Point(8,8),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-resize"}),touchMoveIcon:new L.DivIcon({iconSize:new L.Point(20,20),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-move leaflet-touch-icon"}),touchResizeIcon:new L.DivIcon({iconSize:new L.Point(20,20),className:"leaflet-div-icon leaflet-editing-icon leaflet-edit-resize leaflet-touch-icon"})},initialize:function(t,e){L.Browser.touch&&(this.options.moveIcon=this.options.touchMoveIcon,this.options.resizeIcon=this.options.touchResizeIcon),this._shape=t,L.Util.setOptions(this,e)},addHooks:function(){var t=this._shape;this._shape._map&&(this._map=this._shape._map,t.setStyle(t.options.editing),t._map&&(this._map=t._map,this._markerGroup||this._initMarkers(),this._map.addLayer(this._markerGroup)))},removeHooks:function(){var t=this._shape;if(t.setStyle(t.options.original),t._map){this._unbindMarker(this._moveMarker);for(var e=0,i=this._resizeMarkers.length;e<i;e++)this._unbindMarker(this._resizeMarkers[e]);this._resizeMarkers=null,this._map.removeLayer(this._markerGroup),delete this._markerGroup}this._map=null},updateMarkers:function(){this._markerGroup.clearLayers(),this._initMarkers()},_initMarkers:function(){this._markerGroup||(this._markerGroup=new L.LayerGroup),this._createMoveMarker(),this._createResizeMarker()},_createMoveMarker:function(){},_createResizeMarker:function(){},_createMarker:function(t,e){var i=new L.Marker.Touch(t,{draggable:!0,icon:e,zIndexOffset:10});return this._bindMarker(i),this._markerGroup.addLayer(i),i},_bindMarker:function(t){t.on("dragstart",this._onMarkerDragStart,this).on("drag",this._onMarkerDrag,this).on("dragend",this._onMarkerDragEnd,this).on("touchstart",this._onTouchStart,this).on("touchmove",this._onTouchMove,this).on("MSPointerMove",this._onTouchMove,this).on("touchend",this._onTouchEnd,this).on("MSPointerUp",this._onTouchEnd,this)},_unbindMarker:function(t){t.off("dragstart",this._onMarkerDragStart,this).off("drag",this._onMarkerDrag,this).off("dragend",this._onMarkerDragEnd,this).off("touchstart",this._onTouchStart,this).off("touchmove",this._onTouchMove,this).off("MSPointerMove",this._onTouchMove,this).off("touchend",this._onTouchEnd,this).off("MSPointerUp",this._onTouchEnd,this)},_onMarkerDragStart:function(t){var e=t.target;e.setOpacity(0),this._shape.fire("editstart")},_fireEdit:function(){this._shape.edited=!0,this._shape.fire("edit")},_onMarkerDrag:function(t){var e=t.target,i=e.getLatLng();e===this._moveMarker?this._move(i):this._resize(i),this._shape.redraw(),this._shape.fire("editdrag")},_onMarkerDragEnd:function(t){var e=t.target;e.setOpacity(1),this._fireEdit()},_onTouchStart:function(t){if(L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this,t),"function"==typeof this._getCorners){var e=this._getCorners(),i=t.target,o=i._cornerIndex;i.setOpacity(0),this._oppositeCorner=e[(o+2)%4],this._toggleCornerMarkers(0,o)}this._shape.fire("editstart")},_onTouchMove:function(t){var e=this._map.mouseEventToLayerPoint(t.originalEvent.touches[0]),i=this._map.layerPointToLatLng(e),o=t.target;return o===this._moveMarker?this._move(i):this._resize(i),this._shape.redraw(),!1},_onTouchEnd:function(t){var e=t.target;e.setOpacity(1),this.updateMarkers(),this._fireEdit()},_move:function(){},_resize:function(){}}),L.Edit=L.Edit||{},L.Edit.Rectangle=L.Edit.SimpleShape.extend({_createMoveMarker:function(){var t=this._shape.getBounds(),e=t.getCenter();this._moveMarker=this._createMarker(e,this.options.moveIcon)},_createResizeMarker:function(){var t=this._getCorners();this._resizeMarkers=[];for(var e=0,i=t.length;e<i;e++)this._resizeMarkers.push(this._createMarker(t[e],this.options.resizeIcon)),this._resizeMarkers[e]._cornerIndex=e},_onMarkerDragStart:function(t){L.Edit.SimpleShape.prototype._onMarkerDragStart.call(this,t);var e=this._getCorners(),i=t.target,o=i._cornerIndex;this._oppositeCorner=e[(o+2)%4],this._toggleCornerMarkers(0,o)},_onMarkerDragEnd:function(t){var e,i,o=t.target;o===this._moveMarker&&(e=this._shape.getBounds(),i=e.getCenter(),o.setLatLng(i)),this._toggleCornerMarkers(1),this._repositionCornerMarkers(),L.Edit.SimpleShape.prototype._onMarkerDragEnd.call(this,t)},_move:function(t){for(var e,i=this._shape._defaultShape?this._shape._defaultShape():this._shape.getLatLngs(),o=this._shape.getBounds(),n=o.getCenter(),s=[],a=0,r=i.length;a<r;a++)e=[i[a].lat-n.lat,i[a].lng-n.lng],s.push([t.lat+e[0],t.lng+e[1]]);this._shape.setLatLngs(s),this._repositionCornerMarkers(),this._map.fire(L.Draw.Event.EDITMOVE,{layer:this._shape})},_resize:function(t){var e;this._shape.setBounds(L.latLngBounds(t,this._oppositeCorner)),e=this._shape.getBounds(),this._moveMarker.setLatLng(e.getCenter()),this._map.fire(L.Draw.Event.EDITRESIZE,{layer:this._shape})},_getCorners:function(){var t=this._shape.getBounds(),e=t.getNorthWest(),i=t.getNorthEast(),o=t.getSouthEast(),n=t.getSouthWest();
	return[e,i,o,n]},_toggleCornerMarkers:function(t){for(var e=0,i=this._resizeMarkers.length;e<i;e++)this._resizeMarkers[e].setOpacity(t)},_repositionCornerMarkers:function(){for(var t=this._getCorners(),e=0,i=this._resizeMarkers.length;e<i;e++)this._resizeMarkers[e].setLatLng(t[e])}}),L.Rectangle.addInitHook(function(){L.Edit.Rectangle&&(this.editing=new L.Edit.Rectangle(this),this.options.editable&&this.editing.enable())}),L.Edit=L.Edit||{},L.Edit.Circle=L.Edit.SimpleShape.extend({_createMoveMarker:function(){var t=this._shape.getLatLng();this._moveMarker=this._createMarker(t,this.options.moveIcon)},_createResizeMarker:function(){var t=this._shape.getLatLng(),e=this._getResizeMarkerPoint(t);this._resizeMarkers=[],this._resizeMarkers.push(this._createMarker(e,this.options.resizeIcon))},_getResizeMarkerPoint:function(t){var e=this._shape._radius*Math.cos(Math.PI/4),i=this._map.project(t);return this._map.unproject([i.x+e,i.y-e])},_move:function(t){var e=this._getResizeMarkerPoint(t);this._resizeMarkers[0].setLatLng(e),this._shape.setLatLng(t),this._map.fire(L.Draw.Event.EDITMOVE,{layer:this._shape})},_resize:function(t){var e=this._moveMarker.getLatLng(),i=e.distanceTo(t);this._shape.setRadius(i),this._map.fire(L.Draw.Event.EDITRESIZE,{layer:this._shape})}}),L.Circle.addInitHook(function(){L.Edit.Circle&&(this.editing=new L.Edit.Circle(this),this.options.editable&&this.editing.enable()),this.on("add",function(){this.editing&&this.editing.enabled()&&this.editing.addHooks()}),this.on("remove",function(){this.editing&&this.editing.enabled()&&this.editing.removeHooks()})}),L.Map.mergeOptions({touchExtend:!0}),L.Map.TouchExtend=L.Handler.extend({initialize:function(t){this._map=t,this._container=t._container,this._pane=t._panes.overlayPane},addHooks:function(){L.DomEvent.on(this._container,"touchstart",this._onTouchStart,this),L.DomEvent.on(this._container,"touchend",this._onTouchEnd,this),L.DomEvent.on(this._container,"touchmove",this._onTouchMove,this),this._detectIE()?(L.DomEvent.on(this._container,"MSPointerDown",this._onTouchStart,this),L.DomEvent.on(this._container,"MSPointerUp",this._onTouchEnd,this),L.DomEvent.on(this._container,"MSPointerMove",this._onTouchMove,this),L.DomEvent.on(this._container,"MSPointerCancel",this._onTouchCancel,this)):(L.DomEvent.on(this._container,"touchcancel",this._onTouchCancel,this),L.DomEvent.on(this._container,"touchleave",this._onTouchLeave,this))},removeHooks:function(){L.DomEvent.off(this._container,"touchstart",this._onTouchStart),L.DomEvent.off(this._container,"touchend",this._onTouchEnd),L.DomEvent.off(this._container,"touchmove",this._onTouchMove),this._detectIE()?(L.DomEvent.off(this._container,"MSPointerDowm",this._onTouchStart),L.DomEvent.off(this._container,"MSPointerUp",this._onTouchEnd),L.DomEvent.off(this._container,"MSPointerMove",this._onTouchMove),L.DomEvent.off(this._container,"MSPointerCancel",this._onTouchCancel)):(L.DomEvent.off(this._container,"touchcancel",this._onTouchCancel),L.DomEvent.off(this._container,"touchleave",this._onTouchLeave))},_touchEvent:function(t,e){var i={};if("undefined"!=typeof t.touches){if(!t.touches.length)return;i=t.touches[0]}else{if("touch"!==t.pointerType)return;if(i=t,!this._filterClick(t))return}var o=this._map.mouseEventToContainerPoint(i),n=this._map.mouseEventToLayerPoint(i),s=this._map.layerPointToLatLng(n);this._map.fire(e,{latlng:s,layerPoint:n,containerPoint:o,pageX:i.pageX,pageY:i.pageY,originalEvent:t})},_filterClick:function(t){var e=t.timeStamp||t.originalEvent.timeStamp,i=L.DomEvent._lastClick&&e-L.DomEvent._lastClick;return i&&i>100&&i<500||t.target._simulatedClick&&!t._simulated?(L.DomEvent.stop(t),!1):(L.DomEvent._lastClick=e,!0)},_onTouchStart:function(t){if(this._map._loaded){var e="touchstart";this._touchEvent(t,e)}},_onTouchEnd:function(t){if(this._map._loaded){var e="touchend";this._touchEvent(t,e)}},_onTouchCancel:function(t){if(this._map._loaded){var e="touchcancel";this._detectIE()&&(e="pointercancel"),this._touchEvent(t,e)}},_onTouchLeave:function(t){if(this._map._loaded){var e="touchleave";this._touchEvent(t,e)}},_onTouchMove:function(t){if(this._map._loaded){var e="touchmove";this._touchEvent(t,e)}},_detectIE:function(){var e=t.navigator.userAgent,i=e.indexOf("MSIE ");if(i>0)return parseInt(e.substring(i+5,e.indexOf(".",i)),10);var o=e.indexOf("Trident/");if(o>0){var n=e.indexOf("rv:");return parseInt(e.substring(n+3,e.indexOf(".",n)),10)}var s=e.indexOf("Edge/");return s>0&&parseInt(e.substring(s+5,e.indexOf(".",s)),10)}}),L.Map.addInitHook("addHandler","touchExtend",L.Map.TouchExtend),L.Marker.Touch=L.Marker.extend({_initInteraction:function(){return this.addInteractiveTarget?L.Marker.prototype._initInteraction.apply(this):this._initInteractionLegacy()},_initInteractionLegacy:function(){if(this.options.clickable){var t=this._icon,e=["dblclick","mousedown","mouseover","mouseout","contextmenu","touchstart","touchend","touchmove"];this._detectIE?e.concat(["MSPointerDown","MSPointerUp","MSPointerMove","MSPointerCancel"]):e.concat(["touchcancel"]),L.DomUtil.addClass(t,"leaflet-clickable"),L.DomEvent.on(t,"click",this._onMouseClick,this),L.DomEvent.on(t,"keypress",this._onKeyPress,this);for(var i=0;i<e.length;i++)L.DomEvent.on(t,e[i],this._fireMouseEvent,this);L.Handler.MarkerDrag&&(this.dragging=new L.Handler.MarkerDrag(this),this.options.draggable&&this.dragging.enable())}},_detectIE:function(){var e=t.navigator.userAgent,i=e.indexOf("MSIE ");if(i>0)return parseInt(e.substring(i+5,e.indexOf(".",i)),10);var o=e.indexOf("Trident/");if(o>0){var n=e.indexOf("rv:");return parseInt(e.substring(n+3,e.indexOf(".",n)),10)}var s=e.indexOf("Edge/");return s>0&&parseInt(e.substring(s+5,e.indexOf(".",s)),10)}}),L.LatLngUtil={cloneLatLngs:function(t){for(var e=[],i=0,o=t.length;i<o;i++)Array.isArray(t[i])?e.push(L.LatLngUtil.cloneLatLngs(t[i])):e.push(this.cloneLatLng(t[i]));return e},cloneLatLng:function(t){return L.latLng(t.lat,t.lng)}},L.GeometryUtil=L.extend(L.GeometryUtil||{},{geodesicArea:function(t){var e,i,o=t.length,n=0,s=Math.PI/180;if(o>2){for(var a=0;a<o;a++)e=t[a],i=t[(a+1)%o],n+=(i.lng-e.lng)*s*(2+Math.sin(e.lat*s)+Math.sin(i.lat*s));n=6378137*n*6378137/2}return Math.abs(n)},readableArea:function(t,e){var i;return e?i=t>=1e4?(1e-4*t).toFixed(2)+" ha":t.toFixed(2)+" m&sup2;":(t/=.836127,i=t>=3097600?(t/3097600).toFixed(2)+" mi&sup2;":t>=4840?(t/4840).toFixed(2)+" acres":Math.ceil(t)+" yd&sup2;"),i},readableDistance:function(t,e,i){var o;if(e)o=t>1e3?(t/1e3).toFixed(2)+" km":Math.ceil(t)+" m";else if(t*=1.09361,t>1760)o=(t/1760).toFixed(2)+" miles";else{var n=" yd";i&&(t*=3,n=" ft"),o=Math.ceil(t)+n}return o}}),L.Util.extend(L.LineUtil,{segmentsIntersect:function(t,e,i,o){return this._checkCounterclockwise(t,i,o)!==this._checkCounterclockwise(e,i,o)&&this._checkCounterclockwise(t,e,i)!==this._checkCounterclockwise(t,e,o)},_checkCounterclockwise:function(t,e,i){return(i.y-t.y)*(e.x-t.x)>(e.y-t.y)*(i.x-t.x)}}),L.Polyline.include({intersects:function(){var t,e,i,o=this._getProjectedPoints(),n=o?o.length:0;if(this._tooFewPointsForIntersection())return!1;for(t=n-1;t>=3;t--)if(e=o[t-1],i=o[t],this._lineSegmentsIntersectsRange(e,i,t-2))return!0;return!1},newLatLngIntersects:function(t,e){return!!this._map&&this.newPointIntersects(this._map.latLngToLayerPoint(t),e)},newPointIntersects:function(t,e){var i=this._getProjectedPoints(),o=i?i.length:0,n=i?i[o-1]:null,s=o-2;return!this._tooFewPointsForIntersection(1)&&this._lineSegmentsIntersectsRange(n,t,s,e?1:0)},_tooFewPointsForIntersection:function(t){var e=this._getProjectedPoints(),i=e?e.length:0;return i+=t||0,!e||i<=3},_lineSegmentsIntersectsRange:function(t,e,i,o){var n,s,a=this._getProjectedPoints();o=o||0;for(var r=i;r>o;r--)if(n=a[r-1],s=a[r],L.LineUtil.segmentsIntersect(t,e,n,s))return!0;return!1},_getProjectedPoints:function(){if(!this._defaultShape)return this._originalPoints;for(var t=[],e=this._defaultShape(),i=0;i<e.length;i++)t.push(this._map.latLngToLayerPoint(e[i]));return t}}),L.Polygon.include({intersects:function(){var t,e,i,o,n,s=this._getProjectedPoints();return!this._tooFewPointsForIntersection()&&(!!(t=L.Polyline.prototype.intersects.call(this))||(e=s.length,i=s[0],o=s[e-1],n=e-2,this._lineSegmentsIntersectsRange(o,i,n,1)))}}),L.Control.Draw=L.Control.extend({options:{position:"topleft",draw:{},edit:!1},initialize:function(t){if(L.version<"0.7")throw new Error("Leaflet.draw 0.2.3+ requires Leaflet 0.7.0+. Download latest from https://github.com/Leaflet/Leaflet/");L.Control.prototype.initialize.call(this,t);var e;this._toolbars={},L.DrawToolbar&&this.options.draw&&(e=new L.DrawToolbar(this.options.draw),this._toolbars[L.DrawToolbar.TYPE]=e,this._toolbars[L.DrawToolbar.TYPE].on("enable",this._toolbarEnabled,this)),L.EditToolbar&&this.options.edit&&(e=new L.EditToolbar(this.options.edit),this._toolbars[L.EditToolbar.TYPE]=e,this._toolbars[L.EditToolbar.TYPE].on("enable",this._toolbarEnabled,this)),L.toolbar=this},onAdd:function(t){var e,i=L.DomUtil.create("div","leaflet-draw"),o=!1,n="leaflet-draw-toolbar-top";for(var s in this._toolbars)this._toolbars.hasOwnProperty(s)&&(e=this._toolbars[s].addToolbar(t),e&&(o||(L.DomUtil.hasClass(e,n)||L.DomUtil.addClass(e.childNodes[0],n),o=!0),i.appendChild(e)));return i},onRemove:function(){for(var t in this._toolbars)this._toolbars.hasOwnProperty(t)&&this._toolbars[t].removeToolbar()},setDrawingOptions:function(t){for(var e in this._toolbars)this._toolbars[e]instanceof L.DrawToolbar&&this._toolbars[e].setOptions(t)},_toolbarEnabled:function(t){var e=t.target;for(var i in this._toolbars)this._toolbars[i]!==e&&this._toolbars[i].disable()}}),L.Map.mergeOptions({drawControlTooltips:!0,drawControl:!1}),L.Map.addInitHook(function(){this.options.drawControl&&(this.drawControl=new L.Control.Draw,this.addControl(this.drawControl))}),L.Toolbar=L.Class.extend({includes:[L.Mixin.Events],initialize:function(t){L.setOptions(this,t),this._modes={},this._actionButtons=[],this._activeMode=null},enabled:function(){return null!==this._activeMode},disable:function(){this.enabled()&&this._activeMode.handler.disable()},addToolbar:function(t){var e,i=L.DomUtil.create("div","leaflet-draw-section"),o=0,n=this._toolbarClass||"",s=this.getModeHandlers(t);for(this._toolbarContainer=L.DomUtil.create("div","leaflet-draw-toolbar leaflet-bar"),this._map=t,e=0;e<s.length;e++)s[e].enabled&&this._initModeHandler(s[e].handler,this._toolbarContainer,o++,n,s[e].title);if(o)return this._lastButtonIndex=--o,this._actionsContainer=L.DomUtil.create("ul","leaflet-draw-actions"),i.appendChild(this._toolbarContainer),i.appendChild(this._actionsContainer),i},removeToolbar:function(){for(var t in this._modes)this._modes.hasOwnProperty(t)&&(this._disposeButton(this._modes[t].button,this._modes[t].handler.enable,this._modes[t].handler),this._modes[t].handler.disable(),this._modes[t].handler.off("enabled",this._handlerActivated,this).off("disabled",this._handlerDeactivated,this));this._modes={};for(var e=0,i=this._actionButtons.length;e<i;e++)this._disposeButton(this._actionButtons[e].button,this._actionButtons[e].callback,this);this._actionButtons=[],this._actionsContainer=null},_initModeHandler:function(t,e,i,o,n){var s=t.type;this._modes[s]={},this._modes[s].handler=t,this._modes[s].button=this._createButton({type:s,title:n,className:o+"-"+s,container:e,callback:this._modes[s].handler.enable,context:this._modes[s].handler}),this._modes[s].buttonIndex=i,this._modes[s].handler.on("enabled",this._handlerActivated,this).on("disabled",this._handlerDeactivated,this)},_createButton:function(t){var e=L.DomUtil.create("a",t.className||"",t.container);return e.href="#",t.text&&(e.innerHTML=t.text),t.title&&(e.title=t.title),L.DomEvent.on(e,"click",L.DomEvent.stopPropagation).on(e,"mousedown",L.DomEvent.stopPropagation).on(e,"dblclick",L.DomEvent.stopPropagation).on(e,"click",L.DomEvent.preventDefault).on(e,"click",t.callback,t.context),e},_disposeButton:function(t,e){L.DomEvent.off(t,"click",L.DomEvent.stopPropagation).off(t,"mousedown",L.DomEvent.stopPropagation).off(t,"dblclick",L.DomEvent.stopPropagation).off(t,"click",L.DomEvent.preventDefault).off(t,"click",e)},_handlerActivated:function(t){this.disable(),this._activeMode=this._modes[t.handler],L.DomUtil.addClass(this._activeMode.button,"leaflet-draw-toolbar-button-enabled"),this._showActionsToolbar(),this.fire("enable")},_handlerDeactivated:function(){this._hideActionsToolbar(),L.DomUtil.removeClass(this._activeMode.button,"leaflet-draw-toolbar-button-enabled"),this._activeMode=null,this.fire("disable")},_createActions:function(t){var e,i,o,n,s=this._actionsContainer,a=this.getActions(t),r=a.length;for(i=0,o=this._actionButtons.length;i<o;i++)this._disposeButton(this._actionButtons[i].button,this._actionButtons[i].callback);for(this._actionButtons=[];s.firstChild;)s.removeChild(s.firstChild);for(var h=0;h<r;h++)"enabled"in a[h]&&!a[h].enabled||(e=L.DomUtil.create("li","",s),n=this._createButton({title:a[h].title,text:a[h].text,container:e,callback:a[h].callback,context:a[h].context}),this._actionButtons.push({button:n,callback:a[h].callback}))},_showActionsToolbar:function(){var t=this._activeMode.buttonIndex,e=this._lastButtonIndex,i=this._activeMode.button.offsetTop-1;this._createActions(this._activeMode.handler),this._actionsContainer.style.top=i+"px",0===t&&(L.DomUtil.addClass(this._toolbarContainer,"leaflet-draw-toolbar-notop"),L.DomUtil.addClass(this._actionsContainer,"leaflet-draw-actions-top")),t===e&&(L.DomUtil.addClass(this._toolbarContainer,"leaflet-draw-toolbar-nobottom"),L.DomUtil.addClass(this._actionsContainer,"leaflet-draw-actions-bottom")),this._actionsContainer.style.display="block"},_hideActionsToolbar:function(){this._actionsContainer.style.display="none",L.DomUtil.removeClass(this._toolbarContainer,"leaflet-draw-toolbar-notop"),L.DomUtil.removeClass(this._toolbarContainer,"leaflet-draw-toolbar-nobottom"),L.DomUtil.removeClass(this._actionsContainer,"leaflet-draw-actions-top"),L.DomUtil.removeClass(this._actionsContainer,"leaflet-draw-actions-bottom")}}),L.Draw=L.Draw||{},L.Draw.Tooltip=L.Class.extend({initialize:function(t){this._map=t,this._popupPane=t._panes.popupPane,this._container=t.options.drawControlTooltips?L.DomUtil.create("div","leaflet-draw-tooltip",this._popupPane):null,this._singleLineLabel=!1,this._map.on("mouseout",this._onMouseOut,this)},dispose:function(){this._map.off("mouseout",this._onMouseOut,this),this._container&&(this._popupPane.removeChild(this._container),this._container=null)},updateContent:function(t){return this._container?(t.subtext=t.subtext||"",0!==t.subtext.length||this._singleLineLabel?t.subtext.length>0&&this._singleLineLabel&&(L.DomUtil.removeClass(this._container,"leaflet-draw-tooltip-single"),this._singleLineLabel=!1):(L.DomUtil.addClass(this._container,"leaflet-draw-tooltip-single"),this._singleLineLabel=!0),this._container.innerHTML=(t.subtext.length>0?'<span class="leaflet-draw-tooltip-subtext">'+t.subtext+"</span><br />":"")+"<span>"+t.text+"</span>",this):this},updatePosition:function(t){var e=this._map.latLngToLayerPoint(t),i=this._container;return this._container&&(i.style.visibility="inherit",L.DomUtil.setPosition(i,e)),this},showAsError:function(){return this._container&&L.DomUtil.addClass(this._container,"leaflet-error-draw-tooltip"),this},removeError:function(){return this._container&&L.DomUtil.removeClass(this._container,"leaflet-error-draw-tooltip"),this},_onMouseOut:function(){this._container&&(this._container.style.visibility="hidden")}}),L.DrawToolbar=L.Toolbar.extend({statics:{TYPE:"draw"},options:{polyline:{},polygon:{},rectangle:{},circle:{},marker:{}},initialize:function(t){for(var e in this.options)this.options.hasOwnProperty(e)&&t[e]&&(t[e]=L.extend({},this.options[e],t[e]));this._toolbarClass="leaflet-draw-draw",L.Toolbar.prototype.initialize.call(this,t)},getModeHandlers:function(t){return[{enabled:this.options.polyline,handler:new L.Draw.Polyline(t,this.options.polyline),title:L.drawLocal.draw.toolbar.buttons.polyline},{enabled:this.options.polygon,handler:new L.Draw.Polygon(t,this.options.polygon),title:L.drawLocal.draw.toolbar.buttons.polygon},{enabled:this.options.rectangle,handler:new L.Draw.Rectangle(t,this.options.rectangle),title:L.drawLocal.draw.toolbar.buttons.rectangle},{enabled:this.options.circle,handler:new L.Draw.Circle(t,this.options.circle),title:L.drawLocal.draw.toolbar.buttons.circle},{enabled:this.options.marker,handler:new L.Draw.Marker(t,this.options.marker),title:L.drawLocal.draw.toolbar.buttons.marker}]},getActions:function(t){return[{enabled:t.completeShape,title:L.drawLocal.draw.toolbar.finish.title,text:L.drawLocal.draw.toolbar.finish.text,callback:t.completeShape,context:t},{enabled:t.deleteLastVertex,title:L.drawLocal.draw.toolbar.undo.title,text:L.drawLocal.draw.toolbar.undo.text,callback:t.deleteLastVertex,context:t},{title:L.drawLocal.draw.toolbar.actions.title,text:L.drawLocal.draw.toolbar.actions.text,callback:this.disable,context:this}]},setOptions:function(t){L.setOptions(this,t);for(var e in this._modes)this._modes.hasOwnProperty(e)&&t.hasOwnProperty(e)&&this._modes[e].handler.setOptions(t[e])}}),L.EditToolbar=L.Toolbar.extend({statics:{TYPE:"edit"},options:{edit:{selectedPathOptions:{dashArray:"10, 10",fill:!0,fillColor:"#fe57a1",fillOpacity:.1,maintainColor:!1}},remove:{},poly:null,featureGroup:null},initialize:function(t){t.edit&&("undefined"==typeof t.edit.selectedPathOptions&&(t.edit.selectedPathOptions=this.options.edit.selectedPathOptions),t.edit.selectedPathOptions=L.extend({},this.options.edit.selectedPathOptions,t.edit.selectedPathOptions)),t.remove&&(t.remove=L.extend({},this.options.remove,t.remove)),t.poly&&(t.poly=L.extend({},this.options.poly,t.poly)),this._toolbarClass="leaflet-draw-edit",L.Toolbar.prototype.initialize.call(this,t),this._selectedFeatureCount=0},getModeHandlers:function(t){var e=this.options.featureGroup;return[{enabled:this.options.edit,handler:new L.EditToolbar.Edit(t,{featureGroup:e,selectedPathOptions:this.options.edit.selectedPathOptions,poly:this.options.poly}),title:L.drawLocal.edit.toolbar.buttons.edit},{enabled:this.options.remove,handler:new L.EditToolbar.Delete(t,{featureGroup:e}),title:L.drawLocal.edit.toolbar.buttons.remove}]},getActions:function(){return[{title:L.drawLocal.edit.toolbar.actions.save.title,text:L.drawLocal.edit.toolbar.actions.save.text,callback:this._save,context:this},{title:L.drawLocal.edit.toolbar.actions.cancel.title,text:L.drawLocal.edit.toolbar.actions.cancel.text,callback:this.disable,context:this}]},addToolbar:function(t){var e=L.Toolbar.prototype.addToolbar.call(this,t);return this._checkDisabled(),this.options.featureGroup.on("layeradd layerremove",this._checkDisabled,this),e},removeToolbar:function(){this.options.featureGroup.off("layeradd layerremove",this._checkDisabled,this),L.Toolbar.prototype.removeToolbar.call(this)},disable:function(){this.enabled()&&(this._activeMode.handler.revertLayers(),L.Toolbar.prototype.disable.call(this))},_save:function(){this._activeMode.handler.save(),this._activeMode&&this._activeMode.handler.disable()},_checkDisabled:function(){var t,e=this.options.featureGroup,i=0!==e.getLayers().length;this.options.edit&&(t=this._modes[L.EditToolbar.Edit.TYPE].button,i?L.DomUtil.removeClass(t,"leaflet-disabled"):L.DomUtil.addClass(t,"leaflet-disabled"),t.setAttribute("title",i?L.drawLocal.edit.toolbar.buttons.edit:L.drawLocal.edit.toolbar.buttons.editDisabled)),this.options.remove&&(t=this._modes[L.EditToolbar.Delete.TYPE].button,i?L.DomUtil.removeClass(t,"leaflet-disabled"):L.DomUtil.addClass(t,"leaflet-disabled"),t.setAttribute("title",i?L.drawLocal.edit.toolbar.buttons.remove:L.drawLocal.edit.toolbar.buttons.removeDisabled))}}),L.EditToolbar.Edit=L.Handler.extend({statics:{TYPE:"edit"},includes:L.Mixin.Events,initialize:function(t,e){if(L.Handler.prototype.initialize.call(this,t),L.setOptions(this,e),this._featureGroup=e.featureGroup,!(this._featureGroup instanceof L.FeatureGroup))throw new Error("options.featureGroup must be a L.FeatureGroup");this._uneditedLayerProps={},this.type=L.EditToolbar.Edit.TYPE},enable:function(){!this._enabled&&this._hasAvailableLayers()&&(this.fire("enabled",{handler:this.type}),this._map.fire(L.Draw.Event.EDITSTART,{handler:this.type}),L.Handler.prototype.enable.call(this),this._featureGroup.on("layeradd",this._enableLayerEdit,this).on("layerremove",this._disableLayerEdit,this))},disable:function(){this._enabled&&(this._featureGroup.off("layeradd",this._enableLayerEdit,this).off("layerremove",this._disableLayerEdit,this),L.Handler.prototype.disable.call(this),this._map.fire(L.Draw.Event.EDITSTOP,{handler:this.type}),this.fire("disabled",{handler:this.type}))},addHooks:function(){var t=this._map;t&&(t.getContainer().focus(),this._featureGroup.eachLayer(this._enableLayerEdit,this),this._tooltip=new L.Draw.Tooltip(this._map),this._tooltip.updateContent({text:L.drawLocal.edit.handlers.edit.tooltip.text,subtext:L.drawLocal.edit.handlers.edit.tooltip.subtext}),t._editTooltip=this._tooltip,this._updateTooltip(),this._map.on("mousemove",this._onMouseMove,this).on("touchmove",this._onMouseMove,this).on("MSPointerMove",this._onMouseMove,this).on(L.Draw.Event.EDITVERTEX,this._updateTooltip,this))},removeHooks:function(){this._map&&(this._featureGroup.eachLayer(this._disableLayerEdit,this),this._uneditedLayerProps={},this._tooltip.dispose(),this._tooltip=null,this._map.off("mousemove",this._onMouseMove,this).off("touchmove",this._onMouseMove,this).off("MSPointerMove",this._onMouseMove,this).off(L.Draw.Event.EDITVERTEX,this._updateTooltip,this))},revertLayers:function(){this._featureGroup.eachLayer(function(t){this._revertLayer(t)},this)},save:function(){var t=new L.LayerGroup;this._featureGroup.eachLayer(function(e){e.edited&&(t.addLayer(e),e.edited=!1)}),this._map.fire(L.Draw.Event.EDITED,{layers:t})},_backupLayer:function(t){var e=L.Util.stamp(t);this._uneditedLayerProps[e]||(t instanceof L.Polyline||t instanceof L.Polygon||t instanceof L.Rectangle?this._uneditedLayerProps[e]={latlngs:L.LatLngUtil.cloneLatLngs(t.getLatLngs())}:t instanceof L.Circle?this._uneditedLayerProps[e]={latlng:L.LatLngUtil.cloneLatLng(t.getLatLng()),radius:t.getRadius()}:t instanceof L.Marker&&(this._uneditedLayerProps[e]={latlng:L.LatLngUtil.cloneLatLng(t.getLatLng())}))},_getTooltipText:function(){return{text:L.drawLocal.edit.handlers.edit.tooltip.text,subtext:L.drawLocal.edit.handlers.edit.tooltip.subtext}},_updateTooltip:function(){this._tooltip.updateContent(this._getTooltipText())},_revertLayer:function(t){var e=L.Util.stamp(t);t.edited=!1,this._uneditedLayerProps.hasOwnProperty(e)&&(t instanceof L.Polyline||t instanceof L.Polygon||t instanceof L.Rectangle?t.setLatLngs(this._uneditedLayerProps[e].latlngs):t instanceof L.Circle?(t.setLatLng(this._uneditedLayerProps[e].latlng),t.setRadius(this._uneditedLayerProps[e].radius)):t instanceof L.Marker&&t.setLatLng(this._uneditedLayerProps[e].latlng),t.fire("revert-edited",{layer:t}))},_enableLayerEdit:function(t){var e,i,o=t.layer||t.target||t;this._backupLayer(o),this.options.poly&&(i=L.Util.extend({},this.options.poly),o.options.poly=i),this.options.selectedPathOptions&&(e=L.Util.extend({},this.options.selectedPathOptions),e.maintainColor&&(e.color=o.options.color,e.fillColor=o.options.fillColor),o.options.original=L.extend({},o.options),o.options.editing=e),o instanceof L.Marker?(o.editing&&o.editing.enable(),o.dragging.enable(),o.on("dragend",this._onMarkerDragEnd).on("touchmove",this._onTouchMove,this).on("MSPointerMove",this._onTouchMove,this).on("touchend",this._onMarkerDragEnd,this).on("MSPointerUp",this._onMarkerDragEnd,this)):o.editing.enable()},_disableLayerEdit:function(t){var e=t.layer||t.target||t;e.edited=!1,e.editing&&e.editing.disable(),delete e.options.editing,delete e.options.original,this._selectedPathOptions&&(e instanceof L.Marker?this._toggleMarkerHighlight(e):(e.setStyle(e.options.previousOptions),delete e.options.previousOptions)),e instanceof L.Marker?(e.dragging.disable(),e.off("dragend",this._onMarkerDragEnd,this).off("touchmove",this._onTouchMove,this).off("MSPointerMove",this._onTouchMove,this).off("touchend",this._onMarkerDragEnd,this).off("MSPointerUp",this._onMarkerDragEnd,this)):e.editing.disable()},_onMouseMove:function(t){this._tooltip.updatePosition(t.latlng)},_onMarkerDragEnd:function(t){var e=t.target;e.edited=!0,this._map.fire(L.Draw.Event.EDITMOVE,{layer:e})},_onTouchMove:function(t){var e=t.originalEvent.changedTouches[0],i=this._map.mouseEventToLayerPoint(e),o=this._map.layerPointToLatLng(i);t.target.setLatLng(o)},_hasAvailableLayers:function(){return 0!==this._featureGroup.getLayers().length}}),L.EditToolbar.Delete=L.Handler.extend({statics:{TYPE:"remove"},includes:L.Mixin.Events,initialize:function(t,e){if(L.Handler.prototype.initialize.call(this,t),L.Util.setOptions(this,e),this._deletableLayers=this.options.featureGroup,!(this._deletableLayers instanceof L.FeatureGroup))throw new Error("options.featureGroup must be a L.FeatureGroup");this.type=L.EditToolbar.Delete.TYPE},enable:function(){!this._enabled&&this._hasAvailableLayers()&&(this.fire("enabled",{handler:this.type}),this._map.fire(L.Draw.Event.DELETESTART,{handler:this.type}),L.Handler.prototype.enable.call(this),this._deletableLayers.on("layeradd",this._enableLayerDelete,this).on("layerremove",this._disableLayerDelete,this))},disable:function(){this._enabled&&(this._deletableLayers.off("layeradd",this._enableLayerDelete,this).off("layerremove",this._disableLayerDelete,this),L.Handler.prototype.disable.call(this),this._map.fire(L.Draw.Event.DELETESTOP,{handler:this.type}),this.fire("disabled",{handler:this.type}))},addHooks:function(){var t=this._map;t&&(t.getContainer().focus(),this._deletableLayers.eachLayer(this._enableLayerDelete,this),this._deletedLayers=new L.LayerGroup,this._tooltip=new L.Draw.Tooltip(this._map),this._tooltip.updateContent({text:L.drawLocal.edit.handlers.remove.tooltip.text}),this._map.on("mousemove",this._onMouseMove,this))},removeHooks:function(){this._map&&(this._deletableLayers.eachLayer(this._disableLayerDelete,this),this._deletedLayers=null,this._tooltip.dispose(),this._tooltip=null,this._map.off("mousemove",this._onMouseMove,this))},revertLayers:function(){this._deletedLayers.eachLayer(function(t){this._deletableLayers.addLayer(t),t.fire("revert-deleted",{layer:t})},this)},save:function(){this._map.fire(L.Draw.Event.DELETED,{layers:this._deletedLayers})},_enableLayerDelete:function(t){var e=t.layer||t.target||t;e.on("click",this._removeLayer,this)},_disableLayerDelete:function(t){var e=t.layer||t.target||t;e.off("click",this._removeLayer,this),this._deletedLayers.removeLayer(e)},_removeLayer:function(t){var e=t.layer||t.target||t;this._deletableLayers.removeLayer(e),this._deletedLayers.addLayer(e),e.fire("deleted")},_onMouseMove:function(t){this._tooltip.updatePosition(t.latlng)},_hasAvailableLayers:function(){return 0!==this._deletableLayers.getLayers().length}})}(window,document);

/***/ },
/* 4 */
/***/ function(module, exports) {

	(function () {

	L.Handler.MarkerSnap = L.Handler.extend({
	    options: {
	        snapDistance: 15, // in pixels
	        snapVertices: true
	    },

	    initialize: function (map, marker, options) {
	        L.Handler.prototype.initialize.call(this, map);
	        this._markers = [];
	        this._guides = [];

	        if (arguments.length == 2) {
	            if (!(marker instanceof L.Class)) {
	                options = marker;
	                marker = null;
	            }
	        }

	        L.Util.setOptions(this, options || {});

	        if (marker) {
	            // new markers should be draggable !
	            if (!marker.dragging) marker.dragging = new L.Handler.MarkerDrag(marker);
	            marker.dragging.enable();
	            this.watchMarker(marker);
	        }

	        // Convert snap distance in pixels into buffer in degres, for searching around mouse
	        // It changes at each zoom change.
	        function computeBuffer() {
	            this._buffer = map.layerPointToLatLng(new L.Point(0,0)).lat -
	                           map.layerPointToLatLng(new L.Point(this.options.snapDistance, 0)).lat;
	        }
	        map.on('zoomend', computeBuffer, this);
	        map.whenReady(computeBuffer, this);
	        computeBuffer.call(this);
	    },

	    enable: function () {
	        this.disable();
	        for (var i=0; i<this._markers.length; i++) {
	            this.watchMarker(this._markers[i]);
	        }
	    },

	    disable: function () {
	        for (var i=0; i<this._markers.length; i++) {
	            this.unwatchMarker(this._markers[i]);
	        }
	    },

	    watchMarker: function (marker) {
	        if (this._markers.indexOf(marker) == -1)
	            this._markers.push(marker);
	        marker.on('move', this._snapMarker, this);
	    },

	    unwatchMarker: function (marker) {
	        marker.off('move', this._snapMarker, this);
	        delete marker['snap'];
	    },

	    addGuideLayer: function (layer) {
	        for (var i=0, n=this._guides.length; i<n; i++)
	            if (L.stamp(layer) === L.stamp(this._guides[i]))
	                return;
	        this._guides.push(layer);
	    },

	    _snapMarker: function(e) {
	        var marker = e.target,
	            latlng = marker.getLatLng(),
	            snaplist = [];

	        function isDifferentLayer(layer) {
	            if (layer.getLatLng) {
	                return L.stamp(marker) !== L.stamp(layer);
	            } else {
	                if (layer.editing && layer.editing._enabled) {
	                    var points = layer.editing._verticesHandlers[0]._markerGroup.getLayers();
	                    for(var i = 0, n = points.length; i < n; i++) {
	                        if (L.stamp(points[i]) === L.stamp(marker)) { return false; }
	                    }
	                }
	            }

	            return true;
	        }

	        function processGuide(guide) {
	            if ((guide._layers !== undefined) &&
	                (typeof guide.searchBuffer !== 'function')) {
	                // Guide is a layer group and has no L.LayerIndexMixin (from Leaflet.LayerIndex)
	                for (var id in guide._layers) {
	                    processGuide(guide._layers[id]);
	                }
	            }
	            else if (typeof guide.searchBuffer === 'function') {
	                // Search snaplist around mouse
	                var nearlayers = guide.searchBuffer(latlng, this._buffer);
	                snaplist = snaplist.concat(nearlayers.filter(function(layer) {
	                    return isDifferentLayer(layer);
	                }));
	            }
	            // Make sure the marker doesn't snap to itself or the associated polyline layer
	            else if (isDifferentLayer(guide)) {
	                snaplist.push(guide);
	            }
	        }

	        for (var i=0, n = this._guides.length; i < n; i++) {
	            var guide = this._guides[i];
	            processGuide.call(this, guide);
	        }

	        var closest = this._findClosestLayerSnap(this._map,
	                                                 snaplist,
	                                                 latlng,
	                                                 this.options.snapDistance,
	                                                 this.options.snapVertices);

	        closest = closest || {layer: null, latlng: null};
	        this._updateSnap(marker, closest.layer, closest.latlng);
	    },

	    _findClosestLayerSnap: function (map, layers, latlng, tolerance, withVertices) {
	        return L.GeometryUtil.closestLayerSnap(map, layers, latlng, tolerance, withVertices);
	    },

	    _updateSnap: function (marker, layer, latlng) {
	        if (layer && latlng) {
	            marker._latlng = L.latLng(latlng);
	            marker.update();
	            if (marker.snap != layer) {
	                marker.snap = layer;
	                if (marker._icon) L.DomUtil.addClass(marker._icon, 'marker-snapped');
	                marker.fire('snap', {layer:layer, latlng: latlng});
	            }
	        }
	        else {
	            if (marker.snap) {
	                if (marker._icon) L.DomUtil.removeClass(marker._icon, 'marker-snapped');
	                marker.fire('unsnap', {layer:marker.snap});
	            }
	            delete marker['snap'];
	        }
	    }
	});


	if (!L.Edit) {
	    // Leaflet.Draw not available.
	    return;
	}


	L.Handler.PolylineSnap = L.Edit.Poly.extend({

	    initialize: function (map, poly, options) {
	        var that = this;

	        L.Edit.Poly.prototype.initialize.call(this, poly, options);
	        this._snapper = new L.Handler.MarkerSnap(map, options);
	        poly.on('remove', function() {
	            that.disable();
	        });
	    },

	    addGuideLayer: function (layer) {
	        this._snapper.addGuideLayer(layer);
	    },
	    
	    _initHandlers: function () {
	        this._verticesHandlers = [];
	        for (var i = 0; i < this.latlngs.length; i++) {
	            this._verticesHandlers.push(new L.Edit.PolyVerticesEditSnap(this._poly, this.latlngs[i], this.options));
	        }
	    }
	});

	L.Edit.PolyVerticesEditSnap = L.Edit.PolyVerticesEdit.extend({
	    _createMarker: function (latlng, index) {
	               var marker = L.Edit.PolyVerticesEdit.prototype._createMarker.call(this, latlng, index);

	        // Treat middle markers differently
	        var isMiddle = index === undefined;
	        if (isMiddle) {
	            // Snap middle markers, only once they were touched
	            marker.on('dragstart', function () {
	                this._poly.snapediting._snapper.watchMarker(marker);
	            }, this);
	        }
	        else {
	            this._poly.snapediting._snapper.watchMarker(marker);
	        }
	        return marker;
	    }
	});

	L.EditToolbar.SnapEdit = L.EditToolbar.Edit.extend({
	    snapOptions: {
	        snapDistance: 15, // in pixels
	        snapVertices: true
	    },

	    initialize: function(map, options) {
	        L.EditToolbar.Edit.prototype.initialize.call(this, map, options);

	        if (options.snapOptions) {
	            L.Util.extend(this.snapOptions, options.snapOptions);
	        }

	        if (Array.isArray(this.snapOptions.guideLayers)) {
	            this._guideLayers = this.snapOptions.guideLayers;
	        } else if (options.guideLayers instanceof L.LayerGroup) {
	            this._guideLayers = this.snapOptions.guideLayers.getLayers();
	        } else {
	            this._guideLayers = [];
	        }
	    },

	    addGuideLayer: function(layer) {
	        var index = this._guideLayers.findIndex(function(guideLayer) {
	            return L.stamp(layer) === L.stamp(guideLayer);
	        });

	        if (index === -1) {
	            this._guideLayers.push(layer);
	            this._featureGroup.eachLayer(function(layer) {
	                if (layer.snapediting) { layer.snapediting._guides.push(layer); }
	            });
	        }
	    },

	    removeGuideLayer: function(layer) {
	      var index = this._guideLayers.findIndex(function(guideLayer) {
	          return L.stamp(layer) === L.stamp(guideLayer);
	      });

	      if (index !== -1) {
	          this._guideLayers.splice(index, 1);
	          this._featureGroup.eachLayer(function(layer) {
	              if (layer.snapediting) { layer.snapediting._guides.splice(index, 1); }
	          });
	      }
	    },

	    clearGuideLayers: function() {
	        this._guideLayers = [];
	        this._featureGroup.eachLayer(function(layer) {
	            if (layer.snapediting) { layer.snapediting._guides = []; }
	        });
	    },

	    _enableLayerEdit: function(e) {
	        L.EditToolbar.Edit.prototype._enableLayerEdit.call(this, e);

	        var layer = e.layer || e.target || e;

	        if (!layer.snapediting) {
	            if (layer.getLatLng) {
	                layer.snapediting = new L.Handler.MarkerSnap(layer._map, layer, this.snapOptions);
	            } else {
	                if (layer.editing) {
	                  layer.editing._verticesHandlers[0]._markerGroup.clearLayers();
	                  delete layer.editing;
	                }

	                layer.editing = layer.snapediting = new L.Handler.PolylineSnap(layer._map, layer, this.snapOptions);
	            }

	            for (var i = 0, n = this._guideLayers.length; i < n; i++) {
	                layer.snapediting.addGuideLayer(this._guideLayers[i]);
	            }
	        }

	        layer.snapediting.enable();
	    }
	});

	L.Draw.Feature.SnapMixin = {
	    _snap_initialize: function () {
	        this.on('enabled', this._snap_on_enabled, this);
	        this.on('disabled', this._snap_on_disabled, this);
	    },

	    _snap_on_enabled: function () {
	        if (!this.options.guideLayers) {
	            return;
	        }

	        if (!this._mouseMarker) {
	            this._map.on('layeradd', this._snap_on_enabled, this);
	            return;
	        }else{
	            this._map.off('layeradd', this._snap_on_enabled, this);
	        }

	        if (!this._snapper) {
	            this._snapper = new L.Handler.MarkerSnap(this._map);
	            if (this.options.snapDistance) {
	                this._snapper.options.snapDistance = this.options.snapDistance;
	            }
	            if (this.options.snapVertices) {
	                this._snapper.options.snapVertices = this.options.snapVertices;
	            }
	        }

	        for (var i=0, n=this.options.guideLayers.length; i<n; i++)
	            this._snapper.addGuideLayer(this.options.guideLayers[i]);

	        var marker = this._mouseMarker;

	        this._snapper.watchMarker(marker);

	        // Show marker when (snap for user feedback)
	        var icon = marker.options.icon;
	        marker.on('snap', function (e) {
	                  marker.setIcon(this.options.icon);
	                  marker.setOpacity(1);
	              }, this)
	              .on('unsnap', function (e) {
	                  marker.setIcon(icon);
	                  marker.setOpacity(0);
	              }, this);

	        marker.on('click', this._snap_on_click, this);
	    },

	    _snap_on_click: function (e) {
	        if (this._markers) {
	            var markerCount = this._markers.length,
	                marker = this._markers[markerCount - 1];
	            if (this._mouseMarker.snap) {
	                if(e){
	                  // update the feature being drawn to reflect the snapped location:
	                  marker.setLatLng(e.target._latlng);
	                  if(this._poly){
	                    var polyPointsCount = this._poly._latlngs.length;
	                    this._poly._latlngs[polyPointsCount - 1] = e.target._latlng;
	                    this._poly.redraw();
	                  }
	                }

	                L.DomUtil.addClass(marker._icon, 'marker-snapped');
	            }
	        }
	    },

	    _snap_on_disabled: function () {
	        delete this._snapper;
	    },
	};

	L.Draw.Feature.include(L.Draw.Feature.SnapMixin);
	L.Draw.Feature.addInitHook('_snap_initialize');

	})();


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;'use strict';
	(function (factory, window) {
	    /*globals define, module, require*/

	    // define an AMD module that relies on 'leaflet'
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


	    // define a Common JS module that relies on 'leaflet'
	    } else if (typeof exports === 'object') {
	        module.exports = factory(require('leaflet'));
	    }

	    // attach your plugin to the global 'L' variable
	    if(typeof window !== 'undefined' && window.L){
	        factory(window.L);
	    }

	}(function (L) {
	    // 🍂miniclass CancelableEvent (Event objects)
	    // 🍂method cancel()
	    // Cancel any subsequent action.

	    // 🍂miniclass VertexEvent (Event objects)
	    // 🍂property vertex: VertexMarker
	    // The vertex that fires the event.

	    // 🍂miniclass ShapeEvent (Event objects)
	    // 🍂property shape: Array
	    // The shape (LatLngs array) subject of the action.

	    // 🍂miniclass CancelableVertexEvent (Event objects)
	    // 🍂inherits VertexEvent
	    // 🍂inherits CancelableEvent

	    // 🍂miniclass CancelableShapeEvent (Event objects)
	    // 🍂inherits ShapeEvent
	    // 🍂inherits CancelableEvent

	    // 🍂miniclass LayerEvent (Event objects)
	    // 🍂property layer: object
	    // The Layer (Marker, Polyline…) subject of the action.

	    // 🍂namespace Editable; 🍂class Editable; 🍂aka L.Editable
	    // Main edition handler. By default, it is attached to the map
	    // as `map.editTools` property.
	    // Leaflet.Editable is made to be fully extendable. You have three ways to customize
	    // the behaviour: using options, listening to events, or extending.
	    L.Editable = L.Evented.extend({

	        statics: {
	            FORWARD: 1,
	            BACKWARD: -1
	        },

	        options: {

	            // You can pass them when creating a map using the `editOptions` key.
	            // 🍂option zIndex: int = 1000
	            // The default zIndex of the editing tools.
	            zIndex: 1000,

	            // 🍂option polygonClass: class = L.Polygon
	            // Class to be used when creating a new Polygon.
	            polygonClass: L.Polygon,

	            // 🍂option polylineClass: class = L.Polyline
	            // Class to be used when creating a new Polyline.
	            polylineClass: L.Polyline,

	            // 🍂option markerClass: class = L.Marker
	            // Class to be used when creating a new Marker.
	            markerClass: L.Marker,

	            // 🍂option rectangleClass: class = L.Rectangle
	            // Class to be used when creating a new Rectangle.
	            rectangleClass: L.Rectangle,

	            // 🍂option circleClass: class = L.Circle
	            // Class to be used when creating a new Circle.
	            circleClass: L.Circle,

	            // 🍂option drawingCSSClass: string = 'leaflet-editable-drawing'
	            // CSS class to be added to the map container while drawing.
	            drawingCSSClass: 'leaflet-editable-drawing',

	            // 🍂option drawingCursor: const = 'crosshair'
	            // Cursor mode set to the map while drawing.
	            drawingCursor: 'crosshair',

	            // 🍂option editLayer: Layer = new L.LayerGroup()
	            // Layer used to store edit tools (vertex, line guide…).
	            editLayer: undefined,

	            // 🍂option featuresLayer: Layer = new L.LayerGroup()
	            // Default layer used to store drawn features (Marker, Polyline…).
	            featuresLayer: undefined,

	            // 🍂option polylineEditorClass: class = PolylineEditor
	            // Class to be used as Polyline editor.
	            polylineEditorClass: undefined,

	            // 🍂option polygonEditorClass: class = PolygonEditor
	            // Class to be used as Polygon editor.
	            polygonEditorClass: undefined,

	            // 🍂option markerEditorClass: class = MarkerEditor
	            // Class to be used as Marker editor.
	            markerEditorClass: undefined,

	            // 🍂option rectangleEditorClass: class = RectangleEditor
	            // Class to be used as Rectangle editor.
	            rectangleEditorClass: undefined,

	            // 🍂option circleEditorClass: class = CircleEditor
	            // Class to be used as Circle editor.
	            circleEditorClass: undefined,

	            // 🍂option lineGuideOptions: hash = {}
	            // Options to be passed to the line guides.
	            lineGuideOptions: {},

	            // 🍂option skipMiddleMarkers: boolean = false
	            // Set this to true if you don't want middle markers.
	            skipMiddleMarkers: false

	        },

	        initialize: function (map, options) {
	            L.setOptions(this, options);
	            this._lastZIndex = this.options.zIndex;
	            this.map = map;
	            this.editLayer = this.createEditLayer();
	            this.featuresLayer = this.createFeaturesLayer();
	            this.forwardLineGuide = this.createLineGuide();
	            this.backwardLineGuide = this.createLineGuide();
	        },

	        fireAndForward: function (type, e) {
	            e = e || {};
	            e.editTools = this;
	            this.fire(type, e);
	            this.map.fire(type, e);
	        },

	        createLineGuide: function () {
	            var options = L.extend({dashArray: '5,10', weight: 1, interactive: false}, this.options.lineGuideOptions);
	            return L.polyline([], options);
	        },

	        createVertexIcon: function (options) {
	            return L.Browser.touch ? new L.Editable.TouchVertexIcon(options) : new L.Editable.VertexIcon(options);
	        },

	        createEditLayer: function () {
	            return this.options.editLayer || new L.LayerGroup().addTo(this.map);
	        },

	        createFeaturesLayer: function () {
	            return this.options.featuresLayer || new L.LayerGroup().addTo(this.map);
	        },

	        moveForwardLineGuide: function (latlng) {
	            if (this.forwardLineGuide._latlngs.length) {
	                this.forwardLineGuide._latlngs[1] = latlng;
	                this.forwardLineGuide._bounds.extend(latlng);
	                this.forwardLineGuide.redraw();
	            }
	        },

	        moveBackwardLineGuide: function (latlng) {
	            if (this.backwardLineGuide._latlngs.length) {
	                this.backwardLineGuide._latlngs[1] = latlng;
	                this.backwardLineGuide._bounds.extend(latlng);
	                this.backwardLineGuide.redraw();
	            }
	        },

	        anchorForwardLineGuide: function (latlng) {
	            this.forwardLineGuide._latlngs[0] = latlng;
	            this.forwardLineGuide._bounds.extend(latlng);
	            this.forwardLineGuide.redraw();
	        },

	        anchorBackwardLineGuide: function (latlng) {
	            this.backwardLineGuide._latlngs[0] = latlng;
	            this.backwardLineGuide._bounds.extend(latlng);
	            this.backwardLineGuide.redraw();
	        },

	        attachForwardLineGuide: function () {
	            this.editLayer.addLayer(this.forwardLineGuide);
	        },

	        attachBackwardLineGuide: function () {
	            this.editLayer.addLayer(this.backwardLineGuide);
	        },

	        detachForwardLineGuide: function () {
	            this.forwardLineGuide.setLatLngs([]);
	            this.editLayer.removeLayer(this.forwardLineGuide);
	        },

	        detachBackwardLineGuide: function () {
	            this.backwardLineGuide.setLatLngs([]);
	            this.editLayer.removeLayer(this.backwardLineGuide);
	        },

	        blockEvents: function () {
	            // Hack: force map not to listen to other layers events while drawing.
	            if (!this._oldTargets) {
	                this._oldTargets = this.map._targets;
	                this.map._targets = {};
	            }
	        },

	        unblockEvents: function () {
	            if (this._oldTargets) {
	                // Reset, but keep targets created while drawing.
	                this.map._targets = L.extend(this.map._targets, this._oldTargets);
	                delete this._oldTargets;
	            }
	        },

	        registerForDrawing: function (editor) {
	            if (this._drawingEditor) this.unregisterForDrawing(this._drawingEditor);
	            this.blockEvents();
	            editor.reset();  // Make sure editor tools still receive events.
	            this._drawingEditor = editor;
	            this.map.on('mousemove touchmove', editor.onDrawingMouseMove, editor);
	            this.map.on('mousedown', this.onMousedown, this);
	            this.map.on('mouseup', this.onMouseup, this);
	            L.DomUtil.addClass(this.map._container, this.options.drawingCSSClass);
	            this.defaultMapCursor = this.map._container.style.cursor;
	            this.map._container.style.cursor = this.options.drawingCursor;
	        },

	        unregisterForDrawing: function (editor) {
	            this.unblockEvents();
	            L.DomUtil.removeClass(this.map._container, this.options.drawingCSSClass);
	            this.map._container.style.cursor = this.defaultMapCursor;
	            editor = editor || this._drawingEditor;
	            if (!editor) return;
	            this.map.off('mousemove touchmove', editor.onDrawingMouseMove, editor);
	            this.map.off('mousedown', this.onMousedown, this);
	            this.map.off('mouseup', this.onMouseup, this);
	            if (editor !== this._drawingEditor) return;
	            delete this._drawingEditor;
	            if (editor._drawing) editor.cancelDrawing();
	        },

	        onMousedown: function (e) {
	            this._mouseDown = e;
	            this._drawingEditor.onDrawingMouseDown(e);
	        },

	        onMouseup: function (e) {
	            if (this._mouseDown) {
	                var editor = this._drawingEditor,
	                    mouseDown = this._mouseDown;
	                this._mouseDown = null;
	                editor.onDrawingMouseUp(e);
	                if (this._drawingEditor !== editor) return;  // onDrawingMouseUp may call unregisterFromDrawing.
	                var origin = L.point(mouseDown.originalEvent.clientX, mouseDown.originalEvent.clientY);
	                var distance = L.point(e.originalEvent.clientX, e.originalEvent.clientY).distanceTo(origin);
	                if (Math.abs(distance) < 9 * (window.devicePixelRatio || 1)) this._drawingEditor.onDrawingClick(e);
	            }
	        },

	        // 🍂section Public methods
	        // You will generally access them by the `map.editTools`
	        // instance:
	        //
	        // `map.editTools.startPolyline();`

	        // 🍂method drawing(): boolean
	        // Return true if any drawing action is ongoing.
	        drawing: function () {
	            return this._drawingEditor && this._drawingEditor.drawing();
	        },

	        // 🍂method stopDrawing()
	        // When you need to stop any ongoing drawing, without needing to know which editor is active.
	        stopDrawing: function () {
	            this.unregisterForDrawing();
	        },

	        // 🍂method commitDrawing()
	        // When you need to commit any ongoing drawing, without needing to know which editor is active.
	        commitDrawing: function (e) {
	            if (!this._drawingEditor) return;
	            this._drawingEditor.commitDrawing(e);
	        },

	        connectCreatedToMap: function (layer) {
	            return this.featuresLayer.addLayer(layer);
	        },

	        // 🍂method startPolyline(latlng: L.LatLng, options: hash): L.Polyline
	        // Start drawing a Polyline. If `latlng` is given, a first point will be added. In any case, continuing on user click.
	        // If `options` is given, it will be passed to the Polyline class constructor.
	        startPolyline: function (latlng, options) {
	            var line = this.createPolyline([], options);
	            line.enableEdit(this.map).newShape(latlng);
	            return line;
	        },

	        // 🍂method startPolygon(latlng: L.LatLng, options: hash): L.Polygon
	        // Start drawing a Polygon. If `latlng` is given, a first point will be added. In any case, continuing on user click.
	        // If `options` is given, it will be passed to the Polygon class constructor.
	        startPolygon: function (latlng, options) {
	            var polygon = this.createPolygon([], options);
	            polygon.enableEdit(this.map).newShape(latlng);
	            return polygon;
	        },

	        // 🍂method startMarker(latlng: L.LatLng, options: hash): L.Marker
	        // Start adding a Marker. If `latlng` is given, the Marker will be shown first at this point.
	        // In any case, it will follow the user mouse, and will have a final `latlng` on next click (or touch).
	        // If `options` is given, it will be passed to the Marker class constructor.
	        startMarker: function (latlng, options) {
	            latlng = latlng || this.map.getCenter().clone();
	            var marker = this.createMarker(latlng, options);
	            marker.enableEdit(this.map).startDrawing();
	            return marker;
	        },

	        // 🍂method startRectangle(latlng: L.LatLng, options: hash): L.Rectangle
	        // Start drawing a Rectangle. If `latlng` is given, the Rectangle anchor will be added. In any case, continuing on user drag.
	        // If `options` is given, it will be passed to the Rectangle class constructor.
	        startRectangle: function(latlng, options) {
	            var corner = latlng || L.latLng([0, 0]);
	            var bounds = new L.LatLngBounds(corner, corner);
	            var rectangle = this.createRectangle(bounds, options);
	            rectangle.enableEdit(this.map).startDrawing();
	            return rectangle;
	        },

	        // 🍂method startCircle(latlng: L.LatLng, options: hash): L.Circle
	        // Start drawing a Circle. If `latlng` is given, the Circle anchor will be added. In any case, continuing on user drag.
	        // If `options` is given, it will be passed to the Circle class constructor.
	        startCircle: function (latlng, options) {
	            latlng = latlng || this.map.getCenter().clone();
	            var circle = this.createCircle(latlng, options);
	            circle.enableEdit(this.map).startDrawing();
	            return circle;
	        },

	        startHole: function (editor, latlng) {
	            editor.newHole(latlng);
	        },

	        createLayer: function (klass, latlngs, options) {
	            options = L.Util.extend({editOptions: {editTools: this}}, options);
	            var layer = new klass(latlngs, options);
	            // 🍂namespace Editable
	            // 🍂event editable:created: LayerEvent
	            // Fired when a new feature (Marker, Polyline…) is created.
	            this.fireAndForward('editable:created', {layer: layer});
	            return layer;
	        },

	        createPolyline: function (latlngs, options) {
	            return this.createLayer(options && options.polylineClass || this.options.polylineClass, latlngs, options);
	        },

	        createPolygon: function (latlngs, options) {
	            return this.createLayer(options && options.polygonClass || this.options.polygonClass, latlngs, options);
	        },

	        createMarker: function (latlng, options) {
	            return this.createLayer(options && options.markerClass || this.options.markerClass, latlng, options);
	        },

	        createRectangle: function (bounds, options) {
	            return this.createLayer(options && options.rectangleClass || this.options.rectangleClass, bounds, options);
	        },

	        createCircle: function (latlng, options) {
	            return this.createLayer(options && options.circleClass || this.options.circleClass, latlng, options);
	        }

	    });

	    L.extend(L.Editable, {

	        makeCancellable: function (e) {
	            e.cancel = function () {
	                e._cancelled = true;
	            };
	        }

	    });

	    // 🍂namespace Map; 🍂class Map
	    // Leaflet.Editable add options and events to the `L.Map` object.
	    // See `Editable` events for the list of events fired on the Map.
	    // 🍂example
	    //
	    // ```js
	    // var map = L.map('map', {
	    //  editable: true,
	    //  editOptions: {
	    //    …
	    // }
	    // });
	    // ```
	    // 🍂section Editable Map Options
	    L.Map.mergeOptions({

	        // 🍂namespace Map
	        // 🍂section Map Options
	        // 🍂option editToolsClass: class = L.Editable
	        // Class to be used as vertex, for path editing.
	        editToolsClass: L.Editable,

	        // 🍂option editable: boolean = false
	        // Whether to create a L.Editable instance at map init.
	        editable: false,

	        // 🍂option editOptions: hash = {}
	        // Options to pass to L.Editable when instanciating.
	        editOptions: {}

	    });

	    L.Map.addInitHook(function () {

	        this.whenReady(function () {
	            if (this.options.editable) {
	                this.editTools = new this.options.editToolsClass(this, this.options.editOptions);
	            }
	        });

	    });

	    L.Editable.VertexIcon = L.DivIcon.extend({

	        options: {
	            iconSize: new L.Point(8, 8)
	        }

	    });

	    L.Editable.TouchVertexIcon = L.Editable.VertexIcon.extend({

	        options: {
	            iconSize: new L.Point(20, 20)
	        }

	    });


	    // 🍂namespace Editable; 🍂class VertexMarker; Handler for dragging path vertices.
	    L.Editable.VertexMarker = L.Marker.extend({

	        options: {
	            draggable: true,
	            className: 'leaflet-div-icon leaflet-vertex-icon'
	        },


	        // 🍂section Public methods
	        // The marker used to handle path vertex. You will usually interact with a `VertexMarker`
	        // instance when listening for events like `editable:vertex:ctrlclick`.

	        initialize: function (latlng, latlngs, editor, options) {
	            // We don't use this._latlng, because on drag Leaflet replace it while
	            // we want to keep reference.
	            this.latlng = latlng;
	            this.latlngs = latlngs;
	            this.editor = editor;
	            L.Marker.prototype.initialize.call(this, latlng, options);
	            this.options.icon = this.editor.tools.createVertexIcon({className: this.options.className});
	            this.latlng.__vertex = this;
	            this.editor.editLayer.addLayer(this);
	            this.setZIndexOffset(editor.tools._lastZIndex + 1);
	        },

	        onAdd: function (map) {
	            L.Marker.prototype.onAdd.call(this, map);
	            this.on('drag', this.onDrag);
	            this.on('dragstart', this.onDragStart);
	            this.on('dragend', this.onDragEnd);
	            this.on('mouseup', this.onMouseup);
	            this.on('click', this.onClick);
	            this.on('contextmenu', this.onContextMenu);
	            this.on('mousedown touchstart', this.onMouseDown);
	            this.addMiddleMarkers();
	        },

	        onRemove: function (map) {
	            if (this.middleMarker) this.middleMarker.delete();
	            delete this.latlng.__vertex;
	            this.off('drag', this.onDrag);
	            this.off('dragstart', this.onDragStart);
	            this.off('dragend', this.onDragEnd);
	            this.off('mouseup', this.onMouseup);
	            this.off('click', this.onClick);
	            this.off('contextmenu', this.onContextMenu);
	            this.off('mousedown touchstart', this.onMouseDown);
	            L.Marker.prototype.onRemove.call(this, map);
	        },

	        onDrag: function (e) {
	            e.vertex = this;
	            this.editor.onVertexMarkerDrag(e);
	            var iconPos = L.DomUtil.getPosition(this._icon),
	                latlng = this._map.layerPointToLatLng(iconPos);
	            this.latlng.update(latlng);
	            this._latlng = this.latlng;  // Push back to Leaflet our reference.
	            this.editor.refresh();
	            if (this.middleMarker) this.middleMarker.updateLatLng();
	            var next = this.getNext();
	            if (next && next.middleMarker) next.middleMarker.updateLatLng();
	        },

	        onDragStart: function (e) {
	            e.vertex = this;
	            this.editor.onVertexMarkerDragStart(e);
	        },

	        onDragEnd: function (e) {
	            e.vertex = this;
	            this.editor.onVertexMarkerDragEnd(e);
	        },

	        onClick: function (e) {
	            e.vertex = this;
	            this.editor.onVertexMarkerClick(e);
	        },

	        onMouseup: function (e) {
	            L.DomEvent.stop(e);
	            e.vertex = this;
	            this.editor.map.fire('mouseup', e);
	        },

	        onContextMenu: function (e) {
	            e.vertex = this;
	            this.editor.onVertexMarkerContextMenu(e);
	        },

	        onMouseDown: function (e) {
	            e.vertex = this;
	            this.editor.onVertexMarkerMouseDown(e);
	        },

	        // 🍂method delete()
	        // Delete a vertex and the related LatLng.
	        delete: function () {
	            var next = this.getNext();  // Compute before changing latlng
	            this.latlngs.splice(this.getIndex(), 1);
	            this.editor.editLayer.removeLayer(this);
	            this.editor.onVertexDeleted({latlng: this.latlng, vertex: this});
	            if (!this.latlngs.length) this.editor.deleteShape(this.latlngs);
	            if (next) next.resetMiddleMarker();
	            this.editor.refresh();
	        },

	        // 🍂method getIndex(): int
	        // Get the index of the current vertex among others of the same LatLngs group.
	        getIndex: function () {
	            return this.latlngs.indexOf(this.latlng);
	        },

	        // 🍂method getLastIndex(): int
	        // Get last vertex index of the LatLngs group of the current vertex.
	        getLastIndex: function () {
	            return this.latlngs.length - 1;
	        },

	        // 🍂method getPrevious(): VertexMarker
	        // Get the previous VertexMarker in the same LatLngs group.
	        getPrevious: function () {
	            if (this.latlngs.length < 2) return;
	            var index = this.getIndex(),
	                previousIndex = index - 1;
	            if (index === 0 && this.editor.CLOSED) previousIndex = this.getLastIndex();
	            var previous = this.latlngs[previousIndex];
	            if (previous) return previous.__vertex;
	        },

	        // 🍂method getNext(): VertexMarker
	        // Get the next VertexMarker in the same LatLngs group.
	        getNext: function () {
	            if (this.latlngs.length < 2) return;
	            var index = this.getIndex(),
	                nextIndex = index + 1;
	            if (index === this.getLastIndex() && this.editor.CLOSED) nextIndex = 0;
	            var next = this.latlngs[nextIndex];
	            if (next) return next.__vertex;
	        },

	        addMiddleMarker: function (previous) {
	            if (!this.editor.hasMiddleMarkers()) return;
	            previous = previous || this.getPrevious();
	            if (previous && !this.middleMarker) this.middleMarker = this.editor.addMiddleMarker(previous, this, this.latlngs, this.editor);
	        },

	        addMiddleMarkers: function () {
	            if (!this.editor.hasMiddleMarkers()) return;
	            var previous = this.getPrevious();
	            if (previous) this.addMiddleMarker(previous);
	            var next = this.getNext();
	            if (next) next.resetMiddleMarker();
	        },

	        resetMiddleMarker: function () {
	            if (this.middleMarker) this.middleMarker.delete();
	            this.addMiddleMarker();
	        },

	        // 🍂method split()
	        // Split the vertex LatLngs group at its index, if possible.
	        split: function () {
	            if (!this.editor.splitShape) return;  // Only for PolylineEditor
	            this.editor.splitShape(this.latlngs, this.getIndex());
	        },

	        // 🍂method continue()
	        // Continue the vertex LatLngs from this vertex. Only active for first and last vertices of a Polyline.
	        continue: function () {
	            if (!this.editor.continueBackward) return;  // Only for PolylineEditor
	            var index = this.getIndex();
	            if (index === 0) this.editor.continueBackward(this.latlngs);
	            else if (index === this.getLastIndex()) this.editor.continueForward(this.latlngs);
	        }

	    });

	    L.Editable.mergeOptions({

	        // 🍂namespace Editable
	        // 🍂option vertexMarkerClass: class = VertexMarker
	        // Class to be used as vertex, for path editing.
	        vertexMarkerClass: L.Editable.VertexMarker

	    });

	    L.Editable.MiddleMarker = L.Marker.extend({

	        options: {
	            opacity: 0.5,
	            className: 'leaflet-div-icon leaflet-middle-icon',
	            draggable: true
	        },

	        initialize: function (left, right, latlngs, editor, options) {
	            this.left = left;
	            this.right = right;
	            this.editor = editor;
	            this.latlngs = latlngs;
	            L.Marker.prototype.initialize.call(this, this.computeLatLng(), options);
	            this._opacity = this.options.opacity;
	            this.options.icon = this.editor.tools.createVertexIcon({className: this.options.className});
	            this.editor.editLayer.addLayer(this);
	            this.setVisibility();
	        },

	        setVisibility: function () {
	            var leftPoint = this._map.latLngToContainerPoint(this.left.latlng),
	                rightPoint = this._map.latLngToContainerPoint(this.right.latlng),
	                size = L.point(this.options.icon.options.iconSize);
	            if (leftPoint.distanceTo(rightPoint) < size.x * 3) this.hide();
	            else this.show();
	        },

	        show: function () {
	            this.setOpacity(this._opacity);
	        },

	        hide: function () {
	            this.setOpacity(0);
	        },

	        updateLatLng: function () {
	            this.setLatLng(this.computeLatLng());
	            this.setVisibility();
	        },

	        computeLatLng: function () {
	            var leftPoint = this.editor.map.latLngToContainerPoint(this.left.latlng),
	                rightPoint = this.editor.map.latLngToContainerPoint(this.right.latlng),
	                y = (leftPoint.y + rightPoint.y) / 2,
	                x = (leftPoint.x + rightPoint.x) / 2;
	            return this.editor.map.containerPointToLatLng([x, y]);
	        },

	        onAdd: function (map) {
	            L.Marker.prototype.onAdd.call(this, map);
	            L.DomEvent.on(this._icon, 'mousedown touchstart', this.onMouseDown, this);
	            map.on('zoomend', this.setVisibility, this);
	        },

	        onRemove: function (map) {
	            delete this.right.middleMarker;
	            L.DomEvent.off(this._icon, 'mousedown touchstart', this.onMouseDown, this);
	            map.off('zoomend', this.setVisibility, this);
	            L.Marker.prototype.onRemove.call(this, map);
	        },

	        onMouseDown: function (e) {
	            var iconPos = L.DomUtil.getPosition(this._icon),
	                latlng = this.editor.map.layerPointToLatLng(iconPos);
	            e = {
	                originalEvent: e,
	                latlng: latlng
	            };
	            if (this.options.opacity === 0) return;
	            L.Editable.makeCancellable(e);
	            this.editor.onMiddleMarkerMouseDown(e);
	            if (e._cancelled) return;
	            this.latlngs.splice(this.index(), 0, e.latlng);
	            this.editor.refresh();
	            var icon = this._icon;
	            var marker = this.editor.addVertexMarker(e.latlng, this.latlngs);
	            /* Hack to workaround browser not firing touchend when element is no more on DOM */
	            var parent = marker._icon.parentNode;
	            parent.removeChild(marker._icon);
	            marker._icon = icon;
	            parent.appendChild(marker._icon);
	            marker._initIcon();
	            marker._initInteraction();
	            marker.setOpacity(1);
	            /* End hack */
	            // Transfer ongoing dragging to real marker
	            L.Draggable._dragging = false;
	            marker.dragging._draggable._onDown(e.originalEvent);
	            this.delete();
	        },

	        delete: function () {
	            this.editor.editLayer.removeLayer(this);
	        },

	        index: function () {
	            return this.latlngs.indexOf(this.right.latlng);
	        }

	    });

	    L.Editable.mergeOptions({

	        // 🍂namespace Editable
	        // 🍂option middleMarkerClass: class = VertexMarker
	        // Class to be used as middle vertex, pulled by the user to create a new point in the middle of a path.
	        middleMarkerClass: L.Editable.MiddleMarker

	    });

	    // 🍂namespace Editable; 🍂class BaseEditor; 🍂aka L.Editable.BaseEditor
	    // When editing a feature (Marker, Polyline…), an editor is attached to it. This
	    // editor basically knows how to handle the edition.
	    L.Editable.BaseEditor = L.Handler.extend({

	        initialize: function (map, feature, options) {
	            L.setOptions(this, options);
	            this.map = map;
	            this.feature = feature;
	            this.feature.editor = this;
	            this.editLayer = new L.LayerGroup();
	            this.tools = this.options.editTools || map.editTools;
	        },

	        // 🍂method enable(): this
	        // Set up the drawing tools for the feature to be editable.
	        addHooks: function () {
	            if (this.isConnected()) this.onFeatureAdd();
	            else this.feature.once('add', this.onFeatureAdd, this);
	            this.onEnable();
	            this.feature.on(this._getEvents(), this);
	            return;
	        },

	        // 🍂method disable(): this
	        // Remove the drawing tools for the feature.
	        removeHooks: function () {
	            this.feature.off(this._getEvents(), this);
	            if (this.feature.dragging) this.feature.dragging.disable();
	            this.editLayer.clearLayers();
	            this.tools.editLayer.removeLayer(this.editLayer);
	            this.onDisable();
	            if (this._drawing) this.cancelDrawing();
	            return;
	        },

	        // 🍂method drawing(): boolean
	        // Return true if any drawing action is ongoing with this editor.
	        drawing: function () {
	            return !!this._drawing;
	        },

	        reset: function () {},

	        onFeatureAdd: function () {
	            this.tools.editLayer.addLayer(this.editLayer);
	            if (this.feature.dragging) this.feature.dragging.enable();
	        },

	        hasMiddleMarkers: function () {
	            return !this.options.skipMiddleMarkers && !this.tools.options.skipMiddleMarkers;
	        },

	        fireAndForward: function (type, e) {
	            e = e || {};
	            e.layer = this.feature;
	            this.feature.fire(type, e);
	            this.tools.fireAndForward(type, e);
	        },

	        onEnable: function () {
	            // 🍂namespace Editable
	            // 🍂event editable:enable: Event
	            // Fired when an existing feature is ready to be edited.
	            this.fireAndForward('editable:enable');
	        },

	        onDisable: function () {
	            // 🍂namespace Editable
	            // 🍂event editable:disable: Event
	            // Fired when an existing feature is not ready anymore to be edited.
	            this.fireAndForward('editable:disable');
	        },

	        onEditing: function () {
	            // 🍂namespace Editable
	            // 🍂event editable:editing: Event
	            // Fired as soon as any change is made to the feature geometry.
	            this.fireAndForward('editable:editing');
	        },

	        onStartDrawing: function () {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:start: Event
	            // Fired when a feature is to be drawn.
	            this.fireAndForward('editable:drawing:start');
	        },

	        onEndDrawing: function () {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:end: Event
	            // Fired when a feature is not drawn anymore.
	            this.fireAndForward('editable:drawing:end');
	        },

	        onCancelDrawing: function () {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:cancel: Event
	            // Fired when user cancel drawing while a feature is being drawn.
	            this.fireAndForward('editable:drawing:cancel');
	        },

	        onCommitDrawing: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:commit: Event
	            // Fired when user finish drawing a feature.
	            this.fireAndForward('editable:drawing:commit', e);
	        },

	        onDrawingMouseDown: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:mousedown: Event
	            // Fired when user `mousedown` while drawing.
	            this.fireAndForward('editable:drawing:mousedown', e);
	        },

	        onDrawingMouseUp: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:mouseup: Event
	            // Fired when user `mouseup` while drawing.
	            this.fireAndForward('editable:drawing:mouseup', e);
	        },

	        startDrawing: function () {
	            if (!this._drawing) this._drawing = L.Editable.FORWARD;
	            this.tools.registerForDrawing(this);
	            this.onStartDrawing();
	        },

	        commitDrawing: function (e) {
	            this.onCommitDrawing(e);
	            this.endDrawing();
	        },

	        cancelDrawing: function () {
	            // If called during a vertex drag, the vertex will be removed before
	            // the mouseup fires on it. This is a workaround. Maybe better fix is
	            // To have L.Draggable reset it's status on disable (Leaflet side).
	            L.Draggable._dragging = false;
	            this.onCancelDrawing();
	            this.endDrawing();
	        },

	        endDrawing: function () {
	            this._drawing = false;
	            this.tools.unregisterForDrawing(this);
	            this.onEndDrawing();
	        },

	        onDrawingClick: function (e) {
	            if (!this.drawing()) return;
	            L.Editable.makeCancellable(e);
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:click: CancelableEvent
	            // Fired when user `click` while drawing, before any internal action is being processed.
	            this.fireAndForward('editable:drawing:click', e);
	            if (e._cancelled) return;
	            if (!this.isConnected()) this.connect(e);
	            this.processDrawingClick(e);
	        },

	        isConnected: function () {
	            return this.map.hasLayer(this.feature);
	        },

	        connect: function (e) {
	            this.tools.connectCreatedToMap(this.feature);
	            this.tools.editLayer.addLayer(this.editLayer);
	        },

	        onMove: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:move: Event
	            // Fired when `move` mouse while drawing, while dragging a marker, and while dragging a vertex.
	            this.fireAndForward('editable:drawing:move', e);
	        },

	        onDrawingMouseMove: function (e) {
	            this.onMove(e);
	        },

	        _getEvents: function () {
	            return {
	                dragstart: this.onDragStart,
	                drag: this.onDrag,
	                dragend: this.onDragEnd,
	                remove: this.disable
	            };
	        },

	        onDragStart: function (e) {
	            this.onEditing();
	            // 🍂namespace Editable
	            // 🍂event editable:dragstart: Event
	            // Fired before a path feature is dragged.
	            this.fireAndForward('editable:dragstart', e);
	        },

	        onDrag: function (e) {
	            this.onMove(e);
	            // 🍂namespace Editable
	            // 🍂event editable:drag: Event
	            // Fired when a path feature is being dragged.
	            this.fireAndForward('editable:drag', e);
	        },

	        onDragEnd: function (e) {
	            // 🍂namespace Editable
	            // 🍂event editable:dragend: Event
	            // Fired after a path feature has been dragged.
	            this.fireAndForward('editable:dragend', e);
	        }

	    });

	    // 🍂namespace Editable; 🍂class MarkerEditor; 🍂aka L.Editable.MarkerEditor
	    // 🍂inherits BaseEditor
	    // Editor for Marker.
	    L.Editable.MarkerEditor = L.Editable.BaseEditor.extend({

	        onDrawingMouseMove: function (e) {
	            L.Editable.BaseEditor.prototype.onDrawingMouseMove.call(this, e);
	            if (this._drawing) this.feature.setLatLng(e.latlng);
	        },

	        processDrawingClick: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Drawing events
	            // 🍂event editable:drawing:clicked: Event
	            // Fired when user `click` while drawing, after all internal actions.
	            this.fireAndForward('editable:drawing:clicked', e);
	            this.commitDrawing(e);
	        },

	        connect: function (e) {
	            // On touch, the latlng has not been updated because there is
	            // no mousemove.
	            if (e) this.feature._latlng = e.latlng;
	            L.Editable.BaseEditor.prototype.connect.call(this, e);
	        }

	    });

	    // 🍂namespace Editable; 🍂class PathEditor; 🍂aka L.Editable.PathEditor
	    // 🍂inherits BaseEditor
	    // Base class for all path editors.
	    L.Editable.PathEditor = L.Editable.BaseEditor.extend({

	        CLOSED: false,
	        MIN_VERTEX: 2,

	        addHooks: function () {
	            L.Editable.BaseEditor.prototype.addHooks.call(this);
	            if (this.feature) this.initVertexMarkers();
	            return this;
	        },

	        initVertexMarkers: function (latlngs) {
	            if (!this.enabled()) return;
	            latlngs = latlngs || this.getLatLngs();
	            if (L.Polyline._flat(latlngs)) this.addVertexMarkers(latlngs);
	            else for (var i = 0; i < latlngs.length; i++) this.initVertexMarkers(latlngs[i]);
	        },

	        getLatLngs: function () {
	            return this.feature.getLatLngs();
	        },

	        // 🍂method reset()
	        // Rebuild edit elements (Vertex, MiddleMarker, etc.).
	        reset: function () {
	            this.editLayer.clearLayers();
	            this.initVertexMarkers();
	        },

	        addVertexMarker: function (latlng, latlngs) {
	            return new this.tools.options.vertexMarkerClass(latlng, latlngs, this);
	        },

	        addVertexMarkers: function (latlngs) {
	            for (var i = 0; i < latlngs.length; i++) {
	                this.addVertexMarker(latlngs[i], latlngs);
	            }
	        },

	        refreshVertexMarkers: function (latlngs) {
	            latlngs = latlngs || this.getDefaultLatLngs();
	            for (var i = 0; i < latlngs.length; i++) {
	                latlngs[i].__vertex.update();
	            }
	        },

	        addMiddleMarker: function (left, right, latlngs) {
	            return new this.tools.options.middleMarkerClass(left, right, latlngs, this);
	        },

	        onVertexMarkerClick: function (e) {
	            L.Editable.makeCancellable(e);
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:click: CancelableVertexEvent
	            // Fired when a `click` is issued on a vertex, before any internal action is being processed.
	            this.fireAndForward('editable:vertex:click', e);
	            if (e._cancelled) return;
	            if (this.tools.drawing() && this.tools._drawingEditor !== this) return;
	            var index = e.vertex.getIndex(), commit;
	            if (e.originalEvent.ctrlKey) {
	                this.onVertexMarkerCtrlClick(e);
	            } else if (e.originalEvent.altKey) {
	                this.onVertexMarkerAltClick(e);
	            } else if (e.originalEvent.shiftKey) {
	                this.onVertexMarkerShiftClick(e);
	            } else if (e.originalEvent.metaKey) {
	                this.onVertexMarkerMetaKeyClick(e);
	            } else if (index === e.vertex.getLastIndex() && this._drawing === L.Editable.FORWARD) {
	                if (index >= this.MIN_VERTEX - 1) commit = true;
	            } else if (index === 0 && this._drawing === L.Editable.BACKWARD && this._drawnLatLngs.length >= this.MIN_VERTEX) {
	                commit = true;
	            } else if (index === 0 && this._drawing === L.Editable.FORWARD && this._drawnLatLngs.length >= this.MIN_VERTEX && this.CLOSED) {
	                commit = true;  // Allow to close on first point also for polygons
	            } else {
	                this.onVertexRawMarkerClick(e);
	            }
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:clicked: VertexEvent
	            // Fired when a `click` is issued on a vertex, after all internal actions.
	            this.fireAndForward('editable:vertex:clicked', e);
	            if (commit) this.commitDrawing(e);
	        },

	        onVertexRawMarkerClick: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:rawclick: CancelableVertexEvent
	            // Fired when a `click` is issued on a vertex without any special key and without being in drawing mode.
	            this.fireAndForward('editable:vertex:rawclick', e);
	            if (e._cancelled) return;
	            if (!this.vertexCanBeDeleted(e.vertex)) return;
	            e.vertex.delete();
	        },

	        vertexCanBeDeleted: function (vertex) {
	            return vertex.latlngs.length > this.MIN_VERTEX;
	        },

	        onVertexDeleted: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:deleted: VertexEvent
	            // Fired after a vertex has been deleted by user.
	            this.fireAndForward('editable:vertex:deleted', e);
	        },

	        onVertexMarkerCtrlClick: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:ctrlclick: VertexEvent
	            // Fired when a `click` with `ctrlKey` is issued on a vertex.
	            this.fireAndForward('editable:vertex:ctrlclick', e);
	        },

	        onVertexMarkerShiftClick: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:shiftclick: VertexEvent
	            // Fired when a `click` with `shiftKey` is issued on a vertex.
	            this.fireAndForward('editable:vertex:shiftclick', e);
	        },

	        onVertexMarkerMetaKeyClick: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:metakeyclick: VertexEvent
	            // Fired when a `click` with `metaKey` is issued on a vertex.
	            this.fireAndForward('editable:vertex:metakeyclick', e);
	        },

	        onVertexMarkerAltClick: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:altclick: VertexEvent
	            // Fired when a `click` with `altKey` is issued on a vertex.
	            this.fireAndForward('editable:vertex:altclick', e);
	        },

	        onVertexMarkerContextMenu: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:contextmenu: VertexEvent
	            // Fired when a `contextmenu` is issued on a vertex.
	            this.fireAndForward('editable:vertex:contextmenu', e);
	        },

	        onVertexMarkerMouseDown: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:mousedown: VertexEvent
	            // Fired when user `mousedown` a vertex.
	            this.fireAndForward('editable:vertex:mousedown', e);
	        },

	        onMiddleMarkerMouseDown: function (e) {
	            // 🍂namespace Editable
	            // 🍂section MiddleMarker events
	            // 🍂event editable:middlemarker:mousedown: VertexEvent
	            // Fired when user `mousedown` a middle marker.
	            this.fireAndForward('editable:middlemarker:mousedown', e);
	        },

	        onVertexMarkerDrag: function (e) {
	            this.onMove(e);
	            if (this.feature._bounds) this.extendBounds(e);
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:drag: VertexEvent
	            // Fired when a vertex is dragged by user.
	            this.fireAndForward('editable:vertex:drag', e);
	        },

	        onVertexMarkerDragStart: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:dragstart: VertexEvent
	            // Fired before a vertex is dragged by user.
	            this.fireAndForward('editable:vertex:dragstart', e);
	        },

	        onVertexMarkerDragEnd: function (e) {
	            // 🍂namespace Editable
	            // 🍂section Vertex events
	            // 🍂event editable:vertex:dragend: VertexEvent
	            // Fired after a vertex is dragged by user.
	            this.fireAndForward('editable:vertex:dragend', e);
	        },

	        setDrawnLatLngs: function (latlngs) {
	            this._drawnLatLngs = latlngs || this.getDefaultLatLngs();
	        },

	        startDrawing: function () {
	            if (!this._drawnLatLngs) this.setDrawnLatLngs();
	            L.Editable.BaseEditor.prototype.startDrawing.call(this);
	        },

	        startDrawingForward: function () {
	            this.startDrawing();
	        },

	        endDrawing: function () {
	            this.tools.detachForwardLineGuide();
	            this.tools.detachBackwardLineGuide();
	            if (this._drawnLatLngs && this._drawnLatLngs.length < this.MIN_VERTEX) this.deleteShape(this._drawnLatLngs);
	            L.Editable.BaseEditor.prototype.endDrawing.call(this);
	            delete this._drawnLatLngs;
	        },

	        addLatLng: function (latlng) {
	            if (this._drawing === L.Editable.FORWARD) this._drawnLatLngs.push(latlng);
	            else this._drawnLatLngs.unshift(latlng);
	            this.feature._bounds.extend(latlng);
	            this.addVertexMarker(latlng, this._drawnLatLngs);
	            this.refresh();
	        },

	        newPointForward: function (latlng) {
	            this.addLatLng(latlng);
	            this.tools.attachForwardLineGuide();
	            this.tools.anchorForwardLineGuide(latlng);
	        },

	        newPointBackward: function (latlng) {
	            this.addLatLng(latlng);
	            this.tools.anchorBackwardLineGuide(latlng);
	        },

	        // 🍂namespace PathEditor
	        // 🍂method push()
	        // Programmatically add a point while drawing.
	        push: function (latlng) {
	            if (!latlng) return console.error('L.Editable.PathEditor.push expect a vaild latlng as parameter');
	            if (this._drawing === L.Editable.FORWARD) this.newPointForward(latlng);
	            else this.newPointBackward(latlng);
	        },

	        removeLatLng: function (latlng) {
	            latlng.__vertex.delete();
	            this.refresh();
	        },

	        // 🍂method pop(): L.LatLng or null
	        // Programmatically remove last point (if any) while drawing.
	        pop: function () {
	            if (this._drawnLatLngs.length <= 1) return;
	            var latlng;
	            if (this._drawing === L.Editable.FORWARD) latlng = this._drawnLatLngs[this._drawnLatLngs.length - 1];
	            else latlng = this._drawnLatLngs[0];
	            this.removeLatLng(latlng);
	            if (this._drawing === L.Editable.FORWARD) this.tools.anchorForwardLineGuide(this._drawnLatLngs[this._drawnLatLngs.length - 1]);
	            else this.tools.anchorForwardLineGuide(this._drawnLatLngs[0]);
	            return latlng;
	        },

	        processDrawingClick: function (e) {
	            if (e.vertex && e.vertex.editor === this) return;
	            if (this._drawing === L.Editable.FORWARD) this.newPointForward(e.latlng);
	            else this.newPointBackward(e.latlng);
	            this.fireAndForward('editable:drawing:clicked', e);
	        },

	        onDrawingMouseMove: function (e) {
	            L.Editable.BaseEditor.prototype.onDrawingMouseMove.call(this, e);
	            if (this._drawing) {
	                this.tools.moveForwardLineGuide(e.latlng);
	                this.tools.moveBackwardLineGuide(e.latlng);
	            }
	        },

	        refresh: function () {
	            this.feature.redraw();
	            this.onEditing();
	        },

	        // 🍂namespace PathEditor
	        // 🍂method newShape(latlng?: L.LatLng)
	        // Add a new shape (Polyline, Polygon) in a multi, and setup up drawing tools to draw it;
	        // if optional `latlng` is given, start a path at this point.
	        newShape: function (latlng) {
	            var shape = this.addNewEmptyShape();
	            if (!shape) return;
	            this.setDrawnLatLngs(shape[0] || shape);  // Polygon or polyline
	            this.startDrawingForward();
	            // 🍂namespace Editable
	            // 🍂section Shape events
	            // 🍂event editable:shape:new: ShapeEvent
	            // Fired when a new shape is created in a multi (Polygon or Polyline).
	            this.fireAndForward('editable:shape:new', {shape: shape});
	            if (latlng) this.newPointForward(latlng);
	        },

	        deleteShape: function (shape, latlngs) {
	            var e = {shape: shape};
	            L.Editable.makeCancellable(e);
	            // 🍂namespace Editable
	            // 🍂section Shape events
	            // 🍂event editable:shape:delete: CancelableShapeEvent
	            // Fired before a new shape is deleted in a multi (Polygon or Polyline).
	            this.fireAndForward('editable:shape:delete', e);
	            if (e._cancelled) return;
	            shape = this._deleteShape(shape, latlngs);
	            if (this.ensureNotFlat) this.ensureNotFlat();  // Polygon.
	            this.feature.setLatLngs(this.getLatLngs());  // Force bounds reset.
	            this.refresh();
	            this.reset();
	            // 🍂namespace Editable
	            // 🍂section Shape events
	            // 🍂event editable:shape:deleted: ShapeEvent
	            // Fired after a new shape is deleted in a multi (Polygon or Polyline).
	            this.fireAndForward('editable:shape:deleted', {shape: shape});
	            return shape;
	        },

	        _deleteShape: function (shape, latlngs) {
	            latlngs = latlngs || this.getLatLngs();
	            if (!latlngs.length) return;
	            var self = this,
	                inplaceDelete = function (latlngs, shape) {
	                    // Called when deleting a flat latlngs
	                    shape = latlngs.splice(0, Number.MAX_VALUE);
	                    return shape;
	                },
	                spliceDelete = function (latlngs, shape) {
	                    // Called when removing a latlngs inside an array
	                    latlngs.splice(latlngs.indexOf(shape), 1);
	                    if (!latlngs.length) self._deleteShape(latlngs);
	                    return shape;
	                };
	            if (latlngs === shape) return inplaceDelete(latlngs, shape);
	            for (var i = 0; i < latlngs.length; i++) {
	                if (latlngs[i] === shape) return spliceDelete(latlngs, shape);
	                else if (latlngs[i].indexOf(shape) !== -1) return spliceDelete(latlngs[i], shape);
	            }
	        },

	        // 🍂namespace PathEditor
	        // 🍂method deleteShapeAt(latlng: L.LatLng): Array
	        // Remove a path shape at the given `latlng`.
	        deleteShapeAt: function (latlng) {
	            var shape = this.feature.shapeAt(latlng);
	            if (shape) return this.deleteShape(shape);
	        },

	        // 🍂method appendShape(shape: Array)
	        // Append a new shape to the Polygon or Polyline.
	        appendShape: function (shape) {
	            this.insertShape(shape);
	        },

	        // 🍂method prependShape(shape: Array)
	        // Prepend a new shape to the Polygon or Polyline.
	        prependShape: function (shape) {
	            this.insertShape(shape, 0);
	        },

	        // 🍂method insertShape(shape: Array, index: int)
	        // Insert a new shape to the Polygon or Polyline at given index (default is to append).
	        insertShape: function (shape, index) {
	            this.ensureMulti();
	            shape = this.formatShape(shape);
	            if (typeof index === 'undefined') index = this.feature._latlngs.length;
	            this.feature._latlngs.splice(index, 0, shape);
	            this.feature.redraw();
	            if (this._enabled) this.reset();
	        },

	        extendBounds: function (e) {
	            this.feature._bounds.extend(e.vertex.latlng);
	        },

	        onDragStart: function (e) {
	            this.editLayer.clearLayers();
	            L.Editable.BaseEditor.prototype.onDragStart.call(this, e);
	        },

	        onDragEnd: function (e) {
	            this.initVertexMarkers();
	            L.Editable.BaseEditor.prototype.onDragEnd.call(this, e);
	        }

	    });

	    // 🍂namespace Editable; 🍂class PolylineEditor; 🍂aka L.Editable.PolylineEditor
	    // 🍂inherits PathEditor
	    L.Editable.PolylineEditor = L.Editable.PathEditor.extend({

	        startDrawingBackward: function () {
	            this._drawing = L.Editable.BACKWARD;
	            this.startDrawing();
	        },

	        // 🍂method continueBackward(latlngs?: Array)
	        // Set up drawing tools to continue the line backward.
	        continueBackward: function (latlngs) {
	            if (this.drawing()) return;
	            latlngs = latlngs || this.getDefaultLatLngs();
	            this.setDrawnLatLngs(latlngs);
	            if (latlngs.length > 0) {
	                this.tools.attachBackwardLineGuide();
	                this.tools.anchorBackwardLineGuide(latlngs[0]);
	            }
	            this.startDrawingBackward();
	        },

	        // 🍂method continueForward(latlngs?: Array)
	        // Set up drawing tools to continue the line forward.
	        continueForward: function (latlngs) {
	            if (this.drawing()) return;
	            latlngs = latlngs || this.getDefaultLatLngs();
	            this.setDrawnLatLngs(latlngs);
	            if (latlngs.length > 0) {
	                this.tools.attachForwardLineGuide();
	                this.tools.anchorForwardLineGuide(latlngs[latlngs.length - 1]);
	            }
	            this.startDrawingForward();
	        },

	        getDefaultLatLngs: function (latlngs) {
	            latlngs = latlngs || this.feature._latlngs;
	            if (!latlngs.length || latlngs[0] instanceof L.LatLng) return latlngs;
	            else return this.getDefaultLatLngs(latlngs[0]);
	        },

	        ensureMulti: function () {
	            if (this.feature._latlngs.length && L.Polyline._flat(this.feature._latlngs)) {
	                this.feature._latlngs = [this.feature._latlngs];
	            }
	        },

	        addNewEmptyShape: function () {
	            if (this.feature._latlngs.length) {
	                var shape = [];
	                this.appendShape(shape);
	                return shape;
	            } else {
	                return this.feature._latlngs;
	            }
	        },

	        formatShape: function (shape) {
	            if (L.Polyline._flat(shape)) return shape;
	            else if (shape[0]) return this.formatShape(shape[0]);
	        },

	        // 🍂method splitShape(latlngs?: Array, index: int)
	        // Split the given `latlngs` shape at index `index` and integrate new shape in instance `latlngs`.
	        splitShape: function (shape, index) {
	            if (!index || index >= shape.length - 1) return;
	            this.ensureMulti();
	            var shapeIndex = this.feature._latlngs.indexOf(shape);
	            if (shapeIndex === -1) return;
	            var first = shape.slice(0, index + 1),
	                second = shape.slice(index);
	            // We deal with reference, we don't want twice the same latlng around.
	            second[0] = L.latLng(second[0].lat, second[0].lng, second[0].alt);
	            this.feature._latlngs.splice(shapeIndex, 1, first, second);
	            this.refresh();
	            this.reset();
	        }

	    });

	    // 🍂namespace Editable; 🍂class PolygonEditor; 🍂aka L.Editable.PolygonEditor
	    // 🍂inherits PathEditor
	    L.Editable.PolygonEditor = L.Editable.PathEditor.extend({

	        CLOSED: true,
	        MIN_VERTEX: 3,

	        newPointForward: function (latlng) {
	            L.Editable.PathEditor.prototype.newPointForward.call(this, latlng);
	            if (!this.tools.backwardLineGuide._latlngs.length) this.tools.anchorBackwardLineGuide(latlng);
	            if (this._drawnLatLngs.length === 2) this.tools.attachBackwardLineGuide();
	        },

	        addNewEmptyHole: function (latlng) {
	            this.ensureNotFlat();
	            var latlngs = this.feature.shapeAt(latlng);
	            if (!latlngs) return;
	            var holes = [];
	            latlngs.push(holes);
	            return holes;
	        },

	        // 🍂method newHole(latlng?: L.LatLng, index: int)
	        // Set up drawing tools for creating a new hole on the Polygon. If the `latlng` param is given, a first point is created.
	        newHole: function (latlng) {
	            var holes = this.addNewEmptyHole(latlng);
	            if (!holes) return;
	            this.setDrawnLatLngs(holes);
	            this.startDrawingForward();
	            if (latlng) this.newPointForward(latlng);
	        },

	        addNewEmptyShape: function () {
	            if (this.feature._latlngs.length && this.feature._latlngs[0].length) {
	                var shape = [];
	                this.appendShape(shape);
	                return shape;
	            } else {
	                return this.feature._latlngs;
	            }
	        },

	        ensureMulti: function () {
	            if (this.feature._latlngs.length && L.Polyline._flat(this.feature._latlngs[0])) {
	                this.feature._latlngs = [this.feature._latlngs];
	            }
	        },

	        ensureNotFlat: function () {
	            if (!this.feature._latlngs.length || L.Polyline._flat(this.feature._latlngs)) this.feature._latlngs = [this.feature._latlngs];
	        },

	        vertexCanBeDeleted: function (vertex) {
	            var parent = this.feature.parentShape(vertex.latlngs),
	                idx = L.Util.indexOf(parent, vertex.latlngs);
	            if (idx > 0) return true;  // Holes can be totally deleted without removing the layer itself.
	            return L.Editable.PathEditor.prototype.vertexCanBeDeleted.call(this, vertex);
	        },

	        getDefaultLatLngs: function () {
	            if (!this.feature._latlngs.length) this.feature._latlngs.push([]);
	            return this.feature._latlngs[0];
	        },

	        formatShape: function (shape) {
	            // [[1, 2], [3, 4]] => must be nested
	            // [] => must be nested
	            // [[]] => is already nested
	            if (L.Polyline._flat(shape) && (!shape[0] || shape[0].length !== 0)) return [shape];
	            else return shape;
	        }

	    });

	    // 🍂namespace Editable; 🍂class RectangleEditor; 🍂aka L.Editable.RectangleEditor
	    // 🍂inherits PathEditor
	    L.Editable.RectangleEditor = L.Editable.PathEditor.extend({

	        CLOSED: true,
	        MIN_VERTEX: 4,

	        options: {
	            skipMiddleMarkers: true
	        },

	        extendBounds: function (e) {
	            var index = e.vertex.getIndex(),
	                next = e.vertex.getNext(),
	                previous = e.vertex.getPrevious(),
	                oppositeIndex = (index + 2) % 4,
	                opposite = e.vertex.latlngs[oppositeIndex],
	                bounds = new L.LatLngBounds(e.latlng, opposite);
	            // Update latlngs by hand to preserve order.
	            previous.latlng.update([e.latlng.lat, opposite.lng]);
	            next.latlng.update([opposite.lat, e.latlng.lng]);
	            this.updateBounds(bounds);
	            this.refreshVertexMarkers();
	        },

	        onDrawingMouseDown: function (e) {
	            L.Editable.PathEditor.prototype.onDrawingMouseDown.call(this, e);
	            this.connect();
	            var latlngs = this.getDefaultLatLngs();
	            // L.Polygon._convertLatLngs removes last latlng if it equals first point,
	            // which is the case here as all latlngs are [0, 0]
	            if (latlngs.length === 3) latlngs.push(e.latlng);
	            var bounds = new L.LatLngBounds(e.latlng, e.latlng);
	            this.updateBounds(bounds);
	            this.updateLatLngs(bounds);
	            this.refresh();
	            this.reset();
	            // Stop dragging map.
	            // L.Draggable has two workflows:
	            // - mousedown => mousemove => mouseup
	            // - touchstart => touchmove => touchend
	            // Problem: L.Map.Tap does not allow us to listen to touchstart, so we only
	            // can deal with mousedown, but then when in a touch device, we are dealing with
	            // simulated events (actually simulated by L.Map.Tap), which are no more taken
	            // into account by L.Draggable.
	            // Ref.: https://github.com/Leaflet/Leaflet.Editable/issues/103
	            e.originalEvent._simulated = false;
	            this.map.dragging._draggable._onUp(e.originalEvent);
	            // Now transfer ongoing drag action to the bottom right corner.
	            // Should we refine which corne will handle the drag according to
	            // drag direction?
	            latlngs[3].__vertex.dragging._draggable._onDown(e.originalEvent);
	        },

	        onDrawingMouseUp: function (e) {
	            this.commitDrawing(e);
	            e.originalEvent._simulated = false;
	            L.Editable.PathEditor.prototype.onDrawingMouseUp.call(this, e);
	        },

	        onDrawingMouseMove: function (e) {
	            e.originalEvent._simulated = false;
	            L.Editable.PathEditor.prototype.onDrawingMouseMove.call(this, e);
	        },


	        getDefaultLatLngs: function (latlngs) {
	            return latlngs || this.feature._latlngs[0];
	        },

	        updateBounds: function (bounds) {
	            this.feature._bounds = bounds;
	        },

	        updateLatLngs: function (bounds) {
	            var latlngs = this.getDefaultLatLngs(),
	                newLatlngs = this.feature._boundsToLatLngs(bounds);
	            // Keep references.
	            for (var i = 0; i < latlngs.length; i++) {
	                latlngs[i].update(newLatlngs[i]);
	            };
	        }

	    });

	    // 🍂namespace Editable; 🍂class CircleEditor; 🍂aka L.Editable.CircleEditor
	    // 🍂inherits PathEditor
	    L.Editable.CircleEditor = L.Editable.PathEditor.extend({

	        MIN_VERTEX: 2,

	        options: {
	            skipMiddleMarkers: true
	        },

	        initialize: function (map, feature, options) {
	            L.Editable.PathEditor.prototype.initialize.call(this, map, feature, options);
	            this._resizeLatLng = this.computeResizeLatLng();
	        },

	        computeResizeLatLng: function () {
	            // While circle is not added to the map, _radius is not set.
	            var delta = (this.feature._radius || this.feature._mRadius) * Math.cos(Math.PI / 4),
	                point = this.map.project(this.feature._latlng);
	            return this.map.unproject([point.x + delta, point.y - delta]);
	        },

	        updateResizeLatLng: function () {
	            this._resizeLatLng.update(this.computeResizeLatLng());
	            this._resizeLatLng.__vertex.update();
	        },

	        getLatLngs: function () {
	            return [this.feature._latlng, this._resizeLatLng];
	        },

	        getDefaultLatLngs: function () {
	            return this.getLatLngs();
	        },

	        onVertexMarkerDrag: function (e) {
	            if (e.vertex.getIndex() === 1) this.resize(e);
	            else this.updateResizeLatLng(e);
	            L.Editable.PathEditor.prototype.onVertexMarkerDrag.call(this, e);
	        },

	        resize: function (e) {
	            var radius = this.feature._latlng.distanceTo(e.latlng)
	            this.feature.setRadius(radius);
	        },

	        onDrawingMouseDown: function (e) {
	            L.Editable.PathEditor.prototype.onDrawingMouseDown.call(this, e);
	            this._resizeLatLng.update(e.latlng);
	            this.feature._latlng.update(e.latlng);
	            this.connect();
	            // Stop dragging map.
	            e.originalEvent._simulated = false;
	            this.map.dragging._draggable._onUp(e.originalEvent);
	            // Now transfer ongoing drag action to the radius handler.
	            this._resizeLatLng.__vertex.dragging._draggable._onDown(e.originalEvent);
	        },

	        onDrawingMouseUp: function (e) {
	            this.commitDrawing(e);
	            e.originalEvent._simulated = false;
	            L.Editable.PathEditor.prototype.onDrawingMouseUp.call(this, e);
	        },

	        onDrawingMouseMove: function (e) {
	            e.originalEvent._simulated = false;
	            L.Editable.PathEditor.prototype.onDrawingMouseMove.call(this, e);
	        },

	        onDrag: function (e) {
	            L.Editable.PathEditor.prototype.onDrag.call(this, e);
	            this.feature.dragging.updateLatLng(this._resizeLatLng);
	        }

	    });

	    // 🍂namespace Editable; 🍂class EditableMixin
	    // `EditableMixin` is included to `L.Polyline`, `L.Polygon`, `L.Rectangle`, `L.Circle`
	    // and `L.Marker`. It adds some methods to them.
	    // *When editing is enabled, the editor is accessible on the instance with the
	    // `editor` property.*
	    var EditableMixin = {

	        createEditor: function (map) {
	            map = map || this._map;
	            var tools = (this.options.editOptions || {}).editTools || map.editTools;
	            if (!tools) throw Error('Unable to detect Editable instance.')
	            var Klass = this.options.editorClass || this.getEditorClass(tools);
	            return new Klass(map, this, this.options.editOptions);
	        },

	        // 🍂method enableEdit(map?: L.Map): this.editor
	        // Enable editing, by creating an editor if not existing, and then calling `enable` on it.
	        enableEdit: function (map) {
	            if (!this.editor) this.createEditor(map);
	            this.editor.enable();
	            return this.editor;
	        },

	        // 🍂method editEnabled(): boolean
	        // Return true if current instance has an editor attached, and this editor is enabled.
	        editEnabled: function () {
	            return this.editor && this.editor.enabled();
	        },

	        // 🍂method disableEdit()
	        // Disable editing, also remove the editor property reference.
	        disableEdit: function () {
	            if (this.editor) {
	                this.editor.disable();
	                delete this.editor;
	            }
	        },

	        // 🍂method toggleEdit()
	        // Enable or disable editing, according to current status.
	        toggleEdit: function () {
	            if (this.editEnabled()) this.disableEdit();
	            else this.enableEdit();
	        },

	        _onEditableAdd: function () {
	            if (this.editor) this.enableEdit();
	        }

	    };

	    var PolylineMixin = {

	        getEditorClass: function (tools) {
	            return (tools && tools.options.polylineEditorClass) ? tools.options.polylineEditorClass : L.Editable.PolylineEditor;
	        },

	        shapeAt: function (latlng, latlngs) {
	            // We can have those cases:
	            // - latlngs are just a flat array of latlngs, use this
	            // - latlngs is an array of arrays of latlngs, loop over
	            var shape = null;
	            latlngs = latlngs || this._latlngs;
	            if (!latlngs.length) return shape;
	            else if (L.Polyline._flat(latlngs) && this.isInLatLngs(latlng, latlngs)) shape = latlngs;
	            else for (var i = 0; i < latlngs.length; i++) if (this.isInLatLngs(latlng, latlngs[i])) return latlngs[i];
	            return shape;
	        },

	        isInLatLngs: function (l, latlngs) {
	            if (!latlngs) return false;
	            var i, k, len, part = [], p,
	                w = this._clickTolerance();
	            this._projectLatlngs(latlngs, part, this._pxBounds);
	            part = part[0];
	            p = this._map.latLngToLayerPoint(l);

	            if (!this._pxBounds.contains(p)) { return false; }
	            for (i = 1, len = part.length, k = 0; i < len; k = i++) {

	                if (L.LineUtil.pointToSegmentDistance(p, part[k], part[i]) <= w) {
	                    return true;
	                }
	            }
	            return false;
	        }

	    };

	    var PolygonMixin = {

	        getEditorClass: function (tools) {
	            return (tools && tools.options.polygonEditorClass) ? tools.options.polygonEditorClass : L.Editable.PolygonEditor;
	        },

	        shapeAt: function (latlng, latlngs) {
	            // We can have those cases:
	            // - latlngs are just a flat array of latlngs, use this
	            // - latlngs is an array of arrays of latlngs, this is a simple polygon (maybe with holes), use the first
	            // - latlngs is an array of arrays of arrays, this is a multi, loop over
	            var shape = null;
	            latlngs = latlngs || this._latlngs;
	            if (!latlngs.length) return shape;
	            else if (L.Polyline._flat(latlngs) && this.isInLatLngs(latlng, latlngs)) shape = latlngs;
	            else if (L.Polyline._flat(latlngs[0]) && this.isInLatLngs(latlng, latlngs[0])) shape = latlngs;
	            else for (var i = 0; i < latlngs.length; i++) if (this.isInLatLngs(latlng, latlngs[i][0])) return latlngs[i];
	            return shape;
	        },

	        isInLatLngs: function (l, latlngs) {
	            var inside = false, l1, l2, j, k, len2;

	            for (j = 0, len2 = latlngs.length, k = len2 - 1; j < len2; k = j++) {
	                l1 = latlngs[j];
	                l2 = latlngs[k];

	                if (((l1.lat > l.lat) !== (l2.lat > l.lat)) &&
	                        (l.lng < (l2.lng - l1.lng) * (l.lat - l1.lat) / (l2.lat - l1.lat) + l1.lng)) {
	                    inside = !inside;
	                }
	            }

	            return inside;
	        },

	        parentShape: function (shape, latlngs) {
	            latlngs = latlngs || this._latlngs;
	            if (!latlngs) return;
	            var idx = L.Util.indexOf(latlngs, shape);
	            if (idx !== -1) return latlngs;
	            for (var i = 0; i < latlngs.length; i++) {
	                idx = L.Util.indexOf(latlngs[i], shape);
	                if (idx !== -1) return latlngs[i];
	            }
	        }

	    };


	    var MarkerMixin = {

	        getEditorClass: function (tools) {
	            return (tools && tools.options.markerEditorClass) ? tools.options.markerEditorClass : L.Editable.MarkerEditor;
	        }

	    };

	    var RectangleMixin = {

	        getEditorClass: function (tools) {
	            return (tools && tools.options.rectangleEditorClass) ? tools.options.rectangleEditorClass : L.Editable.RectangleEditor;
	        }

	    };

	    var CircleMixin = {

	        getEditorClass: function (tools) {
	            return (tools && tools.options.circleEditorClass) ? tools.options.circleEditorClass : L.Editable.CircleEditor;
	        }

	    };

	    var keepEditable = function () {
	        // Make sure you can remove/readd an editable layer.
	        this.on('add', this._onEditableAdd);
	    };



	    if (L.Polyline) {
	        L.Polyline.include(EditableMixin);
	        L.Polyline.include(PolylineMixin);
	        L.Polyline.addInitHook(keepEditable);
	    }
	    if (L.Polygon) {
	        L.Polygon.include(EditableMixin);
	        L.Polygon.include(PolygonMixin);
	    }
	    if (L.Marker) {
	        L.Marker.include(EditableMixin);
	        L.Marker.include(MarkerMixin);
	        L.Marker.addInitHook(keepEditable);
	    }
	    if (L.Rectangle) {
	        L.Rectangle.include(EditableMixin);
	        L.Rectangle.include(RectangleMixin);
	    }
	    if (L.Circle) {
	        L.Circle.include(EditableMixin);
	        L.Circle.include(CircleMixin);
	    }

	    L.LatLng.prototype.update = function (latlng) {
	        latlng = L.latLng(latlng);
	        this.lat = latlng.lat;
	        this.lng = latlng.lng;
	    }

	}, window));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// Packaging/modules magic dance.
	(function (factory) {
	    var L;
	    if (true) {
	        // AMD
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(2)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined') {
	        // Node/CommonJS
	        L = require('leaflet');
	        module.exports = factory(L);
	    } else {
	        // Browser globals
	        if (typeof window.L === 'undefined')
	            throw 'Leaflet must be loaded first';
	        factory(window.L);
	    }
	}(function (L) {
	"use strict";

	L.Polyline._flat = L.Polyline._flat || function (latlngs) {
	    // true if it's a flat array of latlngs; false if nested
	    return !L.Util.isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
	};

	/**
	 * @fileOverview Leaflet Geometry utilities for distances and linear referencing.
	 * @name L.GeometryUtil
	 */

	L.GeometryUtil = L.extend(L.GeometryUtil || {}, {

	    /**
	        Shortcut function for planar distance between two {L.LatLng} at current zoom.

	        @tutorial distance-length

	        @param {L.Map} map Leaflet map to be used for this method
	        @param {L.LatLng} latlngA geographical point A
	        @param {L.LatLng} latlngB geographical point B
	        @returns {Number} planar distance
	     */
	    distance: function (map, latlngA, latlngB) {
	        return map.latLngToLayerPoint(latlngA).distanceTo(map.latLngToLayerPoint(latlngB));
	    },

	    /**
	        Shortcut function for planar distance between a {L.LatLng} and a segment (A-B).
	        @param {L.Map} map Leaflet map to be used for this method
	        @param {L.LatLng} latlng - The position to search
	        @param {L.LatLng} latlngA geographical point A of the segment
	        @param {L.LatLng} latlngB geographical point B of the segment
	        @returns {Number} planar distance
	    */
	    distanceSegment: function (map, latlng, latlngA, latlngB) {
	        var p = map.latLngToLayerPoint(latlng),
	           p1 = map.latLngToLayerPoint(latlngA),
	           p2 = map.latLngToLayerPoint(latlngB);
	        return L.LineUtil.pointToSegmentDistance(p, p1, p2);
	    },

	    /**
	        Shortcut function for converting distance to readable distance.
	        @param {Number} distance distance to be converted
	        @param {String} unit 'metric' or 'imperial'
	        @returns {String} in yard or miles
	    */
	    readableDistance: function (distance, unit) {
	        var isMetric = (unit !== 'imperial'),
	            distanceStr;
	        if (isMetric) {
	            // show metres when distance is < 1km, then show km
	            if (distance > 1000) {
	                distanceStr = (distance  / 1000).toFixed(2) + ' km';
	            }
	            else {
	                distanceStr = Math.ceil(distance) + ' m';
	            }
	        }
	        else {
	            distance *= 1.09361;
	            if (distance > 1760) {
	                distanceStr = (distance / 1760).toFixed(2) + ' miles';
	            }
	            else {
	                distanceStr = Math.ceil(distance) + ' yd';
	            }
	        }
	        return distanceStr;
	    },

	    /**
	        Returns true if the latlng belongs to segment A-B
	        @param {L.LatLng} latlng - The position to search
	        @param {L.LatLng} latlngA geographical point A of the segment
	        @param {L.LatLng} latlngB geographical point B of the segment
	        @param {?Number} [tolerance=0.2] tolerance to accept if latlng belongs really
	        @returns {boolean}
	     */
	    belongsSegment: function(latlng, latlngA, latlngB, tolerance) {
	        tolerance = tolerance === undefined ? 0.2 : tolerance;
	        var hypotenuse = latlngA.distanceTo(latlngB),
	            delta = latlngA.distanceTo(latlng) + latlng.distanceTo(latlngB) - hypotenuse;
	        return delta/hypotenuse < tolerance;
	    },

	    /**
	     * Returns total length of line
	     * @tutorial distance-length
	     *
	     * @param {L.Polyline|Array<L.Point>|Array<L.LatLng>} coords Set of coordinates
	     * @returns {Number} Total length (pixels for Point, meters for LatLng)
	     */
	    length: function (coords) {
	        var accumulated = L.GeometryUtil.accumulatedLengths(coords);
	        return accumulated.length > 0 ? accumulated[accumulated.length-1] : 0;
	    },

	    /**
	     * Returns a list of accumulated length along a line.
	     * @param {L.Polyline|Array<L.Point>|Array<L.LatLng>} coords Set of coordinates
	     * @returns {Array<Number>} Array of accumulated lengths (pixels for Point, meters for LatLng)
	     */
	    accumulatedLengths: function (coords) {
	        if (typeof coords.getLatLngs == 'function') {
	            coords = coords.getLatLngs();
	        }
	        if (coords.length === 0)
	            return [];
	        var total = 0,
	            lengths = [0];
	        for (var i = 0, n = coords.length - 1; i< n; i++) {
	            total += coords[i].distanceTo(coords[i+1]);
	            lengths.push(total);
	        }
	        return lengths;
	    },

	    /**
	        Returns the closest point of a {L.LatLng} on the segment (A-B)

	        @tutorial closest

	        @param {L.Map} map Leaflet map to be used for this method
	        @param {L.LatLng} latlng - The position to search
	        @param {L.LatLng} latlngA geographical point A of the segment
	        @param {L.LatLng} latlngB geographical point B of the segment
	        @returns {L.LatLng} Closest geographical point
	    */
	    closestOnSegment: function (map, latlng, latlngA, latlngB) {
	        var maxzoom = map.getMaxZoom();
	        if (maxzoom === Infinity)
	            maxzoom = map.getZoom();
	        var p = map.project(latlng, maxzoom),
	           p1 = map.project(latlngA, maxzoom),
	           p2 = map.project(latlngB, maxzoom),
	           closest = L.LineUtil.closestPointOnSegment(p, p1, p2);
	        return map.unproject(closest, maxzoom);
	    },

	    /**
	        Returns the closest latlng on layer.

	        Accept nested arrays

	        @tutorial closest

	        @param {L.Map} map Leaflet map to be used for this method
	        @param {Array<L.LatLng>|Array<Array<L.LatLng>>|L.PolyLine|L.Polygon} layer - Layer that contains the result
	        @param {L.LatLng} latlng - The position to search
	        @param {?boolean} [vertices=false] - Whether to restrict to path vertices.
	        @returns {L.LatLng} Closest geographical point or null if layer param is incorrect
	    */
	    closest: function (map, layer, latlng, vertices) {

	        var latlngs,
	            mindist = Infinity,
	            result = null,
	            i, n, distance;

	        if (layer instanceof Array) {
	            // if layer is Array<Array<T>>
	            if (layer[0] instanceof Array && typeof layer[0][0] !== 'number') {
	                // if we have nested arrays, we calc the closest for each array
	                // recursive
	                for (var i = 0; i < layer.length; i++) {
	                    var subResult = L.GeometryUtil.closest(map, layer[i], latlng, vertices);
	                    if (subResult.distance < mindist) {
	                        mindist = subResult.distance;
	                        result = subResult;
	                    }
	                }
	                return result;
	            } else if (layer[0] instanceof L.LatLng
	                        || typeof layer[0][0] === 'number'
	                        || typeof layer[0].lat === 'number') { // we could have a latlng as [x,y] with x & y numbers or {lat, lng}
	                layer = L.polyline(layer);
	            } else {
	                return result;
	            }
	        }

	        // if we don't have here a Polyline, that means layer is incorrect
	        // see https://github.com/makinacorpus/Leaflet.GeometryUtil/issues/23
	        if (! ( layer instanceof L.Polyline ) )
	            return result;

	        // deep copy of latlngs
	        latlngs = JSON.parse(JSON.stringify(layer.getLatLngs().slice(0)));

	        // add the last segment for L.Polygon
	        if (layer instanceof L.Polygon) {
	            // add the last segment for each child that is a nested array
	            var addLastSegment = function(latlngs) {
	                if (L.Polyline._flat(latlngs)) {
	                    latlngs.push(latlngs[0]);
	                } else {
	                    for (var i = 0; i < latlngs.length; i++) {
	                        addLastSegment(latlngs[i]);
	                    }
	                }
	            }
	            addLastSegment(latlngs);
	        }

	        // we have a multi polygon / multi polyline / polygon with holes
	        // use recursive to explore and return the good result
	        if ( ! L.Polyline._flat(latlngs) ) {

	            for (var i = 0; i < latlngs.length; i++) {
	                // if we are at the lower level, and if we have a L.Polygon, we add the last segment
	                var subResult = L.GeometryUtil.closest(map, latlngs[i], latlng, vertices);
	                if (subResult.distance < mindist) {
	                    mindist = subResult.distance;
	                    result = subResult;
	                }
	            }
	            return result;

	        } else {

	            // Lookup vertices
	            if (vertices) {
	                for(i = 0, n = latlngs.length; i < n; i++) {
	                    var ll = latlngs[i];
	                    distance = L.GeometryUtil.distance(map, latlng, ll);
	                    if (distance < mindist) {
	                        mindist = distance;
	                        result = ll;
	                        result.distance = distance;
	                    }
	                }
	                return result;
	            }

	            // Keep the closest point of all segments
	            for (i = 0, n = latlngs.length; i < n-1; i++) {
	                var latlngA = latlngs[i],
	                    latlngB = latlngs[i+1];
	                distance = L.GeometryUtil.distanceSegment(map, latlng, latlngA, latlngB);
	                if (distance <= mindist) {
	                    mindist = distance;
	                    result = L.GeometryUtil.closestOnSegment(map, latlng, latlngA, latlngB);
	                    result.distance = distance;
	                }
	            }
	            return result;
	        }

	    },

	    /**
	        Returns the closest layer to latlng among a list of layers.

	        @tutorial closest

	        @param {L.Map} map Leaflet map to be used for this method
	        @param {Array<L.ILayer>} layers Set of layers
	        @param {L.LatLng} latlng - The position to search
	        @returns {object} ``{layer, latlng, distance}`` or ``null`` if list is empty;
	    */
	    closestLayer: function (map, layers, latlng) {
	        var mindist = Infinity,
	            result = null,
	            ll = null,
	            distance = Infinity;

	        for (var i = 0, n = layers.length; i < n; i++) {
	            var layer = layers[i];
	            if (layer instanceof L.LayerGroup) {
	                // recursive
	                var subResult = L.GeometryUtil.closestLayer(map, layer.getLayers(), latlng);
	                if (subResult.distance < mindist) {
	                    mindist = subResult.distance;
	                    result = subResult;
	                }
	            } else {
	                // Single dimension, snap on points, else snap on closest
	                if (typeof layer.getLatLng == 'function') {
	                    ll = layer.getLatLng();
	                    distance = L.GeometryUtil.distance(map, latlng, ll);
	                }
	                else {
	                    ll = L.GeometryUtil.closest(map, layer, latlng);
	                    if (ll) distance = ll.distance;  // Can return null if layer has no points.
	                }
	                if (distance < mindist) {
	                    mindist = distance;
	                    result = {layer: layer, latlng: ll, distance: distance};
	                }
	            }
	        }
	        return result;
	    },

	    /**
	        Returns the n closest layers to latlng among a list of input layers.

	        @param {L.Map} map - Leaflet map to be used for this method
	        @param {Array<L.ILayer>} layers - Set of layers
	        @param {L.LatLng} latlng - The position to search
	        @param {?Number} [n=layers.length] - the expected number of output layers.
	        @returns {Array<object>} an array of objects ``{layer, latlng, distance}`` or ``null`` if the input is invalid (empty list or negative n)
	    */
	    nClosestLayers: function (map, layers, latlng, n) {
	        n = typeof n === 'number' ? n : layers.length;

	        if (n < 1 || layers.length < 1) {
	            return null;
	        }

	        var results = [];
	        var distance, ll;

	        for (var i = 0, m = layers.length; i < m; i++) {
	            var layer = layers[i];
	            if (layer instanceof L.LayerGroup) {
	                // recursive
	                var subResult = L.GeometryUtil.closestLayer(map, layer.getLayers(), latlng);
	                results.push(subResult)
	            } else {
	                // Single dimension, snap on points, else snap on closest
	                if (typeof layer.getLatLng == 'function') {
	                    ll = layer.getLatLng();
	                    distance = L.GeometryUtil.distance(map, latlng, ll);
	                }
	                else {
	                    ll = L.GeometryUtil.closest(map, layer, latlng);
	                    if (ll) distance = ll.distance;  // Can return null if layer has no points.
	                }
	                results.push({layer: layer, latlng: ll, distance: distance})
	            }
	        }

	        results.sort(function(a, b) {
	            return a.distance - b.distance;
	        });

	        if (results.length > n) {
	            return results.slice(0, n);
	        } else  {
	            return results;
	        }
	    },

	    /**
	     * Returns all layers within a radius of the given position, in an ascending order of distance.
	       @param {L.Map} map Leaflet map to be used for this method
	       @param {Array<ILayer>} layers - A list of layers.
	       @param {L.LatLng} latlng - The position to search
	       @param {?Number} [radius=Infinity] - Search radius in pixels
	       @return {object[]} an array of objects including layer within the radius, closest latlng, and distance
	     */
	    layersWithin: function(map, layers, latlng, radius) {
	      radius = typeof radius == 'number' ? radius : Infinity;

	      var results = [];
	      var ll = null;
	      var distance = 0;

	      for (var i = 0, n = layers.length; i < n; i++) {
	        var layer = layers[i];

	        if (typeof layer.getLatLng == 'function') {
	            ll = layer.getLatLng();
	            distance = L.GeometryUtil.distance(map, latlng, ll);
	        }
	        else {
	            ll = L.GeometryUtil.closest(map, layer, latlng);
	            if (ll) distance = ll.distance;  // Can return null if layer has no points.
	        }

	        if (ll && distance < radius) {
	            results.push({layer: layer, latlng: ll, distance: distance});
	        }
	      }

	      var sortedResults = results.sort(function(a, b) {
	          return a.distance - b.distance;
	      });

	      return sortedResults;
	    },

	    /**
	        Returns the closest position from specified {LatLng} among specified layers,
	        with a maximum tolerance in pixels, providing snapping behaviour.

	        @tutorial closest

	        @param {L.Map} map Leaflet map to be used for this method
	        @param {Array<ILayer>} layers - A list of layers to snap on.
	        @param {L.LatLng} latlng - The position to snap
	        @param {?Number} [tolerance=Infinity] - Maximum number of pixels.
	        @param {?boolean} [withVertices=true] - Snap to layers vertices or segment points (not only vertex)
	        @returns {object} with snapped {LatLng} and snapped {Layer} or null if tolerance exceeded.
	    */
	    closestLayerSnap: function (map, layers, latlng, tolerance, withVertices) {
	        tolerance = typeof tolerance == 'number' ? tolerance : Infinity;
	        withVertices = typeof withVertices == 'boolean' ? withVertices : true;

	        var result = L.GeometryUtil.closestLayer(map, layers, latlng);
	        if (!result || result.distance > tolerance)
	            return null;

	        // If snapped layer is linear, try to snap on vertices (extremities and middle points)
	        if (withVertices && typeof result.layer.getLatLngs == 'function') {
	            var closest = L.GeometryUtil.closest(map, result.layer, result.latlng, true);
	            if (closest.distance < tolerance) {
	                result.latlng = closest;
	                result.distance = L.GeometryUtil.distance(map, closest, latlng);
	            }
	        }
	        return result;
	    },

	    /**
	        Returns the Point located on a segment at the specified ratio of the segment length.
	        @param {L.Point} pA coordinates of point A
	        @param {L.Point} pB coordinates of point B
	        @param {Number} the length ratio, expressed as a decimal between 0 and 1, inclusive.
	        @returns {L.Point} the interpolated point.
	    */
	    interpolateOnPointSegment: function (pA, pB, ratio) {
	        return L.point(
	            (pA.x * (1 - ratio)) + (ratio * pB.x),
	            (pA.y * (1 - ratio)) + (ratio * pB.y)
	        );
	    },

	    /**
	        Returns the coordinate of the point located on a line at the specified ratio of the line length.
	        @param {L.Map} map Leaflet map to be used for this method
	        @param {Array<L.LatLng>|L.PolyLine} latlngs Set of geographical points
	        @param {Number} ratio the length ratio, expressed as a decimal between 0 and 1, inclusive
	        @returns {Object} an object with latLng ({LatLng}) and predecessor ({Number}), the index of the preceding vertex in the Polyline
	        (-1 if the interpolated point is the first vertex)
	    */
	    interpolateOnLine: function (map, latLngs, ratio) {
	        latLngs = (latLngs instanceof L.Polyline) ? latLngs.getLatLngs() : latLngs;
	        var n = latLngs.length;
	        if (n < 2) {
	            return null;
	        }

	        // ensure the ratio is between 0 and 1;
	        ratio = Math.max(Math.min(ratio, 1), 0);

	        if (ratio === 0) {
	            return {
	                latLng: latLngs[0] instanceof L.LatLng ? latLngs[0] : L.latLng(latLngs[0]),
	                predecessor: -1
	            };
	        }
	        if (ratio == 1) {
	            return {
	                latLng: latLngs[latLngs.length -1] instanceof L.LatLng ? latLngs[latLngs.length -1] : L.latLng(latLngs[latLngs.length -1]),
	                predecessor: latLngs.length - 2
	            };
	        }

	        // project the LatLngs as Points,
	        // and compute total planar length of the line at max precision
	        var maxzoom = map.getMaxZoom();
	        if (maxzoom === Infinity)
	            maxzoom = map.getZoom();
	        var pts = [];
	        var lineLength = 0;
	        for(var i = 0; i < n; i++) {
	            pts[i] = map.project(latLngs[i], maxzoom);
	            if(i > 0)
	              lineLength += pts[i-1].distanceTo(pts[i]);
	        }

	        var ratioDist = lineLength * ratio;
	        var a = pts[0],
	            b = pts[1],
	            distA = 0,
	            distB = a.distanceTo(b);
	        // follow the line segments [ab], adding lengths,
	        // until we find the segment where the points should lie on
	        var index = 1;
	        for (; index < n && distB < ratioDist; index++) {
	            a = b;
	            distA = distB;
	            b = pts[index];
	            distB += a.distanceTo(b);
	        }
	        // compute the ratio relative to the segment [ab]
	        var segmentRatio = ((distB - distA) !== 0) ? ((ratioDist - distA) / (distB - distA)) : 0;
	        var interpolatedPoint = L.GeometryUtil.interpolateOnPointSegment(a, b, segmentRatio);
	        return {
	            latLng: map.unproject(interpolatedPoint, maxzoom),
	            predecessor: index-2
	        };
	    },

	    /**
	        Returns a float between 0 and 1 representing the location of the
	        closest point on polyline to the given latlng, as a fraction of total line length.
	        (opposite of L.GeometryUtil.interpolateOnLine())
	        @param {L.Map} map Leaflet map to be used for this method
	        @param {L.PolyLine} polyline Polyline on which the latlng will be search
	        @param {L.LatLng} latlng The position to search
	        @returns {Number} Float between 0 and 1
	    */
	    locateOnLine: function (map, polyline, latlng) {
	        var latlngs = polyline.getLatLngs();
	        if (latlng.equals(latlngs[0]))
	            return 0.0;
	        if (latlng.equals(latlngs[latlngs.length-1]))
	            return 1.0;

	        var point = L.GeometryUtil.closest(map, polyline, latlng, false),
	            lengths = L.GeometryUtil.accumulatedLengths(latlngs),
	            total_length = lengths[lengths.length-1],
	            portion = 0,
	            found = false;
	        for (var i=0, n = latlngs.length-1; i < n; i++) {
	            var l1 = latlngs[i],
	                l2 = latlngs[i+1];
	            portion = lengths[i];
	            if (L.GeometryUtil.belongsSegment(point, l1, l2)) {
	                portion += l1.distanceTo(point);
	                found = true;
	                break;
	            }
	        }
	        if (!found) {
	            throw "Could not interpolate " + latlng.toString() + " within " + polyline.toString();
	        }
	        return portion / total_length;
	    },

	    /**
	        Returns a clone with reversed coordinates.
	        @param {L.PolyLine} polyline polyline to reverse
	        @returns {L.PolyLine} polyline reversed
	    */
	    reverse: function (polyline) {
	        return L.polyline(polyline.getLatLngs().slice(0).reverse());
	    },

	    /**
	        Returns a sub-part of the polyline, from start to end.
	        If start is superior to end, returns extraction from inverted line.
	        @param {L.Map} map Leaflet map to be used for this method
	        @param {L.PolyLine} polyline Polyline on which will be extracted the sub-part
	        @param {Number} start ratio, expressed as a decimal between 0 and 1, inclusive
	        @param {Number} end ratio, expressed as a decimal between 0 and 1, inclusive
	        @returns {Array<L.LatLng>} new polyline
	     */
	    extract: function (map, polyline, start, end) {
	        if (start > end) {
	            return L.GeometryUtil.extract(map, L.GeometryUtil.reverse(polyline), 1.0-start, 1.0-end);
	        }

	        // Bound start and end to [0-1]
	        start = Math.max(Math.min(start, 1), 0);
	        end = Math.max(Math.min(end, 1), 0);

	        var latlngs = polyline.getLatLngs(),
	            startpoint = L.GeometryUtil.interpolateOnLine(map, polyline, start),
	            endpoint = L.GeometryUtil.interpolateOnLine(map, polyline, end);
	        // Return single point if start == end
	        if (start == end) {
	            var point = L.GeometryUtil.interpolateOnLine(map, polyline, end);
	            return [point.latLng];
	        }
	        // Array.slice() works indexes at 0
	        if (startpoint.predecessor == -1)
	            startpoint.predecessor = 0;
	        if (endpoint.predecessor == -1)
	            endpoint.predecessor = 0;
	        var result = latlngs.slice(startpoint.predecessor+1, endpoint.predecessor+1);
	        result.unshift(startpoint.latLng);
	        result.push(endpoint.latLng);
	        return result;
	    },

	    /**
	        Returns true if first polyline ends where other second starts.
	        @param {L.PolyLine} polyline First polyline
	        @param {L.PolyLine} other Second polyline
	        @returns {bool}
	    */
	    isBefore: function (polyline, other) {
	        if (!other) return false;
	        var lla = polyline.getLatLngs(),
	            llb = other.getLatLngs();
	        return (lla[lla.length-1]).equals(llb[0]);
	    },

	    /**
	        Returns true if first polyline starts where second ends.
	        @param {L.PolyLine} polyline First polyline
	        @param {L.PolyLine} other Second polyline
	        @returns {bool}
	    */
	    isAfter: function (polyline, other) {
	        if (!other) return false;
	        var lla = polyline.getLatLngs(),
	            llb = other.getLatLngs();
	        return (lla[0]).equals(llb[llb.length-1]);
	    },

	    /**
	        Returns true if first polyline starts where second ends or start.
	        @param {L.PolyLine} polyline First polyline
	        @param {L.PolyLine} other Second polyline
	        @returns {bool}
	    */
	    startsAtExtremity: function (polyline, other) {
	        if (!other) return false;
	        var lla = polyline.getLatLngs(),
	            llb = other.getLatLngs(),
	            start = lla[0];
	        return start.equals(llb[0]) || start.equals(llb[llb.length-1]);
	    },

	    /**
	        Returns horizontal angle in degres between two points.
	        @param {L.Point} a Coordinates of point A
	        @param {L.Point} b Coordinates of point B
	        @returns {Number} horizontal angle
	     */
	    computeAngle: function(a, b) {
	        return (Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI);
	    },

	    /**
	       Returns slope (Ax+B) between two points.
	        @param {L.Point} a Coordinates of point A
	        @param {L.Point} b Coordinates of point B
	        @returns {Object} with ``a`` and ``b`` properties.
	     */
	    computeSlope: function(a, b) {
	        var s = (b.y - a.y) / (b.x - a.x),
	            o = a.y - (s * a.x);
	        return {'a': s, 'b': o};
	    },

	    /**
	       Returns LatLng of rotated point around specified LatLng center.
	        @param {L.LatLng} latlngPoint: point to rotate
	        @param {double} angleDeg: angle to rotate in degrees
	        @param {L.LatLng} latlngCenter: center of rotation
	        @returns {L.LatLng} rotated point
	     */
	    rotatePoint: function(map, latlngPoint, angleDeg, latlngCenter) {
	        var maxzoom = map.getMaxZoom();
	        if (maxzoom === Infinity)
	            maxzoom = map.getZoom();
	        var angleRad = angleDeg*Math.PI/180,
	            pPoint = map.project(latlngPoint, maxzoom),
	            pCenter = map.project(latlngCenter, maxzoom),
	            x2 = Math.cos(angleRad)*(pPoint.x-pCenter.x) - Math.sin(angleRad)*(pPoint.y-pCenter.y) + pCenter.x,
	            y2 = Math.sin(angleRad)*(pPoint.x-pCenter.x) + Math.cos(angleRad)*(pPoint.y-pCenter.y) + pCenter.y;
	        return map.unproject(new L.Point(x2,y2), maxzoom);
	    },

	    /**
	       Returns the bearing in degrees clockwise from north (0 degrees)
	       from the first L.LatLng to the second, at the first LatLng
	       @param {L.LatLng} latlng1: origin point of the bearing
	       @param {L.LatLng} latlng2: destination point of the bearing
	       @returns {float} degrees clockwise from north.
	    */
	    bearing: function(latlng1, latlng2) {
	        var rad = Math.PI / 180,
	            lat1 = latlng1.lat * rad,
	            lat2 = latlng2.lat * rad,
	            lon1 = latlng1.lng * rad,
	            lon2 = latlng2.lng * rad,
	            y = Math.sin(lon2 - lon1) * Math.cos(lat2),
	            x = Math.cos(lat1) * Math.sin(lat2) -
	                Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);

	        var bearing = ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
	        return bearing >= 180 ? bearing-360 : bearing;
	    },

	    /**
	       Returns the point that is a distance and heading away from
	       the given origin point.
	       @param {L.LatLng} latlng: origin point
	       @param {float}: heading in degrees, clockwise from 0 degrees north.
	       @param {float}: distance in meters
	       @returns {L.latLng} the destination point.
	       Many thanks to Chris Veness at http://www.movable-type.co.uk/scripts/latlong.html
	       for a great reference and examples.
	    */
	    destination: function(latlng, heading, distance) {
	        heading = (heading + 360) % 360;
	        var rad = Math.PI / 180,
	            radInv = 180 / Math.PI,
	            R = 6378137, // approximation of Earth's radius
	            lon1 = latlng.lng * rad,
	            lat1 = latlng.lat * rad,
	            rheading = heading * rad,
	            sinLat1 = Math.sin(lat1),
	            cosLat1 = Math.cos(lat1),
	            cosDistR = Math.cos(distance / R),
	            sinDistR = Math.sin(distance / R),
	            lat2 = Math.asin(sinLat1 * cosDistR + cosLat1 *
	                sinDistR * Math.cos(rheading)),
	            lon2 = lon1 + Math.atan2(Math.sin(rheading) * sinDistR *
	                cosLat1, cosDistR - sinLat1 * Math.sin(lat2));
	        lon2 = lon2 * radInv;
	        lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
	        return L.latLng([lat2 * radInv, lon2]);
	    }
	});

	return L.GeometryUtil;

	}));


/***/ },
/* 7 */
/***/ function(module, exports) {

	/*
	 * L.CircleEditor is an extension of L.Circle, just to add the edition part (remember, radius in meters).
	 */

	L.CircleEditor = L.Circle.extend ({

	    options: {
	        icon: new L.DivIcon({
	            iconSize: new L.Point(8, 8),
	            className: 'leaflet-div-icon leaflet-editing-icon'
	        }),
	        extendedIconClass : 'extend-icon'
	    },

	    onAdd: function (map) {
	        L.Path.prototype.onAdd.call(this, map);

	        this.addHooks();
	    },

	    onRemove: function (map) {
	        this.removeHooks();

	        L.Path.prototype.onRemove.call(this, map);
	    },


	    addHooks: function () {
	        if (this._map) {
	            if (!this._markerGroup) {
	                this._initMarkers();
	            }
	            this._map.addLayer(this._markerGroup);
	        }
	    },

	    removeHooks: function () {
	        if (this._map) {
	            this._map.removeLayer(this._markerGroup);
	            delete this._markerGroup;
	            delete this._markers;
	        }
	    },

	    updateMarkers: function () {
	        this._markerGroup.clearLayers();
	        this._initMarkers();
	    },

	    _initMarkers: function () {
	        this._markerGroup = new L.LayerGroup();
	        this._markers = [];

	        var markerCenter = this._createMarker(this._latlng, 0, true);
	        this._markers.push(markerCenter);

	        var circleBounds = this.getBounds(),
	            center = circleBounds.getCenter(),
	            neCoord = circleBounds.getNorthEast(),
	            northCenterCoord = new L.LatLng(center.lat, neCoord.lng, true);
	            markerNorthCenter = this._createMarker(northCenterCoord, 1);
	        this._markers.push(markerNorthCenter);
	    },

	    _createMarker: function (latlng, index, isCenter) {
	        var marker = new L.Marker(latlng, {
	            draggable: true,
	            icon: this.options.icon
	        });

	        if (isCenter === undefined) {
	            isCenter = false;
	        }
	        //console.log("this is center point: " + isCenter);

	        marker._origLatLng = latlng;
	        marker._index = index;
	        marker._isCenter = isCenter;

	        if (isCenter) {
	            marker.on('drag', this._onCenterMove, this)
	                  .on('dragend', this._onCenterMoveEnd, this);
	        } else {
	            marker.on('drag', this._onMarkerDrag, this);
	        }
	        marker.on('dragend', this._fireEdit, this)
	              .on('mouseover', this._onMouseOver, this)
	              .on('mouseout', this._onMouseOut, this);

	        this._markerGroup.addLayer(marker);

	        return marker;
	    },
	    _onMouseOver: function (e) {
	        var target = e.target,
	            icon = target._icon,
	            classValues = icon.getAttribute("class");
	        //icon.setAttribute("class", "extend-icon " + classValues);
	        icon.setAttribute("class", this.options.extendedIconClass + " " + classValues);
	    },
	    _onMouseOut: function (e) {
	        var target = e.target,
	            icon = target._icon,
	            classValues = icon.getAttribute("class");
	        //icon.setAttribute("class", classValues.replace("extend-icon", ""));
	        icon.setAttribute("class", classValues.replace(this.options.extendedIconClass, ""));
	    },

	    _fireEdit: function () {
	        this.fire('edit');
	    },

	    _onCenterMove: function (e) {
	        var marker = e.target;
	        //console.log("center move - START");

	        L.Util.extend(marker._origLatLng, marker._latlng);

	        var mm = this._markers[1];
	        mm.setOpacity(0.1);

	        this.redraw();
	        
	        //console.log("END");
	    },

	    _onCenterMoveEnd: function (e) {
	        var marker = e.target;
	        
	        //now resetting the side point
	        var circleBounds = this.getBounds(),
	            center = circleBounds.getCenter(),
	            neCoord = circleBounds.getNorthEast(),
	            northCenterCoord = new L.LatLng(center.lat, neCoord.lng, true);

	        var mm = this._markers[1];
	        mm.setLatLng(northCenterCoord);
	        mm.setOpacity(1);

	        this.fire('centerchange');
	    },

	    _onMarkerDrag: function (e) {
	        var marker = e.target;
	        //console.log("marker drag - START");
	        var center = this._markers[0].getLatLng();
	        var axis = marker._latlng;

	        var distance = center.distanceTo(axis);

	        this.setRadius(distance);
	        
	        this.redraw();
	        //console.log("END");

	        this.fire('radiuschange');
	    },

	    centerchange: function() {},
	    radiuschange: function() {}
	});


/***/ },
/* 8 */
/***/ function(module, exports) {

	/*
	  This measuring tool is created to measure the distance between different points.
	  * It allows to set the icons for the markers.
	  * Sets a css class for the popup information (which you can style it yourself).
	  * Sets the line with a css class so you can manipulate it as well.
	  * You can measure the distance between multiple points.
	  * You can indicate if you want to show the distance between each point, 
	    the total distance or both.
	  * You can indicate if the popups show a close button.
	*/
	L.MeasuringTool = L.Class.extend({
	    initialize: function (map, options, iconStart, iconEnd) {
	        L.Util.setOptions(this, options);
	        this._map = map;
	        this._layer = new L.LayerGroup().addTo(this._map);
	        this._popupLayer = new L.LayerGroup().addTo(this._map);
	        this._totalDistancePopup;

	        this._measureLine = null;
	        this._distancePopupList = [];
	        this._markerList = [];

	        this._markerIcons = null;
	        if (iconStart || iconEnd) {
	            this._markerIcons = [iconStart, iconEnd];
	        }
	    },

	    options: {
	        minWidth: 50,
	        autoPan: false,
	        closeButton: true, // should the popups have a close option?
	        displayTotalDistance: true,
	        displayPartialDistance: false,
	        className: 'measuring-label', /*css label class name*/
	        lineClassName: 'measuring-line-class', /*css class name for the line*/
		    popupTemplate: '<b>Total distance:</b></br>{distance}m',
		    popupAnchor: [0, -25]
	    },

	    enable: function() {
	        this._map.on('click', this._addMarker, this);
	    },

	    disable: function () {
	        this._map.off('click', this._addMarker, this);

	        while (this._distancePopupList.length > 0) {
	            this._layer.removeLayer(this._distancePopupList.pop());
	        }
	        
	        if (this._measureLine) {
	            this._layer.removeLayer(this._measureLine);
	            this._measureLine = undefined;
	        }

	        for (var i = 0; this._markerList.length; i++) {
	            var marker = this._markerList.pop();
	            marker.off('drag', this._updateRuler, this)
	                  .off('contextmenu', this._removeMarker, this);

	            this._layer.removeLayer(marker);
	        }

	        this._popupLayer.clearLayers();
	        this._layer.clearLayers();
	    },

	    // on click => adds a new point to the line
	    _addMarker: function(e) {
	        var markerPosition = this._markerList.length;

	        var markerLocation = e.latlng;
	        // created and adds the marker to the map
	        var marker = new L.Marker(markerLocation, {draggable:true});
	        this._layer.addLayer(marker);

	        // sets the marker with the correct icons (if previously set)
	        if (this._markerIcons && this._markerIcons.length == 2) {
	            if (markerPosition == 0) { // if it is the first one
	                marker.setIcon(this._markerIcons[0]);
	            } else {
	                marker.setIcon(this._markerIcons[1]);
	                this._markerList[markerPosition - 1].setIcon(this._markerIcons[0]);
	            }
	        }

	        // setting the position to the marker
	        // (it is used when moving them or removing them)
	        marker._pos = markerPosition;
	        marker.on('drag', this._updateRuler, this)
	              .on('contextmenu', this._removeMarker, this);

	        this._markerList.push(marker);
	        this._setupLine();

	        // show total distance after there are at least 2 points
	        if (markerPosition >= 1) {
	            this._showTotalDistance();
	        }
	    },

	    // on right click => remove the point from the line
	    _removeMarker: function(e) {
	        var target = e.target;

	        // removing the popup showing the total distance as it will
	        // be recalculated
	        this._popupLayer.removeLayer(this._totalDistancePopup);

	        // removing the point from the polyline
	        var listLatng = this._measureLine.getLatLngs();
	        listLatng.splice(target._pos, 1);
	        this._measureLine.setLatLngs(listLatng);

	        // removing the marker
	        var deleteMarker = this._markerList.splice(target._pos, 1);
	        this._layer.removeLayer(deleteMarker[0]);

	        var totalMarkers = this._markerList.length;
	        // removing the popups involved and update the distance between
	        // the new neighbouring points
	        if (target._pos == 0) { // first point
	            this._distancePopupList.splice(target._pos, 1);

	            if (totalMarkers > 1) {
	                var startLatLng = this._markerList[target._pos].getLatLng(),
	                    endLatLng = this._markerList[target._pos + 1].getLatLng();

	                this._setDistancePopup(startLatLng, endLatLng, 1);
	            }
	        } else if (target._pos == listLatng.length) { // last point
	            this._distancePopupList.pop();

	            if (totalMarkers > 1) {
	                var startLatLng = this._markerList[target._pos - 2].getLatLng(),
	                    endLatLng = this._markerList[target._pos - 1].getLatLng();

	                this._setDistancePopup(startLatLng, endLatLng, target._pos - 1);
	            }
	        } else { // point in the middle
	            this._distancePopupList.splice(target._pos, 1);

	            var startLatLng = this._markerList[target._pos - 1].getLatLng(),
	                endLatLng = this._markerList[target._pos].getLatLng();
	            this._setDistancePopup(startLatLng, endLatLng, target._pos);
	        }

	        // update the position numbers on the marker list
	        for (var i = 0; i < this._markerList.length; i++) {
	            this._markerList[i]._pos = i;
	        }

	        // show the updated total distance
	        this._showTotalDistance();
	    },

	    // creates the line and adds the additional points for every click on the map
	    _setupLine: function() {
	        var totalMarkers = this._markerList.length;
	        // do nothing in case there is only one point
	        if (totalMarkers <= 1) {
	            return;
	        }

	        // getting the old last two points of the line
	        var startLatLng = this._markerList[totalMarkers - 2].getLatLng(),
	            endLatLng = this._markerList[totalMarkers - 1].getLatLng();

	        // if there are two points => create the line
	        if (totalMarkers == 2) {
	            //Do not worry, I decided to set this as the standard behaviour.
	            //But you can change the style by setting your own class "lineClassName"
	            this._measureLine = new L.Polyline(
	                [startLatLng, endLatLng ], 
	                { color: "black", opacity: 0.5, stroke: true });

	            this._layer.addLayer(this._measureLine);
	            this._measureLine._path.setAttribute("class", this.options['lineClassName']);

	            // setting up the popup for the total distance
	            this._totalDistancePopup = new L.Popup(this.options, this._measureLine);
	        } else { // for every extra point just add the new point to the line
	            this._measureLine.addLatLng(endLatLng);
	        }

	        this._setDistancePopup(startLatLng, endLatLng, totalMarkers - 1);
	    },

	    // obtains the distance between two points and 
	    // updates the information for that segment
	    _setDistancePopup: function(startLatLng, endLatLng, index) {
	        var centerPos = new L.LatLng((startLatLng.lat + endLatLng.lat)/2, 
	                                     (startLatLng.lng + endLatLng.lng)/2),
	            distance = startLatLng.distanceTo(endLatLng);

	        this.setContent(distance, centerPos, index);
	        this._showSegmentsInfo();
	    },

	    // updates the segment information in case that segment has been updated
	    // when dragging the markers
	    _updateRuler: function (e) {
	        // if there is no line => do nothing
	        if (!this._measureLine) {
	            return;
	        }

	        var target = e.target,
	            listLatng = this._measureLine.getLatLngs();

	        // updating line with the new point
	        listLatng[target._pos] = target.getLatLng();
	        // setting the new coordingates to the line
	        this._measureLine.setLatLngs(listLatng);

	        // updating each of the segments which were afected by the 
	        // move
	        if (target._pos == 0) { // first marker
	            var startLatLng = this._markerList[0].getLatLng(),
	                endLatLng = this._markerList[1].getLatLng();
	            this._setDistancePopup(startLatLng, endLatLng, 1);
	        } else if (target._pos == listLatng.length - 1) { // last marker
	            var totalMarkers = this._markerList.length,
	                startLatLng = this._markerList[totalMarkers - 2].getLatLng(),
	                endLatLng = this._markerList[totalMarkers - 1].getLatLng();
	            this._setDistancePopup(startLatLng, endLatLng, target._pos);
	        } else { // markers in betweek
	            var startLatLng = this._markerList[target._pos - 1].getLatLng(),
	                endLatLng = this._markerList[target._pos].getLatLng();
	            this._setDistancePopup(startLatLng, endLatLng, target._pos);

	            var startLatLng = endLatLng,
	                endLatLng = this._markerList[target._pos + 1].getLatLng();
	            this._setDistancePopup(startLatLng, endLatLng, target._pos + 1);
	        }

	        this._showTotalDistance();
	    },

	    // shows the popups for every segment with its distance
	    _showSegmentsInfo: function() {
	        this._popupLayer.clearLayers();
	        // if the user decided not to show the partials => return
	        if (!this.options['displayPartialDistance']) {
	            return;
	        }

	        // this has to be done everytime I want to show more than one popup
	        // at the same time
	        for (var i = 0; i < this._distancePopupList.length; i++) {
	            var popup = this._distancePopupList[i];
	            this._popupLayer.addLayer(popup);
	        }
	    },

	    // shows a popup displaying the total distance of the line
	    _showTotalDistance: function() {
	        // if the user decided not to show the total distance => return
	        if (!this.options['displayTotalDistance']) {
	            return;
	        }
	        // if there are less than 2 points => no point of showing anything
	        var totalMarkers = this._markerList.length;
	        if (totalMarkers < 2) {
	            return;
	        }

	        // calculating the total distance
	        var totalDistance = 0;
	        for (var i = 0; i < this._distancePopupList.length; i++) {
	            var popup = this._distancePopupList[i];
	            totalDistance += popup._distance;
	        }

	        // getting the last marker, whom will be the one showing the info
	        var marker = this._markerList[totalMarkers - 1];
	        // setting the correct content to the popup
		    var content = L.Util.template(this.options.popupTemplate, {distance: totalDistance.toFixed(2)});
	        this._totalDistancePopup.setContent(content);
	        // moving the popup a bit on top so it doesn't hide the last marker
		    var popupAnchor = L.point(this.options.popupAnchor);
	        var shiftedPosition = this._shiftPosition(marker.getLatLng(), popupAnchor.y, popupAnchor.x)
	        this._totalDistancePopup.setLatLng(shiftedPosition);
	        // displaying the popup
	        this._popupLayer.addLayer(this._totalDistancePopup);
	    },

	    // helper funtion to shift a point
	    _shiftPosition: function (latlng, northPx, eastPx) {
	        var p1 = this._map.latLngToLayerPoint(latlng);
	        p1.y += northPx;
	        p1.x += eastPx;
	        return this._map.layerPointToLatLng(p1);
	    },

	    // updates the information for a segment
	    setContent: function (distance, coord, index) {
	        var popup = this._distancePopupList[index - 1];
	        // if the popup for the segment does not exist => create one
	        if (!popup) {
	            popup = new L.Popup(this.options, this._measureLine);
	            this._distancePopupList.push(popup);
	        }

		    var content = L.Util.template(this.options.popupTemplate, {distance: distance.toFixed(2)});
	        popup.setContent(content);
	        popup.setLatLng(coord);

	        // storing the partial distance in the popup
	        popup._distance = distance;
	    },

	    fire: function (fnName, params) {
	        if (fnName) {
	            console.log("fn called is: " + fnName);
	            if (this[fnName]) {
	                this[fnName](params);
	            }
	        }
	    },

	    popupopen: function(obj) {},
	    popupclose: function(obj) {}
	});


/***/ },
/* 9 */
/***/ function(module, exports) {

	/*The class shows the length of each of the side for a Polygon and Polyline.
	* The distance is displayed in meter or kilometes.
	* If the distance between each side is too small (by default 40m.) then instead of
	* the distance a letter is shown for all sides and a pop over is shown on the side
	* which includes the values for each of the letters.
	* If the area is too small (becuase you zoomed out too much) the info is not shown.
	* Included a limit on number of sides. Which is helpful is you think that showing more
	* than 8, 10, 20 sides values is not helpful.
	*
	* TODOS:
	*    1) Handling on IE7/8 is not the best, it works by showing all the sides of all
	        the polygons/polylines.
	*    2) If the area is too small, only the pop over should be shown, showing the area
	        or total length.
	*/

	L.PolySideLabel = L.Class.extend({

	    options: {
	        minWidth: 40,
	        autoPan: false,
	        closeButton: false,
	        className: 'poly-label',
	        offset: new L.Point(0, -20),
	        minSideLength: 40, //Min length for a side in meters before using Charactes
	        minAreaToShow: 0.0025, //Min area for which is worth showing the distance info
	        bordersLimit: 8
	    },
	    
	    initialize: function (polyObj, options) {
	        L.Util.setOptions(this, options);
	        this._polygon = polyObj;
	        this._labelsList = [];
	        this._numberOfBordersLimit = this.options.bordersLimit;
	        this._isViewable = null;

	        //If it is attached to the map
	        //and it has sides (circles won't work here)
	        //then labels will be added to each side of the polygon
	        if (this._polygon._path && this._hasSides(this._polygon)) { //this._polygon.getLatLngs) {
	            L.DomEvent
	                .addListener(this._polygon._path, 'mouseover', this._showLabels, this)
	                .addListener(this._polygon._path, 'mouseout', this._hideLabels, this);

	            this._map = this._polygon._map;

	            //NOTE: Doing this, will show all the labels for all the geometries when you are over one geometry
	            //This part will only work for IE7 and IE8
	            var _this = this;
	            $(".leaflet-vml-shape")
	                .mouseover(function () { _this._showLabels(); })
	                .mouseout(function () { _this._hideLabels(); });
	                
	            this._map.on("zoomend", this._isLabelViewable, this);
	            this._isLabelViewable();
	        }
	    },

	    /*TODO: This method should be re writen, it is too messy*/
	    _showLabels: function () {
	        if (this._labelsList.length > 0) {
	            console.log('the label list is full');
	            return;
	        }
	        if (!this._isViewable) {
	            console.log('it is too small to be viewable');
	            return;
	        }

	        //var sum = 0;
	        var charCounter = 65;
	        this.myDescription = "";
	        var showLabels = true;

	        var latlngs = this._polygon.getLatLngs();
	        var numberOfSides = latlngs.length;
	        var isPolygon = this._isPolygon(this._polygon);
	        if (!isPolygon) {
	            numberOfSides--;
	        }

	        if (latlngs.length > this._numberOfBordersLimit) {
	            showLabels = false;
	            console.log('max number of borders: '+this._numberOfBordersLimit+', there are: ' + latlngs.length);
	            return;
	        }

	        var pointsArray = [];
	        var distance;
	        var isSmall = false;
	        var nextPoint = 1;
	        var i = 0;
	        for (i = 0; i < numberOfSides; i++) {
	            if ((nextPoint == numberOfSides) && (isPolygon)) {
	                nextPoint = 0;
	            }
	            distance = latlngs[i].distanceTo(latlngs[nextPoint]);
	     
	            if (showLabels) {
	                pointsArray.push({ Distance: distance,
	                    Coord: this._getMiddleLatLng(latlngs[i], latlngs[nextPoint]),
	                    Unit: this.LengthUnit(distance)
	                });
	                if (distance < this.options.minSideLength /*meters*/) {
	                    isSmall = true;
	                }
	            }
	            nextPoint++;
	        }
	        if (showLabels) {
	            var pu, description = "";
	            for (i = 0; i < pointsArray.length; i++) {
	                pu = new L.Popup(this.options, this._polygon);
	                pu.setContent(isSmall ? String.fromCharCode(charCounter) : pointsArray[i].Unit);
	                pu.setLatLng(pointsArray[i].Coord);

	                this._map.addLayer(pu);
	                //this._map.fire('popupopen', {popup: pu});

	                this._labelsList.push(pu);

	                description += String.fromCharCode(charCounter++) + ": " + pointsArray[i].Unit + "<br/>";
	            }

	            if (isSmall) {
	                var bounds = this._polygon.getBounds();
	                var latLngNE = bounds.getNorthEast();
	                latLngNE = this._shiftPosition(latLngNE, 0, 35);
	                pu = new L.Popup(this.options, this._polygon);
	                pu.setContent(description);
	                pu.setLatLng(latLngNE);
	                this._map.addLayer(pu);
	                this._map.fire('popupopen', {popup: pu});

	                this._labelsList.push(pu);
	            }
	        }
	    },

	    _getMiddleLatLng: function (latlng1, latlng2) {
	        var p1 = this._map.latLngToLayerPoint(latlng1),
	            p2 = this._map.latLngToLayerPoint(latlng2);

	        return this._map.layerPointToLatLng(p1._add(p2).divideBy(2));
	    },

	    _shiftPosition: function (latlng, northPx, eastPx) {
	        var p1 = this._map.latLngToLayerPoint(latlng);
	        p1.y += northPx;
	        p1.x += eastPx;
	        return this._map.layerPointToLatLng(p1);
	    },

	    _hasSides: function () {
	        //polygon inherits from polyline, so all polygons are polylines
	        if (this._polygon instanceof L.Polyline) {
	            return true;
	        }
	        return false;
	    },

	    _isPolygon: function () {
	        if (this._polygon instanceof L.Polygon) {
	            return true;
	        }
	        return false;
	    },

	    _hideLabels: function () {
	        for (var i = 0; i < this._labelsList.length; i++) {
	            this._map.removeLayer(this._labelsList[i]);
	        }
	        this._labelsList = [];
	    },
	    
	    //This is thought as:
	    /*
	        Get the area of the geometry as well as the map area.
	        If the area of the geometry is less than 0.25% of the map
	        then it is too small to distinguish the sides and there for
	        it should not be drawn.
	    */
	    _isLabelViewable: function () {
	        var mapSize = this._map.getSize(),
	            mapArea = mapSize.x * mapSize.y,
	            polyBounds = this._polygon.getBounds();
	            polySW = this._map.project(polyBounds.getSouthWest()),
	            polyNE = this._map.project(polyBounds.getNorthEast()),
	            polyArea = Math.abs( (polySW.x - polyNE.x) * (polySW.y - polyNE.y) );
	        
	        var result = (polyArea/mapArea);
	        //console.log("% viewable: " + result + " --- poly area is: " + polyArea);
	        if (result < this.options.minAreaToShow /* in m2 ... 0.0025*/) {
	            this._isViewable = false;
	        }
	        this._isViewable = true;
	    },

	    LengthUnit: function (meters) {
	        var str = meters.toFixed(1) + "";
	        return meters > 999 ? ((str / 100) / 10).toFixed(1) + "km" : str + "m";
	    },

	    AreaUnit: function (meters) {
	        var str = meters.toFixed(1) + "";
	        if (meters > 1000000) {
	            return ((meters / 1000000) / 10).toFixed(1) + "km\xB2";
	        } else if (meters > 1000) {
	            return ((meters / 1000) / 10).toFixed(1) + "ha";
	        } else {
	            return str + "m\xB2";
	        }
	    }
	});



/***/ },
/* 10 */
/***/ function(module, exports) {

	L.River = L.Path.extend({
	    initialize: function (latlngs, options) {
	        L.setOptions(this, options);
	        this._setLatLngs(latlngs);
	    },

	});

	L.river = function (args) {
	    return new L.River(args);
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(12);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(14)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(13)();
	// imports


	// module
	exports.push([module.id, "html, body {\r\n    width: 100%;\r\n}\r\n\r\nbody {\r\n    background-color: #F3F3F3;\r\n}\r\n\r\n#map {\r\n    margin: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 13 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);