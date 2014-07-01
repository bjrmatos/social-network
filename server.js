'use strict';

var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    events = require('events'),
    nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    sessionStore = new session.MemoryStore(),
    express = require('express'),
    app = express(),
    server = http.Server(app),
    io = require('socket.io')(server),
    config = require('./config/');

var mailConf = {
  mail: config.get('mail')
};

var Account = require('./models/Account')(app, mailConf, mongoose, nodemailer);

// Create a event Dispatcher
var eventDispatcher = new events.EventEmitter();

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.set('eventDispatcher', eventDispatcher);

// Middleware setup
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// logging request
if (app.get('env') === 'production') {
  app.use(morgan());
} else {
  app.use(morgan('dev'));
}

app.use(bodyParser());
app.use(cookieParser(config.get('cookie:secret')));
app.use(session({
  name: config.get('cookie:name'),
  secret: config.get('cookie:secret'),
  store: sessionStore
}));

// Require routes
fs.readdirSync('routes').forEach(function(file) {
  var routeName = file.substr(0, file.indexOf('.'));

  if (routeName === 'chat') {
    require('./routes/' + routeName)(io, app, sessionStore, Account);
  } else {
    require('./routes/' + routeName)(app, Account);
  }
});

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/contacts/find', function(req, res) {
  var searchStr = req.body.searchStr;

  if (null == searchStr) { return res.send(400); }

  Account.findByString(searchStr, function(err, accounts) {
    if (err || accounts.length === 0) { return res.send(404); }

    res.send(accounts);
  });
});

// Init server
mongoose.connect(config.get('mongoose:uri'), function(err) {
  if (err) { throw err; }

  console.log('Mongodb connected');

  server.listen(config.get('port'), function() {
    console.log('Express server on port %s', config.get('port'));
  });
});
