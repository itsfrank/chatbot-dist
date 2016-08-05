"use strict";
function formatQuestion(hit) {
    return {
        _index: hit._index,
        _type: hit._type,
        _id: hit._id,
        name: hit._source.name,
        questions: hit._source.questions,
        response: hit._source.response
    };
}
exports.formatQuestion = formatQuestion;
//# sourceMappingURL=questions.js.map