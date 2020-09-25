const SINGLETON = Symbol();

export function Singleton() {
    return function (target: any): any {
        return class extends target {
            constructor(...args: any) {
                if (SINGLETON in target) {
                    return target[SINGLETON];
                } else {
                    super(...args);
                    target[SINGLETON] = this;
                }
            }
        }
    }
}

Singleton.clear = function (target: any): boolean {
    if (typeof target === 'function') {
        if (SINGLETON in target) {
            do {
                delete target[SINGLETON];
                target = Object.getPrototypeOf(target);
            }
            while (target && target !== Object.prototype)
            return true;
        } else {
            return false;
        }
    } else if (target.constructor) {
        return Singleton.clear(target.constructor);
    } else {
        return false;
    }
}