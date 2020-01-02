# mp-inject
A simple dependency injection library for mini-programs.

# Installation

>`$ npm install --save mp-inject`

# Getting started
```ts
import { expect } from "chai";
import "mocha";

import { injectable, inject, Injector, injectFor, injectSelf } from 'mp-inject';

export interface IService {
    get(): number;
}
export abstract class IService { }

@injectable()
export class Service implements IService {
    get() {
        return 1;
    }
}
// inject manually
Injector.register(IService, Service);

export interface IService1 {
    get(): boolean;
}
export abstract class IService1 { }
// inject by decorater
@injectFor(IService1)
export class Service1 implements IService1 {
    get() {
        return true;
    }
}
// inject self by decorater
@injectSelf()
export class Service2 {
    name = 'service2';
}

@injectSelf()
@injectable()
export class Demo {
    constructor(@inject() public service: IService) {
        this.service1 = Injector.get(IService1);
    }
    public service1: IService1;
    @inject() 
    public service2: Service2;
}


const instance = Injector.get<Demo>(Demo);

describe("demo", () => {
    it("should injected succeeded default.", () => {
        expect(instance.service).is.instanceOf(Service);
    });
    it("should injected succeeded by using decorate", () => {
        expect(instance.service1).is.instanceOf(Service1);
    });
    it("should injected succeeded by using self's decorate", () => {
        expect(instance.service2).is.instanceOf(Service2);
    });
});
```
## Injection options
* propertiesBinder(string,optional): The method name to bind properties, default use `constructor`.
# API
## Injector.clearSingletons(type?: Function) : void
Clear singleton of specified type, if type is omitted, clear all singletons's type.
* type: The singleton type to clear
## Injector.register(type: Function, value:Function | object, options?:object) : void
Register a service for injection.
* type: The service type to be register.
* value: The associated value can be a factory function.
* options: The registration options.
* * singleton(boolean, optional): Whether it is a singleton pattern, default is false.
```ts
Injector.register(String, "default value");
Injector.register(Number, () => Math.random());
class Demo{}
Injector.register(Demo, new Demo());
```
## Injector.get<T>(type: Function, ...args: any[]): T
Get the value corresponding to a specific type, the type must be registered in advance.
* type: The type registered.
* args: The parameters required by the factory function.
```ts
class Demo{}
Injector.register(Demo, new Demo());
const instance = ServiceManager.get<Demo>(Demo);
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
