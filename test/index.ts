import { ServiceManager, inject, injectable } from '../src/index';

class Demo {
    num: number;
    constructor() {
        this.num = Math.round(Math.random() * 10);
    }
}

ServiceManager.register(String, 'default value');
ServiceManager.register(Number, () => Math.random());
console.assert(ServiceManager.get(String) === 'default value');
console.assert(typeof ServiceManager.get(Number) === 'number');

ServiceManager.register(Demo, new Demo());
const instance = ServiceManager.get(Demo);
console.assert(typeof instance.num === 'number');

@injectable()
class Service {
    num: number;
    constructor() {
        this.num = Math.round(Math.random() * 10);
    }
}

class Page {
    @inject(Service)
    service: Service;
}

console.assert(typeof new Page().service.num === 'number');
