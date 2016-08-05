"use strict";
//// CRAPPY MOCHA BUG FIX ////
var mongoose = require('mongoose');
mongoose['models'] = {};
mongoose['modelSchemas'] = {};
//// END BUG FIX ////
var express_1 = require('express');
var chai_1 = require('chai');
var MockServer_ts_1 = require('./mockexpress/MockServer.ts');
var routes_1 = require('../src/routes');
var elasticsearch_ts_1 = require('../src/services/elasticsearch.ts');
before(function (done) {
    this.timeout(10000);
    var router = express_1.Router();
    routes_1.RouteBinder.bind(router);
    exports.Server = new MockServer_ts_1.MockServer(router);
    if (mongoose.connection.readyState == 1) {
        console.log('Connections allready created, clearing data...');
        mongoose.connection.db.dropDatabase(function (err, result) {
            done();
        });
    }
    else {
        console.log('Connections closed connecting...');
        var host = 'localhost';
        var es_port = 9999;
        var mongo_port = 27017;
        var database = 'ccdb-test';
        var loglevel = 'error';
        var es_done = false;
        var mongo_done = false;
        elasticsearch_ts_1.connect(host, es_port, loglevel);
        mongoose.connect('mongodb://' + host + ':' + mongo_port + '/' + database);
        elasticsearch_ts_1.pingWait(function () {
            console.log('elasticsearch connected, clearing data...');
            elasticsearch_ts_1.elasticsearch.indices.delete({ index: '_all' }, function (err) {
                es_done = true;
                finished();
            });
        });
        mongoose.connection.on('open', function () {
            console.log('mongodb connected, clearing data...');
            mongoose.connection.db.dropDatabase(function (err, result) {
                mongo_done = true;
                finished();
            });
        });
        function finished() {
            if (es_done && mongo_done) {
                console.log('databases connected and data cleared, beggining tests');
                done();
            }
        }
    }
});
describe('Test route', function () {
    it('should send a json message', function (done) {
        exports.Server.get('/test').then(function (res) {
            chai_1.expect(res.code).to.equal(200);
            chai_1.expect(res.data).to.have.property('msg').that.equals('success');
        }).finally(done);
    });
});
//# sourceMappingURL=prep.spec.js.map