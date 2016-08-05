"use strict";
var Elasticsearch = require('elasticsearch');
function connect(host, port, loglevel) {
    exports.elasticsearch = new Elasticsearch.Client({
        host: host + ':' + port,
        log: loglevel
    });
}
exports.connect = connect;
function pingWait(done) {
    if (!done)
        done = function () { };
    exports.elasticsearch.ping({}, function (error) {
        if (error) {
            console.log('elasticsearch ping failed, trying again in 2 seconds...');
            setTimeout(pingWait, 1000);
        }
        else {
            console.log('elasticsearch is connected');
            done();
        }
    });
}
exports.pingWait = pingWait;
//# sourceMappingURL=elasticsearch.js.map