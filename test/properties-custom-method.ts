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

@injectable({ bindPropertiesInConstructor: false, propertiesBinder: 'do' })
export class Demo {

    @inject()
    name: string;
    @inject()
    age: number;
    @inject()
    service: IService;

    do() {
        this.age = 18;
    }
}

let instance: Demo;

describe("bind properties in custom method", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Demo, Demo);
        instance = Injector.get<Demo>(Demo);
        instance.do();
    });
    it("should be string.", () => {
        expect(instance.name).is.a('string');
    });
    it("should be number.", () => {
        expect(instance.age).is.a('number');
        expect(instance.age).to.eq(18);
    });
    it("should be a class instance.", () => {
        expect(instance.service).to.be.instanceOf(Service);
    });
});