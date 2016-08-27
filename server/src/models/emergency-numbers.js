"use strict";
var mongoose_1 = require('mongoose');
exports.emergency_numbers_schema = new mongoose_1.Schema({
    faculty: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    }
});
exports.EmergencyNumbers = mongoose_1.model('EmergencyNumbers', exports.emergency_numbers_schema);
//# sourceMappingURL=emergency-numbers.js.map