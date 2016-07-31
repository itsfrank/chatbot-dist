"use strict";
var mongoose_1 = require('mongoose');
exports.venue_schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    aliases: [{
            type: String,
            required: true,
        }],
    address: {
        type: String,
        required: true,
    }
});
exports.Venue = mongoose_1.model('Venue', exports.venue_schema);
//# sourceMappingURL=venue.js.map