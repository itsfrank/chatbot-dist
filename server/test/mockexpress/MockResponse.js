"use strict";
var MockResponse = (function () {
    function MockResponse() {
        this.code = 200;
        this.err = undefined;
        this.data = undefined;
        this.data_type = 'null';
        this.sent = false;
        this.dataSet = false;
        this.codeSet = false;
        this.onSentHandler = function () { };
    }
    MockResponse.prototype.set_code = function (code) {
        if (this.sent)
            console.error("WARN: response was already sent, cannot set status code after it was already sent");
        if (this.codeSet)
            console.error("WARN: response status code was already set, you are trying to set it a second time");
        this.code = code;
        this.codeSet = true;
    };
    MockResponse.prototype.set_data = function (data, type) {
        if (this.sent)
            console.error("WARN: response was already sent, cannot set data after it was already sent");
        if (this.dataSet)
            console.error("WARN: response data was already set, you are trying to set it a second time");
        this.data = data;
        this.data_type = type;
        this.dataSet = true;
    };
    MockResponse.prototype.status = function (code) {
        this.set_code(code);
        return this;
    };
    MockResponse.prototype.sendStatus = function (code) {
        this.send(code, 'The response code is: ' + code);
    };
    MockResponse.prototype.send = function (one, two) {
        if (this.sent)
            console.error("WARN: response was already sent, cannot send it a second time");
        if (two) {
            this.set_code(one);
            this.set_data(two, 'string');
        }
        else if (!one) {
        }
        else if (typeof one == 'string') {
            this.set_data(one, 'string');
        }
        else if (typeof one == 'number') {
            this.set_data(one, 'number');
        }
        else if (typeof one == 'object') {
            this.set_data(one, 'object');
        }
        else {
            console.error("WARN: " + typeof one + " is an invalid response data type");
        }
        this.sent = true;
        this.onSentHandler();
    };
    MockResponse.prototype.json = function (data) {
        this.send(data);
    };
    MockResponse.prototype.onSent = function (fn) {
        this.onSentHandler = fn;
    };
    return MockResponse;
}());
exports.MockResponse = MockResponse;
//# sourceMappingURL=MockResponse.js.map