var config;

config = require('../../lib/protractor.conf.js');

config.capabilities = {
  browserName: 'chrome'
};

config.framework = 'mocha';

config.mochaOpts = {
  timeout: 6000
}

config.specs = [
  '../generalStepDefs/support/initGlobals.js',
  '../**/*.spec.js'
];

config.allScriptsTimeout = 20000;

config.onPrepare = function() {
  browser.manage().timeouts().setScriptTimeout(5000);
  return browser.manage().timeouts().implicitlyWait(5000);
}

exports.config = config;
