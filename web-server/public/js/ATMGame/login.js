var pomelo = window.pomelo;

var pomeloGateConfig = {
    host: window.location.hostname,
    port: 3014,
    log: false
};

$(document).ready(function() {
    $('#login-btn').click(function() {
        var uid = $('#usr').val();
        var pwd = $('#pwd').val();

        var loginInfo = {
            uid: uid,
            pwd: pwd
        };

        authAndQueryEntry(loginInfo, function(host, port) {
            pomelo.init(
                {
                    host: host,
                    port: port,
                    log: false
                },
                function() {
                    var route = 'connector.entryHandler.enter';
                    pomelo.request(
                        route,
                        uid ,
                        function(data) {
                            pomelo.disconnect();
                            if (data.code === 500) {
                                alert('errorCode: ' + 500);
                                return;
                            }
                            setCookie('uid', data.uid, 24 * 3600 * 1000);
                            window.location.href='/';
                        }
                    );
                }
            );
        });
    });
});

function authAndQueryEntry(loginInfo, cb) {
    pomelo.init(pomeloGateConfig, function() {
        var route = 'gate.gateHandler.authAndQueryEntry';
        pomelo.request(route, loginInfo, function(resp) {
            pomelo.disconnect();
            if (resp.code !== 0) {
                alert('errorCode: ' + resp.code);
                return;
            }
            cb(resp.host, resp.port);
        });
    });
}
