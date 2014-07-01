'use strict';

module.exports = function(app, Account) {
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
      res.send(account._id);
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
    if (req.session && req.session.loggedIn) {
      return res.send(req.session.accountId);
    } else {
      // Unauthorized
      return res.send(401);
    }
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
};
