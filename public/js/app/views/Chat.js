
(function(){
  'use strict';

  var $ = require('jquery'),
      SocialNetView = require('./SocialNet'),
      ChatSessionView = require('./ChatSession'),
      ChatItemView = require('./ChatItem'),
      template = require('../templates/chat.hbs');

  var ChatView = SocialNetView.extend({
    el: $('#chat'),
    template: template,
    chatSessions: {},
    initialize: function() {
      this.listenTo(this.collection, 'reset', this.addContacts);
    },
    render: function() {
      this.$el.html(this.template());
      this.addContacts();
    },
    addContact: function(contact) {
      var chatItemView = new ChatItemView({
        model: contact
      });

      this.listenTo(chatItemView, 'chat:start', this.startChatSession);

      // add new view
      this.addSubView(chatItemView);
      this.$('.chat_list').append(chatItemView.render().el);
    },
    addContacts: function() {
      // clean previous views
      this.removeSubViews();
      this.collection.forEach(this.addContact, this);
    },
    startChatSession: function(model) {
      var accountId = model.get('accountId');

      // add new chat if is not ready initialize
      if (!this.chatSessions[accountId]) {
        var chatSessionView = new ChatSessionView({
          model: model
        });

        this.addSubView(chatSessionView);
        this.$el.prepend(chatSessionView.render().el);
        this.chatSessions[accountId] = chatSessionView;
      }
    }
  });

  module.exports = ChatView;
})();
