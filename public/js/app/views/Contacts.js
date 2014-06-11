/* jshint camelcase: false */

/**

  TODO:
  - Create a ContactsContainerView and put the contacts template
  and call ContactView from there

**/

(function(){
  'use strict';

  var $ = require('jquery'),
      SocialNetView = require('./SocialNet'),
      ContactView = require('./Contact'),
      template = require('../templates/contacts.hbs');

  var ContactsView = SocialNetView.extend({
    el: $('#content'),
    template: template,
    initialize: function() {
      this.listenTo(this.collection, 'add', this.addContact);
      this.listenTo(this.collection, 'reset', this.addContacts);
    },
    addContact: function(contact) {
      var contactView = new ContactView({
        removeButton: true,
        model: contact
      });

      // add new view
      this.addSubView(contactView);
      this.$('.contacts_list').append(contactView.render().el);
    },
    addContacts: function() {
      // clean previous views
      this.removeSubViews();
      this.collection.forEach(this.addContact, this);
    },
    render: function() {
      this.$el.html(this.template());
      this.addContacts();
    }
  });

  module.exports = ContactsView;
})();
