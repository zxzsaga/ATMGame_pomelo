module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

Handler.prototype.register = function(msg, session, next) {
    var uid = msg.uid;
    var pwd = msg.pwd;
    if (uid === '' || pwd === '') {
        var err = new Error('Invalid param');
        next(err, { code: 0, data: err });
        return;
    }

    var nowTime = Date.now();

    var doc = {
        _id: uid,
        pwd: pwd,
        registed: nowTime
    };

    ATMGame.UserDAO.addOne(doc, function(err, insertedDoc) {
        if (err) {
            next(err, { code: 10000 });
            return;
        }
        next(null, { code: 0, data: { uid: insertedDoc._id } });
    });
};

Handler.prototype.enter = function(uid, session, next) {
    var self = this;
    var sessionService = self.app.get('sessionService');

    // duplicate log in
    if (!!sessionService.getByUid(uid)) {
        next(null, { code: 1002, error: true });
        return;
    }

    session.bind(uid);

    // session.on('closed', onUserLeave.bind(null, self.app));

    var rid = 1;
    next(null, { code: 200, uid: uid });
    
    //put user into channel
    self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users) {
        next(null, {
            users:users
        });
    });
    next(null, { code: 0, uid: uid });
};

var onUserLeave = function(app, session) {
    if(!session || !session.uid) {
	return;
    }
    app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
