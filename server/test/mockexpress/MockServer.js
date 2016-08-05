"use strict";
var FakePromise_ts_1 = require('./FakePromise.ts');
var MockResponse_ts_1 = require('./MockResponse.ts');
var MockServer = (function () {
    function MockServer(router, allow_next) {
        this.next_err = false;
        this.next_warn = false;
        this.router = router;
        if (allow_next) {
            if (allow_next == MockServer.NEXT_ERROR)
                this.next_err = true;
            if (allow_next == MockServer.NEXT_WARN)
                this.next_warn = true;
        }
    }
    MockServer.prototype.request = function (method, route, body, headers, others) {
        var req = {};
        req.url = route;
        req.method = method.toUpperCase();
        req.body = body;
        req.headers = headers;
        if (others)
            joinObj(req, others);
        var res = new MockResponse_ts_1.MockResponse();
        var fakePromise = new FakePromise_ts_1.FakePromise();
        res.onSent(function () {
            fakePromise.fulfill(res);
        });
        var self = this;
        this.router['handle'](req, res, function (err) {
            if (self.next_warn)
                console.error('WARN: next() SHOULD NOT BE CALLED');
            if (self.next_err)
                throw 'WARN: next() SHOULD NOT BE CALLED';
            if (err) {
                console.log(err);
            }
            if (!res['sent']) {
                console.error('WARN: execution branch ends without calling send()');
                res.send();
            }
        });
        return fakePromise;
    };
    MockServer.prototype.get = function (route, body, headers) {
        return this.request('GET', route, body, headers);
    };
    MockServer.prototype.post = function (route, body, headers) {
        return this.request('POST', route, body, headers);
    };
    MockServer.prototype.put = function (route, body, headers) {
        return this.request('PUT', route, body, headers);
    };
    MockServer.prototype.patch = function (route, body, headers) {
        return this.request('PATCH', route, body, headers);
    };
    MockServer.prototype.delete = function (route, body, headers) {
        return this.request('DELETE', route, body, headers);
    };
    MockServer.NEXT_ALLOWED = 1;
    MockServer.NEXT_WARN = 2;
    MockServer.NEXT_ERROR = 3;
    return MockServer;
}());
exports.MockServer = MockServer;
function joinObj(to_obj, from_obj) {
    for (var key in from_obj) {
        if (!to_obj.hasOwnProperty(key)) {
            to_obj[key] = from_obj[key];
        }
    }
}
//# sourceMappingURL=MockServer.js.map