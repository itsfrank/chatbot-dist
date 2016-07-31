"use strict";
var mongoose_1 = require('mongoose');
exports.event_schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    aliases: [{
            type: String,
            required: true
        }],
    venue: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Venue'
    },
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true,
    }
});
exports.Event = mongoose_1.model('Event', exports.event_schema);
//# sourceMappingURL=event.js.map