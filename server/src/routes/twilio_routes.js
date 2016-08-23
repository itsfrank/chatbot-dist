"use strict";
var Ask = require('./ask_routes');
var Metrics = require('../services/metrics');
var Faculties = require('../services/faculties');
var TwilioRoutes = (function () {
    function TwilioRoutes() {
    }
    TwilioRoutes.bind = function (router) {
        router.post('/twilio/webhook', twilioWebhook);
    };
    return TwilioRoutes;
}());
exports.TwilioRoutes = TwilioRoutes;
var Twilio = require('twilio')('ACd0007650167a06fc12092bfff5160f97', 'fa9046e2bcadb440f669cf23d80cadce');
function twilioWebhook(req, res) {
    var message = req.body.Body;
    var faculty = Faculties.FacultyMap.twilio.numbers[req.body.To];
    var to = req.body.To;
    var from = req.body.From;
    Ask.questionResponse(faculty, message, function (response, found, emergency) {
        if (emergency) {
        }
        else {
            Metrics.updateMetrics(faculty, found, true, message);
            sendSMS(from, to, response);
        }
    });
}
function sendSMS(to, from, message) {
    Twilio.sendSms({
        to: to,
        from: from,
        body: message
    }, function (error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);
            console.log('Message sent on:');
            console.log(message.dateCreated);
        }
        else {
            console.log(error);
            console.log('Oops! There was an error.');
        }
    });
}
//# sourceMappingURL=twilio_routes.js.map