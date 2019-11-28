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

@injectable({ bindPropertiesInConstructor: false })
export class Demo {
    @inject()
    name: string;
    @inject()
    age: number;
    @inject()
    service: IService;
}

let instance: Demo;

describe("bind properties not in constructor", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Demo, Demo);
        instance = Injector.get<Demo>(Demo);
    });
    it("should be undefined.", () => {
        expect(instance.name).to.be.eq(undefined);
    });
    it("should be undefined.", () => {
        expect(instance.age).to.be.eq(undefined);
    });
    it("should be undefined.", () => {
        expect(instance.service).to.be.eq(undefined);
    });
});