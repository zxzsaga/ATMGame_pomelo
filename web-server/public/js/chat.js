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

function getCookie(c_name) {
    if (document.cookie.length>0) {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        { 
            c_start=c_start + c_name.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        } 
    }
    return ""
}
