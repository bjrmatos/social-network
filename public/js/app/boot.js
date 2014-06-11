
(function(){
  'use strict';

  var $ = require('jquery'),
    SocialNet = require('./SocialNet');

  // initialize when DOM is totally ready
  $(function(){
    // Initialize router
    SocialNet.init();
    // Run application -> Backbone.history.start()
    SocialNet.run();
  });
})();
