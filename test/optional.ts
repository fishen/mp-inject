import "reflect-metadata";
import { Injectable, Injector, Optional } from '../src/index';
import { assert } from "chai";
import "mocha";

export class Service {
    num = Math.random();
}

@Injectable()
export class Demo {
    constructor(
        service: Service
    ) { }
}

@Injectable()
export class Demo1 {
    constructor(
        @Optional() service: Service
    ) { }
}

describe("optional", () => {
    it("should throw error while missing required injection", () => {
        assert.throw(() => Injector.get(Service), Error);
        assert.throw(() => Injector.get(Demo), Error);
    });
    it("should ignore errors while missing optional injection", () => {
        assert.doesNotThrow(() => Injector.get(Service, { optional: true }), Error);
        assert.doesNotThrow(() => Injector.get(Demo1), Error);
    });
});