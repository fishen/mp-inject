import "reflect-metadata";
import { Injector, Injectable, Singleton } from '../src/index';
import { expect } from "chai";
import "mocha";

@Injectable()
@Singleton()
export class SingletonService {
    num = Math.random();
}

@Injectable()
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
    it("should return same object when called multiple times.", () => {
        const service1 = Injector.get(SingletonService);
        const service2 = Injector.get(SingletonService);
        expect(service1).to.be.instanceOf(SingletonService);
        expect(service1).to.be.eq(service2);
    });
    it("should return different object when register again.", () => {
        const service1 = Injector.get(SingletonService);
        Injector.register(SingletonService, SingletonService);
        const service2 = Injector.get(SingletonService);
        const service3 = Injector.get(SingletonService);
        expect(service1).to.be.instanceOf(SingletonService);
        expect(service2).to.be.instanceOf(SingletonService);
        expect(service3).to.be.instanceOf(SingletonService);
        expect(service1).not.to.be.eq(service2);
        expect(service2).to.be.eq(service3);
    });
    it("should be cleaned up properly", () => {
        const service1 = Injector.get(SingletonService);
        Injector.clearSingletons(SingletonService);
        const service2 = Injector.get<SingletonService>(SingletonService);
        Injector.clearSingletons();
        const service3 = Injector.get<SingletonService>(SingletonService);
        const service4 = Injector.get<SingletonService>(SingletonService);
        expect(service1.num).to.be.not.eq(service2.num);
        expect(service3.num).to.be.not.eq(service2.num);
        expect(service3.num).to.be.eq(service4.num);
    })
});