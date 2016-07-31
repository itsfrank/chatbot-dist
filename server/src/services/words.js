"use strict";
var AliasModels = require('../models/index');
var WordsService = (function () {
    function WordsService() {
    }
    WordsService.reloadWords = function (callback) {
        if (!callback)
            callback = function () { };
        AliasModels.getAllAliases(function (err, aliases) {
            if (err) {
                callback(err);
                return;
            }
            WordsService.dataWords = aliases;
            callback(null);
        });
    };
    WordsService.findAliasInString = function (str) {
        str = str.toLocaleLowerCase();
        for (var _i = 0, _a = WordsService.dataWords; _i < _a.length; _i++) {
            var alias = _a[_i];
            if (WordsService.matchFullWord(str, alias)) {
                return alias;
            }
        }
        return null;
    };
    WordsService.matchFullWord = function (str, word) {
        var re = new RegExp('\\b' + word + '\\b');
        return str.match(re) != null;
    };
    WordsService.dataWords = [];
    return WordsService;
}());
exports.WordsService = WordsService;
//# sourceMappingURL=words.js.map