// "Question name":
//     keywords: ["word", "something", "thisiskey"]
//     questions:
//         - "What is a question?"
//         - "Am i also a question?"
//         - "Who are you?"
//     response: "Holy shit i'm a response!"
"use strict";
var fs = require('fs');
var Yamljs = require('yamljs');
var Utils = require('./utils');
var QRoutes = require('../routes/question_routes');
var Faculties = require('./faculties');
var elasticsearch_1 = require('./elasticsearch');
function reloadYaml(faculty_name, callback) {
    var file = fs.readFileSync('./yamls/' + Faculties.FacultyMap.subdomains[faculty_name] + '.yml').toString();
    var yaml = Yamljs.parse(file);
    var questions = getQuestions(yaml);
    var errors = [];
    var successes = 0;
    var res = {
        status: function () { return this; },
        json: function (o) { errors.push(o); },
        send: function () { successes++; }
    };
    Utils.forAsync(questions.length, function (index, done) {
        var q = questions[index];
        var req = {
            body: q,
            subdomains: [faculty_name]
        };
        console.log('posting ' + q.name);
        QRoutes.postQuestion(req, res);
    }, function (aborted) {
        callback({ successful: successes, errors: errors });
    });
}
exports.reloadYaml = reloadYaml;
function resetYaml(faculty_name, callback) {
    console.log('reset started');
    var fac_code = Faculties.FacultyMap.subdomains[faculty_name];
    var file = fs.readFileSync('./yamls/' + fac_code + '.yml').toString();
    var yaml = Yamljs.parse(file);
    var questions = getQuestions(yaml);
    var errors = [];
    var successes = 0;
    var res = {
        status: function () { return this; },
        json: function (o) { errors.push(o); },
        send: function () { successes++; }
    };
    elasticsearch_1.resetIndex(fac_code, function () {
        console.log('reset');
        Utils.forAsync(questions.length, function (index, done) {
            var q = questions[index];
            var req = {
                body: q,
                subdomains: [faculty_name]
            };
            console.log('posting ' + q.name);
            QRoutes.postQuestion(req, res);
        }, function (aborted) {
            callback({ successful: successes, errors: errors });
        });
    });
}
exports.resetYaml = resetYaml;
function getQuestions(yaml) {
    var result = [];
    for (var name in yaml) {
        var o = yaml[name];
        o.keywords = fixKeywords(o.keywords);
        var q = {
            name: name,
            keywords: o.keywords,
            questions: o.questions,
            response: o.response
        };
        result.push(q);
    }
    return result;
}
exports.getQuestions = getQuestions;
function fixKeywords(keywords) {
    var new_kws = [];
    for (var _i = 0, keywords_1 = keywords; _i < keywords_1.length; _i++) {
        var kw = keywords_1[_i];
        var split = kw.split(' ');
        for (var _a = 0, split_1 = split; _a < split_1.length; _a++) {
            var sp = split_1[_a];
            if (!isInKws(sp, new_kws)) {
                new_kws.push(sp);
            }
        }
    }
    return new_kws;
}
function isInKws(kw, kws) {
    for (var _i = 0, kws_1 = kws; _i < kws_1.length; _i++) {
        var word = kws_1[_i];
        if (kw == word)
            return true;
    }
    return false;
}
//# sourceMappingURL=yaml.js.map