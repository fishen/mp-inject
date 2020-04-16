import { defaultConfigOptions, IConfigOptions } from "./config";
import { GLOBAL_CONFIG_KEY, INJECTED_CLASS_TAG, INJECTED_PROPERTIES } from "./constants";
import reflect from "./reflect";

// tslint:disable-next-line
export type RegisterType = Function | symbol | number | string;

const INJECT_ITEMS = new Map<RegisterType, [InstanceType<any>, IRegisterOptions?, any?]>();

export interface IRegisterOptions {
    /**
     * Whether it is a singleton pattern
     * @default false
     * @since 2.1.0
     */
    singleton?: boolean;
}

export class Injector {

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
    public static register(type: RegisterType, value: any, options?: IRegisterOptions): void {
        const validTypes = ['function', 'number', 'string', 'symbol'];
        const valid = validTypes.indexOf(typeof type) >= 0;
        if (!valid) { throw new TypeError(`The 'type' parameter must be in ${validTypes}.`); }
        const factory = typeof value === "function" ? value : () => value;
        INJECT_ITEMS.set(type, [factory, options]);
    }

    /**
     * Get the value corresponding to a specific type, the type must be registered in advance.
     * @param type The type registered.
     * @param args The parameters required by the factory function.
     *
     * @example
     * class Demo{}
     * Injector.register("demo", new Demo());
     * const instance = ServiceManager.get("demo");
     * const typedInstance = ServiceManager.get<Demo>("demo");
     */
    public static get<T = any>(type: RegisterType, ...args: any[]): T {
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
        if (prototype && reflect.hasMetadata(INJECTED_CLASS_TAG, prototype)) {
            result = new factory(...args);
        } else {
            result = factory.apply(null, args);
        }
        // tslint:disable-next-line
        singleton && (INJECT_ITEMS.get(type)[2] = result);
        return result;
    }

    /**
     * Clear singleton of specified type, if type is omitted, clear all singletons of type.
     * @param type The specified type to clear
     */
    public static clearSingletons(type?: RegisterType) {
        if (type === undefined) {
            Array.from(INJECT_ITEMS.keys()).forEach(Injector.clearSingletons);
        } else if (INJECT_ITEMS.has(type)) {
            INJECT_ITEMS.get(type)[2] = undefined;
        } else {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection to clear`);
        }
    }

    /**
     * Set global injection options
     * @param options injection options
     * @param target injection target
     */
    public static config(options: IConfigOptions, target?: RegisterType) {
        if (typeof target === "function") {
            target.prototype[GLOBAL_CONFIG_KEY] = options;
        } else {
            Object.assign(defaultConfigOptions, options);
        }
    }

    /**
     * Binding injected property members
     * @param instance instance object
     * @param prototype prototype object
     */
    public static bindProperties(instance: any, prototype: object) {
        const properties: any[] = reflect.getMetadata(INJECTED_PROPERTIES, prototype);
        if (!properties) { return; }
        properties.forEach(({ name, type, args }) => {
            try {
                instance[name] = Injector.get(type, ...args);
            } catch (err) {
                console.error(name, prototype.constructor.name, err);
            }
        });
    }

    /**
     * Get global config options.
     * @param target injection target.
     * @param options inection options.
     */
    public static getConfig(target?: any, options?: IConfigOptions): IConfigOptions {
        target = target || {};
        const prototype = typeof target === "function" ? target.prototype : Object.getPrototypeOf(target);
        return Object.assign({},
            defaultConfigOptions,
            prototype[GLOBAL_CONFIG_KEY],
            options);
    }
}
