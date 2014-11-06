'use strict';

var UserDAO = function() {
    UserDAO.super_.call(this, 'User', ATMGame.mongodb);
};
util.inherits(UserDAO, ATMGame.MongoBaseDAO);

module.exports = UserDAO;
