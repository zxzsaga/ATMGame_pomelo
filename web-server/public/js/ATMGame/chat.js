var pomelo = window.pomelo;

$(document).ready(function() {
    var uid = getCookie('uid');

    pomelo.request(
        'connector.chatHandler.enter',
        uid,
        function(resp) {
            console.log(resp);
        }
    );
    /*
    queryEntry(name, function(host, port) {
        pomelo.init(
            {
                host: host,
                port: port,
                log: true
            },
            function() {
                var route = 'chat.chatHandler.';
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
        var route = 'chat.chatHandler.send';
        var msg = $('#chat-msg').val();
        pomelo.request(route, msg, function(data) {
            $('#chat-frame').append(data.msg);
        });
    });
    */
});
