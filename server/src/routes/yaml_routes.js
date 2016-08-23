"use strict";
var Yaml = require('../services/yaml');
var YamlRoutes = (function () {
    function YamlRoutes() {
    }
    YamlRoutes.bind = function (router) {
        router.get('/yaml/reload', reloadYaml);
    };
    return YamlRoutes;
}());
exports.YamlRoutes = YamlRoutes;
function reloadYaml(req, res) {
    var subd = req.subdomains[0];
    Yaml.reloadYaml(subd, function (result) {
        res.send(result);
    });
}
//# sourceMappingURL=yaml_routes.js.map