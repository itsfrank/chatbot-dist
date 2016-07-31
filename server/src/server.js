"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var database_1 = require('./services/database');
var routes_1 = require('./routes');
var words_1 = require('./services/words');
var mongo_express = require('mongo-express/lib/middleware');
var mongo_express_config = require('./mongo-config.js');
var app = express();
var db = process.env.CCBOT_DB;
var host = process.env.CCBOT_HOST; //'159.203.32.219'
var port = process.env.CCBOT_PORT;
var user = process.env.CCBOT_USER;
var password = process.env.CCBOT_PWD;
database_1.Database.connect(host, 27017, db, user, password);
//Body to json
app.use(bodyParser.json());
//Serve static
app.use('/', express.static('../client'));
//mongo-express db manager
app.use('/mongo_express', mongo_express(mongo_express_config));
var router = express.Router();
//Add routes to app
routes_1.RouteBinder.bind(router);
app.use('/cbot', router);
words_1.WordsService.reloadWords();
var server = app.listen(port, function () {
    var address = server.address().address;
    console.log('Listening on ' + address + ":" + port);
});
server.on("error", function (error) {
    if (error.syscall !== "listen") {
        throw error;
    }
    var bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
});
exports.server_obj = server;
//# sourceMappingURL=server.js.map