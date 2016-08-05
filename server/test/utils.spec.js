"use strict";
var Utils = require('../src/services/utils');
var chai_1 = require('chai');
describe('Utils', function () {
    it('should find documents from alias', function (done) {
        Utils.getFromAlias(['irrelevant alias', 'ph'], function (err, model, document) {
            chai_1.expect(err).to.be.null;
            chai_1.expect(model.modelName).to.equal('Event');
            chai_1.expect(document.name).to.equal('Power Hour');
            done();
        });
    });
});
//# sourceMappingURL=utils.spec.js.map