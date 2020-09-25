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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
const singleton_1 = __webpack_require__(2);
const INJECT_ITEMS = new Map();
class Injector {
    /**
     * Register a service for injection.
     * @param type The service type to be register.
     * @param value The associated value can be a factory function.
     * @param opitons The injection options.
     *
     * @example
     * Injector.register("", "default value");
     * Injector.register(Number, () => Math.random());
     * Injector.register(IDemo, new Demo());
     */
    static register(type, value, options) {
        const validTypes = ['function', 'number', 'string', 'symbol'];
        const valid = validTypes.indexOf(typeof type) >= 0;
        if (!valid) {
            throw new TypeError(`The 'type' parameter must be in ${validTypes}.`);
        }
        const factory = typeof value === "function" ? value : () => value;
        INJECT_ITEMS.set(type, factory);
        if (options === null || options === void 0 ? void 0 : options.alias) {
            INJECT_ITEMS.set(options.alias, factory);
        }
        singleton_1.Singleton.clear(type);
        return Injector;
    }
    /**
     * Register a service for injection.
     * @param type The service type to be register.
     * @param value The associated value must be a class.
     * @param opitons The injection options.
     *
     * @example
     * Injector.register("", "default value");
     * class Demo extens IDemo{}
     * Injector.register(IDemo, Demo);
     */
    static registerClass(type, value, options) {
        return this.register(type, (...args) => new value(...args), options);
    }
    /**
     * Get the value corresponding to a specific type, the type must be registered in advance.
     * If the type was't injected in advance and the `optional` options is absent or false, an error will be throw.
     * @param type The type registered.
     * @param options The injecttion options.
     *
     * @example
     * class Demo{}
     * Injector.register("demo", new Demo());
     * const instance = Injector.get("demo");
     * const typedInstance = Injector.get<Demo>("demo");
     */
    static get(type, options) {
        if (options === null || options === void 0 ? void 0 : options.optional) {
            return this.getOrDefault(type);
        }
        if (!INJECT_ITEMS.has(type)) {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection [source]:${options === null || options === void 0 ? void 0 : options.source}`);
        }
        const factory = INJECT_ITEMS.get(type);
        const args = options && Array.isArray(options.args) ? options.args : [];
        try {
            return factory.apply(null, args);
        }
        catch (e) {
            return new factory(...args);
        }
    }
    /**
     * Try Get the value corresponding to a specific type
     * @param type The type registered.
     * @param defaultValue The value returned by default.
     * @param options The injecttion options.
     *
     * @example
     * Injector.getOrDefault(ClassType, new ClassType());
     */
    static getOrDefault(type, defaultValue, options) {
        if (!INJECT_ITEMS.has(type)) {
            return defaultValue;
        }
        return this.get(type, options);
    }
    /**
     * Clear singleton of specified type, if type is omitted, clear all singletons of type.
     * @param type The specified type to clear
     */
    static clearSingletons(type) {
        if (type === undefined) {
            Array.from(INJECT_ITEMS.keys()).forEach(Injector.clearSingletons);
        }
        else if (INJECT_ITEMS.has(type)) {
            singleton_1.Singleton.clear(type);
        }
        else {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection to clear`);
        }
    }
}
exports.Injector = Injector;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Singleton = void 0;
const SINGLETON = Symbol();
function Singleton() {
    return function (target) {
        return class extends target {
            constructor(...args) {
                if (SINGLETON in target) {
                    return target[SINGLETON];
                }
                else {
                    super(...args);
                    target[SINGLETON] = this;
                }
            }
        };
    };
}
exports.Singleton = Singleton;
Singleton.clear = function (target) {
    if (typeof target === 'function') {
        if (SINGLETON in target) {
            do {
                delete target[SINGLETON];
                target = Object.getPrototypeOf(target);
            } while (target && target !== Object.prototype);
            return true;
        }
        else {
            return false;
        }
    }
    else if (target.constructor) {
        return Singleton.clear(target.constructor);
    }
    else {
        return false;
    }
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(8);
function isValid(obj) {
    return typeof obj === "object" && typeof obj.getMetadata === "function";
}
const reflect = (function () {
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(7)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Reflect = exports.Singleton = exports.Optional = exports.Injectable = exports.Inject = exports.Injector = void 0;
const tslib_1 = __webpack_require__(0);
var injector_1 = __webpack_require__(1);
Object.defineProperty(exports, "Injector", { enumerable: true, get: function () { return injector_1.Injector; } });
var inject_1 = __webpack_require__(5);
Object.defineProperty(exports, "Inject", { enumerable: true, get: function () { return inject_1.Inject; } });
Object.defineProperty(exports, "Injectable", { enumerable: true, get: function () { return inject_1.Injectable; } });
Object.defineProperty(exports, "Optional", { enumerable: true, get: function () { return inject_1.Optional; } });
var singleton_1 = __webpack_require__(2);
Object.defineProperty(exports, "Singleton", { enumerable: true, get: function () { return singleton_1.Singleton; } });
exports.Reflect = tslib_1.__importStar(__webpack_require__(3));


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Injectable = exports.Optional = exports.Inject = exports.INJECTED_ARGUMENTS = void 0;
const tslib_1 = __webpack_require__(0);
const constants_1 = __webpack_require__(6);
const injector_1 = __webpack_require__(1);
const reflect_1 = tslib_1.__importDefault(__webpack_require__(3));
exports.INJECTED_ARGUMENTS = Symbol();
/**
 * Tag arguments or properties to inject.
 * @param options Injection options
 */
function Inject(options) {
    const opt = options && typeof options === 'object' ? options : { type: options };
    return function (target, name, index) {
        if (name && typeof target !== 'function' && index === undefined) {
            // properties
            let type = reflect_1.default.getOwnMetadata(constants_1.DESIGN_TYPE, target, name);
            type = opt.type !== undefined ? opt.type : (type || name);
            opt.source = opt.source || `the property ${name} in class ${target.constructor.name}`;
            Object.defineProperty(target, name, { get: () => injector_1.Injector.get(type, opt) });
        }
        else if (typeof index === 'number' && !name) {
            // constructor arguments
            let metadata = reflect_1.default.getOwnMetadata(exports.INJECTED_ARGUMENTS, target);
            metadata = metadata || new Map();
            const className = target.constructor.name;
            opt.source = opt.source || `the ${index}th argument in ${className} constructor`;
            metadata.set(index, opt);
            reflect_1.default.defineMetadata(exports.INJECTED_ARGUMENTS, metadata, target);
        }
        else {
            console.warn('The decorater @Inject must used in properties or methods', target, name, index, options);
        }
    };
}
exports.Inject = Inject;
/**
 * Tag optional arguments or properties to inject.
 * @param options Injection options
 */
function Optional(options) {
    return Inject(Object.assign({}, options, { optional: true }));
}
exports.Optional = Optional;
/**
 * Automatically inject properties or constructor arguments for the current class
 */
function Injectable(options) {
    return function (ctor) {
        const metadata = reflect_1.default.getOwnMetadata(exports.INJECTED_ARGUMENTS, ctor);
        const result = class extends ctor {
            constructor(...args) {
                const paramtypes = reflect_1.default.getOwnMetadata(constants_1.DESIGN_PARAM_TYPES, ctor) || [];
                paramtypes.forEach((t, index) => {
                    const meta = metadata && metadata.get(index);
                    const type = meta && meta.type !== undefined ? meta.type : t;
                    args[index] === undefined && (args[index] = injector_1.Injector.get(type, meta));
                });
                super(...args);
            }
        };
        Object.defineProperty(result, "name", { value: ctor.name });
        injector_1.Injector.registerClass(result, result, options);
        return result;
    };
}
exports.Injectable = Injectable;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.DESIGN_RETURN_TYPE = exports.DESIGN_TYPE = exports.DESIGN_PARAM_TYPES = void 0;
exports.DESIGN_PARAM_TYPES = "design:paramtypes";
exports.DESIGN_TYPE = "design:type";
exports.DESIGN_RETURN_TYPE = "design:returntype";


/***/ }),
/* 7 */
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
/* 8 */
/***/ (function(module, exports) {

module.exports = require("reflect-metadata");

/***/ })
/******/ ])));
//# sourceMappingURL=index.js.map