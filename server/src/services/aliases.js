"use strict";
var elasticsearch_1 = require('./elasticsearch');
function getByAlias(alias, callback) {
    return elasticsearch_1.elasticsearch.search({
        index: 'aliased',
        body: {
            query: {
                "match": {
                    aliases: alias
                }
            }
        }
    }).then(function (value) {
        if (value.hits.total == 0)
            callback(null, null);
        else
            callback(null, formatAliased(value.hits.hits[0]));
    }, function (err) {
        callback(err, null);
    });
}
exports.getByAlias = getByAlias;
function getByAliasArray(aliases, callback) {
    return elasticsearch_1.elasticsearch.search({
        index: 'aliased',
        body: {
            query: {
                "match": {
                    aliases: flattenArray(aliases)
                }
            }
        }
    }).then(function (value) {
        if (value.hits.total == 0)
            callback(null, null);
        else {
            var docs = [];
            for (var _i = 0, _a = value.hits.hits; _i < _a.length; _i++) {
                var hit = _a[_i];
                docs.push(formatAliased(hit));
            }
            callback(null, docs);
        }
    }, function (err) {
        callback(err, null);
    });
}
exports.getByAliasArray = getByAliasArray;
function getByID(type, id, callback) {
    return elasticsearch_1.elasticsearch.get({
        index: 'aliased',
        type: type,
        id: id
    }).then(function (value) {
        if (!value.found)
            callback(null, null);
        else
            callback(null, formatAliased(value));
    }, function (err) {
        callback(err, null);
    });
}
exports.getByID = getByID;
function formatAliased(hit) {
    var name = hit._source.name;
    var aliases = hit._source.aliases;
    delete hit._source.name;
    delete hit._source.aliases;
    return {
        _index: hit._index,
        _type: hit._type,
        _id: hit._id,
        name: name,
        aliases: aliases,
        data: hit._source
    };
}
exports.formatAliased = formatAliased;
function flattenArray(arr) {
    var rtn = '';
    var first = true;
    for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
        var str = arr_1[_i];
        if (!first)
            rtn += ' ';
        first = false;
        rtn += str;
    }
    return rtn;
}
exports.flattenArray = flattenArray;
//# sourceMappingURL=aliases.js.map