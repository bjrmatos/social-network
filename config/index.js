'use strict';

var nconf = require('nconf');

/**

  TODO:
  - Implement logic for handling enviroment configuration files

**/

nconf.argv()
    .env()
    .file({ file: './config/config.json' }) // path relative to process.cwd()
    .file('mail', { file: './config/mail.json' });

module.exports = nconf;
