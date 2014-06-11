'use strict';

module.exports = function(grunt, options) {
  return {
    tasks: {

      /*==========  LAUNCH - TASKS  ==========*/
      wait: {
        // wait some seconds before start another task
        options: {
          delay: 1000
        },
        pause: {
          options: {
            before: function(options) {
              console.log('pausing %dms before launching page', options.delay);
            },
            after: function() {
              console.log('pause end, heading to page (using default browser)');
            }
          }
        }
      },

      'open:server': {
        // open default browser in the url specified
        path: options.domain
      }
    }
  };
};
