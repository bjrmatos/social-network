'use strict';

module.exports = function(grunt, options) {
  return {
    tasks: {

      /*==========  BOWERCOPY  ==========*/
      'bowercopy:css': {
        options: {
          destPrefix: '<%= paths.cssLib %>'
        },
        files: {
          'normalize/normalize.css': 'normalize.css/normalize.css'
        }
      },

      'bowercopy:js': {
        options: {
          destPrefix: '<%= paths.jsLib %>'
        },
        files: {
          'underscore/underscore.js': 'underscore/underscore.js',
          'jquery': 'jquery/dist/jquery.*',
          'backbone/backbone.js': 'backbone/backbone.js'
        }
      },

      /*==========  BROWSERIFY  ==========*/
      'browserify:dev': {
        options: {
          bundleOptions: {
            debug: true // enable sourcemaps
          },
          watch: true,
          keepAlive: true, // remove when use grunt-contrib-watch
          transform: ['debowerify', 'hbsfy']
        },
        files: {
          '<%= paths.js %>/bundle.js': ['<%= paths.jsSource %>/boot.js']
        }
      },

      'browserify:production': {
        options: {
          transform: ['debowerify', 'hbsfy']
        },
        files: {
          '<%= paths.js %>/bundle.js': ['<%= paths.jsSource %>/boot.js']
        }
      }
    }
  };
};
