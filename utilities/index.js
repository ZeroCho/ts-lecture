"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var a = Array.prototype.forEach.call([1, 2, 3], function (item) {
    return item.toFixed(2);
});
function hello(target) {
    console.log('hello');
    return /** @class */ (function (_super) {
        __extends(Person, _super);
        function Person() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.title = 'hello';
            return _this;
        }
        return Person;
    }(target));
}
function readonly(target, key) {
    console.log(target, key);
    Object.defineProperty(target, key, {
        writable: false
    });
}
function logger(target, key, index) {
    console.log(target, key, index);
}
var Person = /** @class */ (function () {
    function Person(name) {
        this.age = 27;
        this.title = name;
    }
    Person.prototype.setTitle = function (title) {
        this.title = title;
    };
    Person.prototype.sayTitle = function () {
        return this.title;
    };
    __decorate([
        __param(0, logger)
    ], Person.prototype, "setTitle");
    __decorate([
        readonly
    ], Person.prototype, "sayTitle");
    Person = __decorate([
        hello
    ], Person);
    return Person;
}());
var zerocho = new Person('zerocho');
// zerocho.sayTitle = () => { console.log('changed') };
console.log('sayTitle', zerocho.sayTitle());
console.log('setTitle', zerocho.setTitle('hello'));
function classDecorator(constructor) {
    return /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.newProperty = "new property";
            _this.hello = "override";
            return _this;
        }
        return class_1;
    }(constructor));
}
var Greeter = /** @class */ (function () {
    function Greeter(m) {
        this.property = "property";
        this.hello = m;
    }
    Greeter = __decorate([
        classDecorator
    ], Greeter);
    return Greeter;
}());
console.log(new Greeter("world"));
