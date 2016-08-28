"use strict";
var metrics_1 = require('../models/metrics');
var Utils = require('../services/utils');
var Faculties = require('../services/faculties');
var MetricsRoutes = (function () {
    function MetricsRoutes() {
    }
    MetricsRoutes.bind = function (router) {
        router.get('/metrics', getMetric);
    };
    return MetricsRoutes;
}());
exports.MetricsRoutes = MetricsRoutes;
function getMetric(req, res) {
    var fac = Faculties.requestFaculty(req);
    metrics_1.Metrics.findOne({ faculty: fac }, function (err, metric) {
        if (err)
            Utils.sendError(res, 404, 'not found', 'faculty', "No metrics for faculty: " + req.params.faculty + " in database.", err);
        else if (!metric)
            Utils.sendError(res, 404, 'not found', 'faculty', "No metrics for faculty: " + req.params.faculty + " in database.", err);
        else {
            res.send(metric);
        }
    });
}
//# sourceMappingURL=metrics_routes.js.map