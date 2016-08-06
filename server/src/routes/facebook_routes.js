"use strict";
var FacebookRoutes = (function () {
    function FacebookRoutes() {
    }
    FacebookRoutes.bind = function (router) {
        router.get('/facebook/webhook', webhook);
    };
    return FacebookRoutes;
}());
exports.FacebookRoutes = FacebookRoutes;
var VALIDATION_TOKEN = 'fb_licorne_webhook';
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
//# sourceMappingURL=facebook_routes.js.map