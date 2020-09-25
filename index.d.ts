// Generated by "bundle-dts@1.1.4" https://github.com/fishen/bundle-dts#readme."
declare module "mp-inject/src/singleton" {
    export function Singleton(): (target: any) => any;
    export namespace Singleton {
        var clear: (target: any) => boolean;
    }
}
declare module "mp-inject/src/injector" {
    export type RegisterType = Function | symbol | number | string;
    type InjectionType<R, T> = R extends object | Primitive ? R : T extends new (...args: any) => any ? InstanceType<T> : any;
    type Primitive = string | number | symbol | boolean | bigint | undefined | null;
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
        static register(type: RegisterType, value: any, options?: InjectionOptions): typeof Injector;
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
        static registerClass(type: RegisterType, value: new (...args: any) => any, options?: InjectionOptions): typeof Injector;
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
        static get<R, T extends RegisterType = any>(type: T, options?: InjectOptions): InjectionType<R, T>;
        /**
         * Try Get the value corresponding to a specific type
         * @param type The type registered.
         * @param defaultValue The value returned by default.
         * @param options The injecttion options.
         *
         * @example
         * Injector.getOrDefault(ClassType, new ClassType());
         */
        static getOrDefault<R, T extends RegisterType = any>(type: T, defaultValue?: R, options?: InjectOptions): InjectionType<R, T>;
        /**
         * Clear singleton of specified type, if type is omitted, clear all singletons of type.
         * @param type The specified type to clear
         */
        static clearSingletons(type?: RegisterType): void;
    }
    export {};
}
declare module "mp-inject/src/constants" {
    export const DESIGN_PARAM_TYPES = "design:paramtypes";
    export const DESIGN_TYPE = "design:type";
    export const DESIGN_RETURN_TYPE = "design:returntype";
}
declare module "mp-inject/src/reflect" {
    import "reflect-metadata";
    const reflect: typeof Reflect;
    export default reflect;
}
declare module "mp-inject/src/inject" {
    import { InjectOptions, RegisterType, InjectionOptions } from "mp-inject/src/injector";
    export const INJECTED_ARGUMENTS: unique symbol;
    /**
     * Tag arguments or properties to inject.
     * @param options Injection options
     */
    export function Inject(options?: InjectOptions | RegisterType): (target: any, name: string, index?: number) => void;
    /**
     * Tag optional arguments or properties to inject.
     * @param options Injection options
     */
    export function Optional(options?: Omit<InjectOptions, 'optional'> | RegisterType): (target: any, name: string, index?: number) => void;
    /**
     * Automatically inject properties or constructor arguments for the current class
     */
    export function Injectable(options?: InjectionOptions): <T extends new (...args: any[]) => any>(ctor: T) => any;
}
declare module "mp-inject" {
    export { Injector } from "mp-inject/src/injector";
    export { Inject, Injectable, Optional } from "mp-inject/src/inject";
    export { Singleton } from 'mp-inject/src/singleton';
    export * as Reflect from 'mp-inject/src/reflect';
}