"use strict";
var mongoose_1 = require('mongoose');
exports.definition_schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        lowercase: true,
        required: true
    },
    fields: [new mongoose_1.Schema({
            name: { type: String },
            type: { type: String },
            reference: { type: String }
        })]
}, { strict: false });
exports.Definition = mongoose_1.model('Definition', exports.definition_schema);
//# sourceMappingURL=definition.js.map