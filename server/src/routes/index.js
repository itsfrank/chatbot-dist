"use strict";
var data_routes_1 = require('./data_routes');
var event_routes_1 = require('./event_routes');
var venue_routes_1 = require('./venue_routes');
var question_routes_1 = require('./question_routes');
var RouteBinder = (function () {
    function RouteBinder() {
    }
    RouteBinder.bind = function (router) {
        router.get('/test', function (req, res) {
            res.json({ msg: 'success' });
        });
        data_routes_1.DataRoutes.bind(router);
        event_routes_1.EventRoutes.bind(router);
        venue_routes_1.VenueRoutes.bind(router);
        question_routes_1.QuestionRoutes.bind(router);
    };
    return RouteBinder;
}());
exports.RouteBinder = RouteBinder;
//# sourceMappingURL=index.js.map