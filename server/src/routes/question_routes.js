"use strict";
var words_1 = require('../services/words');
var AliasedModels = require('../models/index');
var infoStuff = require('../models/info');
var QuestionRoutes = (function () {
    function QuestionRoutes() {
    }
    QuestionRoutes.bind = function (router) {
        router.get('/question', respondToQuestion);
    };
    return QuestionRoutes;
}());
exports.QuestionRoutes = QuestionRoutes;
function respondToQuestion(req, res) {
    var question = req.query['q'].toLowerCase();
    var alias = words_1.WordsService.findAliasInString(question);
    if (!alias) {
        res.json({
            message: "Sorry, I did not understand your question. Try rewording it or ask me about something else.",
            err: false
        });
    }
    else {
        AliasedModels.getOneDocumentByAlias([alias], function (err, model, document) {
            if (err) {
                res.json({
                    message: 'There was an error processing your question.',
                    err: true
                });
            }
            else {
                console.log(document);
                document.populate('venue', function (err, pop_document) {
                    document = pop_document;
                    var info = infoStuff.findInfo(model.modelName, question);
                    if (!info) {
                        res.json({
                            message: "Sorry, I could not figure out what you wanted to know about " + document.name + " try rephrasing your question.",
                            err: false
                        });
                    }
                    else {
                        console.log(info);
                        var inf_res = infoStuff.infoResponse(info, document);
                        res.json(inf_res);
                    }
                });
            }
        });
    }
}
//# sourceMappingURL=question_routes.js.map