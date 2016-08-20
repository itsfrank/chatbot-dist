"use strict";
var mongoose_1 = require('mongoose');
exports.metrics_schema = new mongoose_1.Schema({
    faculty: {
        type: String,
        required: true,
    },
    total_questions: {
        type: Number,
        default: 0,
    },
    sms_questions: {
        type: Number,
        default: 0,
    },
    unanswered_questions: {
        type: Number,
        default: 0,
    }
});
exports.unanswered_question_schema = new mongoose_1.Schema({
    faculty: {
        type: String,
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 1,
    }
});
exports.Metrics = mongoose_1.model('Metric', exports.metrics_schema);
exports.UnansweredQuestion = mongoose_1.model('UnansweredQuestion', exports.unanswered_question_schema);
//# sourceMappingURL=metrics.js.map