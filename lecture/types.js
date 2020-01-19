"use strict";
exports.__esModule = true;
var Sub = /** @class */ (function () {
    function Sub(mine) {
        this.mine = mine;
        this.att = Math.ceil(Math.random() * 5);
        this.hp = Math.ceil(Math.random() * 5);
        this.cost = Math.floor((this.att + this.hp) / 2);
        this.field = false;
    }
    return Sub;
}());
exports.Sub = Sub;
var Hero = /** @class */ (function () {
    function Hero(mine) {
        this.mine = mine;
        this.att = Math.ceil(Math.random() * 2);
        this.hp = Math.ceil(Math.random() * 5) + 25;
        this.hero = true;
        this.field = true;
    }
    return Hero;
}());
exports.Hero = Hero;
