
import "reflect-metadata";
import { Injector, inject, injectable, injectSelf } from '../src/index';
import { expect } from "chai";
import "mocha";

Injector.register(Number, () => Math.ceil(Number.MAX_SAFE_INTEGER * Math.random()));
Injector.register(String, () => Date.now().toString());

@injectSelf()
@injectable()
export class Parent {
    constructor(@inject() public id: number) { }
}

@injectSelf()
@injectable()
export class Child extends Parent {
    constructor(@inject() public name: string, @inject() public id: number) {
        super(id);
    }
}

@injectSelf()
@injectable()
export class Child1 extends Parent {

}

@injectSelf()
@injectable()
export class Child2 extends Parent {
    constructor() {
        super(0);
    }
}

const parent = Injector.get<Parent>(Parent);
const child = Injector.get<Child>(Child);
const child1 = Injector.get<Child1>(Child1);
const child2 = Injector.get<Child2>(Child2);

describe("inherit", () => {
    it("should injected succeeded.", () => {
        expect(parent.id).is.a('number');
        expect(child.id).is.a('number');
        expect(child1.id).is.a('number');
        expect(child.name).is.a('string');
        expect(child2.id).is.a('number');
        expect(child2.id).to.be.eq(0);
    });
});

