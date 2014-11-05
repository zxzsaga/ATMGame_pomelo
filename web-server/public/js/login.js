var pomelo = window.pomelo;

$(document).ready(function() {
    $('#btn-login').click(function() {
        var usr = $('#usr').val();
        var pwd = $('#pwd').val();
        queryEntry(usr, function(host, port) {
            var route = 'connector.entryHandler.entry';
            pomelo.init(
                {
                    host: host,
                    port: port,
                    log: true
                },
                function() {
                    pomelo.request(
                        route,
                        {},
                        function(data) {
                            pomelo.disconnect();
                            if (data.code === 500) {
                                alert('errorCode: ' + 500);
                                return;
                            }
                            console.log(data.msg);
                        }
                    );
                }
            );
        });
    });
});

function queryEntry(uid, cb) {
    var route = 'gate.gateHandler.queryEntry';
    pomelo.init(
        {
            host: window.location.hostname,
            port: 3014,
            log: true
        },
        function() {
            pomelo.request(
                route,
                { uid: uid },
                function(data) {
                    pomelo.disconnect();
                    if (data.code === 500) {
                        alert('errorCode: ' + 500);
                        return;
                    }
                    cb(data.host, data.port);
                }
            )
        }
    );
}
