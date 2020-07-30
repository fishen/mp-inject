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
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Injector = void 0;
const tslib_1 = __webpack_require__(1);
const config_1 = __webpack_require__(5);
const constants_1 = __webpack_require__(2);
const reflect_1 = tslib_1.__importDefault(__webpack_require__(3));
const INJECT_ITEMS = new Map();
class Injector {
    /**
     * Register a service for injection.
     * @param type The service type to be register.
     * @param value The associated value can be a factory function.
     * @param options The registration options.
     *
     * @example
     * Injector.register("", "default value");
     * Injector.register(0, () => Math.random());
     * class Demo{}
     * Injector.register(Demo, new Demo());
     */
    static register(type, value, options) {
        const validTypes = ['function', 'number', 'string', 'symbol'];
        const valid = validTypes.indexOf(typeof type) >= 0;
        if (!valid) {
            throw new TypeError(`The 'type' parameter must be in ${validTypes}.`);
        }
        const factory = typeof value === "function" ? value : () => value;
        INJECT_ITEMS.set(type, [factory, options]);
    }
    /**
     * Get the value corresponding to a specific type, the type must be registered in advance.
     * If the type was't injected in advance, an error will be throw.
     * @param type The type registered.
     * @param args The parameters required by the factory function.
     *
     * @example
     * class Demo{}
     * Injector.register("demo", new Demo());
     * const instance = ServiceManager.get("demo");
     * const typedInstance = ServiceManager.get<Demo>("demo");
     */
    static get(type, ...args) {
        if (!INJECT_ITEMS.has(type)) {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection`);
        }
        const [factory, options, instance] = INJECT_ITEMS.get(type);
        const prototype = factory.prototype;
        const singleton = type instanceof Object && options && options.singleton;
        if (singleton && instance !== undefined) {
            return instance;
        }
        let result;
        if (prototype && reflect_1.default.hasMetadata(constants_1.INJECTED_CLASS_TAG, prototype)) {
            result = new factory(...args);
        }
        else {
            result = factory.apply(null, args);
        }
        // tslint:disable-next-line
        singleton && (INJECT_ITEMS.get(type)[2] = result);
        return result;
    }
    /**
     * Try Get the value corresponding to a specific type
     * @param type The type registered.
     * @param defaultValue The value returned by default.
     * @param args The parameters required by the factory function.
     *
     * @example
     * Injector.getOrDefault(ClassType, new ClassType());R
     */
    static getOrDefault(type, defaultValue, ...args) {
        if (!INJECT_ITEMS.has(type)) {
            return defaultValue;
        }
        return this.get(type, ...args);
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
            INJECT_ITEMS.get(type)[2] = undefined;
        }
        else {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection to clear`);
        }
    }
    /**
     * Set global injection options
     * @param options injection options
     * @param target injection target
     */
    static config(options, target) {
        if (typeof target === "function") {
            target.prototype[constants_1.GLOBAL_CONFIG_KEY] = options;
        }
        else {
            Object.assign(config_1.defaultConfigOptions, options);
        }
    }
    /**
     * Binding injected property members
     * @param instance instance object
     * @param prototype prototype object
     */
    static bindProperties(instance, prototype) {
        const properties = reflect_1.default.getMetadata(constants_1.INJECTED_PROPERTIES, prototype);
        if (!properties) {
            return;
        }
        properties.forEach(({ name, type, args }) => {
            try {
                instance[name] = Injector.get(type, ...args);
            }
            catch (err) {
                console.error(name, prototype.constructor.name, err);
            }
        });
    }
    /**
     * Get global config options.
     * @param target injection target.
     * @param options inection options.
     */
    static getConfig(target, options) {
        target = target || {};
        const prototype = typeof target === "function" ? target.prototype : Object.getPrototypeOf(target);
        return Object.assign({}, config_1.defaultConfigOptions, prototype[constants_1.GLOBAL_CONFIG_KEY], options);
    }
}
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
exports.GLOBAL_CONFIG_KEY = exports.INJECTED_CLASS_TAG = exports.INJECTED_ARGUMENTS = exports.INJECTED_PROPERTIES = exports.DESIGN_RETURN_TYPE = exports.DESIGN_TYPE = exports.DESIGN_PARAM_TYPES = void 0;
exports.DESIGN_PARAM_TYPES = "design:paramtypes";
exports.DESIGN_TYPE = "design:type";
exports.DESIGN_RETURN_TYPE = "design:returntype";
exports.INJECTED_PROPERTIES = Symbol("injected properties");
exports.INJECTED_ARGUMENTS = Symbol("injected arguments");
exports.INJECTED_CLASS_TAG = Symbol("injected class tag");
exports.GLOBAL_CONFIG_KEY = Symbol("global config key");


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(7);
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

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(6)))

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var injector_1 = __webpack_require__(0);
Object.defineProperty(exports, "Injector", { enumerable: true, get: function () { return injector_1.Injector; } });
var inject_1 = __webpack_require__(8);
Object.defineProperty(exports, "inject", { enumerable: true, get: function () { return inject_1.inject; } });
Object.defineProperty(exports, "injectable", { enumerable: true, get: function () { return inject_1.injectable; } });
Object.defineProperty(exports, "injectFor", { enumerable: true, get: function () { return inject_1.injectFor; } });
Object.defineProperty(exports, "injectSelf", { enumerable: true, get: function () { return inject_1.injectSelf; } });


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfigOptions = void 0;
exports.defaultConfigOptions = {
    propertiesBinder: "constructor",
};


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
exports.injectSelf = exports.injectFor = exports.injectable = exports.inject = void 0;
const tslib_1 = __webpack_require__(1);
const constants_1 = __webpack_require__(2);
const injector_1 = __webpack_require__(0);
const reflect_1 = tslib_1.__importDefault(__webpack_require__(3));
/**
 * Tag arguments or properties to inject.
 */
