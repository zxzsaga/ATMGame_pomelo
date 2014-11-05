var pomelo = window.pomelo;
var host = '127.0.0.1';
var port = '3010';

function show() {
    pomelo.init({
        host: host,
        port: port,
        log: true
    }, function() {
        pomelo.request('connector.entryHandler.entry', 'hello pomelo', function(data) {
            alert(data.msg);
        });
    });
}
