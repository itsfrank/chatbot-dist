"use strict";
var Elasticsearch = require('elasticsearch');
var Faculties = require('../services/faculties');
var Utils = require('./utils');
var question_routes_1 = require('../routes/question_routes');
var deleteByQuery = require('elasticsearch-deletebyquery');
function connect(host, port, loglevel) {
    exports.elasticsearch = new Elasticsearch.Client({
        host: host + ':' + port,
        log: loglevel,
        plugins: [deleteByQuery]
    });
}
exports.connect = connect;
function pingWait(done) {
    if (!done)
        done = function () { };
    exports.elasticsearch.ping({}, function (error) {
        if (error) {
            console.log('elasticsearch ping failed, trying again in 2 seconds...');
            setTimeout(pingWait, 1000);
        }
        else {
            console.log('elasticsearch is connected');
            done();
        }
    });
}
exports.pingWait = pingWait;
function resetIndex(indexName, callback) {
    exports.elasticsearch.indices.delete({
        index: indexName
    }).then(function () {
        setIndexMapping(indexName, callback);
    }, function (err) {
        callback(err);
    });
}
exports.resetIndex = resetIndex;
function setIndexMapping(index, callback) {
    exports.elasticsearch.indices.exists({
        index: index
    }).then(function (res) {
        if (!res) {
            exports.elasticsearch.indices.create({
                index: index
            }).then(function (value) {
                exports.elasticsearch.indices.putMapping({
                    index: index,
                    type: question_routes_1.TYPE_NAME,
                    body: {
                        "properties": {
                            "questions": {
                                "type": "nested"
                            }
                        }
                    }
                }).then(function (value) {
                    callback(null);
                }, function (err) {
                    callback(err);
                });
            }, function (err) {
                callback(err);
            });
        }
    }, function (err) {
        callback(err);
    });
}
function prepareIndices(callback) {
    Utils.forAsync(Faculties.facultyList.length, function (index, done) {
        var faculty = Faculties.facultyList[index];
        setIndexMapping(faculty);
    }, function (aborted) { callback(); });
}
exports.prepareIndices = prepareIndices;
//# sourceMappingURL=elasticsearch.js.map