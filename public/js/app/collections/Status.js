
(function(){
  'use strict';

  var Backbone = require('backbone'),
      Status = require('../models/Status');

  var StatusCollection = Backbone.Collection.extend({
    model: Status
  });

  module.exports = StatusCollection;
})();
