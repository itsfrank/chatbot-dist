"use strict";
var metrics_1 = require('../models/metrics');
var Utils = require('../services/utils');
var MetricsRoutes = (function () {
    function MetricsRoutes() {
    }
    MetricsRoutes.bind = function (router) {
        router.get('/metrics/:faculty', getMetric);
    };
    return MetricsRoutes;
}());
exports.MetricsRoutes = MetricsRoutes;
function getMetric(req, res) {
    if (!req.params.faculty)
        Utils.sendError(res, 400, 'param', 'faculty', 'This route should not be sent without a faculty');
    else {
        metrics_1.Metrics.findOne({ faculty: req.params.faculty }, function (err, metric) {
            if (err)
                Utils.sendError(res, 404, 'not found', 'faculty', "No metrics for faculty: " + req.params.faculty + " in database.", err);
            else if (!metric)
                Utils.sendError(res, 404, 'not found', 'faculty', "No metrics for faculty: " + req.params.faculty + " in database.", err);
            else {
                res.send(metric);
            }
        });
    }
}
//# sourceMappingURL=metrics_routes.js.map