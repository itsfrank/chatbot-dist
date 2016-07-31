"use strict";
var venue_1 = require('./venue');
var event_1 = require('./event');
var Utils = require('../services/utils');
exports.AliasModels = [
    venue_1.Venue,
    event_1.Event
];
function getAllAliases(callback) {
    var result = [];
    var error;
    Utils.forAsync(exports.AliasModels.length, function (index, done) {
        var model = exports.AliasModels[index];
        model.find({}, 'aliases', function (err, res) {
            if (err) {
                error = err;
                done(true);
            }
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var document = res_1[_i];
                result = result.concat(document.aliases);
            }
            done(false);
        });
    }, function (aborted) {
        callback(error, result);
    });
}
exports.getAllAliases = getAllAliases;
function getOneDocumentByAlias(alias_array, callback) {
    var result = {
        error: null,
        model: null,
        document: null
    };
    Utils.forAsync(exports.AliasModels.length, function (index, done) {
        var model = exports.AliasModels[index];
        model.findOne({ aliases: { $in: alias_array } }, function (err, document) {
            if (err) {
                result.error = err;
                done(true);
            }
            else {
                if (document) {
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
exports.getOneDocumentByAlias = getOneDocumentByAlias;
function getDocumentsByAlias(alias_array, callback) {
    var result = {
        error: null,
        documents: []
    };
    Utils.forAsync(exports.AliasModels.length, function (index, done) {
        var model = exports.AliasModels[index];
        model.find({ aliases: { $in: alias_array } }, function (err, documents) {
            if (err) {
                result.error = err;
                done(true);
            }
            else {
                if (documents) {
                    for (var i = 0; i < documents.length; i++) {
                        result.documents.push({
                            model: model,
                            document: documents[i]
                        });
                    }
                    done(false);
                }
                else {
                    done(false);
                }
            }
        });
    }, function (aborted) {
        callback(result.error, result.documents);
    });
}
exports.getDocumentsByAlias = getDocumentsByAlias;
function saveAliasedDocument(body, Model, res, callback) {
    if (!callback)
        callback = function (bool) { };
    if (body._id) {
        Utils.sendError(res, 400, 'body', '_id', 'POST is only for new event creation, use PUT or PATCH for updates');
        callback(false);
    }
    else if (!body.name) {
        Utils.sendError(res, 400, 'body', 'name', 'The ' + Model.modelName + ' must have a name');
        callback(false);
    }
    else {
        //make sure aliases contains name and is all lowercase
        if (!body.aliases)
            body.aliases = [];
        body.aliases = Utils.lowercaseArray(body.aliases);
        if (body.aliases.indexOf(body.name.toLowerCase()) < 0)
            body.aliases.push(body.name.toLowerCase());
        //make sure no other document has a matching alias
        getOneDocumentByAlias(body.aliases, function (err, model, document) {
            if (err)
                Utils.serverErr(err, res);
            else if (document) {
                var first = true;
                var aliases_string = '';
                for (var i = 0; i < document.aliases.length; i++) {
                    var element = document.aliases[i];
                    if (body.aliases.indexOf(element) > -1) {
                        if (first) {
                            aliases_string = element;
                            first = false;
                        }
                        else {
                            aliases_string = aliases_string + ', ' + element;
                        }
                    }
                }
                Utils.sendError(res, 409, 'alias', model.modelName, 'An existing ' + model.modelName.toLowerCase() + ' already contains the alias: \'' + aliases_string + '\'', { id: document._id, name: document.name });
                callback(false);
            }
            else {
                new Model(body).save(function (err, saved) {
                    if (err) {
                        Utils.serverErr(err, res);
                        callback(false);
                    }
                    else {
                        callback(true, saved._id);
                    }
                });
            }
        });
    }
}
exports.saveAliasedDocument = saveAliasedDocument;
function updateAliasedDocument(id, body, Model, res, callback) {
    if (!callback)
        callback = function (bool) { };
    if (body._id) {
        if (id != body._id) {
            Utils.sendError(res, 400, 'request', '_id', 'The id in the body does not match the id in the route');
            callback(false);
        }
        else {
            delete body._id;
        }
    }
    else {
        Model.findById(id, function (err, updating_doc) {
            if (err) {
                Utils.serverErr(err, res);
                callback(false);
            }
            else {
                if (!body.name) {
                    body.name = updating_doc.name;
                }
                else {
                    if (!body.aliases) {
                        body.aliases = updating_doc.aliases;
                        body.aliases.splice(body.aliases.indexOf(updating_doc.name.toLowerCase()), 1);
                    }
                }
                if (body.aliases) {
                    body.aliases = Utils.lowercaseArray(body.aliases);
                    if (body.aliases.indexOf(body.name.toLowerCase()) < 0)
                        body.aliases.push(body.name.toLowerCase());
                    getDocumentsByAlias(body.aliases, function (err, results) {
                        if (err) {
                            Utils.serverErr(err, res);
                            callback(false);
                        }
                        else {
                            var hasConflict = false;
                            if (results.length > 0) {
                                for (var i = 0; i < results.length; i++) {
                                    var model = results[i].model;
                                    var document = results[i].document;
                                    //Not a conflict if it's the doc we're currently updating
                                    if (document._id.equals(updating_doc._id))
                                        continue;
                                    var first = true;
                                    var aliases_string = '';
                                    for (var i = 0; i < document.aliases.length; i++) {
                                        var element = document.aliases[i];
                                        if (body.aliases.indexOf(element) > -1) {
                                            if (first) {
                                                aliases_string = element;
                                                first = false;
                                            }
                                            else {
                                                aliases_string = aliases_string + ', ' + element;
                                            }
                                        }
                                    }
                                    Utils.sendError(res, 400, 'alias', model.modelName, 'An existing ' + model.modelName + ' already contains the alias: \'' + aliases_string + '\'', { id: document._id, name: document.name });
                                    hasConflict = true;
                                    break; //one conflict found, no need to check additional
                                }
                            }
                            if (!hasConflict) {
                                Model.update({ _id: id }, body, function (err, rnum_rows, raw) {
                                    if (err) {
                                        Utils.serverErr(err, res);
                                        callback(false);
                                    }
                                    else {
                                        callback(true);
                                    }
                                });
                            }
                        }
                    });
                }
                else {
                    Model.update({ _id: id }, body, function (err, rnum_rows, raw) {
                        if (err) {
                            Utils.serverErr(err, res);
                            callback(false);
                        }
                        else {
                            callback(true);
                        }
                    });
                }
            }
        });
    }
}
exports.updateAliasedDocument = updateAliasedDocument;
//# sourceMappingURL=index.js.map