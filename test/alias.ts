import "reflect-metadata";
import { Inject, Injectable, Injector } from '../src/index';
import { expect } from "chai";
import "mocha";

@Injectable({ alias: 'service' })
export class Service {
    num = Math.random();
}

@Injectable({ alias: 'demo' })
export class Demo {
    constructor(
        public service: Service,
        @Inject('service') public service1: Service,
    ) { }
}

describe("alias", () => {
    it("should be get correct type while using alias", () => {
        expect(Injector.get(Demo)).to.be.instanceOf(Demo);
        expect(Injector.get('demo')).to.be.instanceOf(Demo);
        expect(Injector.get<Demo>('demo').service).to.be.instanceOf(Service);
        expect(Injector.get<Demo>('demo').service1).to.be.instanceOf(Service);
    });
});