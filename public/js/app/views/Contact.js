
(function(){
  'use strict';

  var $ = require('jquery'),
      SocialNetView = require('./SocialNet'),
      template = require('../templates/contact.hbs');

  var ContactView = SocialNetView.extend({
    tagName: 'li',
    template: template,
    addButton: false,
    removeButton: false,
    events: {
      'click .addbutton': 'addContact',
      'click .removeButton': 'removeContact'
    },
    initialize: function(options) {
      this.$responseArea = this.$('.actionArea');
      // set the addButton and removeButton variable in case
      // it has been added in the constructor
      if (options.addButton) {
        this.addButton = options.addButton;
      }

      if (options.removeButton) {
        this.removeButton = options.removeButton;
      }
    },
    addContact: function() {
      $.ajax('/accounts/me/contact', {
        type: 'POST',
        data: {
          contactId: this.model.get('_id')
        },
        context: this
      })
      .done(function() {
        this.$responseArea.text('Contact Added');
      })
      .fail(function() {
        this.$responseArea.text('Could not add contact');
      });
    },
    removeContact: function() {
      this.$responseArea.text('Removing contact...');

      $.ajax('/accounts/me/contact', {
        type: 'DELETE',
        data: {
          contactId: this.model.get('accountId')
        }
      })
      .done(function() {
        this.$responseArea.text('Contact Removed');
      })
      .fail(function() {
        this.$responseArea.text('Could not remove contact');
      });
    },
    render: function() {
      this.$el.html(this.template({
        model: this.model.toJSON(),
        addButton: this.addButton,
        removeButton: this.removeButton
      }));

      return this;
    }
  });

  module.exports = ContactView;
})();
