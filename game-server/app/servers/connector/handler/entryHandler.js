module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

Handler.prototype.enter = function(uid, session, next) {
    var self = this;
    var sessionService = self.app.get('sessionService');

    // duplicate log in
    if (!!sessionService.getByUid(uid)) {
        next(null, { code: ATMGame.code.DUPLICATE_LOGIN, error: 'Duplicate login' });
        return;
    }

    var rid = 'global';

    session.bind(uid);
    session.set('rid', rid);
    session.push('rid', function(err) {
	if (err) {
	    console.error('set rid for session service failed! error is : %j', err.stack);
	}
    });
    session.on('closed', onUserLeave.bind(null, self.app));

    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users) {
        next(null, { code: ATMGame.code.OK, users: users });
    });
};

var onUserLeave = function(app, session) {
    if (!session || !session.uid) {
	return;
    }
    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
