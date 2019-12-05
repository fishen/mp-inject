import "reflect-metadata";
import { Injector, injectable, inject, injectSelf } from '../src/index';
import { IService } from "./service";
import { expect } from "chai";
import "mocha";

Injector.config({ propertiesBinder: 'onLoad' });

@injectable()
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
    @inject()
    service: IService;
    onLoad() { }
}

let instance: Demo;

describe("global config", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Demo, Demo);
        instance = Injector.get<Demo>(Demo);
    });
    it("should be undefined.", () => {
        expect(instance.name).to.be.undefined;
    });
    it("should be number.", () => {
        instance.onLoad();
        expect(instance.age).is.a('number');
    });
    it("should be a class instance.", () => {
        instance.onLoad();
        expect(instance.service).to.be.instanceOf(Service);
    });
});