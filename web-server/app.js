// Node.js modules
var fs = require('fs');
var util = require('util');

// third part modules
var _ = require('underscore');
var MongoClient = require('mongodb').MongoClient;

// express relative
var express = require('express');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var app = express();

// app configure
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(cookieParser('secret'));
app.use(session({ secret: 'keyboard cat' }));
app.use(bodyParser());
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {layout: false});
app.set('basepath',__dirname + '/public');

var env = process.env.NODE_ENV || 'development';
if (env === 'production') {
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(errorHandler());
} else if (env === 'development') {
    app.use(express.static(__dirname + '/public'));
    app.use(errorHandler({ dumpExceptions: true, showStack: true })); 
} else {
    throw new Error('Unrecognized Environment');
}

// set modules global
global.util = util;
global._ = _;
global.ATMGame = {};

// read configs
var webConfig   = JSON.parse(fs.readFileSync('../shared/config/webConfig.json', 'utf8'));
var mongoConfig = JSON.parse(fs.readFileSync('../shared/config/mongoConfig.json', 'utf8'));

MongoClient.connect(mongoConfig.ATMGame.db, function(err, db) {
    if (err) {
        console.error(err);
        return;
    }
    ATMGame.mongodb = db;

    // load mongodb base dao
    ATMGame.MongoBaseDAO = require('../shared/dao/MongoBaseDAO.js');
    
    // load mongodb other dao
    var UserDAO = require('../shared/dao/UserDAO.js');
    ATMGame.UserDAO = new UserDAO();
    appListen();
});

function appListen() {
    console.log('Web server has started.\nPlease log on http://' + webConfig.ip + ':' + webConfig.port);
    app.listen(webConfig.port);
}

// routers
// get
app.get('/', function(req, res) {
    if (req.cookies.accessId) {
        res.render('main', { username: req.cookies.accessId });
    } else {
        res.redirect('/login');
    }
});

app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/login', function(req, res) {
    res.render('login');
});

app.get('/register', function(req, res) {
    res.render('register');
});

// post
app.post('/login', function(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    if (username === '') {
        req.render('login', { error: 'Please input username' });
        return;
    }
    if (password === '') {
        res.render('login', { error: 'Please input password' });
        return;
    }
    var condition = {
        name: username,
        password: password
    };
    ATMGame.UserDAO.findOne(condition, function(err, foundDoc) {
        if (err) {
            res.render('login', { error: err });
            return;
        }
        if (foundDoc === null) {
            res.render('login', { error: 'Username or password incorrect' });
            return;
        }
        res.cookie('accessId', foundDoc.name, { maxAge: 86400000 });
        res.redirect('/');
    });
});

app.post('/register', function(req, res) {
    var username = req.param('username');
    var password = req.param('password');
    if (username === '') {
        req.render('login', { error: 'Please input username' });
        return;
    }
    if (password === '') {
        res.render('login', { error: 'Please input password' });
        return;
    }
    var nowTime = Date.now()
    var doc = {
        name: username,
        password: password,
        registerAt: nowTime
    };
    ATMGame.UserDAO.addOne(doc, function(err, insertedDoc) {
        if (err) {
            res.render('register', { error: err });
            return;
        }
        res.redirect('/');
    });
});
