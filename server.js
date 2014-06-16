'use strict';

var path = require('path'),
    nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    app = express(),
    config = require('./config/');

var mailConf = {
  mail: config.get('mail')
};

var Account = require('./models/Account')(mailConf, mongoose, nodemailer);

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

// logging request
if (app.get('env') === 'production') {
  app.use(morgan());
} else {
  app.use(morgan('dev'));
}

app.use(bodyParser());
app.use(cookieParser('shhhh is a secret'));
app.use(session({ secret: 'shhhh is a secret' }));

app.get('/', function(req, res) {
  res.render('index');
});

app.post('/login', function(req, res) {
  console.log('Login request');

  var email = req.body.email || null,
      password = req.body.password || null;

  if (null == email || email.length < 1 ||
    null == password || password.length < 1) {
    return res.send(400);
  }

  Account.login(email, password, function(account) {
    if (!account) { return res.send(401); }

    console.log('Login was successful');
    req.session.loggedIn = true;
    req.session.accountId = account._id;
    res.send(200);
  });
});

app.post('/register', function(req, res) {
  var firstName = req.body.firstName || '',
      lastName = req.body.lastName || '',
      email = req.body.email || null,
      password = req.body.password || null;

  if (null == email || email.length < 1 ||
      null == password || password.length < 1) {
    return res.send(400); // 400: bad request
  }

  Account.register(email, password, firstName, lastName);
  res.send(200);
});

app.get('/account/authenticated', function(req, res) {
  if (req.session.loggedIn) {
    return res.send(200);
  } else {
    // Unauthorized
    return res.send(401);
  }
});

app.get('/accounts/:id/contacts', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  Account.findById(accountId, function(err, account) {
    res.send(account.contacts);
  });
});

app.get('/accounts/:id/activity', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  Account.findById(accountId, function(err, account) {
    if (account == null) { return res.send([]); }

    res.send(account.activity);
  });
});

app.get('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  Account.findById(accountId, function(err, account) {
    if (null == account) { return res.send({}); }

    res.send(account.status);
  });
});

app.post('/accounts/:id/status', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  Account.findById(accountId, function(err, account) {
    var status = {
      name: account.name,
      status: req.body.status || ''
    };

    account.status.push(status);
    // Push the status for everybody in contacts
    account.activity.push(status);

    account.save(function(err) {
      if (err) { return console.log('Error saving account: ', err); }
    });

    res.send(200);
  });
});

app.post('/accounts/:id/contact', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  var contactId = req.body.contactId || null;

  if (null == contactId) { return res.send(400); }

  Account.findById(accountId, function(err, account) {
    if (account) {
      Account.findById(contactId, function(err, contact) {
        Account.addContact(account, contact);
        // Add the account in the contact
        Account.addContact(contact, account);
      });
    }
  });

  // returns inmediately and processes in background
  res.send(200);
});

app.delete('/accounts/:id/contact', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  var contactId = req.body.contactId || null;

  if (null == contactId) { return res.send(400); }

  Account.findById(accountId, function(err, account) {
    if (!account) { return; }

    Account.findById(contactId, function(err, contact) {
      if (!contact) { return; }

      Account.removeContact(account, contactId);
      Account.removeContact(contact, accountId);
    });
  });

  // returns inmediately and processes in background
  res.send(200);
});

app.get('/accounts/:id', function(req, res) {
  var accountId = req.params.id === 'me' ?
                  req.session.accountId :
                  req.params.id;

  Account.findById(accountId, function(err, account) {
    /**

      TODO:
      - Do not send password in the response

    **/
    if (accountId === 'me' ||
      Account.hasContact(account, req.session.accountId)) {
      account.isFriend = true;
    }

    res.send(account);
  });
});

app.post('/contacts/find', function(req, res) {
  var searchStr = req.body.searchStr;

  if (null == searchStr) { return res.send(400); }

  Account.findByString(searchStr, function(err, accounts) {
    if (err || accounts.length === 0) { return res.send(404); }

    res.send(accounts);
  });
});

app.post('/forgotpassword', function(req, res) {
  var hostname = req.host,
      resetPasswordUrl = req.protocol + '://' + hostname + '/resetPassword',
      email = req.body.email || null;

  if (null == email || email.length < 1) { return res.send(400); }

  Account.forgotPassword(email, resetPasswordUrl, function(success) {
    if (success) {
      return res.send(200);
    } else {
      return res.send(404);
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.query.account || null;
  res.render('resetPassword', { accountId: accountId });
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.body.accountId || null,
      password = req.body.password || null;

  if (null != accountId && null != password) {
    Account.changePassword(accountId, password);
  }

  res.render('resetPasswordSuccess');
});

mongoose.connect(config.get('mongoose:uri'), function(err) {
  if (err) { throw err; }

  console.log('Mongodb connected');

  app.listen(config.get('port'), function() {
    console.log('Express server on port %s', config.get('port'));
  });
});
