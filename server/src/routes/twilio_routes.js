"use strict";
var Ask = require('./ask_routes');
var Metrics = require('../services/metrics');
var Faculties = require('../services/faculties');
var emergency_numbers_1 = require('../models/emergency-numbers');
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
            Twilio.sendEmergencySms(faculty, from + " (sms)", message, function (responseMsg) {
                sendSMS(from, to, responseMsg);
            });
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
function sendEmergencySms(faculty, sender, message, callback) {
    emergency_numbers_1.EmergencyNumbers.find({ faculty: faculty }, function (err, numbers) {
        if (err) {
            callback('There was a technical error processing your message, please try to contact the staff or coords through a different means');
        }
        else {
            for (var _i = 0, numbers_1 = numbers; _i < numbers_1.length; _i++) {
                var number = numbers_1[_i];
                sendSMS(number.number, Faculties.FacultyMap.twilio.from[faculty], "Emeregency message from " + sender + ": " + message);
            }
            callback('Your emergency message has been sent! Make sure you have provided enough information for us to properly assist you (location, name, phone number, etc..). If you want to provide additional information, simply send another emergency message with the additional details.');
        }
    });
}
exports.sendEmergencySms = sendEmergencySms;
//# sourceMappingURL=twilio_routes.js.map