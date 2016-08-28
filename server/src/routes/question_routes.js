"use strict";
var elasticsearch_1 = require('../services/elasticsearch');
var Utils = require('../services/utils');
var Questions = require('../services/questions');
var Faculties = require('../services/faculties');
var QuestionRoutes = (function () {
    function QuestionRoutes() {
    }
    QuestionRoutes.bind = function (router) {
        router.post('/question', postQuestion);
        router.get('/question', getQuestionCollection);
        router.get('/question/:id', getQuestion);
        router.put('/question/:id', putQuestion);
        router.delete('/question/:id', deleteQuestion);
    };
    return QuestionRoutes;
}());
exports.QuestionRoutes = QuestionRoutes;
exports.TYPE_NAME = 'q';
function getQuestionCollection(req, res) {
    var index = Faculties.requestFaculty(req);
    if (!index)
        Utils.sendError(res, 400, 'bad subdomain', 'subdomain', 'Subdomain does not match faculty');
    elasticsearch_1.elasticsearch.search({
        index: index,
        type: exports.TYPE_NAME,
        size: 1000,
        body: {
            query: {
                match_all: {}
            }
        }
    }).then(function (value) {
        var questions = [];
        for (var _i = 0, _a = value.hits.hits; _i < _a.length; _i++) {
            var hit = _a[_i];
            questions.push(Questions.hitToQ(hit));
        }
        res.send(questions);
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
function getQuestion(req, res) {
    var index = Faculties.requestFaculty(req);
    if (!index)
        Utils.sendError(res, 400, 'bad subdomain', 'subdomain', 'Subdomain does not match faculty');
    elasticsearch_1.elasticsearch.get({
        index: index,
        type: exports.TYPE_NAME,
        id: req.params.id
    }).then(function (value) {
        if (!value.found) {
            Utils.sendError(res, 404, 'not found', 'question', 'no question with id exists', value);
        }
        else {
            var q = Questions.hitToQ(value);
            console.log(q);
            res.send(q);
        }
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
function postQuestion(req, res) {
    var index = Faculties.requestFaculty(req);
    if (!index)
        Utils.sendError(res, 400, 'bad subdomain', 'subdomain', 'Subdomain does not match faculty');
    var q = Questions.qToDoc(req.body);
    elasticsearch_1.elasticsearch.search({
        index: index,
        type: exports.TYPE_NAME,
        body: {
            "query": {
                "match": {
                    "name": {
                        "query": q.name,
                        "operator": "and"
                    }
                }
            }
        },
    }).then(function (value) {
        if (value.hits.total > 0) {
            for (var _i = 0, _a = value.hits.hits; _i < _a.length; _i++) {
                var hit = _a[_i];
                if (q.name == hit._source.name) {
                    Utils.sendError(res, 409, 'conflict', 'name', 'a question with the same name already exists', Questions.hitToQ(hit));
                    return;
                }
            }
        }
        elasticsearch_1.elasticsearch.create({
            index: index,
            type: exports.TYPE_NAME,
            body: q
        }).then(function (value) {
            res.send({ id: value._id });
        }, function (err) {
            Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured creating a dopcument in es', err);
        });
    }, function (err) {
        if (err.status == 404) {
            elasticsearch_1.elasticsearch.create({
                index: index,
                type: exports.TYPE_NAME,
                body: q
            }).then(function (value) {
                res.send({ id: value._id });
            }, function (err) {
                Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured creating a dopcument in es', err);
            });
        }
        else
            Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
exports.postQuestion = postQuestion;
function putQuestion(req, res) {
    var index = Faculties.requestFaculty(req);
    if (!index)
        Utils.sendError(res, 400, 'bad subdomain', 'subdomain', 'Subdomain does not match faculty');
    var q = Questions.qToDoc(req.body);
    elasticsearch_1.elasticsearch.search({
        index: index,
        type: exports.TYPE_NAME,
        body: {
            "query": {
                "match": {
                    "name": {
                        "query": q.name,
                        "operator": "and"
                    }
                }
            }
        }
    }).then(function (value) {
        if (value.hits.total > 0) {
            for (var _i = 0, _a = value.hits.hits; _i < _a.length; _i++) {
                var hit = _a[_i];
                if (q.name == hit._source.name && req.params.id != hit._id) {
                    Utils.sendError(res, 409, 'conflict', 'name', 'a question with the same name already exists', Questions.hitToQ(hit));
                    return;
                }
            }
        }
        elasticsearch_1.elasticsearch.update({
            index: index,
            type: exports.TYPE_NAME,
            id: req.params.id,
            body: { doc: q }
        }).then(function (value) {
            res.send({ id: value._id });
        }, function (err) {
            Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured creating a dopcument in es', err);
        });
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
function deleteQuestion(req, res) {
    var index = Faculties.requestFaculty(req);
    if (!index)
        Utils.sendError(res, 400, 'bad subdomain', 'subdomain', 'Subdomain does not match faculty');
    elasticsearch_1.elasticsearch.delete({
        index: index,
        type: exports.TYPE_NAME,
        id: req.params.id
    }).then(function (value) {
        res.sendStatus(200);
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
//# sourceMappingURL=question_routes.js.map