'use strict';

module.exports = function(app, Account) {
  var eventDispatcher = app.get('eventDispatcher');

  app.get('/accounts/:id/contacts', function(req, res) {
    var accountId = req.params.id === 'me' ?
                    req.session.accountId :
                    req.params.id;

    Account.findById(accountId, function(err, account) {
      res.send(account ? account.get('contacts') : {});
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

        eventDispatcher.emit('event:' + accountId, {
          from: accountId,
          data: status,
          action: 'status'
        });
      });
    });

    res.send(200);
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
};
