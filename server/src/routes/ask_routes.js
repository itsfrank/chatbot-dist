"use strict";
var elasticsearch_1 = require('../services/elasticsearch');
var question_routes_1 = require('./question_routes');
var Faculties = require('../services/faculties');
var Utils = require('../services/utils');
var Metrics = require('../services/metrics');
var AskRoutes = (function () {
    function AskRoutes() {
    }
    AskRoutes.bind = function (router) {
        router.get('/ask', askQuestion);
    };
    return AskRoutes;
}());
exports.AskRoutes = AskRoutes;
var scoreThreshold = 0.15;
function askQuestion(req, res) {
    var index = Faculties.requestFaculty(req);
    if (!index)
        Utils.sendError(res, 400, 'bad subdomain', 'subdomain', 'Subdomain does not match faculty');
    console.log(req.subdomains);
    questionResponse(index, req.query.q, function (response, found, emergency) {
        if (emergency) {
        }
        else {
            Metrics.updateMetrics(index, found, false, req.query.q);
            res.send(response);
        }
    });
}
function questionResponse(index, question, callback) {
    if (!question || question == '')
        callback('You must ask a question!', false, false);
    else if (question.toLowerCase().indexOf('emergency') == 0) {
        callback(null, false, true);
    }
    else {
        elasticsearch_1.elasticsearch.search({
            index: index,
            type: question_routes_1.TYPE_NAME,
            body: {
                "query": {
                    "bool": {
                        "filter": {
                            "match": {
                                "keywords": {
                                    "query": question,
                                    "fuzziness": "1"
                                }
                            }
                        },
                        "must": [
                            {
                                "nested": {
                                    "path": "questions",
                                    "score_mode": "max",
                                    "query": {
                                        "match": {
                                            "questions.string": question
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        }).then(function (value) {
            if (value.hits.total == 0 || value.hits.max_score < scoreThreshold) {
                callback('I\'m sorry, I don\'t know how to answer this question unfortunately', false, false);
            }
            else {
                callback(value.hits.hits[0]._source.response, true, false);
            }
        }, function (err) {
            console.log(err);
            callback('I\'m sorry, there was an error in my server, try asking again or contact an admin', false, false);
        });
    }
}
exports.questionResponse = questionResponse;
// function respondToQuestion(req:Request, res:Response) {
//     var question = req.query['q'].toLowerCase();
//     var alias = WordsService.findAliasInString(question);
//     if (!alias) {
//         res.json({
//             message: "Sorry, I did not understand your question. Try rewording it or ask me about something else.",
//             err: false
//         })
//     } else {
//         AliasedModels.getOneDocumentByAlias([alias], function(err, model, document) {
//             if (err) {
//                 res.json({
//                     message: 'There was an error processing your question.',
//                     err: true
//                 })
//             } else {
//                 console.log(document);
//                 document.populate('venue', function(err, pop_document){
//                     document = <any>pop_document;
//                     var info = infoStuff.findInfo(model.modelName, question);
//                     if (!info) {
//                         res.json({
//                             message: "Sorry, I could not figure out what you wanted to know about " + document.name + " try rephrasing your question.",
//                             err: false
//                         })
//                     } else {
//                         console.log(info);
//                         var inf_res = infoStuff.infoResponse(info, document);
//                         res.json(inf_res);
//                     }
//                 })
//             }
//         });
//     }
// } 
//# sourceMappingURL=ask_routes.js.map