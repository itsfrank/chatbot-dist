"use strict";
var jsonpatch = require('fast-json-patch');
var utils_1 = require('./utils');
var PatchHandler = (function () {
    function PatchHandler() {
        this.handlers = {
            'add': {},
            'remove': {},
            'replace': {},
            'copy': {},
            'move': {},
            'test': {}
        };
    }
    PatchHandler.prototype.on = function (op, path, handler) {
        this.handlers[op][path] = handler;
    };
    PatchHandler.prototype.onAdd = function (path, handler) {
        this.on('add', path, handler);
    };
    PatchHandler.prototype.onRemove = function (path, handler) {
        this.on('remove', path, handler);
    };
    PatchHandler.prototype.onReplace = function (path, handler) {
        this.on('replace', path, handler);
    };
    PatchHandler.prototype.onCopy = function (path, handler) {
        this.on('copy', path, handler);
    };
    PatchHandler.prototype.onMove = function (path, handler) {
        this.on('move', path, handler);
    };
    PatchHandler.prototype.onTest = function (path, handler) {
        this.on('test', path, handler);
    };
    PatchHandler.prototype.patch = function (document, patches, callback) {
        var self = this;
        var error = null;
        utils_1.forAsync(patches.length, function (index, done) {
            if (self.handlers[patches[index].op][patches[index].path]) {
                var err = self.handlers[patches[index].op][patches[index].path](document, patches[index], function (err) {
                    if (err) {
                        error = err;
                        done(true);
                    }
                    else {
                        done(false);
                    }
                });
            }
            else {
                done(false);
            }
        }, function (aborted) {
            jsonpatch.apply(document, patches);
            callback(error);
        });
    };
    return PatchHandler;
}());
exports.PatchHandler = PatchHandler;
//# sourceMappingURL=patch.js.map