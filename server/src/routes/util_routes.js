"use strict";
var elasticsearch_1 = require('../services/elasticsearch');
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
    console.log(p);
    if (!p) {
        res.statusCode = 400;
        res.send("denied");
    }
    else if (p != 'licorne') {
        res.statusCode = 400;
        res.send("denied");
    }
    else {
        elasticsearch_1.elasticsearch.indices.delete({
            index: 'questions'
        }).then(function (value) {
            elasticsearch_1.elasticsearch.indices.create({
                index: 'questions'
            }).then(function (value) {
                elasticsearch_1.elasticsearch.indices.putMapping({
                    index: 'questions',
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
//# sourceMappingURL=util_routes.js.map