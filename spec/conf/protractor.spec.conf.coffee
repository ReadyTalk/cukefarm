config = require('../../lib/protractor.conf.coffee').config

config.framework = 'mocha'
config.specs = '../**/*.spec.coffee'
config.allScriptsTimeout = 20000

exports.config = config