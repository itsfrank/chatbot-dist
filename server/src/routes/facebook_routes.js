"use strict";
var request = require('request');
var FB = require('fb');
var Ask = require('./ask_routes');
var Faculties = require('../services/faculties');
var Metrics = require('../services/metrics');
var Twilio = require('./twilio_routes');
var FacebookRoutes = (function () {
    function FacebookRoutes() {
    }
    FacebookRoutes.bind = function (router) {
        router.get('/facebook/webhook', webhook);
        router.post('/facebook/webhook', facebookMessage);
    };
    return FacebookRoutes;
}());
exports.FacebookRoutes = FacebookRoutes;
var VALIDATION_TOKEN = 'fb_licorne_webhook';
var PAGE_TOKEN = 'EAAXBClPmZCXABAE0UAZBwkrJL0MtCVvDRaADfId0WH7bwKcjkp5t2xrxCKPaDcu7OcwWAcElrFiPSjMJ9GbX8erzkQmTbpUD84bjMAPc6PfZCNmf2Y6W3xbL6mxgRvkoKFkWRUBHoYmpprzs4weBsRAcwsMbFw6qMBAZAkAZB3QZDZD';
function webhook(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === VALIDATION_TOKEN) {
        console.log("Validating webhook");
        res.status(200).send(req.query['hub.challenge']);
    }
    else {
        console.error("Failed validation. Make sure the validation tokens match.");
        res.sendStatus(403);
    }
}
function facebookMessage(req, res) {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == 'page') {
        // Iterate over each entry
        // There may be multiple if batched
        data.entry.forEach(function (pageEntry) {
            var pageID = pageEntry.id;
            var timeOfEvent = pageEntry.time;
            // Iterate over each messaging event
            pageEntry.messaging.forEach(function (messagingEvent) {
                if (messagingEvent.optin) {
                }
                else if (messagingEvent.message) {
                    receivedMessage(messagingEvent, Faculties.FacultyMap.facebook.ids[pageID]);
                }
                else if (messagingEvent.delivery) {
                }
                else if (messagingEvent.postback) {
                }
                else {
                    console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                }
            });
        });
        // Assume all went well.
        //
        // You must send back a 200, within 20 seconds, to let us know you've 
        // successfully received the callback. Otherwise, the request will time out.
        res.sendStatus(200);
    }
}
function receivedMessage(event, faculty) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;
    console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));
    var messageId = message.mid;
    // You may get a text or attachment but not both
    var messageText = message.text;
    var messageAttachments = message.attachments;
    if (messageText) {
        sendTextMessage(faculty, senderID, messageText);
    }
    else if (messageAttachments) {
    }
}
function sendTextMessage(faculty, recipientId, messageText) {
    Ask.questionResponse(faculty, messageText, function (response, found, emergency) {
        if (emergency) {
            Twilio.sendEmergencySms(faculty, "unknown (facebook)", messageText, function (responseMsg) {
                var messageData = {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        text: responseMsg
                    }
                };
                callSendAPI(faculty, messageData);
            });
        }
        else {
            Metrics.updateMetrics(faculty, found, false, messageText);
            var messageData = {
                recipient: {
                    id: recipientId
                },
                message: {
                    text: response
                }
            };
            callSendAPI(faculty, messageData);
        }
    });
}
function callSendAPI(faculty, messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: Faculties.FacultyMap.facebook.tokens[faculty] },
        method: 'POST',
        json: messageData
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var recipientId = body.recipient_id;
            var messageId = body.message_id;
            console.log("Successfully sent generic message with id %s to recipient %s", messageId, recipientId);
        }
        else {
            console.error("Unable to send message.");
            console.error(response);
            console.error(error);
        }
    });
}
//# sourceMappingURL=facebook_routes.js.map