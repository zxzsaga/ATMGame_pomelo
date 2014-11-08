var pomelo = window.pomelo;

var pomeloGateConfig = {
    host: window.location.hostname,
    port: 3014,
    log: true
};

$(document).ready(function() {
    $('#register-btn').click(function() {
        var uid = $('#usr').val();
        var pwd = $('#pwd').val();
        queryEntry(uid, function(host, port) {
            pomelo.init(
                {
                    host: host,
                    port: port,
                    log: true
                },
                function() {
                    var route = 'connector.entryHandler.register';
                    pomelo.request(
                        route,
                        { uid: uid, pwd: pwd },
                        function(data) {
                            pomelo.disconnect();
                            if (data.code !== 0) {
                                alert('error code: ' + data.code);
                                return;
                            }
                            window.location.href='/';
                        }
                    );
                }
            );
        });
    });
});

function queryEntry(uid, cb) {
    pomelo.init(pomeloGateConfig, function() {
        var route = 'gate.gateHandler.queryEntry';
        pomelo.request(route, { uid: uid }, function(data) {
            pomelo.disconnect();
            if (data.code !== 200) {
                alert('errorCode: ' + data.code);
                return;
            }
            cb(data.host, data.port);
        });
    });
}
