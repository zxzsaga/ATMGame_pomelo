module.exports = function(app) {
    return new ChatRemote(app);
};

var ChatRemote = function(app) {
    this.app = app;
    this.channelService = app.get('channelService');
};

/**
 * Add user into chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 *
 */
ChatRemote.prototype.add = function(uid, sid, name, flag, cb) {
    var channel = this.channelService.getChannel(name, flag);
    channel.pushMessage('join', uid + ' join room ~');

    if (!!channel) {
	channel.add(uid, sid);
    }

    cb(this.get(name, flag));
};

/**
 * Get user from chat channel.
 *
 * @param {Object} opts parameters for request
 * @param {String} name channel name
 * @param {boolean} flag channel parameter
 * @return {Array} users uids in channel
 *
 */
ChatRemote.prototype.get = function(name, flag) {
    var users = [];
    var channel = this.channelService.getChannel(name, flag);
    if (!!channel) {
	users = channel.getMembers();
    }
    return users;
};

/**
 * Kick user out chat channel.
 *
 * @param {String} uid unique id for user
 * @param {String} sid server id
 * @param {String} name channel name
 *
 */
ChatRemote.prototype.kick = function(uid, sid, name) {
    var channel = this.channelService.getChannel(name, false);
    // leave channel
    if( !! channel) {
	channel.leave(uid, sid);
    }
    var username = uid;
    var param = {
	route: 'onLeave',
	user: username
    };
    channel.pushMessage(param);
};
