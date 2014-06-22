
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      StatusCollection = require('../collections/Status');

  Backbone.$ = $;

  var Account = Backbone.Model.extend({
    urlRoot: '/accounts',
    initialize: function() {
      var status = new StatusCollection(),
          activity = new StatusCollection();

      status.url = '/accounts/' + this.id + '/status';
      activity.url = '/accounts/' + this.id + '/activity';

      this.set('status', status);
      this.set('activity', activity);
    },
    // override default parse method for recreate collection on fetch
    parse: function(response, options) {
      response.status = this.get('status').reset(response.status);
      response.activity = this.get('status').reset(response.activity);
      return response;
    }
  });

  module.exports = Account;
})();
