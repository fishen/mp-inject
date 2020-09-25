import { Injectable, Injector, Singleton, Inject } from '../src/index';

@Injectable()
export class Logger {
    log(message: string) {
        console.log(message);
    }
    error(error: string) {
        console.error(error);
    }
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

Singleton.clear(SingletonService);
// or
Injector.clearSingletons(SingletonService);
// or clear all singletons
Injector.clearSingletons();

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