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
        }
    }
};
// "start": "node built/server.js",
// "dev": "env CCBOT_DB='ccdb-dev' env CCBOT_HOST='159.203.32.219' env CCBOT_username='ccbot69' env CCBOT_PWD='devpass' env CCBOT_PORT='6969' nodemon src/server.ts --watch 'src/**/*.ts'  --exec 'ts-node'",
// "dev-local": "mongod | env CCBOT_DB='ccdb-dev' env CCBOT_HOST='localhost' env CCBOT_PORT='6969' nodemon src/server.ts --watch 'src/**/*.ts'  --exec 'ts-node'",
// "test": "mongod | env CCBOT_DB='ccdb-test' env CCBOT_username='ccbot69' env CCBOT_PWD='testpass' env CCBOT_PORT='6868' mocha -w test/testrunner.ts",
// "test-cover": "mongod | env CCBOT_DB='ccdb-test' env CCBOT_username='ccbot69' env CCBOT_PWD='testpass' env CCBOT_PORT='6868' istanbul cover node_modules/mocha/bin/_mocha",
// "build": "tsc",
// "clean": "rm -rf built",
// "postinstall": "typings install",
// "dev:client": " webpack-dev-server --content-base client/"
// "stage": "env CCBOT_DB='ccdb-dev' env CCBOT_HOST='159.203.32.219' env CCBOT_username='ccbot69' env CCBOT_PWD='devpass' env CCBOT_PORT='6969' node src/server.js",
// "prod-test": "env CCBOT_DB='ccdb-dev' env CCBOT_HOST='localhost' env CCBOT_username='ccbot69' env CCBOT_PWD='devpass' env CCBOT_PORT='80' node src/server.js",
//# sourceMappingURL=config.js.map