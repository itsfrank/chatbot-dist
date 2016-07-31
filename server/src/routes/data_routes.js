"use strict";
var Models = require('../models');
var Utils = require('../services/utils');
var DataRoutes = (function () {
    function DataRoutes() {
    }
    DataRoutes.bind = function (router) {
        router.get('/alias/:alias', checkAlias);
    };
    return DataRoutes;
}());
exports.DataRoutes = DataRoutes;
function checkAlias(req, res) {
    if (!req.params.alias)
        Utils.sendError(res, 400, 'param', 'alias', 'This route should not be sent without an alias');
    else {
        Models.getOneDocumentByAlias([req.params.alias.toLowerCase()], function (err, model, document) {
            if (err) {
                Utils.serverErr(err, res);
            }
            else {
                if (document) {
                    res.json({
                        model: model.modelName,
                        document: document,
                        inUse: true
                    });
                }
                else {
                    res.json({
                        inUse: false
                    });
                }
            }
        });
    }
}
//# sourceMappingURL=data_routes.js.map