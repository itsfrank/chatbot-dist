"use strict";
var Elasticsearch = require('elasticsearch');
var Faculties = require('../services/faculties');
var Utils = require('./utils');
var question_routes_1 = require('../routes/question_routes');
function connect(host, port, loglevel) {
    exports.elasticsearch = new Elasticsearch.Client({
        host: host + ':' + port,
        log: loglevel
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
function prepareIndices() {
    Utils.forAsync(Faculties.facultyList.length, function (index, done) {
        var faculty = Faculties.facultyList[index];
        exports.elasticsearch.indices.exists({
            index: faculty
        }).then(function (res) {
            if (!res) {
                exports.elasticsearch.indices.create({
                    index: faculty
                }).then(function (value) {
                    exports.elasticsearch.indices.putMapping({
                        index: faculty,
                        type: question_routes_1.TYPE_NAME,
                        body: {
                            "properties": {
                                "questions": {
                                    "type": "nested"
                                }
                            }
                        }
                    }).then(function (value) {
                        res.send(value);
                    }, function (err) {
                        res.statusCode = 500;
                        res.send(err);
                    });
                }, function (err) {
                    res.statusCode = 500;
                    res.send(err);
                });
            }
        }, function (err) {
            console.log('err');
            console.log(err);
        });
    }, function (aborted) { });
}
exports.prepareIndices = prepareIndices;
//# sourceMappingURL=elasticsearch.js.map