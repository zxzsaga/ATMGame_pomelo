var pomelo = window.pomelo;

$(document).ready(function() {
    var name = getCookie('accessId');
    queryEntry(name, function(host, port) {
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
                    { username: username },
                    function(data) {
                        if (data.error) {
                            alert(error);
                            return;
                        }
                    }
                )
            }
        )
    });
    $('#send-msg-btn').click(function() {
    });
});

// query connector
function queryEntry(uid, cb) {
    var route = 'gate.gateHandler.queryEntry';
    var msg = { uid: uid };
    pomelo.init(
        {
            host: window.location.hostname,
            port: 3014,
            log: true
        },
        function() {
            pomelo.request(
                route,
                msg,
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

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length,c.length);
    }
    return "";
}