'use strict';

var nconf = require('nconf');

/**

  TODO:
  - Implement logic for handling enviroment configuration files

**/

nconf.argv()
    .env()
    .file({ file: './config/config.json' }); // path relative to process.cwd()

module.exports = nconf;