function inject(options) {
    function bindInjections(metadataKey, metadataValue, target) {
        let arr = reflect_1.default.getMetadata(metadataKey, target);
        arr = arr ? arr.slice() : [];
        arr.push(metadataValue);
        reflect_1.default.defineMetadata(metadataKey, arr, target);
    }
    const opts = typeof options === "object" ? Object.assign({}, options) : { type: options };
    return function (target, name, index) {
        let { type, args } = opts;
        args = Array.isArray(args) ? args : [];
        const ctor = target.constructor;
        if (typeof index === 'number') {
            // params decorator
            if (type === undefined) {
                const types = reflect_1.default.getMetadata(constants_1.DESIGN_PARAM_TYPES, target, name);
                if (!types) {
                    throw new Error(`Please enable "emitDecoratorMetadata" option in tsconfig.json or set "type" option manually.`);
                }
                type = types[index];
                if (typeof type !== "function") {
                    throw new Error(`Unknown argument type of [${ctor.name}|${index}].`);
                }
            }
            bindInjections(constants_1.INJECTED_ARGUMENTS, { type, args, name, index }, target);
        }
        else if (typeof target !== "function") {
            // properties decorator
            if (type === undefined) {
                type = reflect_1.default.getMetadata(constants_1.DESIGN_TYPE, target, name);
                if (typeof type !== "function") {
                    throw new Error(`Unknown property type of [${ctor.name}|${name}].`);
                }
            }
            bindInjections(constants_1.INJECTED_PROPERTIES, { type, args, name }, target);
        }
    };
}
exports.inject = inject;
/**
 * Automatically inject properties or constructor arguments for the current class
 */
function injectable(options) {
    function bindProperties(ctor, method) {
        const original = ctor.prototype[method];
        if (typeof original === "function" || original === undefined) {
            ctor.prototype[method] = function (...methodArgs) {
                injector_1.Injector.bindProperties(this, ctor.prototype);
                return original && original.apply(this, methodArgs);
            };
        }
    }
    return function (ctor) {
        const { propertiesBinder } = injector_1.Injector.getConfig(ctor, options);
        reflect_1.default.defineMetadata(constants_1.INJECTED_CLASS_TAG, true, ctor.prototype);
        const bindPropertiesInConstructor = propertiesBinder === "constructor";
        const hasProperties = reflect_1.default.hasMetadata(constants_1.INJECTED_PROPERTIES, ctor.prototype);
        if (!bindPropertiesInConstructor && hasProperties && typeof propertiesBinder === "string") {
            bindProperties(ctor, propertiesBinder);
        }
        const hasArguments = reflect_1.default.hasMetadata(constants_1.INJECTED_ARGUMENTS, ctor);
        if (hasProperties && bindPropertiesInConstructor || hasArguments) {
            return class extends ctor {
                constructor(...newArgs) {
                    const injectedArgs = reflect_1.default.getMetadata(constants_1.INJECTED_ARGUMENTS, ctor) || [];
                    injectedArgs.filter(({ index }) => newArgs[index] === undefined)
                        .forEach(({ index, args, type }) => newArgs[index] = injector_1.Injector.get(type, ...args));
                    super(...newArgs);
                    // tslint:disable-next-line
                    hasProperties && bindPropertiesInConstructor && injector_1.Injector.bindProperties(this, ctor.prototype);
                }
            };
        }
    };
}
exports.injectable = injectable;
/**
 * Register the current class as a service of the specified type
 * @param type The type to register
 * @param options The injection options
 */
function injectFor(type, options) {
    return function (ctor) {
        injector_1.Injector.register(type || ctor, function (...ctorArguments) {
            return new ctor(...ctorArguments);
        }, options);
    };
}
exports.injectFor = injectFor;
/**
 * Register the current class as a service of the self type
 * @param options The injection options
 */
function injectSelf(options) {
    return injectFor(null, options);
}
exports.injectSelf = injectSelf;


/***/ })
/******/ ])));
//# sourceMappingURL=index.js.map