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

    session.bind(uid);
    session.on('closed', onUserLeave.bind(null, self.app));

    next(null, { code: ATMGame.code.OK });
};

var onUserLeave = function(app, session) {
    if (!session || !session.uid) {
	return;
    }
    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
