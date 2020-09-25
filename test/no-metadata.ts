import { Injector, Injectable, Inject } from '../src/index';
import { IService } from "./service";
import { expect } from "chai";
import "mocha";

@Injectable()
export class Service implements IService {
    id: number;
    num: number;
}

@Injectable()
export class Demo {
    constructor(
        @Inject(String) public name: string,
        @Inject(IService) public service: IService
    ) { }
    @Inject(Number) public age: number
}

let instance: Demo;
Injector.register(String, 'default value');
Injector.register(Number, () => Math.random());
Injector.register(IService, Service);
Injector.register(Demo, Demo);
instance = Injector.get<Demo>(Demo);

describe("with no reflect-metadata", () => {
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