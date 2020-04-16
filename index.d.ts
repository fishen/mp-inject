// Generated by "bundle-dts@1.1.3" https://github.com/fishen/bundle-dts#readme."
declare module "mp-inject/src/config" {
    export interface IConfigOptions {
        /**
         * The method name to bind properties, default use constructor.
         * @default 'constructor'
         */
        propertiesBinder?: string;
    }
    export const defaultConfigOptions: {
        propertiesBinder: string;
    };
}
declare module "mp-inject/src/constants" {
    export const DESIGN_PARAM_TYPES = "design:paramtypes";
    export const DESIGN_TYPE = "design:type";
    export const DESIGN_RETURN_TYPE = "design:returntype";
    export const INJECTED_PROPERTIES: unique symbol;
    export const INJECTED_ARGUMENTS: unique symbol;
    export const INJECTED_CLASS_TAG: unique symbol;
    export const GLOBAL_CONFIG_KEY: unique symbol;
}
declare module "mp-inject/src/reflect" {
    import "reflect-metadata";
    const reflect: typeof Reflect;
    export default reflect;
}
declare module "mp-inject/src/injector" {
    import { IConfigOptions } from "mp-inject/src/config";
    export type RegisterType = Function | symbol | number | string;
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
        static register(type: RegisterType, value: any, options?: IRegisterOptions): void;
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
        static get<T = any>(type: RegisterType, ...args: any[]): T;
        /**
         * Clear singleton of specified type, if type is omitted, clear all singletons of type.
         * @param type The specified type to clear
         */
        static clearSingletons(type?: RegisterType): void;
        /**
         * Set global injection options
         * @param options injection options
         * @param target injection target
         */
        static config(options: IConfigOptions, target?: RegisterType): void;
        /**
         * Binding injected property members
         * @param instance instance object
         * @param prototype prototype object
         */
        static bindProperties(instance: any, prototype: object): void;
        /**
         * Get global config options.
         * @param target injection target.
         * @param options inection options.
         */
        static getConfig(target?: any, options?: IConfigOptions): IConfigOptions;
    }
}
declare module "mp-inject/src/inject" {
    import { IConfigOptions } from "mp-inject/src/config";
    import { IRegisterOptions, RegisterType } from "mp-inject/src/injector";
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
    /**
     * Tag arguments or properties to inject.
     */
    export function inject(options?: IInjectOptions | RegisterType): (target: any, name: string, index?: number) => void;
    /**
     * Automatically inject properties or constructor arguments for the current class
     */
    export function injectable(options?: IConfigOptions): (ctor: new (...args: any) => any) => any;
    /**
     * Register the current class as a service of the specified type
     * @param type The type to register
     * @param options The injection options
     */
    export function injectFor(type: RegisterType, options?: IRegisterOptions): (ctor: new (...args: any) => any) => void;
    /**
     * Register the current class as a service of the self type
     * @param options The injection options
     */
    export function injectSelf(options?: IRegisterOptions): (ctor: new (...args: any) => any) => void;
    export {};
}
declare module "mp-inject" {
    export { Injector } from "mp-inject/src/injector";
    export { inject, injectable, injectFor, injectSelf } from "mp-inject/src/inject";
}