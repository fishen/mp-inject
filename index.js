(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var config_1 = __webpack_require__(2);
var constants_1 = __webpack_require__(3);
var reflect_1 = tslib_1.__importDefault(__webpack_require__(4));
var INJECT_ITEMS = new Map();
var Injector = (function () {
    function Injector() {
    }
    Injector.register = function (type, value) {
        if (typeof type !== "function") {
            throw new TypeError("The 'type' parameter must be a function type.");
        }
        var factory = typeof value === "function" ? value : function () { return value; };
        INJECT_ITEMS.set(type, factory);
    };
    Injector.get = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!INJECT_ITEMS.has(type)) {
            throw new Error("Missing type " + type.name + " injection");
        }
        var factory = INJECT_ITEMS.get(type);
        var prototype = factory.prototype;
        if (prototype && reflect_1.default.hasMetadata(constants_1.INJECTED_CLASS_TAG, prototype)) {
            return new (factory.bind.apply(factory, tslib_1.__spread([void 0], args)))();
        }
        return factory.apply(null, args);
    };
    Injector.config = function (options) {
        Object.assign(config_1.defaultConfigOptions, options);
    };
    Injector.bindProperties = function (thisArg, forcibly) {
        if (forcibly === void 0) { forcibly = false; }
        if (thisArg[constants_1.PROPERTIES_BOUND] && !forcibly) {
            return;
        }
        var properties = reflect_1.default.getMetadata(constants_1.INJECTED_PROPERTIES, thisArg);
        if (!properties) {
            return;
        }
        properties.forEach(function (_a) {
            var name = _a.name, type = _a.type, args = _a.args;
            return thisArg[name] = Injector.get.apply(Injector, tslib_1.__spread([type], args));
        });
        thisArg[constants_1.PROPERTIES_BOUND] = true;
    };
    return Injector;
}());
exports.Injector = Injector;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfigOptions = { bindPropertiesInConstructor: true };


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DESIGN_PARAM_TYPES = "design:paramtypes";
exports.DESIGN_TYPE = "design:type";
exports.DESIGN_RETURN_TYPE = "design:returntype";
exports.INJECTED_PROPERTIES = Symbol("injected properties");
exports.INJECTED_ARGUMENTS = Symbol("injected arguments");
exports.PROPERTIES_BOUND = Symbol("properties bound");
exports.INJECTED_CLASS_TAG = Symbol("injected class tag");


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(7);
function isValid(obj) {
    return typeof obj === "object" && typeof obj.getMetadata === "function";
}
var reflect = (function () {
    if (isValid(Reflect)) {
        return Reflect;
    }
    else if (isValid(global.Reflect)) {
        return global.Reflect;
    }
    else if (isValid(global.global && global.global.Reflect)) {
        return global.global.Reflect;
    }
    return {};
}());
exports.default = reflect;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)))

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = __webpack_require__(0);
exports.Injector = injector_1.Injector;
var inject_1 = __webpack_require__(8);
exports.inject = inject_1.inject;
exports.injectable = inject_1.injectable;
exports.injectFor = inject_1.injectFor;
exports.injectSelf = inject_1.injectSelf;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = __webpack_require__(1);
var config_1 = __webpack_require__(2);
var constants_1 = __webpack_require__(3);
var injector_1 = __webpack_require__(0);
var reflect_1 = tslib_1.__importDefault(__webpack_require__(4));
function defineData(metadataKey, metadataValue, target) {
    var arr = reflect_1.default.getMetadata(metadataKey, target);
    arr = arr ? arr.slice() : [];
    arr.push(metadataValue);
    reflect_1.default.defineMetadata(metadataKey, arr, target);
}
function bindProperties(ctor, method) {
    var original = ctor.prototype[method];
    if (typeof original === "function" || original === undefined) {
        ctor.prototype[method] = function () {
            var methodArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                methodArgs[_i] = arguments[_i];
            }
            injector_1.Injector.bindProperties(ctor.prototype);
            return original && original.apply(this, methodArgs);
        };
    }
}
function inject(options) {
    var opts = typeof options === "function" ? { type: options } : Object.assign({}, options);
    return function (target, name, index) {
        var _a = opts, type = _a.type, args = _a.args;
        args = Array.isArray(args) ? args : [];
        var ctor = target.constructor;
        if (index === undefined && typeof name === "string") {
            type = type || reflect_1.default.getMetadata(constants_1.DESIGN_TYPE, target, name);
            if (typeof type !== "function") {
                throw new Error("Unknown property type of [" + ctor.name + "|" + name + "].");
            }
            defineData(constants_1.INJECTED_PROPERTIES, { type: type, args: args, name: name }, target);
        }
        else if (typeof index === "number") {
            if (typeof type !== "function") {
                var types = reflect_1.default.getMetadata(constants_1.DESIGN_PARAM_TYPES, target);
                type = types[index];
                if (typeof type !== "function") {
                    throw new Error("Unknown argument type of [" + ctor.name + "," + index + "].");
                }
            }
            defineData(constants_1.INJECTED_ARGUMENTS, { type: type, args: args, name: name, index: index }, target);
        }
    };
}
exports.inject = inject;
function injectable(options) {
    var opts = Object.assign({}, config_1.defaultConfigOptions, options);
    var propertiesBinder = opts.propertiesBinder;
    var bindPropertiesInConstructor = opts.bindPropertiesInConstructor;
    return function (ctor) {
        reflect_1.default.defineMetadata(constants_1.INJECTED_CLASS_TAG, true, ctor.prototype);
        var hasProperties = reflect_1.default.hasMetadata(constants_1.INJECTED_PROPERTIES, ctor.prototype);
        if (!bindPropertiesInConstructor && hasProperties) {
            if (typeof propertiesBinder === "function") {
                propertiesBinder = propertiesBinder(ctor);
            }
            if (typeof propertiesBinder === "string") {
                if (propertiesBinder === "constructor") {
                    throw new Error("The propertiesBinder options cannot be 'constructor'.");
                }
                bindProperties(ctor, propertiesBinder);
            }
            else {
                bindProperties(ctor, "onLoad");
                bindProperties(ctor, "attached");
            }
        }
        var hasArguments = reflect_1.default.hasMetadata(constants_1.INJECTED_ARGUMENTS, ctor);
        if (hasProperties && bindPropertiesInConstructor || hasArguments) {
            return (function (_super) {
                tslib_1.__extends(class_1, _super);
                function class_1() {
                    var newArgs = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        newArgs[_i] = arguments[_i];
                    }
                    var _this = this;
                    bindPropertiesInConstructor && injector_1.Injector.bindProperties(ctor.prototype);
                    var injectedArgs = reflect_1.default.getMetadata(constants_1.INJECTED_ARGUMENTS, ctor) || [];
                    injectedArgs.forEach(function (_a) {
                        var index = _a.index, args = _a.args, type = _a.type;
                        return newArgs[index] = injector_1.Injector.get.apply(injector_1.Injector, tslib_1.__spread([type], args));
                    });
                    _this = _super.apply(this, tslib_1.__spread(newArgs)) || this;
                    return _this;
                }
                return class_1;
            }(ctor));
        }
    };
}
exports.injectable = injectable;
function injectFor(type) {
    return function (ctor) {
        injector_1.Injector.register(type || ctor, function () {
            var ctorArguments = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                ctorArguments[_i] = arguments[_i];
            }
            return new (ctor.bind.apply(ctor, tslib_1.__spread([void 0], ctorArguments)))();
        });
    };
}
exports.injectFor = injectFor;
function injectSelf() {
    return injectFor();
}
exports.injectSelf = injectSelf;


/***/ })
/******/ ])));
//# sourceMappingURL=index.js.map