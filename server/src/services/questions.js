"use strict";
function hitToQ(hit) {
    var q_arr = [];
    for (var _i = 0, _a = hit._source.questions; _i < _a.length; _i++) {
        var q = _a[_i];
        q_arr.push(q.string);
    }
    return {
        _index: hit._index,
        _type: hit._type,
        _id: hit._id,
        name: hit._source.name,
        keywords: hit._source.keywords,
        questions: q_arr,
        response: hit._source.response
    };
}
exports.hitToQ = hitToQ;
function qToDoc(q) {
    var doc = {
        name: q.name,
        keywords: q.keywords,
        questions: [],
        response: q.response
    };
    for (var _i = 0, _a = q.questions; _i < _a.length; _i++) {
        var question = _a[_i];
        doc.questions.push({
            string: question
        });
    }
    return doc;
}
exports.qToDoc = qToDoc;
// export function flattenQuestion(q:IQuestion):any {
//     var question = {
//         name: q.name,
//         response: q.response
//     }
//     for (var i = 0; i < q.questions.length, )
// } 
//# sourceMappingURL=questions.js.map