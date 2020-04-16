import { expect } from "chai";
import "mocha";

import { injectable, inject, Injector, injectSelf } from '../src/index';

export interface IService {
    value: number;
}
export abstract class IService { }

@injectable()
export class CustomService implements IService {
    value = 1;
}

// inject self
@injectSelf()
export class CustomService1 { }

// inject manually
Injector.register(IService, CustomService);
Injector.register('injectedStringKey', 'string value');
Injector.register(0, Number.MAX_VALUE);

@injectSelf()
@injectable()
export class Demo {
    constructor(@inject() public service: IService) {
        this.str = Injector.get('injectedStringKey');
    }

    @inject() public service1: CustomService1;
    public str: string;
    @inject(0) public num: number;
}


const instance = Injector.get<Demo>(Demo);

describe("demo test", () => {
    it("should be successfully injected by default.", () => {
        expect(instance.service).is.instanceof(CustomService);
        expect(instance.service.value).to.eq(1);
    });
    it("should be successfully injected by decorating properties.", () => {
        expect(instance.num).is.a('number');
        expect(instance.num).to.eq(Number.MAX_VALUE);
    });
    it("should be successfully injected by manually.", () => {
        expect(instance.str).is.a('string');
        expect(instance.str).to.eq('string value');
    });
    it("should be successfully injected by using self's decorate", () => {
        expect(instance.service1).is.instanceOf(CustomService1);
    });
});