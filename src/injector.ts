import { defaultConfigOptions, IConfigOptions } from "./config";
import { GLOBAL_CONFIG_KEY, INJECTED_CLASS_TAG, INJECTED_PROPERTIES, SINGLE_VALUE_KEY } from "./constants";
import reflect from "./reflect";

// tslint:disable-next-line
export type RegisterType = Function & { [SINGLE_VALUE_KEY]?: any };

const INJECT_ITEMS = new Map<any, [any, IRegisterOptions?]>();

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
     * Injector.register(String, "default value");
     * Injector.register(Number, () => Math.random());
     * class Demo{}
     * Injector.register(Demo, new Demo());
     */
    public static register(type: RegisterType, value: any, options?: IRegisterOptions): void {
        if (typeof type !== "function") { throw new TypeError(`The 'type' parameter must be a function type.`); }
        const factory = typeof value === "function" ? value : () => value;
        INJECT_ITEMS.set(type, [factory, options]);
        delete type[SINGLE_VALUE_KEY];
    }

    /**
     * Get the value corresponding to a specific type, the type must be registered in advance.
     * @param type The type registered.
     * @param args The parameters required by the factory function.
     *
     * @example
     * class Demo{}
     * Injector.register(Demo, new Demo());
     * const instance = ServiceManager.get(Demo);
     */
    public static get<T = any>(type: RegisterType, ...args: any[]): T {
        if (!INJECT_ITEMS.has(type)) {
            throw new Error(`Missing type ${type.name} injection`);
        }
        const [factory, options] = INJECT_ITEMS.get(type);
        const prototype = factory.prototype;
        const singleton = type instanceof Object && options && options.singleton;
        if (singleton && SINGLE_VALUE_KEY in type) {
            return type[SINGLE_VALUE_KEY];
        }
        let result;
        if (prototype && reflect.hasMetadata(INJECTED_CLASS_TAG, prototype)) {
            result = new factory(...args);
        } else {
            result = factory.apply(null, args);
        }
        // tslint:disable-next-line
        singleton && (type[SINGLE_VALUE_KEY] = result);
        return result;
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
