var config;

config = require('../../lib/protractor.conf.js').config;

config.capabilities = {
  browserName: 'chrome'
};

config.framework = 'mocha';

config.specs = '../**/*.spec.js';

config.allScriptsTimeout = 20000;

exports.config = config;
