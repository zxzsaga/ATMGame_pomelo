module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

Handler.prototype.enter = function(msg, session, next) {
    var self = this;
    var uid = msg.username;
    var sessionService = this.app.get('sessionService');
    
    // duplicate log in
    if (!!sessionService.getByUid(uid)) {
        next(null, { code: 500, error: true });
        return;
    });
    
    session.bind(uid);
    session.on('closed', onUserLeave.bind(null, self.app));

    var rid = 1;

    //put user into channel
    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
	next(null, {
	    users:users
	});
    });
};

var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
