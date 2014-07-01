
(function(){
  'use strict';

  var $ = require('jquery'),
    Backbone = require('backbone'),
    socketEventDispatcher = require('../socketEvents'),
    Status = require('../models/Status'),
    SocialNetView = require('./SocialNet'),
    StatusView = require('./Status'),
    template = require('../templates/index.hbs');

  Backbone.$ = $;

  var IndexView = SocialNetView.extend({
    el: $('#content'),
    template: template,
    events: {
      'submit form': 'updateStatus'
    },
    initialize: function() {
      this.listenTo(socketEventDispatcher, 'status:me', this.onSocketStatusAdded);
      this.listenTo(this.collection, 'add', this.onStatusAdded);
      this.listenTo(this.collection, 'reset', this.onStatusCollectionReset);
    },
    onStatusCollectionReset: function(collection) {
      var self = this;

      collection.each(function(model) {
        self.onStatusAdded(model);
      });
    },
    onSocketStatusAdded: function(data) {
      var newStatus = data.data,
          found = false;

      this.collection.forEach(function(status) {
        var name = status.get('name');

        if (name && name.full === newStatus.name.full &&
          status.get('status') === newStatus.status) {
          found = true;
        }
      });

      if (!found) {
        this.collection.add(new Status({
          status: newStatus.status,
          name: newStatus.name
        }));
      }
    },
    onStatusAdded: function(status) {
      var statusHtml = (new StatusView({ model: status })).render().el;
      $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
    },
    updateStatus: function(event) {
      event.preventDefault();

      var statusText = this.$('input[name=status]').val(),
          statusCollection = this.collection;

      $.ajax('/accounts/me/status', {
        type: 'POST',
        data: {
          status: statusText
        }
      })
      .done(function(data) {
        // No longer adding to screen, because is handled by socket.io event
        // statusCollection.add(new Status({ status: statusText }));
      });

      this.$('input[name=status]').val('');
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  module.exports = IndexView;
})();
