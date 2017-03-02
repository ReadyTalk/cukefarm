var config;

config = require('../../lib/protractor.conf.js').config;

config.capabilities = {
  browserName: 'chrome'
};

config.framework = 'mocha';

config.specs = [
  '../generalStepDefs/initGlobals.js',
  '../**/*.spec.js'
];

config.allScriptsTimeout = 20000;

config.directConnect = true;

exports.config = config;
