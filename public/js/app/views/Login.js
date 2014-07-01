
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      socketEventDispatcher = require('../socketEvents'),
      SocialNetView = require('./SocialNet'),
      template = require('../templates/login.hbs');

  Backbone.$ = $;

  var LoginView = SocialNetView.extend({
    requireLogin: false,
    el: $('#content'),
    template: template,
    events: {
      'submit form': 'login'
    },
    login: function(event) {
      event.preventDefault();

      $.ajax('/login', {
        type: 'POST',
        data: {
          email: this.$('input[name=email]').val(),
          password: this.$('input[name=password]').val()
        },
        context: this
      })
      .done(function(data) {
        console.log('Redirecting...');
        socketEventDispatcher.trigger('app:loggedin', data);

        Backbone.trigger('redirect', {
          url: 'index',
          trigger: true
        });
      })
      .fail(function() {
        this.$('#error').text('Email or password incorrect.');
        this.$('#error').slideDown();
      });
    },
    render: function() {
      this.$el.html(this.template());
      this.$('#error').hide();
      this.$('input[name=email]').focus();
    }
  });

  module.exports = LoginView;
})();
