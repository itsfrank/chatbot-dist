"use strict";
var elasticsearch_1 = require('../services/elasticsearch');
var Faculties = require('../services/faculties');
var question_routes_1 = require('../routes/question_routes');
var UtilRoutes = (function () {
    function UtilRoutes() {
    }
    UtilRoutes.bind = function (router) {
        router.get('/reset/questions', resetQuestions);
    };
    return UtilRoutes;
}());
exports.UtilRoutes = UtilRoutes;
function resetQuestions(req, res) {
    var p = req.query.p;
    if (!p) {
        res.statusCode = 400;
        res.send("denied");
    }
    else if (p != 'licorne') {
        res.statusCode = 400;
        res.send("denied");
    }
    else {
        for (var _i = 0, _a = Faculties.facultyList; _i < _a.length; _i++) {
            var faculty = _a[_i];
            elasticsearch_1.elasticsearch.indices.delete({
                index: faculty
            }).then(function (value) {
                elasticsearch_1.elasticsearch.indices.create({
                    index: faculty
                }).then(function (value) {
                    elasticsearch_1.elasticsearch.indices.putMapping({
                        index: faculty,
                        type: question_routes_1.TYPE_NAME,
                        body: {
                            "properties": {
                                "questions": {
                                    "type": "nested"
                                }
                            }
                        }
                    }).then(function (value) {
                        res.send(value);
                    }, function (err) {
                        res.statusCode = 500;
                        res.send(err);
                    });
                }, function (err) {
                    res.statusCode = 500;
                    res.send(err);
                });
            }, function (err) {
                res.statusCode = 500;
                res.send(err);
            });
        }
    }
}
//# sourceMappingURL=util_routes.js.map