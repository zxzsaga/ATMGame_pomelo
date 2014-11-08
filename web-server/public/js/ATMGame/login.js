var pomelo = window.pomelo;

var pomeloGateConfig = {
    host: window.location.hostname,
    port: 3014,
    log: true
};

$(document).ready(function() {
    $('#login-btn').click(function() {
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
                    var route = 'connector.entryHandler.enter';
                    pomelo.request(
                        route,
                        { uid: uid, pwd: pwd },
                        function(data) {
                            pomelo.disconnect();
                            if (data.code === 500) {
                                alert('errorCode: ' + 500);
                                return;
                            }
                            setCookie('uid', data.uid, 1);
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

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}