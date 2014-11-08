module.exports = function(app) {
    return new Handler(app);
};

var Handler = function(app) {
    this.app = app;
};

Handler.prototype.register = function(uid, pwd, next) {
    if (uid === '' || pwd === '') {
        next(null, { code: 1000 });
        return;
    }
    var doc = {
        _id: uid,
        pwd: pwd
    };
    ATMGame.UserDAO.addOne(doc, function(err, insertedDoc) {
        if (err) {
            next(err, { code: 10000 });
            return;
        }
        next(null, { code: 0, data: { uid: insertedDoc._id } });
    });
};