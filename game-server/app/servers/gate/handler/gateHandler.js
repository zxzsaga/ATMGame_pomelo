module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

/**
 * Gate handler that auth login info and dispatch user to connectors.
 *
 * @param {Object} loginInfo login info from client
 * @param {Object} session
 * @param {Function} next
 */
Handler.prototype.authAndQueryEntry = function(loginInfo, session, next) {
    var self = this;

    var uid = loginInfo.uid;
    var pwd = loginInfo.pwd;
    
    if (!uid || !pwd) {
	next(null, { code: 2000 });
	return;
    }

    var doc = {
        _id: uid,
        pwd: pwd
    };

    ATMGame.UserDAO.findOne(doc, function(err, foundDoc) {
        if (err) {
            console.error(err);
            next(null, { code: 3000 });
            return;
        }

        // get all connectors
        var connectors = self.app.getServersByType('connector');
        if(!connectors || connectors.length === 0) {
	    next(null, {
	        code: 1000
	    });
	    return;
        }

        // here we just start `ONE` connector server, so we return the connectors[0]
        var res = connectors[0];
        next(
            null,
            {
	        code: 0,
	        host: res.host,
	        port: res.clientPort
            }
        );
    });
};

/**
 * Gate handler that register user.
 *
 * @param {Object} registerInfo register info from client
 * @param {Object} session
 * @param {Function} next
 */
Handler.prototype.register = function(registerInfo, session, next) {
    var username = registerInfo.username;
    var password = registerInfo.password;

    if (uid === '' || pwd === '') {
        next(err, { code: 0, error: 'Invalid param' });
        return;
    }

    var nowTime = Date.now();

    var doc = {
        username: username,
        password: password,
        registeredAt: nowTime
    };

    ATMGame.UserDAO.addOne(doc, function(err, insertedDoc) {
        if (err) {
            next(err, { code: 10000 });
            return;
        }
        next(null, { code: 0, data: { uid: insertedDoc._id } });
    });
};