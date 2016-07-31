"use strict";
var mongoose = require('mongoose');
var Database = (function () {
    function Database() {
    }
    Database.getUrl = function (host, port, database, user, password) {
        if (user && password) {
            this.conn_url = 'mongodb://' + user + ':' + password + '@' + host + ':' + port + '/' + database;
        }
        else {
            this.conn_url = 'mongodb://' + host + ':' + port + '/' + database;
        }
        return this.conn_url;
    };
    Database.connect = function (host, port, database, user, password, options, callback) {
        mongoose.connect(Database.getUrl(host, port, database, user, password), options, callback);
    };
    return Database;
}());
exports.Database = Database;
//# sourceMappingURL=database.js.map