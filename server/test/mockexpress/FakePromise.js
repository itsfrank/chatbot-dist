"use strict";
var FakePromise = (function () {
    function FakePromise() {
        this.then_set = false;
        this.catch_set = false;
        this.finally_set = false;
        this.exec_then_sync = false;
        this.exec_catch_sync = false;
        this.exec_finally_sync = false;
        this.finally_fn = function () { };
    }
    FakePromise.prototype.then = function (then_fn) {
        if (this.then_set)
            throw "then can only be called once";
        if (this.exec_then_sync)
            then_fn(this.o); //simulate async
        else {
            this.then_fn = then_fn;
            this.then_set = true;
        }
        return this;
    };
    FakePromise.prototype.finally = function (finally_fn) {
        if (this.finally_set)
            throw "finally can only be called once";
        if (this.exec_finally_sync)
            finally_fn(this.e); //simulate async
        else {
            this.finally_fn = finally_fn;
            this.finally_set = true;
        }
    };
    FakePromise.prototype.fulfill = function (o) {
        if (!this.then_set) {
            this.exec_then_sync = true;
            this.o = o;
        }
        else {
            this.then_fn(o);
        }
        if (!this.finally_set) {
            this.exec_finally_sync = true;
        }
        else {
            this.finally_fn(this.e);
        }
    };
    return FakePromise;
}());
exports.FakePromise = FakePromise;
//# sourceMappingURL=FakePromise.js.map