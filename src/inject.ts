import { DESIGN_TYPE, DESIGN_PARAM_TYPES } from "./constants";
import { Injector, InjectOptions, RegisterType, InjectionOptions } from "./injector";
import Reflect from './reflect';

const INJECTED_ARGUMENTS = Symbol();

/**
 * Tag arguments or properties to inject.
 * @param options Injection options
 */
export function Inject(options?: InjectOptions | RegisterType) {
    const opt: InjectOptions = options && typeof options === 'object' ? options : { type: options } as any;
    return function (target: any, name: string, index?: number): void {
        if (name && typeof target !== 'function' && index === undefined) {
            // properties
            let type = Reflect.getOwnMetadata(DESIGN_TYPE, target, name);
            type = opt!.type !== undefined ? opt!.type : (type || name);
            opt.source = opt.source || `the property ${name} in class ${target.constructor.name}`;
            Object.defineProperty(target, name, { get: () => Injector.get(type, opt) })
        } else if (typeof index === 'number' && !name) {
            // constructor arguments
            let metadata: Map<number, InjectOptions> = Reflect.getOwnMetadata(INJECTED_ARGUMENTS, target);
            metadata = metadata || new Map();
            const className = target.constructor.name;
            opt.source = opt.source || `the ${index}th argument in ${className} constructor`;
            metadata.set(index, opt);
            Reflect.defineMetadata(INJECTED_ARGUMENTS, metadata, target);
        } else {
            console.warn('The decorater @Inject must used in properties or methods', target, name, index, options)
        }
    }
}

/**
 * Tag optional arguments or properties to inject.
 * @param options Injection options
 */
export function Optional(options?: Omit<InjectOptions, 'optional'> | RegisterType) {
    return Inject(Object.assign({}, options, { optional: true }));
}

/**
 * Automatically inject properties or constructor arguments for the current class
 */
export function Injectable(options?: InjectionOptions) {
    return function <T extends new (...args: any[]) => any>(ctor: T): any {
        const metadata: Map<number, InjectOptions> = Reflect.getOwnMetadata(INJECTED_ARGUMENTS, ctor);
        const result = class extends ctor {
            constructor(...args: any[]) {
                const paramtypes: Function[] = Reflect.getOwnMetadata(DESIGN_PARAM_TYPES, ctor) || [];
                paramtypes.forEach((t, index) => {
                    const meta = metadata && metadata.get(index);
                    const type = meta && meta.type !== undefined ? meta.type : t;
                    args[index] === undefined && (args[index] = Injector.get(type, meta));
                });
                super(...args);
            }
        };
        Object.defineProperty(result, "name", { value: ctor.name });
        Injector.registerClass(result, result, options);
        return result;
    }
}
