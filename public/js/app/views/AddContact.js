
(function(){
  'use strict';

  var $ = require('jquery'),
      _ = require('underscore'),
      Contact = require('../models/Contact'),
      SocialNetView = require('./SocialNet'),
      ContactView = require('./Contact'),
      template = require('../templates/addcontact.hbs');

  var AddContactView = SocialNetView.extend({
    el: $('#content'),
    template: template,
    events: {
      'submit form': 'search'
    },
    search: function(event) {
      event.preventDefault();

      $.ajax('/contacts/find', {
        type: 'POST',
        data: this.$('form').serialize(),
        context: this
      })
      .done(function(data) {
        this.render(data);
      })
      .fail(function() {
        this.$results.text('No contacts found.');
        this.$results.slideDown();
      });
    },
    // addContact: function(contact) {

    // },
    // addContacts: function() {

    // },
    render: function(resultList) {
      this.$el.html(this.template());
      this.$results = this.$('#results'); // cache jquery object
      this.removeSubViews();

      if (null != resultList) {
        _.each(resultList, function(contactJson) {
          var contactModel = new Contact(contactJson);

          var contactView = new ContactView({
            addButton: true,
            model: contactModel
          });

          this.addSubView(contactView);
          this.$results.append(contactView.render().el);
        }, this);
      }
    }
  });

  module.exports = AddContactView;
})();
