'use strict';

module.exports = function(grunt, options) {
  return {
    tasks: {

      /*==========  NOTIFY  ==========*/
      // See https://github.com/dylang/grunt-notify/
      // for Notification Systems for every platform
      'notify:open': {
        options: {
          title: 'OPEN PAGE',
          message: 'Open browser in: <%= domain %>'
        }
      },

      'notify:bowercopy': {
        options: {
          title: 'BOWERCOPY - FINISHED',
          message: 'Task: bowercopy is finish.'
        }
      },

      'notify:browserify': {
        options: {
          title: 'BROWSERIFY BUILD',
          message: 'Browserify bundle finish with no error.'
        }
      },

      'notify:build': {
        options: {
          title: 'BUILD - SUCCESS',
          message: 'Build is finish with no error.'
        }
      }
    }
  };
};
