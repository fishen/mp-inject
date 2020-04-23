import "reflect-metadata";
import { Injector } from '../src/index';
import { expect } from "chai";
import "mocha";

export class Service {
    id: number;
    num: number;
}

Injector.register('string value', 'string');

describe("get the type value by safely", () => {
    it("should be return undefined.", () => {
        expect(Injector.getOrDefault(Service)).to.be.undefined;
    });
    it("should be return the default value.", () => {
        expect(Injector.getOrDefault(Symbol(), new Service())).to.be.instanceof(Service);
    });
    it("should be get the injected value in advance.", () => {
        expect(Injector.getOrDefault('string value')).to.be.eq('string');
    });
});