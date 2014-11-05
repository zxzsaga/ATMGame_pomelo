var pomelo = require('pomelo');
var app = pomelo.createApp();

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

// start app
app.start();

process.on('uncaughtException', function (err) {
    console.error(' Caught exception: ' + err.stack);
});
