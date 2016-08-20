"use strict";
var metrics_1 = require('../models/metrics');
var Utils = require('./utils');
var Faculties = require('./faculties');
function updateMetrics(faculty, answered, sms, question) {
    var update = { $inc: { total_questions: 1 } };
    if (!answered) {
        update.$inc.unanswered_questions = 1;
        if (question) {
            question = normalizeQuestion(question);
            metrics_1.UnansweredQuestion.findOne({ faculty: faculty, question: question }, function (err, q) {
                if (q) {
                    q.count++;
                    q.save();
                }
                else {
                    new metrics_1.UnansweredQuestion({
                        faculty: faculty,
                        question: question,
                        count: 1
                    }).save();
                }
            });
        }
    }
    if (sms)
        update.$inc.sms_questions = 1;
    metrics_1.Metrics.findOneAndUpdate({ faculty: faculty }, update, function () {
    });
}
exports.updateMetrics = updateMetrics;
function initMetrics() {
    Utils.forAsync(Faculties.facultyList.length, function (index, done) {
        var faculty = Faculties.facultyList[index];
        metrics_1.Metrics.findOne({ faculty: faculty }, function (err, res) {
            if (err) {
                console.log("Metric init error");
                console.log(err);
            }
            else {
                if (!res) {
                    console.log('initializing ' + faculty + ' metrics');
                    new metrics_1.Metrics({ faculty: faculty }).save();
                }
            }
        });
    }, function () { });
}
exports.initMetrics = initMetrics;
function normalizeQuestion(question) {
    question = question.toLowerCase();
    question = question.charAt(0).toUpperCase() + question.substring(1);
    if (question.charAt(question.length) != '?') {
        question = question + '?';
    }
    return question;
}
//# sourceMappingURL=metrics.js.map