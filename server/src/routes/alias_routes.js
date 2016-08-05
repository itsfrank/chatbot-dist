"use strict";
var Models = require('../models');
var Utils = require('../services/utils');
var AliasRoutes = (function () {
    function AliasRoutes() {
    }
    AliasRoutes.bind = function (router) {
        router.get('/alias/:alias', checkAlias);
    };
    return AliasRoutes;
}());
exports.AliasRoutes = AliasRoutes;
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
//# sourceMappingURL=alias_routes.js.map