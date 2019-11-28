import "reflect-metadata";
import { Injector, injectable, inject, injectFor } from '../src/index';
import { IService } from "./service";
import { expect } from "chai";
import "mocha";

Injector.config({ bindPropertiesInConstructor: false });

@injectable()
export class Service implements IService {
    id: number;
    num: number;
}

@injectFor()
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

describe("global config", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Demo, Demo);
        instance = Injector.get<Demo>(Demo);
        (instance as any).onLoad();
    });
    it("should be string.", () => {
        expect(instance.name).is.a('string');
    });
    it("should be number.", () => {
        expect(instance.age).is.a('number');
    });
    it("should be a class instance.", () => {
        expect(instance.service).to.be.instanceOf(Service);
    });
});