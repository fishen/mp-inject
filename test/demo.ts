import { expect } from "chai";
import "mocha";

import { injectable, inject, Injector, injectFor, injectSelf } from '../src/index';

export interface IService {
    get(): number;
}
export abstract class IService { }

@injectable()
export class Service implements IService {
    get() {
        return 1;
    }
}
// inject manually
Injector.register(IService, Service);

export interface IService1 {
    get(): boolean;
}
export abstract class IService1 { }
// inject by decorater
@injectFor(IService1)
export class Service1 implements IService1 {
    get() {
        return true;
    }
}
// inject self by decorater
@injectSelf()
export class Service2 {
    name = 'service2';
}

@injectSelf()
@injectable()
export class Demo {
    constructor(@inject() public service: IService) {
        this.service1 = Injector.get(IService1);
    }
    public service1: IService1;
    @inject() 
    public service2: Service2;
}


const instance = Injector.get<Demo>(Demo);

describe("demo", () => {
    it("should injected succeeded default.", () => {
        expect(instance.service).is.instanceOf(Service);
    });
    it("should injected succeeded by using decorate", () => {
        expect(instance.service1).is.instanceOf(Service1);
    });
    it("should injected succeeded by using self's decorate", () => {
        expect(instance.service2).is.instanceOf(Service2);
    });
});