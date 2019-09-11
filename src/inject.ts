
import { ServiceManager } from "./manager";

const DESIGN_TYPE = "design:type";

/**
 * Identifying an property as an injection property is automatically bound to the prototype object.
 * @param type The type to be injected, by default, the field type is automatically obtained.
 * In some cases, it cannot be obtained automatically, and the type needs to be specified explicitly.
 * @param args The parameters required by the factory function.
 */
export function inject(type?: any, ...args: any[]) {
    return function(target: any, name: string) {
        const t = type || (Reflect as any).getMetadata(DESIGN_TYPE, target, name);
        const value = ServiceManager.get(t, ...args);
        if (!value) { return; }
        target[name] = value;
    };
}

/**
 * Registering a type into an injection collection,
 * by default, creates an instance of that class by calling the constructor of the current class.
 * @param value The value to be bound, the value can be a specified value, or it can be a function with a return value.
 */
export function injectable<T extends new (...args: any) =>
    InstanceType<T>>(value?: InstanceType<T> | ((...args: any[]) => InstanceType<T>)): any {
    return function(ctor: any) {
        value = value === undefined ? new ctor() : value;
        ServiceManager.register(ctor, value!);
    };
}
