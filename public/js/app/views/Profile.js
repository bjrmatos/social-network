
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
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
    render: function() {
      var self = this;

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
        self.prependStatus(new Status({ status: statusText }));
      });
    }
  });

  module.exports = ProfileView;
})();
