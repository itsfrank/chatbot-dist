"use strict";
var prep_spec_ts_1 = require('../prep.spec.ts');
var chai_1 = require('chai');
var words_ts_1 = require('../../src/services/words.ts');
describe('Words Service', function () {
    it('should reload the alias array', function (done) {
        words_ts_1.WordsService.reloadWords(function (err) {
            chai_1.expect(err).to.be.null;
            done();
        });
    });
    it('should return an alias found in a string', function () {
        var alias = words_ts_1.WordsService.findAliasInString('Where is cafe campus?');
        chai_1.expect(alias).not.to.be.null;
    });
    it('should return null if no alias in string', function () {
        var alias = words_ts_1.WordsService.findAliasInString('Blughl bahglr janglelor?');
        chai_1.expect(alias).to.be.null;
    });
    it('should find alias regardless of case', function () {
        var alias = words_ts_1.WordsService.findAliasInString('Where is Cafecampus?');
        chai_1.expect(alias).not.to.be.null;
    });
    it.skip('should return a formated message', function (done) {
        prep_spec_ts_1.Server.get('/question?q=when+is+br?&he=lasdka').then(function (res) {
        }).finally(done);
    });
});
//# sourceMappingURL=words.spec.js.map