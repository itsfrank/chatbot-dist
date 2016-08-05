"use strict";
var DataRoutes = (function () {
    function DataRoutes() {
    }
    DataRoutes.bind = function (router) {
        router.post('/data/:type', postData);
    };
    return DataRoutes;
}());
exports.DataRoutes = DataRoutes;
function postData(req, res) {
    var type = req.params.type;
}
//# sourceMappingURL=data_routes.js.map