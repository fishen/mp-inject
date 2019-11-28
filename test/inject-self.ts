import "reflect-metadata";
import { Injector, injectable, inject, injectFor, injectSelf } from '../src/index';
import { IService } from "./service";
import { expect } from "chai";
import "mocha";

@injectFor(Service)
export class Service implements IService {
    id: number;
    num: number;
}

@injectSelf()
@injectable()
export class Demo {
    @inject()
    name: string;
    @inject()
    age: number;
    @inject(Service)
    service: IService;
}

Injector.register(String, 'default value');
Injector.register(Number, () => Math.random());

let instance: Demo;

describe("inject to self", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        instance = Injector.get<Demo>(Demo);
    });
    it("should be a string.", () => {
        expect(typeof instance.name).to.be.eq('string');
    });
    it("should be a number.", () => {
        expect(typeof instance.age).to.be.eq("number");
    });
    it("should be a class instance.", () => {
        expect(instance.service).to.be.instanceof(Service);
    });
});