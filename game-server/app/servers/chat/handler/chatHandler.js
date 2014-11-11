var chatRemote = require('../remote/chatRemote');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

/**
 * Enter chat
 *
 *
 */
Handler.prototype.enter = function (uid, session, next) {
    var self = this;
    var sessionService = self.app.get('sessionService');


    console.log('sessionService');
    console.log('++++++++++++++++');

    var rid = 1;
    //put user into channel
    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users) {
        next(null, { code: ATMGame.code.OK, users: users });
    });
}


/**
 * Send messages to users
 *
 * @param {Object} msg message from client
 * @param {Object} session
 * @param  {Function} next next stemp callback
 *
 */
Handler.prototype.send = function(msg, session, next) {
    console.log(msg);
    console.log('--------------');
    next(null, { msg: msg });
    /*
	var rid = session.get('rid');
	var username = session.uid.split('*')[0];
	var channelService = this.app.get('channelService');
	var param = {
		msg: msg.content,
		from: username,
		target: msg.target
	};
	channel = channelService.getChannel(rid, false);

	//the target is all users
	if(msg.target == '*') {
		channel.pushMessage('onChat', param);
	}
	//the target is specific user
	else {
		var tuid = msg.target + '*' + rid;
		var tsid = channel.getMember(tuid)['sid'];
		channelService.pushMessageByUids('onChat', param, [{
			uid: tuid,
			sid: tsid
		}]);
	}
	next(null, {
		route: msg.route
	});
	*/
};
