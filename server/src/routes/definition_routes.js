"use strict";
var Utils = require('../services/utils');
var Definitions = require('../services/definitions');
var definition_1 = require('../models/definition');
var DefinitionRoutes = (function () {
    function DefinitionRoutes() {
    }
    DefinitionRoutes.bind = function (router) {
        router.get('/definition', getDefinitionCollection);
        router.get('/definition/:id', getDefinition);
        router.post('/definition', postDefinition);
        router.delete('/definition/:id', deleteDefinition);
    };
    return DefinitionRoutes;
}());
exports.DefinitionRoutes = DefinitionRoutes;
function getDefinitionCollection(req, res) {
    definition_1.Definition.find({}, function (err, definitions) {
        if (err)
            Utils.sendError(res, 500, 'error', 'unknown', "An error occured while processing the request", err);
        res.send(definitions);
    });
}
function getDefinition(req, res) {
    if (!req.params.id)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    else {
        definition_1.Definition.findOne({ _id: req.params.id }, function (err, definition) {
            if (err)
                Utils.sendError(res, 500, 'error', 'unknown', "An error occured while processing the request", err);
            else if (!definition)
                Utils.sendError(res, 404, 'not found', '', definition_1.Definition.modelName, "No definition with id: " + req.params.id + " in database.");
            else
                res.send(definition);
        });
    }
}
function postDefinition(req, res) {
    var definition = req.body;
    if (!definition.name)
        Utils.sendError(res, 400, 'bad request', 'name', "missing 'name' parameter", definition);
    else {
        if (!definition.fields)
            definition.fields = [];
        definition_1.Definition.findOne({ name: definition.name }, function (err, conflict) {
            if (err)
                Utils.sendError(res, 500, 'error', 'unknown', "An error occured while processing the request", err);
            else if (conflict) {
                Utils.sendError(res, 409, 'conflict', definition_1.Definition.modelName, "A definition named " + definition.name + " already exists", err);
            }
            else {
                definition['type'] = definition.name.toLowerCase();
                new definition_1.Definition(definition).save(function (err, newDefinition) {
                    Definitions.reload();
                    res.send(newDefinition);
                });
            }
        });
    }
}
function deleteDefinition(req, res) {
    var id = req.params.id;
    definition_1.Definition.remove({ _id: id }, function (err) {
        if (err)
            Utils.sendError(res, 500, 'error', 'unknown', "An error occured while processing the request", err);
        else {
            Definitions.reload();
            res.sendStatus(200);
        }
    });
}
//# sourceMappingURL=definition_routes.js.map