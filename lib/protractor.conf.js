var path = require('path');

module.exports = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    'chromeOptions': {
      args: ['--test-type']
    }
  },
  cucumberOpts: {
    require: [
      path.resolve('./node_modules/cukefarm/lib/step_definitions/GeneralStepDefs'),
      path.resolve('./node_modules/cukefarm/lib/support/Transform'),
      path.resolve('./node_modules/cukefarm/lib/support/World')
    ],
    format: 'pretty'
  },
  onPrepare: function() {
    browser.ignoreSynchronization = true;
    browser.manage().timeouts().setScriptTimeout(5000);
    return browser.manage().timeouts().implicitlyWait(5000);
  }
};
