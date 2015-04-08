path = require 'path'
rek = require 'rekuire'

module.exports.config =
  framework: 'cucumber'

  # Capabilities to be passed to the webdriver instance.
  capabilities:
    'chromeOptions':
      args: ['--test-type']   # Disable the "unsupported flag" prompt. See: https://github.com/angular/protractor/issues/835

  cucumberOpts:
    require: [rek.path 'GeneralStepDefs']
    tags: []
    format: 'pretty'

  onPrepare: ->
    # Support a non-angular site
    browser.ignoreSynchronization = true
    browser.manage().timeouts().setScriptTimeout 5000
    browser.manage().timeouts().implicitlyWait 5000
