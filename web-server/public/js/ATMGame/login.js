var pomelo = window.pomelo;

var pomeloGateConfig = {
    host: window.location.hostname,
    port: 3014,
    log: false
};

$(document).ready(function() {
    $('#login-btn').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var loginInfo = {
            username: username,
            password: password
        };
        authAndQueryEntry(loginInfo, function(host, port, uid, username) {
            pomelo.init(
                {
                    host: host,
                    port: port,
                    log: false
                },
                // 与 connector 建立连接
                function() {
                    var route = 'connector.entryHandler.enter';
                    pomelo.request(
                        route,
                        uid,
                        function(resp) {
                            if (resp.code !== ATMGame.code.OK) {
                                pomelo.disconnect();
                                alert('error: ' + resp.error);
                                return;
                            }
                            var oneDay = 24 * 60 * 60 * 1000;
                            setCookie('uid', uid, oneDay);
                            setCookie('username', username, oneDay);
                            sessionStorage.setItem('users', resp.users);
                            window.location.href='/';
                        }
                    );
                }
            );
        });
    });
});

// 验证用户名和密码, 获取 connector 的 host 和 port
function authAndQueryEntry(loginInfo, cb) {
    pomelo.init(pomeloGateConfig, function() {
        var route = 'gate.gateHandler.authAndQueryEntry';
        pomelo.request(route, loginInfo, function(resp) {
            pomelo.disconnect();
            if (resp.code !== ATMGame.code.OK) {
                alert('error: ' + resp.error);
                return;
            }
            cb(resp.host, resp.port, resp.uid, resp.username);
        });
    });
}
