
(function(){
  'use strict';

  var $ = require('jquery'),
      socketEventDispatcher = require('../socketEvents'),
      SocialNetView = require('./SocialNet'),
      template = require('../templates/chatsession.hbs');

  var ChatSessionView = SocialNetView.extend({
    tagName: 'div',
    className: 'chat_session',
    template: template,
    events: {
      'submit form': 'sendChat'
    },
    initialize: function() {
      var accountId = this.model.get('accountId');

      this.listenTo(this.model, 'change:online', this.toogleOnlineState);

      this.listenTo(
        socketEventDispatcher,
        'socket:chat:in:' + this.model.get('accountId'),
        this.receiveChat
      );

      this.listenTo(
        socketEventDispatcher,
        'login:' + accountId,
        this.handleContactLogin
      );

      this.listenTo(
        socketEventDispatcher,
        'logout:' + accountId,
        this.handleContactLogout
      );
    },
    handleContactLogin: function() {
      this.model.set('online', true);
    },
    handleContactLogout: function() {
      this.model.set('online', false);
    },
    toogleOnlineState: function(model, value) {
      var $onlineIndicator = this.$el.find('.online_indicator');
      $onlineIndicator.toggleClass('online', value);
    },
    receiveChat: function(data) {
      var chatLine = this.model.get('name').first + ':' + data.text;
      this.$el.find('.chat_log').append($('<li></li>').text(chatLine));
    },
    sendChat: function(event) {
      event.preventDefault();

      var chatLine,
          chatText = this.$el.find('input[name=chat]').val();

      if (chatText && /[^\s]+/.test(chatText)) {
        chatLine = 'Me: ' + chatText;
        this.$el.find('.chat_log').append($('<li></li>').text(chatLine));

        socketEventDispatcher.trigger('socket:chat', {
          to: this.model.get('accountId'),
          text: chatText
        });

        this.$el.find('input[name=chat]').val('');
      }
    },
    render: function() {
      this.$el.html(this.template({ model: this.model.toJSON() }));
      this.toogleOnlineState(this.model, this.model.get('online'));
      return this;
    }
  });

  module.exports = ChatSessionView;
})();
