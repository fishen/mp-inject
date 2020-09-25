import "reflect-metadata";
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
        public name: string,
        public age: number,
        @Inject(String) public other: number,
        public service: IService) { }
}

let instance: Demo;

describe("bind arguments in constructor", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Demo, Demo);
        instance = Injector.get<Demo>(Demo);
    });
    it("should be a string.", () => {
        expect(typeof instance.name).to.be.eq('string');
        expect(typeof instance.other).to.be.eq('string');
    });
    it("should be a number.", () => {
        expect(typeof instance.age).to.be.eq("number");
    });
    it("should be a class instance.", () => {
        expect(instance.service).to.be.instanceof(Service);
    });
});