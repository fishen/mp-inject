import "reflect-metadata";
import { Injector, injectSelf, injectable } from '../src/index';
import { expect } from "chai";
import "mocha";

@injectSelf({ singleton: true })
@injectable()
export class SingletonService {
    num = Math.random();
}

@injectSelf()
export class Service {
    num = Math.random();
}

describe("singleton", () => {
    it("should return different object when called multiple times.", () => {
        const service1 = Injector.get(Service);
        const service2 = Injector.get(Service);
        expect(service1).to.be.instanceOf(Service);
        expect(service1).not.to.be.eq(service2);
    });
    it("should return a different object when called multiple times.", () => {
        const service1 = Injector.get(SingletonService);
        const service2 = Injector.get(SingletonService);
        expect(service1).to.be.instanceOf(SingletonService);
        expect(service1).to.be.eq(service2);
    });
    it("should return different object when register again.", () => {
        const service1 = Injector.get(SingletonService);
        Injector.register(SingletonService, SingletonService, { singleton: true });
        const service2 = Injector.get(SingletonService);
        const service3 = Injector.get(SingletonService);
        expect(service1).to.be.instanceOf(SingletonService);
        expect(service2).to.be.instanceOf(SingletonService);
        expect(service3).to.be.instanceOf(SingletonService);
        expect(service1).not.to.be.eq(service2);
        expect(service2).to.be.eq(service3);
    });
});