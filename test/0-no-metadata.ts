import { Injector, injectable, inject } from '../src/index';
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
    constructor(
        @inject(String) public name: string,
        @inject(IService) public service: IService) { }
    @inject(Number)
    public age: number
}

let instance: Demo;

describe("with no reflect-metadata", () => {
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