var pomelo = require('pomelo');
var app = pomelo.createApp();

var util = require('util');
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;

app.set('name', 'ATMGame');

app.configure('production|development', function() {
    app.loadConfig('mongoConfig', app.getBase() + '/../shared/config/mongoConfig.json');
    // app.loadConfig('code', app.getBase() + '/../shared/config/code.json');
});

// app configuration
app.configure('production|development', 'connector', function() {
    app.set(
        'connectorConfig',
        {
            connector : pomelo.connectors.hybridconnector,
            heartbeat : 3,
            useDict : true,
            useProtobuf : true
        }
    );
});

app.configure('production|development', 'gate', function() {
    app.set(
        'connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            useProtobuf: true
        }
    );
});

app.configure('production|development', 'chat', function() {
    app.set(
        'connectorConfig',
        {
            connector: pomelo.connectors.hybridconnector,
            useProtobuf: true
        }
    );
});

// set modules global
global.util = util;
global._ = _;
global.ATMGame = {};

ATMGame.code = require('../shared/config/code.json');

appStart(app.get('mongoConfig').ATMGame);

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});

function appStart(mongoConfig) {
    var mongoAddress = 'mongodb://' + mongoConfig.host + ':' + mongoConfig.port + '/' + mongoConfig.database;
    MongoClient.connect(mongoAddress, function(err, db) {
        if (err) {
            console.error(err);
            return;
        }
        ATMGame.mongodb = db;

        // load mongodb base dao
        ATMGame.MongoBaseDAO = require('../shared/dao/MongoBaseDAO.js');

        // load mongodb other dao
        var UserDAO = require('../shared/dao/UserDAO.js');
        ATMGame.UserDAO = new UserDAO();

        app.start();
    });
}
