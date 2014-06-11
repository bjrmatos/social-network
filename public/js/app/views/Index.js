
(function(){
  'use strict';

  var $ = require('jquery'),
    Backbone = require('backbone'),
    // TODO: SOLVE THE RELATIVE PATH HELL... "../../../"
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
      this.listenTo(this.collection, 'add', this.onStatusAdded);
      this.listenTo(this.collection, 'reset', this.onStatusCollectionReset);
    },
    onStatusCollectionReset: function(collection) {
      var self = this;

      collection.each(function(model) {
        self.onStatusAdded(model);
      });
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
        statusCollection.add(new Status({ status: statusText }));
      });
    },
    render: function() {
      this.$el.html(this.template());
    }
  });

  module.exports = IndexView;
})();
