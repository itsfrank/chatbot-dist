"use strict";
var prep_spec_ts_1 = require('../prep.spec.ts');
var chai_1 = require('chai');
var eventDefinition = {
    name: "Event",
    fields: [
        {
            name: 'venue',
            type: 'reference',
            reference: 'venue'
        },
        {
            name: 'start_time',
            type: 'date'
        },
        {
            name: 'end_time',
            type: 'date'
        }
    ]
};
var eventCopyDefinition = {
    name: "Event",
    fields: []
};
describe('Definition routes', function () {
    describe('POST', function () {
        it('should create a new definition', function (done) {
            prep_spec_ts_1.Server.post('/definition', eventDefinition).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.have.property('_id');
                eventDefinition._id = res.data._id;
                chai_1.expect(res.data).to.have.property('fields');
                chai_1.expect(res.data).to.have.property('name').that.equals('Event');
                chai_1.expect(res.data).to.have.property('type').that.equals('event');
            }).finally(done);
        });
        it('should not create a new definition when name exists', function (done) {
            prep_spec_ts_1.Server.post('/definition', eventCopyDefinition).then(function (res) {
                chai_1.expect(res.code).to.equal(409);
            }).finally(done);
        });
    });
    describe('GET', function () {
        it('should get definition collection', function (done) {
            prep_spec_ts_1.Server.get('/definition').then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data[0]).to.have.property('fields');
                chai_1.expect(res.data[0]).to.have.property('name').that.equals('Event');
                chai_1.expect(res.data[0]).to.have.property('type').that.equals('event');
            }).finally(done);
        });
        it('should get a definition by id', function (done) {
            prep_spec_ts_1.Server.get('/definition/' + eventDefinition._id).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.have.property('fields');
                chai_1.expect(res.data).to.have.property('name').that.equals('Event');
                chai_1.expect(res.data).to.have.property('type').that.equals('event');
            }).finally(done);
        });
    });
    describe('DELETE', function () {
        it('should delete a definition', function (done) {
            prep_spec_ts_1.Server.delete('/definition/' + eventDefinition._id).then(function (res) {
                prep_spec_ts_1.Server.get('/definition/' + eventDefinition._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(404);
                }).finally(done);
            });
        });
    });
});
//# sourceMappingURL=definition.spec.js.map