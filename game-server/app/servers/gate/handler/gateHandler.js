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

    var username = loginInfo.username;
    var password = loginInfo.password;
    
    if (!username || !password) {
        next(null, { code: ATMGame.code.INVALID_PARAM, error: 'Invalid param' });
        return;
    }

    var doc = {
        username: username,
        password: password
    };

    ATMGame.UserDAO.findOne(doc, function(err, foundDoc) {
        if (err) {
            next(err, { code: ATMGame.code.MONGODB_ERROR, error: 'Mongodb error' });
            return;
        }

        // get all connectors
        var connectors = self.app.getServersByType('connector');
        if (!connectors || connectors.length === 0) {
	    next(
                new Error('No connector server'),
                {
                    code: ATMGame.code.NO_CONNECTOR_SERVER,
                    error: 'No connector server'
                }
            );
	    return;
        }

        // here we just start `ONE` connector server, so we return the connectors[0]
        var res = connectors[0];
        next(
            null,
            {
	        code: 0,
	        host: res.host,
	        port: res.clientPort,
                uid: foundDoc._id,
                username: foundDoc.username
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
    if (!username || !password) {
        next(null, { code: ATMGame.code.INVALID_PARAM, error: 'Invalid param' });
        return;
    }
    ATMGame.UserDAO.findMaxId(function(err, maxId) {
        if (err) {
            next(err, { code: ATMGame.code.MONGODB_ERROR, error: 'Mongodb error' });
            return;            
        }

        var nowTime = Date.now();
        var id = maxId ? maxId + 1 : 10000;
        var doc = {
            _id: id,
            username: username,
            password: password,
            registeredAt: nowTime
        };

        ATMGame.UserDAO.addOne(doc, function(err, insertedDoc) {
            if (err) {
                next(err, { code: ATMGame.code.MONGODB_ERROR, error: 'Mongodb error' });
                return;
            }
            next(null, { code: ATMGame.code.OK });
        });
    });
};
