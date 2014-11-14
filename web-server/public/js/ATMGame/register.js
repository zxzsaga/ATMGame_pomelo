var pomeloGateConfig = {
    host: window.location.hostname,
    port: 3014,
    log: false
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
            pomelo.request(route, registerInfo, function(res) {
                pomelo.disconnect();
                if (res.code !== ATMGame.code.OK) {
                    alert('Error: ' + res.error);
                    return;
                }
                window.location.href='/';
            });
        });
    });
});
