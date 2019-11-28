import "reflect-metadata";
import { Injector, injectable, inject, injectFor } from '../src/index';
import { IService } from "./service";
import { expect } from "chai";
import "mocha";

@injectable()
export class Service implements IService {
    id: number;
    num: number;
}

@injectable()
export class Demo {
    @inject()
    name: string;
    @inject()
    age: number;
    @inject()
    service: IService;
}

let instance: Demo;

describe("bind properties in constructor", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Demo, Demo);
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