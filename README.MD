# mp-inject
A type-based dependency injection library.

# Installation

>`$ npm install --save mp-inject`
# Requirments

```json
// tsconfig.json
{
    "compilerOptions":{
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
    }
}
```

# Getting started
```ts
import { Injectable, Injector, } from 'mp-inject';

@Injectable()
export class Logger {
    log(message: string) {}
    error(error: string) {}
}

@Injectable()
export class Http {
    constructor(public logger: Logger) { }
    get<T = any>(url: string): Promise<T> {
        return fetch(url)
            .then(res => res.json())
            .catch(err => this.logger.error(err))
    }
    post<T = any>(url: string, body: any): Promise<T> {
        return fetch(url, { method: 'post', body })
            .then(res => res.json())
            .catch(err => this.logger.error(err))
    }
}

@Injectable()
export class Service {

    constructor(public logger: Logger, public http: Http) { }

    todo() {
        this.logger.log('...');
        this.http.get('...');
    }
}

const service = Injector.get(Service);
console.log(service instanceof Service); //true
console.log(service.http instanceof Http); //true
console.log(service.logger instanceof Logger); //true
console.log(service.http.logger instanceof Logger); //true
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
* * alias(Function|string|number|symbol, optional): The another name for current Service.
```ts
import { Injector, } from 'mp-inject';

Injector.register("String", "default value");
Injector.register(0, () => Math.random());

abstract class Service{}
class MyService extends Service{}
Injector.register(Service, ()=>new MyService());
```
## Injector.registerClass(type: Function|string|number|symbol, value:new(...args: any) => any, options?:object) : void
Register a class service for injection.
* type: The service type to be register.
* value: The associated value must be a class.
* options: The registration options.
* * alias(Function|string|number|symbol, optional): The another name for current Service.
```ts
import { Injector, } from 'mp-inject';

abstract class Service{}
class MyService extends Service{}
Injector.registerClass(Service, MyService);
// equal to 
// Injector.register(Service, (...args:any)=>new MyService(...args));
```
## Injector.get<T>(type: Function|string|number|symbol, ...args: any[]): T
Get the value corresponding to a specific type, the type must be registered in advance. If the type was't injected in advance, an error will be throw.
* type: The type registered.
* args: The parameters required by the factory function.
```ts
import { Injector, } from 'mp-inject';

class Demo{}
Injector.register(Demo, new Demo());
const instance = Injector.get<Demo>(Demo);
```
## Injector.getOrDefault<T>(type: Function|string|number|symbol, defaultValue: T ...args: any[]): T
Get the value corresponding to a specific type, If the type was't injected in advance, an default value will be returned.
* type: The type registered.
* defaultValue: The value returned by default.
* args: The parameters required by the factory function.
```ts
import { Injector, } from 'mp-inject';

class Demo{}
const instance = Injector.getOrDefault<Demo>(Demo, new Demo());
```
# Singleton
>The `Injectable` should be the topmost decorator
```ts
import { Injectable, Injector, Singleton } from 'mp-inject';

Injector.register(Number, () => Math.random());

@Injectable()
export class NoSingletonService {
    constructor(public num: number) { }
}

@Injectable()
@Singleton()
export class SingletonService {
    constructor(public num: number) { }
}

const service1 = Injector.get(NoSingletonService);
const service2 = Injector.get(NoSingletonService);
console.log(service1.num === service2.num) //false
console.log(service1 === service2) //false
const service3 = Injector.get(SingletonService);
const service4 = Injector.get(SingletonService);
console.log(service3.num === service4.num) //true
console.log(service3 === service4) //true
```
## Clear Singleton
```ts
Singleton.clear(SingletonService);
// or
Injector.clearSingletons(SingletonService);
// or clear all singletons
Injector.clearSingletons();
```
# Alias
```ts
import { Injectable, Injector, Inject } from 'mp-inject';

export class Service1 { }

Injector.registerClass(Service1, Service1, { alias: 'service1' });

@Injectable({ alias: 'demo1' })
export class Demo1 {
    constructor(
        public service: Service,
        @Inject('service1') public service1: Service1,
    ) { }
}

console.log(Injector.get('service1') instanceof Service1) //true
console.log(Injector.get(Service1) instanceof Service1) //true
console.log(Injector.get('demo1') instanceof Demo1) //true
console.log(Injector.get(Demo1) instanceof Demo1) //true
console.log(Injector.get('demo1').service1 instanceof Service1) //true
```
# Poperties Injection
```ts
import { Inject, Injectable, Injector } from 'mp-inject';

Injector.register(Number, 0);

@Injectable()
class Service{}

export class Demo{
    @Inject() number!:number;
    @Inject() service!:Service;
}
```
# Optional
By default, if the injected properties or parameters are absent, an error will be thrown. If the properties or parameters are optional, you can use the `Optional` decorator.
```ts
import { Inject, Injectable, Injector, Optional } from 'mp-inject';

@Injectable()
class Service{}

class AbsentService{}

export class Demo{
    constructor(
         service: Service;
        //service: AbsentService; // throw error
        @Optional() service1: AbsentService // ok
    ){}

    @Inject() service2!:AbsentService;
    @Optional() service3!:AbsentService;

    todo(){
        //this.service2.some(); throw error
        this.service3.some(); // ok
    }
}
```
# Also see
[auto-validate](https://www.npmjs.com/package/auto-validate)
validate object by decorator in typescript.

[auto-mapping](https://www.npmjs.com/package/auto-mapping): map and convert objects automatically in typescript;
