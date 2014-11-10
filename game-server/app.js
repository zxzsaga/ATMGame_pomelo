var pomelo = require('pomelo');
var app = pomelo.createApp();

var fs = require('fs');
var util = require('util');

var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;

app.set('name', 'ATMGame');

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

// read configs
var mongoConfig = JSON.parse(fs.readFileSync('../shared/config/mongoConfig.json', 'utf8'));

MongoClient.connect(mongoConfig.ATMGame.db, function(err, db) {
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
    appStart();
});
function appStart() {
    // start app
    app.start();
}

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
