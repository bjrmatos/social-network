
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      template = require('../templates/register.hbs');

  Backbone.$ = $;

  var RegisterView = Backbone.View.extend({
    el: $('#content'),
    template: template,
    events: {
      'submit form': 'register'
    },
    register: function(event) {
      $.ajax('/register', {
        type: 'POST',
        data: {
          firstName: this.$('input[name=firstName]').val(),
          lastName: this.$('input[name=lastName]').val(),
          email: this.$('input[name=email]').val(),
          password: this.$('input[name=password]').val()
        }
      })
      .done(function(data) {
        console.log('Register POST: ', data);
      })
      .fail(function() {
        console.log('Register FAIL!');
      });

      event.preventDefault();
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  module.exports = RegisterView;
})();
