"use strict";
var venue_1 = require('../models/venue');
var Models = require('../models');
var Utils = require('../services/utils');
var VenueRoutes = (function () {
    function VenueRoutes() {
    }
    VenueRoutes.bind = function (router) {
        router.get('/venue', getVenueCollection);
        router.get('/venue/:venueId', getVenue);
        router.post('/venue', postVenue);
        router.patch('/venue/:venueId', updateVenue);
        router.delete('/venue/:venueId', deleteVenue);
    };
    return VenueRoutes;
}());
exports.VenueRoutes = VenueRoutes;
function getVenueCollection(req, res) {
    venue_1.Venue.find({}, function (err, venues) {
        res.send(venues);
    });
}
function getVenue(req, res) {
    if (!req.params.venueId)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    else {
        venue_1.Venue.findOne({ _id: req.params.venueId }, function (err, venue) {
            if (err)
                Utils.sendError(res, 404, 'not found', '_id', "No venue with id: " + req.params.venueId + " in database.", err);
            else if (!venue)
                Utils.sendError(res, 404, 'not found', '', venue_1.Venue.modelName, "No venue with id: " + req.params.venueId + " in database.");
            else
                res.send(venue);
        });
    }
}
function postVenue(req, res) {
    Models.saveAliasedDocument(req.body, venue_1.Venue, res, function (success, id) {
        if (success)
            res.status(200).json({ _id: id });
    });
}
function updateVenue(req, res) {
    if (!req.params.venueId)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    Models.updateAliasedDocument(req.params.venueId, req.body, venue_1.Venue, res, function (success) {
        if (success)
            res.sendStatus(200);
    });
}
function deleteVenue(req, res) {
    if (!req.params.venueId)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    venue_1.Venue.findByIdAndRemove(req.params.venueId, function (err, venue) {
        if (err)
            Utils.sendError(res, 404, 'not found', '_id', "No venue with id: " + req.params.venueId + " in database.", err);
        else if (!venue)
            Utils.sendError(res, 404, 'not found', '', venue_1.Venue.modelName, "No venue with id: " + req.params.venueId + " in database.");
        else
            res.send(venue);
    });
}
//# sourceMappingURL=venue_routes.js.map