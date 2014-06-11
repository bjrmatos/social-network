
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      template = require('../templates/forgotPassword.hbs');

  Backbone.$ = $;

  var ForgotPasswordView = Backbone.View.extend({
    el: $('#content'),
    template: template,
    events: {
      'submit form': 'password'
    },
    password: function(event) {
      event.preventDefault();

      $.ajax('/forgotpassword', {
        type: 'POST',
        data: {
          email: this.$('input[name=email]').val()
        }
      }).done(function(data) {
        console.log('Forgot password: ', data);
      });
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  module.exports = ForgotPasswordView;
})();
