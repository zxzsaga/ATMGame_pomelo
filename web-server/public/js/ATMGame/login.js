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
            var oneDay = 24 * 60 * 60 * 1000;
            setCookie('uid', uid, oneDay);
            setCookie('username', username, oneDay);
            sessionStorage.setItem('host', host);
            sessionStorage.setItem('port', port);
            window.location.href='/';
        });
    });
});

// 验证用户名和密码, 获取 connector 的 host 和 port
function authAndQueryEntry(loginInfo, cb) {
    pomelo.init(pomeloGateConfig, function() {
        var route = 'gate.gateHandler.authAndQueryEntry';
        pomelo.request(route, loginInfo, function(res) {
            pomelo.disconnect();
            if (res.code !== ATMGame.code.OK) {
                alert('error: ' + res.error);
                return;
            }
            cb(res.host, res.port, res.uid, res.username);
        });
    });
}
