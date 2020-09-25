
import "reflect-metadata";
import { Injector, Injectable, } from '../src/index';
import { expect } from "chai";
import "mocha";

Injector.register(Number, () => Math.ceil(Number.MAX_SAFE_INTEGER * Math.random()));
Injector.register(String, () => Date.now().toString());


@Injectable()
export class Parent {
    constructor(public id: number) { }
}


@Injectable()
export class Child extends Parent {
    constructor(public name: string, public id: number) {
        super(id);
    }
}


@Injectable()
export class Child1 extends Parent {

}


@Injectable()
export class Child2 extends Parent {
    constructor() {
        super(0);
    }
}

const parent = Injector.get(Parent);
const child = Injector.get(Child);
const child1 = Injector.get(Child1);
const child2 = Injector.get(Child2);

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

