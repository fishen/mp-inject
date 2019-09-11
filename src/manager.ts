const INJECT_ITEMS = new WeakMap<any, any>();

export type INJECT_TYPE<T = any> = new (...args: any[]) => T | ((...args: any[]) => T);

export class ServiceManager {

    /**
     * Register a service for injection.
     * @param type The service type to be register
     * @param value The associated value can be a factory function.
     *
     * @example
     * ServiceManager.register(String, "default value");
     *
     * ServiceManager.register(Number, () => Math.random());
     */
    public static register<T>(
        type: INJECT_TYPE<T>,
        value: T | ((...args: any) => T)): void {
        INJECT_ITEMS.set(type, value);
    }

    /**
     * Get the value corresponding to a specific type, the type must be registered in advance.
     * @param type The type registered.
     * @param args The parameters required by the factory function.
     *
     * @example
     * class Demo{}
     * ServiceManager.register(Demo, new Demo());
     * const instance = ServiceManager.get(Demo);
     */
    public static get<T>(
        type: INJECT_TYPE<T>, ...args: any[]): T {
        if (!INJECT_ITEMS.has(type)) {
            throw new Error(`Missing type ${type} injection`);
        }
        let value = INJECT_ITEMS.get(type);
        if (typeof value === "function") {
            value = value.apply(null, args);
        }
        return value;
    }
}
