# mp-inject
A simple dependency injection library compatible with mini-programs.

# Installation

>`$ npm install --save mp-inject`

# Getting started
```ts
import { expect } from "chai";
import "mocha";

import { injectable, inject, Injector, injectSelf } from 'mp-inject';

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
```
# API
## Injector.clearSingletons(type?: Function|string|number|symbol) : void
Clear singleton of specified type, if type is omitted, clear all singletons's type.
* type: The singleton type to clear
## Injector.register(type: Function|string|number|symbol, value:Function | object, options?:object) : void
Register a service for injection.
* type: The service type to be register.
* value: The associated value can be a factory function.
* options: The registration options.
* * singleton(boolean, optional): Whether it is a singleton pattern, default is false.
```ts
Injector.register("String", "default value");
Injector.register(0, () => Math.random());
class Demo{}
Injector.register(Demo, new Demo());
```
## Injector.get<T>(type: Function|string|number|symbol, ...args: any[]): T
Get the value corresponding to a specific type, the type must be registered in advance. If the type was't injected in advance, an error will be throw.
* type: The type registered.
* args: The parameters required by the factory function.
```ts
class Demo{}
Injector.register(Demo, new Demo());
const instance = ServiceManager.get<Demo>(Demo);
```
## Injector.getOrDefault<T>(type: Function|string|number|symbol, defaultValue: T ...args: any[]): T
Get the value corresponding to a specific type, If the type was't injected in advance, an default value will be returned.
* type: The type registered.
* defaultValue: The value returned by default.
* args: The parameters required by the factory function.
```ts
class Demo{}
const instance = ServiceManager.getOrDefault<Demo>(Demo, new Demo());
```
## Injector.config(options: object, target?: Function): void
Set global injection options
* options: Injection options
* * propertiesBinder(string,optional): The method name to bind properties, default use `constructor`.
* target(Function, optional): Injection target, such as `Component`.
```ts
Injector.config({ propertiesBinder: "componentDidMount" });
```
# Singleton
```ts
// @injectSelf
@injectSelf({ singleton: true })
export class SingletonService {}
```
```ts
// @injectFor
@injectFor(IService, { singleton: true })
export class SingletonService {}
```
```ts
// register
@injectable()
export class SingletonService {}
Injector.register(IService, SingletonService, { singleton: true });
```
# Also see
[mp-event](https://www.npmjs.com/package/mp-event): a simple event subscription publishing system implementation;

[mp-i18n](https://www.npmjs.com/package/mp-i18n): a cross-platform i18n library for muti-miniprograms (wx、alipay、baidu、tt);

[mp-mem](https://www.npmjs.com/package/mp-mem): a lightweight memoize library that can be used on both normal functions and class methods;

[mp-modal](https://www.npmjs.com/package/mp-modal)
A helper cross-platform tool for miniprograms that can more convenient to use modal components;

[auto-mapping](https://www.npmjs.com/package/auto-mapping): map and convert objects automatically in typescript;
