import { Injector, Injectable, Inject } from '../src/index';
import { IService } from "./service";
import { expect, assert } from "chai";
import "mocha";

@Injectable()
export class CustomService implements IService {
    id: number;
    num: number;
}

let instance: Demo, sym = Symbol();

@Injectable()
export class Demo {
    constructor(
        @Inject(String) public name: string,
        @Inject(IService) public service: IService,
        @Inject(0) public num: number,
        @Inject("string") public str: string,
        @Inject(sym) public symbol: symbol,
    ) { }
    @Inject(Number) public age: number
}

describe("with no reflect-metadata", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, CustomService);
        Injector.register(Demo, Demo);
        Injector.register(0, 0);
        Injector.register('string', typeof '');
        Injector.register(sym, typeof sym);
        instance = Injector.get<Demo>(Demo);
    });
    it("should be throw error with incorrent type", () => {
        assert.throw(() => Injector.register({} as any, 0), TypeError);
    });
    it("should be a string.", () => {
        expect(typeof instance.name).to.be.eq('string');
        expect(typeof instance.str).to.be.eq('string');
    });
    it("should be a number.", () => {
        expect(typeof instance.age).to.be.eq("number");
        expect(instance.num).to.be.eq(0);
    });
    it("should be a symbol.", () => {
        expect(instance.symbol).to.be.eq('symbol');
    });
    it("should be a class instance.", () => {
        expect(instance.service).to.be.instanceof(CustomService);
    });
});