"use strict";
var prep_spec_ts_1 = require('../prep.spec.ts');
var chai_1 = require('chai');
describe('Venue routes', function () {
    var cafe_campus = {
        name: 'Cafe Camus',
        aliases: ['cafe'],
        address: '1000 prince arthur'
    };
    var cafe_similar = {
        name: 'Le Cafe',
        aliases: ['cafe'],
        address: '10 mctavish'
    };
    var telus = {
        name: 'Theatre Telus',
        aliases: ['telus'],
        address: '1000 saint denis'
    };
    var to_delete = {
        name: 'Del this',
        aliases: ['to delete'],
        address: 'doesn\'t matter'
    };
    describe('POST', function () {
        it('should create a new venue in the database', function (done) {
            prep_spec_ts_1.Server.post('/venue', cafe_campus).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.have.property('_id');
                cafe_campus._id = res.data._id;
            }).finally(done);
        });
        it('should not create an venue with non-unique aliases', function (done) {
            prep_spec_ts_1.Server.post('/venue', cafe_similar).then(function (res) {
                chai_1.expect(res.code).to.equal(409);
                chai_1.expect(res.data).to.have.property('code').that.equals('alias');
                chai_1.expect(res.data).to.have.property('subject').that.equals('Venue');
            }).finally(done);
        });
        it('should not create an venue when an id is provided', function (done) {
            prep_spec_ts_1.Server.post('/venue', cafe_campus).then(function (res) {
                chai_1.expect(res.code).to.equal(400);
                chai_1.expect(res.data).to.have.property('code').that.equals('body');
                chai_1.expect(res.data).to.have.property('subject').that.equals('_id');
            }).finally(done);
        });
    });
    describe('GET', function () {
        it('should retrieve the whole collection on bare request', function (done) {
            prep_spec_ts_1.Server.get('/venue').then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.be.an('array').of.length(1);
                chai_1.expect(res.data[0]).to.have.property('_id').deep.equal(cafe_campus._id);
                chai_1.expect(res.data[0]).to.have.property('name').that.equals(cafe_campus.name);
            }).finally(done);
        });
        it('should retrieve one venue on request with id', function (done) {
            prep_spec_ts_1.Server.get('/venue/' + cafe_campus._id).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data).to.have.property('_id').deep.equal(cafe_campus._id);
                chai_1.expect(res.data).to.have.property('name').that.equals(cafe_campus.name);
            }).finally(done);
        });
        it('should return a 404 when an inexistant id is used', function (done) {
            prep_spec_ts_1.Server.get('/venue/notanid').then(function (res) {
                chai_1.expect(res.code).to.equal(404);
                chai_1.expect(res.data).to.have.property('code').that.equals('not found');
                chai_1.expect(res.data).to.have.property('subject').that.equals('_id');
            }).finally(done);
        });
        it('should create an venue and then read it', function (done) {
            prep_spec_ts_1.Server.post('/venue', telus).then(function (res_post) {
                chai_1.expect(res_post.code).to.equal(200);
                chai_1.expect(res_post.data).to.have.property('_id');
                telus._id = res_post.data._id;
                prep_spec_ts_1.Server.get('/venue/' + res_post.data._id).then(function (res_get) {
                    chai_1.expect(res_get.code).to.equal(200);
                    chai_1.expect(res_get.data._id).to.deep.equal(res_post.data._id);
                }).finally(done);
            });
        });
    });
    describe('UPDATE', function () {
        it('should change the whole alias array', function (done) {
            prep_spec_ts_1.Server.patch('/venue/' + cafe_campus._id, { aliases: ['cafe', 'cc', 'cafecampus'] }).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                prep_spec_ts_1.Server.get('/venue/' + cafe_campus._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(200);
                    chai_1.expect(res.data.aliases.length).to.equal(4);
                    chai_1.expect(res.data.aliases).to.contain('cafecampus');
                }).finally(done);
            });
        });
        it('should change the name and alias array when only name provided', function (done) {
            prep_spec_ts_1.Server.patch('/venue/' + telus._id, { name: 'Telus Theatre' }).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                prep_spec_ts_1.Server.get('/venue/' + telus._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(200);
                    chai_1.expect(res.data.aliases.length).to.equal(2);
                    chai_1.expect(res.data.aliases).to.contain('telus');
                    chai_1.expect(res.data.aliases).to.contain('telus theatre');
                }).finally(done);
            });
        });
        it('should return 400 when alias conflict', function (done) {
            prep_spec_ts_1.Server.patch('/venue/' + cafe_campus._id, { aliases: ['telus'] }).then(function (res) {
                chai_1.expect(res.code).to.equal(400);
            }).finally(done);
        });
    });
    describe('DELETE', function () {
        before(function (done) {
            prep_spec_ts_1.Server.post('/venue', to_delete).then(function (res_post) {
                chai_1.expect(res_post.code).to.equal(200);
                chai_1.expect(res_post.data).to.have.property('_id');
                to_delete._id = res_post.data._id;
            }).finally(done);
        });
        it('should delete the venue', function (done) {
            prep_spec_ts_1.Server.delete('/venue/' + to_delete._id).then(function (res) {
                chai_1.expect(res.code).to.equal(200);
                chai_1.expect(res.data.name).to.equal(to_delete.name);
                prep_spec_ts_1.Server.get('/venue/' + to_delete._id).then(function (res) {
                    chai_1.expect(res.code).to.equal(404);
                }).finally(done);
            });
        });
    });
});
//# sourceMappingURL=venue.spec.js.map