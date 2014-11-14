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

    app.set('webConfig', require('./config/webConfig.json').production);
} else if (env === 'development') {
    app.use(express.static(__dirname + '/public'));
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));

    app.set('webConfig', require('./config/webConfig.json').development);
} else {
    throw new Error('Unrecognized Environment');
}

var webConfig = app.get('webConfig');
console.log('Web server has started.\nPlease log on http://' + webConfig.host + ':' + webConfig.port);
app.listen(webConfig.port);

// routers
app.get('/login', function(req, res) {
    res.render('login');
});
app.get('/register', function(req, res) {
    res.render('register');
});
app.get('/', function(req, res) {
    if (req.cookies.uid) {
        res.render('main');
    } else {
        res.redirect('/login');
    }
});


