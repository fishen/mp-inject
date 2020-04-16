
import { IConfigOptions } from "./config";
import {
    DESIGN_PARAM_TYPES, DESIGN_TYPE, INJECTED_ARGUMENTS, INJECTED_CLASS_TAG,
    INJECTED_PROPERTIES,
} from "./constants";
import { Injector, IRegisterOptions, RegisterType } from "./injector";
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

interface IInjectedProperty {
    type: any;
    args: any[];
    name: string;
}

interface IInjectedArgument extends IInjectedProperty {
    index: number;
}

/**
 * Tag arguments or properties to inject.
 */
export function inject(options?: IInjectOptions | RegisterType) {
    function bindInjections<T extends IInjectedProperty>(metadataKey: symbol, metadataValue: T, target: object) {
        let arr = reflect.getMetadata(metadataKey, target);
        arr = arr ? arr.slice() : [];
        arr.push(metadataValue);
        reflect.defineMetadata(metadataKey, arr, target);
    }
    const opts = typeof options === "object" ? Object.assign({}, options) : { type: options };
    return function (target: any, name: string, index?: number) {
        let { type, args } = opts as IInjectOptions;
        args = Array.isArray(args) ? args : [];
        const ctor = target.constructor;
        if (typeof index === 'number') {
            // params decorator
            if (type === undefined) {
                const types = reflect.getMetadata(DESIGN_PARAM_TYPES, target, name);
                type = types[index];
                if (typeof type !== "function") {
                    throw new Error(`Unknown argument type of [${ctor.name}|${index}].`);
                }
            }
            bindInjections(INJECTED_ARGUMENTS, { type, args, name, index }, target);
        } else if (typeof target !== "function") {
            // properties decorator
            if (type === undefined) {
                type = reflect.getMetadata(DESIGN_TYPE, target, name);
                if (typeof type !== "function") {
                    throw new Error(`Unknown property type of [${ctor.name}|${name}].`);
                }
            }
            bindInjections(INJECTED_PROPERTIES, { type, args, name }, target);
        }
    };
}

/**
 * Automatically inject properties or constructor arguments for the current class
 */
export function injectable(options?: IConfigOptions) {
    function bindProperties(ctor: new (...args: any) => void, method: string) {
        const original = ctor.prototype[method];
        if (typeof original === "function" || original === undefined) {
            ctor.prototype[method] = function (...methodArgs: any) {
                Injector.bindProperties(this, ctor.prototype);
                return original && original.apply(this, methodArgs);
            };
        }
    }
    return function (ctor: new (...args: any) => any): any {
        const { propertiesBinder } = Injector.getConfig(ctor, options);
        reflect.defineMetadata(INJECTED_CLASS_TAG, true, ctor.prototype);
        const bindPropertiesInConstructor = propertiesBinder === "constructor";
        const hasProperties = reflect.hasMetadata(INJECTED_PROPERTIES, ctor.prototype);
        if (!bindPropertiesInConstructor && hasProperties && typeof propertiesBinder === "string") {
            bindProperties(ctor, propertiesBinder);
        }
        const hasArguments = reflect.hasMetadata(INJECTED_ARGUMENTS, ctor);
        if (hasProperties && bindPropertiesInConstructor || hasArguments) {
            return class extends ctor {
                constructor(...newArgs: any) {
                    const injectedArgs: IInjectedArgument[] = reflect.getMetadata(INJECTED_ARGUMENTS, ctor) || [];
                    injectedArgs.filter(({ index }) => newArgs[index] === undefined)
                        .forEach(({ index, args, type }) => newArgs[index] = Injector.get(type, ...args));
                    super(...newArgs);
                    // tslint:disable-next-line
                    hasProperties && bindPropertiesInConstructor && Injector.bindProperties(this, ctor.prototype);
                }
            };
        }
    };
}

/**
 * Register the current class as a service of the specified type
 * @param type The type to register
 * @param options The injection options
 */
export function injectFor(type: RegisterType, options?: IRegisterOptions) {
    return function (ctor: new (...args: any) => any) {
        Injector.register(type || ctor, function (...ctorArguments: any[]) {
            return new ctor(...ctorArguments);
        }, options);
    };
}

/**
 * Register the current class as a service of the self type
 * @param options The injection options
 */
export function injectSelf(options?: IRegisterOptions) {
    return injectFor(null, options);
}
