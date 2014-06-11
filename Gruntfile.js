'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // options for all tasks
  var Options = function() {
    this.config = {
      src: 'config-grunt/*.js' // set folder for configuration tasks
    };

    this.domain = 'http://localhost:3000';

    this.paths = {
      // file to track for server reboot on nodemon restart
      rebootedFile: '.rebooted',
      tmp: '.tmp',
      tmpCss: '.tmp/css',
      tmpJs: '.tmp/js',
      img: 'public/images',
      css: 'public/css',
      cssLib: 'public/css/lib',
      cssSource: 'public/css/src',
      js: 'public/js',
      jsLib: 'public/js/lib',
      jsSource: 'public/js/app',
      less: 'public/less',
      views: 'views'
    };

    this.paths.publicImages = this.domain + '/images';
  };

  // loads the various task configuration files
  var configs = require('load-grunt-configs')(grunt, new Options());
  grunt.initConfig(configs);

  grunt.registerTask('build', [
    // 'bowercopy',
    // 'notify:bowercopy',
    'browserify:dev',
    'notify:browserify',
    'notify:build'
  ]);

  grunt.registerTask('launch', ['wait', 'open', 'notify:open']);

  grunt.registerTask('default', [
    'build',
    'launch'
  ]);
};
