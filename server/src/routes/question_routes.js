"use strict";
var elasticsearch_1 = require('../services/elasticsearch');
var Utils = require('../services/utils');
var Questions = require('../services/questions');
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
function getQuestionCollection(req, res) {
    elasticsearch_1.elasticsearch.search({
        index: 'questions',
        type: 'multi',
        body: {
            query: {
                match_all: {}
            }
        }
    }).then(function (value) {
        var questions = [];
        for (var _i = 0, _a = value.hits.hits; _i < _a.length; _i++) {
            var hit = _a[_i];
            questions.push(Questions.formatQuestion(hit));
        }
        res.send(questions);
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
function getQuestion(req, res) {
    elasticsearch_1.elasticsearch.get({
        index: 'questions',
        type: 'multi',
        id: req.params.id
    }).then(function (value) {
        if (!value.found) {
            Utils.sendError(res, 404, 'not found', 'question', 'no question with id exists', value);
        }
        else {
            res.send(Questions.formatQuestion(value));
        }
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
function postQuestion(req, res) {
    var q = req.body;
    elasticsearch_1.elasticsearch.search({
        index: 'questions',
        type: "multi",
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
                if (q.name == hit._source.name) {
                    Utils.sendError(res, 409, 'conflict', 'name', 'a question with the same name already exists', Questions.formatQuestion(hit));
                    return;
                }
            }
        }
        elasticsearch_1.elasticsearch.create({
            index: 'questions',
            type: 'multi',
            body: q
        }).then(function (value) {
            res.send({ id: value._id });
        }, function (err) {
            Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured creating a dopcument in es', err);
        });
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
function putQuestion(req, res) {
    var q = req.body;
    for (var key in q) {
        if (key.indexOf('_') == 0) {
            delete q[key];
        }
    }
    elasticsearch_1.elasticsearch.search({
        index: 'questions',
        type: "multi",
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
                    Utils.sendError(res, 409, 'conflict', 'name', 'a question with the same name already exists', Questions.formatQuestion(hit));
                    return;
                }
            }
        }
        elasticsearch_1.elasticsearch.update({
            index: 'questions',
            type: 'multi',
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
    elasticsearch_1.elasticsearch.delete({
        index: 'questions',
        type: 'multi',
        id: req.params.id
    }).then(function (value) {
        res.sendStatus(200);
    }, function (err) {
        Utils.sendError(res, 500, 'elasticsearch', 'unknown', 'an error occured searching es', err);
    });
}
//# sourceMappingURL=question_routes.js.map