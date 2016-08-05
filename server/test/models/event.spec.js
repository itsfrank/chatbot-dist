"use strict";
var prep_spec_ts_1 = require('../prep.spec.ts');
var chai_1 = require('chai');
describe('Event routes', function () {
    var first_sample_event = {
        name: 'Boat Races',
        aliases: ['br', 'boatraces'],
        venue: null,
        start_time: 10,
        end_time: 20
    };
    var second_sample_event = {
        name: 'Different Event',
        aliases: ['de', 'br'],
        venue: null,
        start_time: 10,
        end_time: 20
    };
    var third_sample_event = {
        name: 'Power Hour',
        aliases: ['ph', 'powerhour'],
        venue: null,
        start_time: 10,
        end_time: 20
    };
    var delete_sample_event = {
        name: 'Delete Me',
        aliases: ['del', 'oii'],
        venue: null,
        start_time: 10,
        end_time: 20
    };
    describe('POST', function () {
        it('should create a new event in the database', function (done) {
            prep_spec_ts_1.Server.post('/event', first_sample_event).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.have.property('_id');
                first_sample_event._id = res.data._id;
            }).finally(done);
        });
        it('should not create an event with non-unique aliases', function (done) {
            prep_spec_ts_1.Server.post('/event', second_sample_event).then(function (res) {
                chai_1.expect(res.code).to.equal(409);
                chai_1.expect(res.data).to.have.property('code').that.equals('alias');
                chai_1.expect(res.data).to.have.property('subject').that.equals('Event');
            }).finally(done);
        });
        it('should not create an event when an id is provided', function (done) {
            prep_spec_ts_1.Server.post('/event', first_sample_event).then(function (res) {
                chai_1.expect(res.code).to.equal(400);
                chai_1.expect(res.data).to.have.property('code').that.equals('body');
                chai_1.expect(res.data).to.have.property('subject').that.equals('_id');
            }).finally(done);
        });
    });
    describe('GET', function () {
        it('should retrieve the whole collection on bare request', function (done) {
            prep_spec_ts_1.Server.get('/event').then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.be.an('array').of.length(1);
                chai_1.expect(res.data[0]).to.have.property('_id').deep.equal(first_sample_event._id);
                chai_1.expect(res.data[0]).to.have.property('name').that.equals(first_sample_event.name);
            }).finally(done);
        });
        it('should retrieve one event on request with id', function (done) {
            prep_spec_ts_1.Server.get('/event/' + first_sample_event._id).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.have.property('_id').deep.equal(first_sample_event._id);
                chai_1.expect(res.data).to.have.property('name').that.equals(first_sample_event.name);
            }).finally(done);
        });
        it('should return a 404 when an inexistant id is used', function (done) {
            prep_spec_ts_1.Server.get('/event/notanid').then(function (res) {
                chai_1.expect(res.code).to.equal(404);
                chai_1.expect(res.data).to.have.property('code').that.equals('not found');
                chai_1.expect(res.data).to.have.property('subject').that.equals('_id');
            }).finally(done);
        });
        it('should create an event and then read it', function (done) {
            prep_spec_ts_1.Server.post('/event', third_sample_event).then(function (res_post) {
                chai_1.expect(res_post.code).to.equal(200);
                chai_1.expect(res_post.data).to.have.property('_id');
                prep_spec_ts_1.Server.get('/event/' + res_post.data._id).then(function (res_get) {
                    chai_1.expect(res_get.code).to.equal(200);
                    chai_1.expect(res_get.data._id).to.deep.equal(res_post.data._id);
                }).finally(done);
            });
        });
    });
    describe('UPDATE', function () {
        it('should change the whole alias array', function (done) {
            prep_spec_ts_1.Server.patch('/event/' + first_sample_event._id, { aliases: ['hello'] }).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                prep_spec_ts_1.Server.get('/event/' + first_sample_event._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(200);
                    chai_1.expect(res.data.aliases.length).to.equal(2);
                    chai_1.expect(res.data.aliases).to.contain('hello');
                }).finally(done);
            });
        });
        it('should change the name and alias array when only name provided', function (done) {
            prep_spec_ts_1.Server.patch('/event/' + first_sample_event._id, { name: 'Boatraces' }).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                prep_spec_ts_1.Server.get('/event/' + first_sample_event._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(200);
                    chai_1.expect(res.data.aliases.length).to.equal(2);
                    chai_1.expect(res.data.aliases).to.contain('hello');
                    chai_1.expect(res.data.aliases).to.contain('boatraces');
                }).finally(done);
            });
        });
        it('should return 400 when alias conflict', function (done) {
            prep_spec_ts_1.Server.patch('/event/' + first_sample_event._id, { aliases: ['ph'] }).then(function (res) {
                chai_1.expect(res.code).to.equal(400);
            }).finally(done);
        });
    });
    describe('DELETE', function () {
        before(function (done) {
            prep_spec_ts_1.Server.post('/event', delete_sample_event).then(function (res_post) {
                chai_1.expect(res_post.code).to.equal(200);
                chai_1.expect(res_post.data).to.have.property('_id');
                delete_sample_event._id = res_post.data._id;
            }).finally(done);
        });
        it('should delete the event', function (done) {
            prep_spec_ts_1.Server.delete('/event/' + delete_sample_event._id).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data.name).to.equal(delete_sample_event.name);
                prep_spec_ts_1.Server.get('/event/' + delete_sample_event._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(404);
                }).finally(done);
            });
        });
    });
});
//# sourceMappingURL=event.spec.js.map