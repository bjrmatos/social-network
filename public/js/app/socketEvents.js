
(function(){
  'use strict';

  var _ = require('underscore'),
      Backbone = require('backbone');

  /**
  *
  * Global event dispatcher for socket events
  *
  **/

  module.exports = _.extend({}, Backbone.Events);
})();
