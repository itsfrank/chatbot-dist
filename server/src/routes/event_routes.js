"use strict";
var event_1 = require('../models/event');
var Models = require('../models');
var Utils = require('../services/utils');
var EventRoutes = (function () {
    function EventRoutes() {
    }
    EventRoutes.bind = function (router) {
        router.get('/event', getEventCollection);
        router.get('/event/:eventId', getEvent);
        router.post('/event', postEvent);
        router.patch('/event/:eventId', updateEvent);
        router.delete('/event/:eventId', deleteEvent);
    };
    return EventRoutes;
}());
exports.EventRoutes = EventRoutes;
function getEventCollection(req, res) {
    event_1.Event.find({}).populate('venue').exec(function (err, events) {
        if (err)
            Utils.sendError(res, 500, 'error', 'unknown', "An error occured", err);
        res.send(events);
    });
}
function getEvent(req, res) {
    if (!req.params.eventId)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    else {
        event_1.Event.findOne({ _id: req.params.eventId }).populate('venue').exec(function (err, event) {
            if (err)
                Utils.sendError(res, 404, 'not found', '_id', "No event with id: " + req.params.eventId + " in database.", err);
            else if (!event)
                Utils.sendError(res, 404, 'not found', '', event_1.Event.modelName, "No event with id: " + req.params.eventId + " in database.");
            else
                res.send(event);
        });
    }
}
function postEvent(req, res) {
    Models.saveAliasedDocument(req.body, event_1.Event, res, function (success, id) {
        if (success)
            res.status(200).json({ _id: id });
    });
}
function updateEvent(req, res) {
    if (!req.params.eventId)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    Models.updateAliasedDocument(req.params.eventId, req.body, event_1.Event, res, function (success) {
        if (success)
            res.sendStatus(200);
    });
}
function deleteEvent(req, res) {
    if (!req.params.eventId)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    event_1.Event.findByIdAndRemove(req.params.eventId, function (err, event) {
        if (err)
            Utils.sendError(res, 404, 'not found', '_id', "No event with id: " + req.params.eventId + " in database.", err);
        else if (!event)
            Utils.sendError(res, 404, 'not found', '', event_1.Event.modelName, "No event with id: " + req.params.eventId + " in database.");
        else
            res.send(event);
    });
}
//# sourceMappingURL=event_routes.js.map