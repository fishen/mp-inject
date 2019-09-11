declare module "mp-inject/src/manager" {
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
        static register<T>(type: INJECT_TYPE<T>, value: T | ((...args: any) => T)): void;
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
        static get<T>(type: INJECT_TYPE<T>, ...args: any[]): T;
    }
}
declare module "mp-inject/src/inject" {
    /**
     * Identifying an property as an injection property is automatically bound to the prototype object.
     * @param type The type to be injected, by default, the field type is automatically obtained.
     * In some cases, it cannot be obtained automatically, and the type needs to be specified explicitly.
     * @param args The parameters required by the factory function.
     */
    export function inject(type?: any, ...args: any[]): (target: any, name: string) => void;
    /**
     * Registering a type into an injection collection,
     * by default, creates an instance of that class by calling the constructor of the current class.
     * @param value The value to be bound, the value can be a specified value, or it can be a function with a return value.
     */
    export function injectable<T extends new (...args: any) => InstanceType<T>>(value?: InstanceType<T> | ((...args: any[]) => InstanceType<T>)): any;
}
declare module "mp-inject" {
    export { ServiceManager } from "mp-inject/src/manager";
    export { inject, injectable } from "mp-inject/src/inject";
}