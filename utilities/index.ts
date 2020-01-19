const a = Array.prototype.forEach.call([1, 2, 3], (item) => {
    return item.toFixed(2);
})

function hello(target: typeof Person) {
    console.log('hello');
    return class Person extends target {
        title = 'hello';
    };
}

function readonly(target: any, key: any) {
    console.log(target, key);
    Object.defineProperty(target, key, {
        writable: false,
    });
}

function logger(target: any, key: any, index: number) {
    console.log(target, key, index);
}

@hello
class Person {
    title: string;
    age = 27;
    constructor(name: string) {
        this.title = name;
    }
    setTitle(@logger title: string) {
        this.title = title;
    }
    @readonly sayTitle(): any {
        return this.title;
    }
}

const zerocho = new Person('zerocho');
// zerocho.sayTitle = () => { console.log('changed') };
console.log('sayTitle', zerocho.sayTitle());
console.log('setTitle', zerocho.setTitle('hello'));

function classDecorator<T extends {new(...args:any[]):{}}>(constructor:T) {
    return class extends constructor {
        newProperty = "new property";
        hello = "override";
    }
}

@classDecorator
class Greeter {
    property = "property";
    hello: string;
    constructor(m: string) {
        this.hello = m;
    }
}

console.log(new Greeter("world"));