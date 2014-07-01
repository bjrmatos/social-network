'use strict';

var session = require('express-session'),
    parserCookie = require('../lib/parserCookie'),
    config = require('../config/');

module.exports = function(io, app, sessionStore, Account) {
  var eventDispatcher = app.get('eventDispatcher');

  app.isAccountOnline = function(accountId) {
    // OLD WAY OF GET CLIENTS IN A ROOM (v0.9)
    // var clients = io.sockets.clients(accountId);
    // return clients.length > 0;

    var clients = [],
        room = io.sockets.adapter.rooms[accountId];

    if (room) {
      for (var id in room) {
        clients.push(io.sockets.adapter.nsp.connected[id]);
      }
    }

    return clients.length > 0;
  };

  // authorization middleware
  io.use(function(socket, next) {
    console.log('Socket.io authentication middleware execute');

    var handshakeData = socket.request;

    if (handshakeData && handshakeData.headers && handshakeData.headers.cookie) {
      var cookies = parserCookie.parse(handshakeData.headers.cookie),
        signedCookies = parserCookie.signedCookies(cookies, config.get('cookie:secret')),
        sessionID = signedCookies[config.get('cookie:name')];

      sessionStore.get(sessionID, function(err, userSession) {
        if ( err || !userSession ) {
          return next(new Error('INVALID_SESSION'), false);
        } else {
          // INVESTIGATE IF THIS LINE COULD REPLACE THE THREE ABOVE
          // handshakeData.session = userSession;
          handshakeData.sessionID = sessionID;
          handshakeData.sessionStore = sessionStore;
          handshakeData.session = new session.Session(handshakeData, userSession);
          return next(null, true);
        }
      });
    } else {
      return next(new Error('COOKIES_NOT_FOUND'), false);
    }
  });


  io.on('connection', function(socket) {
    var session = socket.request.session,
        accountId = session.accountId,
        sAccount = null;

    console.log('New socket on connection...');

    // Join a room with the same name as the accountId
    socket.join(accountId);

    var handleContactEvent = function(eventMessage) {
      socket.emit('contactEvent', eventMessage);
    };

    var suscribeToAccount = function(accountId) {
      var eventName = 'event:' + accountId;

      eventDispatcher.on(eventName, handleContactEvent);
      console.log('Subscribing to %s', eventName);
    };

    Account.findById(accountId, function(err, account) {
      var suscribedAccounts = {};

      sAccount = account;

      // suscribe to my contacts updates
      account.contacts.forEach(function(contact) {
        if (!suscribedAccounts[contact.accountId]) {
          suscribeToAccount(contact.accountId);
          suscribedAccounts[contact.accountId] = true;
        }
      });

      // suscribe to my own updates
      if (!suscribedAccounts[accountId]) {
        suscribeToAccount(accountId);
      }
    });

    socket.on('disconnect', function() {
      if (sAccount) {
        // Unsuscribing contacts listeners
        sAccount.contacts.forEach(function(contact) {
          var eventName = 'event:' + contact.accountId;

          eventDispatcher.removeListener(eventName, handleContactEvent);
          console.log('Unsuscribing from %s', eventName);
        });

        // Unsuscribing my own listener
        eventDispatcher.removeListener('event:' + accountId, handleContactEvent);
        console.log('Unsuscribing from %s [myself]', 'event:' + accountId);

        eventDispatcher.emit('event:' + accountId, {
          from: accountId,
          action: 'logout'
        });
      }
    });

    socket.on('chatClient', function(data) {
      // Send to every socket in "data.to" room
      io.in(data.to).emit('chatServer', {
        from: accountId,
        text: data.text
      });
    });

    // notify user is connected
    eventDispatcher.emit('event:' + accountId, {
      from: accountId,
      action: 'login'
    });
  });
};
