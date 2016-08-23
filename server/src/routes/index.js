"use strict";
var alias_routes_1 = require('./alias_routes');
var ask_routes_1 = require('./ask_routes');
var data_routes_1 = require('./data_routes');
var facebook_routes_1 = require('./facebook_routes');
var question_routes_1 = require('./question_routes');
var util_routes_1 = require('./util_routes');
var metrics_routes_1 = require('./metrics_routes');
var twilio_routes_1 = require('./twilio_routes');
var yaml_routes_1 = require('./yaml_routes');
var RouteBinder = (function () {
    function RouteBinder() {
    }
    RouteBinder.bind = function (router) {
        router.get('/test', function (req, res) {
            res.json({ msg: 'success' });
        });
        alias_routes_1.AliasRoutes.bind(router);
        ask_routes_1.AskRoutes.bind(router);
        data_routes_1.DataRoutes.bind(router);
        facebook_routes_1.FacebookRoutes.bind(router);
        question_routes_1.QuestionRoutes.bind(router);
        util_routes_1.UtilRoutes.bind(router);
        metrics_routes_1.MetricsRoutes.bind(router);
        twilio_routes_1.TwilioRoutes.bind(router);
        yaml_routes_1.YamlRoutes.bind(router);
    };
    return RouteBinder;
}());
exports.RouteBinder = RouteBinder;
//# sourceMappingURL=index.js.map