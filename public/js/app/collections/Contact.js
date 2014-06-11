
(function(){
  'use strict';

  var $ = require('jquery'),
      Backbone = require('backbone'),
      Contact = require('../models/Contact');

  Backbone.$ = $;

  var ContactCollection = Backbone.Collection.extend({
    model: Contact
  });

  module.exports = ContactCollection;
})();
