var pomelo = window.pomelo;

var pomeloGateConfig = {
    host: window.location.hostname,
    port: 3014,
    log: true
};

$(document).ready(function() {
    $('#register-btn').click(function() {
        var username = $('#username').val();
        var password = $('#password').val();
        var registerInfo = {
            username: username,
            password: password
        };
        pomelo.init(pomeloGateConfig, function() {
            var route = 'gate.gateHandler.register';
            pomelo.request(route, registerInfo, function(resp) {
                pomelo.disconnect();
                if (resp.code !== ATMGame.code.OK) {
                    alert('Error: ' + resp.error);
                    return;
                }
                window.location.href='/';
            });
        });
    });
});
