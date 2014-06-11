
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      template = require('../templates/login.hbs');

  Backbone.$ = $;

  var LoginView = Backbone.View.extend({
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
        }
      })
      .done(function(data) {
        console.log('Login: ', data);
      })
      .fail(function() {
        this.$('#error').text('Unable to login.');
        this.$('#error').slideDown();
      });
    },
    render: function() {
      this.$el.html(this.template());
      this.$('#error').hide();
    }
  });

  module.exports = LoginView;
})();
