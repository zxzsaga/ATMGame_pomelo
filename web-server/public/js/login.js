var pomelo = window.pomelo;

$(document).ready(function() {
    $('#btn-login').click(function() {
        var usr = $('#usr').val();
        var pwd = $('#pwd').val();
        queryEntry(usr, function(host, port) {
            pomelo.init(
                {
                    host: host,
                    port: port,
                    log: true
                },
                function() {
                    var route = 'connector.entryHandler.enter';
                    /*
                    pomelo.request(
                        route,
                        {  }
                    );
                    */
                }
            );
        });
    });
});

function queryEntry(uid, cb) {
    var route = 'gate.gateHandler.queryEntry';
    console.log(pomelo);
    pomelo.init(
        {
            host: window.location.hostname,
            port: 3014,
            log: true
        },
        function() {
            consol.log('lalala');
            pomelo.request(
                route,
                { uid: uid },
                function(data) {
                    pomelo.disconnet();
                    if (data.code === 500) {
                        alert('errorCode: ' + 500);
                        return;
                    }
                    console.log(data);
                    cb(data.host, data.port);
                }
            )
        }
    );
}
