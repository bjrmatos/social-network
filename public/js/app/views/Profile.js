
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      socketEventDispatcher = require('../socketEvents'),
      Status = require('../models/Status'),
      SocialNetView = require('./SocialNet'),
      StatusView = require('./Status'),
      profileTemplate = require('../templates/profile.hbs');

  Backbone.$ = $;

  var ProfileView = SocialNetView.extend({
    el: $('#content'),
    template: profileTemplate,
    events: {
      'submit form': 'postStatus'
    },
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
    onSocketStatusAdded: function(data) {
      var newStatus = data.data;

      this.prependStatus(new Status({
        status: newStatus.status,
        name: newStatus.name
      }));
    },
    prependStatus: function(statusModel) {
      var statusHtml = (new StatusView({ model: statusModel })).render().el;

      this.$('.status_list')
        .prepend(statusHtml)
        .hide()
        .fadeIn('slow');
    },
    postStatus: function(event) {
      event.preventDefault();

      var self = this,
          statusText = this.$('input[name=status]').val();

      $.ajax('/accounts/' + this.model.get('_id') + '/status', {
        type: 'POST',
        data: {
          status: statusText
        }
      })
      .done(function(data) {
        // No longer adding to screen, because is handled by socket.io event
        // self.prependStatus(new Status({ status: statusText }));
      });
    },
    render: function() {
      var self = this;

      if (this.model.get('_id')) {
        this.listenTo(
          socketEventDispatcher,
          'status:' + this.model.get('_id'),
          this.onSocketStatusAdded
        );

        this.prevModelId = this.model.get('_id');
      } else {
        if (this.prevModelId) {
          this.stopListening(
            socketEventDispatcher,
            'status:' + this.prevModelId
          );

          this.prevModelId = null;
        }
      }

      this.$el.html(this.template(this.model.toJSON()));

      var statusCollection = this.model.get('status');

      if (null != statusCollection) {
        // _.each(statusCollection, function(statusJson) {
        //   var statusModel = new Status(statusJson),
        //       statusHtml = (new StatusView({ model: statusModel })).render().el);

        //   $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
        // });
        statusCollection.forEach(function(statusModel) {
          self.prependStatus(statusModel);
        });
      }
    }
  });

  module.exports = ProfileView;
})();
