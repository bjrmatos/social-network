
(function(){
  'use strict';

  var SocialNetView = require('./SocialNet'),
      template = require('../templates/status.hbs');

  var StatusView = SocialNetView.extend({
    tagName: 'li',
    template: template,
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    }
  });

  module.exports = StatusView;
})();
