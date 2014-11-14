$(document).ready(function() {
    var host = sessionStorage.getItem('host');
    var port = sessionStorage.getItem('port');
    if (!host || !port) {
        window.location.href = '/login';
    }

    var username = getCookie('username');
    var uid = getCookie('uid');
    $('.username').text(username);

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
                uid,
                function(resp) {
                    if (resp.code !== ATMGame.code.OK) {
                        pomelo.disconnect();
                        alert('error: ' + resp.error);
                        return;
                    }
                    console.log('enter connector');
                }
            );
        }
    );
});
