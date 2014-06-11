
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      SocialNetView = require('./SocialNet'),
      StatusView = require('/.Status'),
      template = require('../templates/profile.hbs');

  Backbone.$ = $;

  var ProfileView = SocialNetView.extend({
    el: $('#content'),
    template: template,
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));

      var statusCollection = this.model.get('status');

      if (null != statusCollection) {
        // _.each(statusCollection, function(statusJson) {
        //   var statusModel = new Status(statusJson),
        //       statusHtml = (new StatusView({ model: statusModel })).render().el);

        //   $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
        // });
        statusCollection.each(function(statusModel) {
          var statusHtml = (new StatusView({ model: statusModel })).render().el;

          $(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
        });
      }
    }
  });

  module.exports = ProfileView;
})();
