"use strict";
var Utils = require('../services/utils');
var Faculties = require('../services/faculties');
var emergency_numbers_1 = require('../models/emergency-numbers');
var EmergencyNumbersRoutes = (function () {
    function EmergencyNumbersRoutes() {
    }
    EmergencyNumbersRoutes.bind = function (router) {
        router.get('/emergency', getEmergencyNumbers);
        router.put('/emergency/:id', putEmergencyNumber);
        router.delete('/emergency/:id', deleteEmergencyNumber);
        router.post('/emergency', postEmergencyNumber);
    };
    return EmergencyNumbersRoutes;
}());
exports.EmergencyNumbersRoutes = EmergencyNumbersRoutes;
function getEmergencyNumbers(req, res) {
    var fac = Faculties.requestFaculty(req);
    emergency_numbers_1.EmergencyNumbers.find({ faculty: fac }, function (err, numbers) {
        if (err)
            Utils.sendError(res, 500, "internal", "error getting emergency number", "", err);
        else
            res.send(numbers);
    });
}
function putEmergencyNumber(req, res) {
    var fac = Faculties.requestFaculty(req);
    req.body.faculty = fac;
    if (!req.params.id)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    else {
        emergency_numbers_1.EmergencyNumbers.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, updated) {
            if (err)
                Utils.sendError(res, 500, "internal", "error saving emergency number", "", err);
            else
                res.send(updated);
        });
    }
}
function deleteEmergencyNumber(req, res) {
    if (!req.params.id)
        Utils.sendError(res, 400, 'param', '_id', 'This route should not be sent without an id');
    else {
        emergency_numbers_1.EmergencyNumbers.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err)
                Utils.sendError(res, 500, "internal", "error saving emergency number", "", err);
            else
                res.status(200).send();
        });
    }
}
function postEmergencyNumber(req, res) {
    var fac = Faculties.requestFaculty(req);
    req.body.faculty = fac;
    new emergency_numbers_1.EmergencyNumbers(req.body).save(function (err) {
        if (err)
            Utils.sendError(res, 500, "internal", "error saving emergency number", "", err);
        else
            res.status(200).send();
    });
}
//# sourceMappingURL=emergency-numbers_routes.js.map