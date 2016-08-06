"use strict";
var elasticsearch_1 = require('../services/elasticsearch');
var question_routes_1 = require('./question_routes');
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
    var question = req.query.q;
    if (!question || question == '')
        res.send('You must ask a question!');
    else {
        elasticsearch_1.elasticsearch.search({
            index: 'questions',
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
                res.send('I\'m sorry, I don\'t know how to awnser this question unfortunately');
            }
            else {
                res.send(value.hits.hits[0]._source.response);
            }
        }, function (err) {
            console.log(err);
            res.send('I\'m sorry, there was an error in my server, try asking again or contact an admin');
        });
    }
}
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