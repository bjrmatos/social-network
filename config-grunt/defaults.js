'use strict';

module.exports = function(grunt, options) {
  return {
    tasks: {
      pkg: grunt.file.readJSON('package.json')
    }
  };
};
