import "reflect-metadata";
import { Injector, injectable, inject, injectSelf } from '../src/index';
import { expect } from "chai";
import "mocha";

class Page { onLoad() { } }
class Component { attached() { } }

Injector.register(Number, Math.random());
Injector.config({ propertiesBinder: 'onLoad' }, Page);
Injector.config({ propertiesBinder: 'attached' }, Component);

@injectSelf()
@injectable()
export class Service {
    id: number;
    @inject() num: number;
}

@injectSelf()
@injectable()
export class MyPage extends Page {
    @inject() service: Service;
}

@injectSelf()
@injectable()
export class MyComponnet extends Component {
    @inject() service: Service;
}

describe("global config for target", () => {
    it("should injected success in page.", () => {
        const page = Injector.get<MyPage>(MyPage);
        expect(page.service).to.be.undefined;
        page.onLoad();
        expect(page.service).to.be.instanceOf(Service);
    });
    it("should injected success in component.", () => {
        const component = Injector.get<MyComponnet>(MyComponnet);
        expect(component.service).to.be.undefined;
        component.attached();
        expect(component.service).to.be.instanceOf(Service);
    });
    it("should injected success in constructor", () => {
        const service = Injector.get<Service>(Service);
        expect(service.num).to.be.an('number');
    })
});