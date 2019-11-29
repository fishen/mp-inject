import { defaultConfigOptions, IConfigOptions } from "./config";
import { INJECTED_CLASS_TAG, INJECTED_PROPERTIES, PROPERTIES_BOUND } from "./constants";
import reflect from "./reflect";

// tslint:disable-next-line
export type RegisterType = Function;

const INJECT_ITEMS = new Map<any, any>();

export class Injector {

    /**
     * Register a service for injection.
     * @param type The service type to be register
     * @param value The associated value can be a factory function.
     *
     * @example
     * Injector.register(String, "default value");
     * Injector.register(Number, () => Math.random());
     * class Demo{}
     * Injector.register(Demo, new Demo());
     */
    public static register(type: RegisterType, value: any): void {
        if (typeof type !== "function") { throw new TypeError(`The 'type' parameter must be a function type.`); }
        const factory = typeof value === "function" ? value : () => value;
        INJECT_ITEMS.set(type, factory);
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
        const factory = INJECT_ITEMS.get(type);
        const prototype = factory.prototype;
        if (prototype && reflect.hasMetadata(INJECTED_CLASS_TAG, prototype)) {
            return new factory(...args);
        }
        return factory.apply(null, args);
    }

    /**
     * Set global injection options
     * @param options injection options
     */
    public static config(options: IConfigOptions) {
        Object.assign(defaultConfigOptions, options);
    }

    /**
     * Binding injected property members
     * @param instance instance object
     * @param prototype prototype object
     * @param forcibly Whether to force the setting
     */
    public static bindProperties(instance: any, prototype: object, forcibly: boolean = false) {
        if (instance[PROPERTIES_BOUND] && !forcibly) { return; }
        const properties: any[] = reflect.getMetadata(INJECTED_PROPERTIES, prototype);
        if (!properties) { return; }
        properties.forEach(({ name, type, args }) => {
            try {
                instance[name] = Injector.get(type, ...args);
            } catch (err) {
                console.error(name, prototype.constructor.name, err);
            }
        });
        instance[PROPERTIES_BOUND] = true;
    }
}
