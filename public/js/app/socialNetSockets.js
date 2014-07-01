
(function(){
  'use strict';

  var io = require('socket.io-client'),
      socketEventDispatcher = require('./socketEvents'),
      ContactCollection = require('./collections/Contact'),
      ChatView = require('./views/Chat');

  var socialNetSockets = function() {
    var accountId = null,
        socket = null;

    var sendChat = function(payload) {
      if (null != socket) {
        socket.emit('chatClient', payload);
      }
    };

    var handleContactEvent = function(eventObj) {
      var eventName = eventObj.action + ':' + eventObj.from;

      socketEventDispatcher.trigger(eventName, eventObj);

      if ( eventObj.from === accountId ) {
        eventName = eventObj.action + ':me';
        socketEventDispatcher.trigger(eventName, eventObj);
      }
    };

    var connectSocket = function(socketAccountId) {
      accountId = socketAccountId;
      socket = io(); // if no-url is passed defaults to same host at '/'

      socket
        .on('error', function(error) {
          console.error('Unable to connect: ', error);
        })
        .on('connect', function() {
          console.info('Connected socket');
          socketEventDispatcher.on('socket:chat', sendChat);

          socket.on('chatServer', function(data) {
            socketEventDispatcher.trigger('socket:chat:start:' + data.from);
            socketEventDispatcher.trigger('socket:chat:in:' + data.from, data);
          });

          socket.on('contactEvent', handleContactEvent);

          /**
          *
          * INIT CHAT VIEW
          *
          **/

          var contactsCollection = new ContactCollection();

          contactsCollection.url = '/accounts/me/contacts';

          new ChatView({
            collection: contactsCollection
          }).render();

          contactsCollection.fetch({ reset: true });
        });
    };

    socketEventDispatcher.on('app:loggedin', connectSocket);
  };

  exports.initialize = function() {
    socialNetSockets();
  };
})();
