import "reflect-metadata";
import { Injector, injectable } from '../src/index';
import { IService } from "./service";
import { expect } from "chai";
import "mocha";

@injectable()
export class Service implements IService {
    id: number;
    num: number;
}

describe("register and get", () => {
    before(function () {
        Injector.register(String, 'default value');
        Injector.register(Number, () => Math.random());
        Injector.register(IService, Service);
        Injector.register(Service, () => new Service());
    });
    it("should be a string.", () => {
        expect(typeof Injector.get(String)).to.be.eq('string');
    });
    it("should be a number.", () => {
        expect(typeof Injector.get(Number)).to.be.eq("number");
    });
    it("should be a class instance.", () => {
        expect(Injector.get(IService)).to.be.instanceof(Service);
        expect(Injector.get(Service)).to.be.instanceof(Service);
    });
});