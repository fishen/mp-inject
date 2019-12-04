// Generated by dts-bundle v0.7.3

declare module 'mp-inject' {
    export { Injector } from "mp-inject/injector";
    export { inject, injectable, injectFor, injectSelf } from "mp-inject/inject";
    export { PROPERTIES_BINDER } from "mp-inject/constants";
}

declare module 'mp-inject/injector' {
    import { IConfigOptions } from "mp-inject/config";
    const SINGLE_VALUE_KEY: unique symbol;
    export type RegisterType = Function & {
            [SINGLE_VALUE_KEY]?: any;
    };
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
            static register(type: RegisterType, value: any, options?: IRegisterOptions): void;
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
            static get<T = any>(type: RegisterType, ...args: any[]): T;
            /**
                * Set global injection options
                * @param options injection options
                */
            static config(options: IConfigOptions): void;
            /**
                * Binding injected property members
                * @param instance instance object
                * @param prototype prototype object
                * @param forcibly Whether to force the setting
                */
            static bindProperties(instance: any, prototype: object, forcibly?: boolean): void;
    }
    export {};
}

declare module 'mp-inject/inject' {
    import { IConfigOptions } from "mp-inject/config";
    import { IRegisterOptions, RegisterType } from "mp-inject/injector";
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

declare module 'mp-inject/constants' {
    export const DESIGN_PARAM_TYPES = "design:paramtypes";
    export const DESIGN_TYPE = "design:type";
    export const DESIGN_RETURN_TYPE = "design:returntype";
    export const INJECTED_PROPERTIES: unique symbol;
    export const INJECTED_ARGUMENTS: unique symbol;
    export const PROPERTIES_BOUND: unique symbol;
    export const INJECTED_CLASS_TAG: unique symbol;
    export const PROPERTIES_BINDER: unique symbol;
}

declare module 'mp-inject/config' {
    export interface IConfigOptions {
            /**
                * The method name to bind properties, default use onLoad or attached methods.
                * @default 'onLoad' and 'attached'.
                */
            propertiesBinder?: string;
            /**
                * Whether to bind properties in the constructor.
                * @default true
                */
            bindPropertiesInConstructor?: boolean;
    }
    export const defaultConfigOptions: {
            bindPropertiesInConstructor: boolean;
    };
}

