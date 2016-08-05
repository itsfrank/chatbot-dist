"use strict";
var definition_1 = require('../models/definition');
var definitions = {};
function reload() {
    definition_1.Definition.find({}, function (err, defs) {
        if (err)
            console.log(err);
        else {
            definitions = {};
            for (var _i = 0, defs_1 = defs; _i < defs_1.length; _i++) {
                var def = defs_1[_i];
                definitions[def.type] = def;
            }
        }
    });
}
exports.reload = reload;
function get(type) {
    return definitions[type];
}
exports.get = get;
//# sourceMappingURL=definitions.js.map