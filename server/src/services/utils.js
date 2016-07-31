"use strict";
var models_1 = require('../models');
function sendError(res, status, code, subject, message, extra) {
    var err_obj = {
        code: code,
        subject: subject,
        message: message,
    };
    if (extra)
        err_obj.extra = extra;
    res.status(status).json(err_obj);
}
exports.sendError = sendError;
function serverErr(err, res) {
    console.log("ERROR");
    res.status(500).send(err);
}
exports.serverErr = serverErr;
function lowercaseArray(arr) {
    var rtn = [];
    for (var i = 0; i < arr.length; i++) {
        rtn.push(arr[i].toLowerCase());
    }
    return rtn;
}
exports.lowercaseArray = lowercaseArray;
function getFromAlias(alias_array, callback) {
    var result = {
        error: null,
        model: null,
        document: null
    };
    forAsync(models_1.AliasModels.length, function (index, done) {
        var model = models_1.AliasModels[index];
        model.findOne({ aliases: { $in: alias_array } }, function (err, document) {
            if (err) {
                result.error = err;
                done(true);
            }
            else {
                if (document) {
                    var first = true;
                    var aliases_string = '';
                    for (var i = 0; i < document.aliases.length; i++) {
                        var element = document.aliases[i];
                        if (alias_array.indexOf(element) > -1) {
                            if (first) {
                                aliases_string = element;
                                first = false;
                            }
                            else {
                                aliases_string = aliases_string + ', ' + element;
                            }
                        }
                    }
                    result.model = model;
                    result.document = document;
                    done(true);
                }
                else {
                    done(false);
                }
            }
        });
    }, function (aborted) {
        callback(result.error, result.model, result.document);
    });
}
exports.getFromAlias = getFromAlias;
function forAsync(loops, loop, complete) {
    var c = loops - 1;
    var aborted = false;
    var self = this;
    for (var i = 0; i < loops; i++) {
        loop(i, function (abort) {
            if (aborted)
                return;
            if (abort) {
                aborted = true;
                complete(true);
            }
            else if (--c < 0) {
                complete();
            }
        });
    }
}
exports.forAsync = forAsync;
//# sourceMappingURL=utils.js.map