# mp-inject
A simple dependency injection library for mini-programs.

# Installation

>`$ npm install --save mp-inject`

# Getting started
```
import { injectable, inject, ServiceManager } from 'mp-inject';

ServiceManager.register(String, 'default value');
ServiceManager.register(Number, () => Math.random());
console.assert(ServiceManager.get(String) === 'default value');
console.assert(typeof ServiceManager.get(Number) === 'number');

@injectable()
export class Service {
    do() {
        console.log(123);
    }
}

export default class{
    @inject(Service)
    private service: Service;
    onLoad(){
        this.service.do();
    }
}
```
# Also see
[mp-event](https://www.npmjs.com/package/mp-event): a simple event subscription publishing system implementation;

[mp-i18n](https://www.npmjs.com/package/mp-i18n): a cross-platform i18n library for muti-miniprograms (wx、alipay、baidu、tt);

[mp-mem](https://www.npmjs.com/package/mp-mem): a lightweight memoize library that can be used on both normal functions and class methods;

[mp-modal](https://www.npmjs.com/package/mp-modal)
A helper cross-platform tool for miniprograms that can more convenient to use modal components;

[auto-mapping](https://www.npmjs.com/package/auto-mapping): map and convert objects automatically in typescript;
