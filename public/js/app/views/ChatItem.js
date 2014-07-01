
(function(){
  'use strict';

  var socketEventDispatcher = require('../socketEvents'),
      SocialNetView = require('./SocialNet'),
      template = require('../templates/chatitem.hbs');

  var ChatItemView = SocialNetView.extend({
    tagName: 'li',
    template: template,
    events: {
      'click': 'startChatSession'
    },
    initialize: function() {
      var accountId = this.model.get('accountId');

      this.listenTo(this.model, 'change:online', this.toogleOnlineState);

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

      this.listenTo(
        socketEventDispatcher,
        'socket:chat:start:' + accountId,
        this.startChatSession
      );
    },
    handleContactLogin: function() {
      this.model.set('online', true);
    },
    handleContactLogout: function() {
      this.model.set('online', false);
    },
    startChatSession: function() {
      this.trigger('chat:start', this.model);
    },
    toogleOnlineState: function(model, value) {
      var $onlineIndicator = this.$el.find('.online_indicator');
      $onlineIndicator.toggleClass('online', value);
    },
    render: function() {
      this.$el.html(this.template({ model: this.model.toJSON() }));
      this.toogleOnlineState(this.model, this.model.get('online'));
      return this;
    }
  });

  module.exports = ChatItemView;
})();
