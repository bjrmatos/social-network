
(function(){
  'use strict';

  var Backbone = require('backbone');

  var Status = Backbone.Model.extend({
    urlRoot: '/accounts/' + this.accountId + '/status'
  });

  module.exports = Status;
})();
