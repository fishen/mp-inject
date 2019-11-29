
import { defaultConfigOptions, IConfigOptions } from "./config";
import {
    DESIGN_PARAM_TYPES, DESIGN_TYPE, INJECTED_ARGUMENTS,
    INJECTED_CLASS_TAG, INJECTED_PROPERTIES, PROPERTIES_BINDER,
} from "./constants";
import { Injector, RegisterType } from "./injector";
import reflect from "./reflect";

interface IInjectOptions {
    /**
     * The parameters required by the factory function.
     */
    args?: any[];
    /**
     * The type to register
     */
    type?: RegisterType;
}

function defineData(metadataKey: any, metadataValue: any, target: object) {
    let arr = reflect.getMetadata(metadataKey, target);
    arr = arr ? arr.slice() : [];
    arr.push(metadataValue);
    reflect.defineMetadata(metadataKey, arr, target);
}

function bindProperties(ctor: new (...args: any) => void, method: string) {
    const original = ctor.prototype[method];
    if (typeof original === "function" || original === undefined) {
        ctor.prototype[method] = function(...methodArgs: any) {
            Injector.bindProperties(this, ctor.prototype);
            return original && original.apply(this, methodArgs);
        };
    }
}

/**
 * Tag constructor arguments or properties to inject.
 * @param args 函数调用用到的参数
 */
export function inject(options?: IInjectOptions | RegisterType) {
    const opts = typeof options === "function" ? { type: options } : Object.assign({}, options);
    return function(target: any, name: string, index?: number) {
        let { type, args } = opts as IInjectOptions;
        args = Array.isArray(args) ? args : [];
        const ctor = target.constructor;
        if (index === undefined && typeof name === "string") {
            type = type || reflect.getMetadata(DESIGN_TYPE, target, name);
            if (typeof type !== "function") {
                throw new Error(`Unknown property type of [${ctor.name}|${name}].`);
            }
            defineData(INJECTED_PROPERTIES, { type, args, name }, target);
        } else if (typeof index === "number") {
            if (typeof type !== "function") {
                const types = reflect.getMetadata(DESIGN_PARAM_TYPES, target, name);
                type = types[index];
                if (typeof type !== "function") {
                    throw new Error(`Unknown argument type of [${ctor.name}|${index}].`);
                }
            }
            defineData(INJECTED_ARGUMENTS, { type, args, name, index }, target);
        }
    };
}

/**
 * Automatically inject properties or constructor arguments for the current class
 */
export function injectable(options?: IConfigOptions) {
    const opts = Object.assign({}, defaultConfigOptions, options);
    let { bindPropertiesInConstructor } = opts;
    const propertiesBinder = opts.propertiesBinder;
    return function(ctor: new (...args: any) => any): any {
        reflect.defineMetadata(INJECTED_CLASS_TAG, true, ctor.prototype);
        const hasProperties = reflect.hasMetadata(INJECTED_PROPERTIES, ctor.prototype);
        if (hasProperties) {
            if (propertiesBinder === "constructor") {
                bindPropertiesInConstructor = true;
            } else if (typeof propertiesBinder === "string") {
                bindProperties(ctor, propertiesBinder);
                bindPropertiesInConstructor = false;
            } else if (typeof ctor.prototype[PROPERTIES_BINDER] === "string") {
                bindProperties(ctor, ctor.prototype[PROPERTIES_BINDER]);
                bindPropertiesInConstructor = false;
            } else if (!bindPropertiesInConstructor) {
                bindProperties(ctor, "onLoad");
                bindProperties(ctor, "attached");
                bindPropertiesInConstructor = false;
            }
        }
        const hasArguments = reflect.hasMetadata(INJECTED_ARGUMENTS, ctor);
        if (hasProperties && bindPropertiesInConstructor || hasArguments) {
            return class extends ctor {
                constructor(...newArgs: any) {
                    const injectedArgs: any[] = reflect.getMetadata(INJECTED_ARGUMENTS, ctor) || [];
                    injectedArgs.forEach(({ index, args, type }) => newArgs[index] = Injector.get(type, ...args));
                    super(...newArgs);
                    // tslint:disable-next-line
                    bindPropertiesInConstructor && Injector.bindProperties(this, ctor.prototype);
                }
            };
        }
    };
}

/**
 * Register the current class as a service of the specified type
 * @param type The type to register
 */
export function injectFor(type: RegisterType) {
    return function(ctor: new (...args: any) => any) {
        Injector.register(type || ctor, function(...ctorArguments: any[]) {
            return new ctor(...ctorArguments);
        });
    };
}

/**
 * Register the current class as a service of the self type
 */
export function injectSelf() {
    return injectFor(null);
}
