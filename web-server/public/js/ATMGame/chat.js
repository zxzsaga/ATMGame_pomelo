$(document).ready(function() {
    var username = getCookie('username');
    var uid = getCookie('uid');
    $('#send-msg-btn').click(function() {
        content = $('#chat-msg').val();
        var route = 'chat.chatHandler.send';
        var msg = {
            content: content,
            from: username,
            target: '*'
        };
        pomelo.request(route, msg, function(data) {
            console.log(data);
        });
    });

    pomelo.on('join', function(data) {
        $('#chat-frame').append(data);
    });

    pomelo.on('onChat', function(data) {
        console.log(data);
        appendMsgToChatFrame(data.from, data.msg);
    });
});

function appendMsgToChatFrame(from, msg) {
    var content = from + ': ' + msg;
    $('#chat-frame').append(content).append('<br>');
}
