import { Singleton } from './singleton';

// tslint:disable-next-line
export type RegisterType = Function | symbol | number | string;

type InjectionType<R, T> = R extends object | Primitive ? R : T extends new (...args: any) => any ? InstanceType<T> : any;

type Primitive = string | number | symbol | boolean | bigint | undefined | null;

const INJECT_ITEMS = new Map<RegisterType, Function>();

export interface InjectionOptions {
    /**
     * The another name for current Service
     */
    alias?: RegisterType;
}

export interface InjectOptions {
    /**
     * The parameters required by the factory function.
     */
    args?: ArrayLike<any>;
    /**
     * The type to register
     */
    type?: RegisterType;
    /**
     * The injection source for debugging
     */
    source?: string;
    /**
     * The injected item is optional
     * @default false
     */
    optional?: boolean;

}

export class Injector {

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
    public static register(type: RegisterType, value: any, options?: InjectionOptions) {
        const validTypes = ['function', 'number', 'string', 'symbol'];
        const valid = validTypes.indexOf(typeof type) >= 0;
        if (!valid) { throw new TypeError(`The 'type' parameter must be in ${validTypes}.`); }
        const factory = typeof value === "function" ? value : () => value;
        INJECT_ITEMS.set(type, factory);
        if (options?.alias) {
            INJECT_ITEMS.set(options.alias, factory);
        }
        Singleton.clear(type);
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
    public static registerClass(type: RegisterType, value: new(...args: any) => any, options?: InjectionOptions) {
        return this.register(type, (...args: any) => new value(...args), options);
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
    public static get<R, T extends RegisterType = any>(type: T, options?: InjectOptions): InjectionType<R, T> {
        if (options?.optional) {
            return this.getOrDefault(type);
        }
        if (!INJECT_ITEMS.has(type)) {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection [source]:${options?.source}`);
        }
        const factory = INJECT_ITEMS.get(type)!;
        const args: any[] = options && Array.isArray(options.args) ? options.args : [];
        try {
            return factory.apply(null, args);
        } catch (e) {
            return new (factory as any)(...args);
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
    public static getOrDefault<R, T extends RegisterType = any>(type: T, defaultValue?: R, options?: InjectOptions): InjectionType<R, T> {
        if (!INJECT_ITEMS.has(type)) {
            return defaultValue as any;
        }
        return this.get(type, options) as InjectionType<R, T>;
    }

    /**
     * Clear singleton of specified type, if type is omitted, clear all singletons of type.
     * @param type The specified type to clear
     */
    public static clearSingletons(type?: RegisterType) {
        if (type === undefined) {
            Array.from(INJECT_ITEMS.keys()).forEach(Injector.clearSingletons);
        } else if (INJECT_ITEMS.has(type)) {
            Singleton.clear(type);
        } else {
            const name = typeof type === 'function' ? type.name : String(type);
            throw new Error(`Missing type ${name} injection to clear`);
        }
    }
}
