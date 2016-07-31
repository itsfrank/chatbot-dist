"use strict";
var time_service_1 = require('../services/time_service');
var words_1 = require('../services/words');
exports.TEMP_infos = {
    "Event": [
        {
            name: 'Location',
            callings: [
                { string: 'where' }
            ],
            message: '{{name}} will be held at {{venue.name}} which is located at {{venue.address}}.',
            additional_info: {
                maps: {
                    address: 'venue.address'
                }
            }
        },
        {
            name: 'Time',
            callings: [
                { string: 'when' },
                { string: 'time' }
            ],
            message: '{{name}} will begin on {{start_time>formatTime}} and go on until {{start_time>formatTime}}.',
            additional_info: {
                maps: {
                    value: 'venue.address'
                }
            }
        }
    ],
    "Venue": [
        {
            name: 'Location',
            callings: [
                { string: 'where' }
            ],
            message: '{{name}} is located at {{address}}.',
            additional_info: {
                maps: {
                    address: 'address'
                }
            }
        }
    ]
};
exports.TEMP_info_formats = {
    "formatTime": function (str) {
        return time_service_1.TimeService.formatEventsDate(str);
    }
};
function infoResponse(info, document) {
    var message = info.message;
    var instructions = extractDataInstructions(info.message);
    console.log(instructions);
    for (var _i = 0, instructions_1 = instructions; _i < instructions_1.length; _i++) {
        var instr = instructions_1[_i];
        var value = instr.replace('{{', '').replace('}}', '');
        var format_pipes = instr.split('>');
        if (format_pipes.length < 2)
            format_pipes = [];
        else {
            value = format_pipes[0].replace('{{', '').replace('}}', '');
            format_pipes = format_pipes.slice(1);
        }
        var value_path = value.split('.');
        if (value_path.length == 1) {
            value = document[value];
        }
        else {
            value = document[value_path[0]];
            for (var i = 1; i < value_path.length; i++) {
                value = value[value_path[i]];
            }
        }
        if (format_pipes.length > 0) {
            for (var i = 0; i < format_pipes.length; i++) {
                format_pipes[i] = format_pipes[i].replace('{{', '').replace('}}', '');
                value = exports.TEMP_info_formats[format_pipes[i]](value);
            }
        }
        message = message.replace(instr, value);
    }
    return {
        message: message
    };
}
exports.infoResponse = infoResponse;
function extractDataInstructions(message) {
    var re = /{{(.*?)}}/g;
    var str = message;
    var m;
    var instructions = [];
    while ((m = re.exec(str)) !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        instructions.push(m[0]);
    }
    return instructions;
}
exports.extractDataInstructions = extractDataInstructions;
function findInfo(modelname, question) {
    var infos = exports.TEMP_infos[modelname];
    for (var i = 0; i < infos.length; i++) {
        var callings = infos[i].callings;
        for (var j = 0; j < callings.length; j++) {
            if (words_1.WordsService.matchFullWord(question, callings[j].string))
                return infos[i];
        }
    }
    return null;
}
exports.findInfo = findInfo;
//# sourceMappingURL=info.js.map