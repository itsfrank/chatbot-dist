"use strict";
var TwilioRoutes = (function () {
    function TwilioRoutes() {
    }
    TwilioRoutes.bind = function (router) {
        router.post('/twilio/webhook', twilioWebhook);
    };
    return TwilioRoutes;
}());
exports.TwilioRoutes = TwilioRoutes;
function twilioWebhook(req, res) {
    console.log(req.body);
}
//# sourceMappingURL=twilio_routes.js.map