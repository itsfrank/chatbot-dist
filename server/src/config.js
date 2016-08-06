"use strict";
exports.Config = {
    local: {
        server: {
            port: 6969
        },
        mongo: {
            database: 'ccdb-dev',
            host: 'localhost',
            port: 27017
        },
        elasticsearch: {
            host: 'localhost',
            port: 9200,
            loglevel: 'trace'
        }
    },
    test: {
        server: {
            port: 9898
        },
        mongo: {
            database: 'ccdb-test',
            host: 'localhost',
            port: 27017
        },
        elasticsearch: {
            host: 'localhost',
            port: 9999,
            loglevel: 'error'
        }
    },
    dev: {
        server: {
            port: 6969
        },
        mongo: {
            database: 'ccdb-dev',
            host: '159.203.32.219',
            port: 27017,
            username: 'ccbot69',
            password: 'devpass'
        },
        elasticsearch: {
            host: 'localhost',
            port: 9200,
            loglevel: 'trace'
        }
    },
    staging: {
        server: {
            port: 6969
        },
        mongo: {
            database: 'ccdb-dev',
            host: 'localhost',
            port: 27017,
            username: 'ccbot69',
            password: 'devpass'
        },
        elasticsearch: {
            host: 'localhost',
            port: 9200,
            loglevel: 'trace'
        }
    },
    production: {
        server: {
            port: 80
        },
        mongo: {
            database: 'ccdb',
            host: 'localhost',
            port: 27017,
            username: 'ccbot69',
            password: 'ENV::CCBOT_DB_PWD'
        },
        elasticsearch: {
            host: 'localhost',
            port: 9200,
            loglevel: 'trace'
        },
        ssl: {
            key_path: '/etc/ssl/private/node-selfsigned.key',
            cert_path: '/etc/ssl/certs/node-selfsigned.crt',
            https_port: 443
        }
    }
};
// sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/priv ate/node-selfsigned.key -out /etc/ssl/certs/node-selfsigned.crt
//# sourceMappingURL=config.js.map