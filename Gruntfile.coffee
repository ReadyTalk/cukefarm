module.exports = (grunt) ->

  require('time-grunt') grunt
  require('jit-grunt') grunt,
    protractor: 'grunt-protractor-runner'
    connect: 'grunt-contrib-connect'

  grunt.initConfig
    coffeelint:
      options:
        configFile: 'coffeelint.json'
      all: [
        'Gruntfile.coffee'
        'lib/**/*.coffee'
      ]

    protractor:
      options:
        configFile: "./spec/conf/protractor.spec.conf.coffee"

      chrome:
        options:
          args:
            browser: 'chrome'

      firefox:
        options:
          args:
            browser: 'firefox'

    shell:
      webdriverManagerUpdate:
        command: "node_modules/grunt-protractor-runner/node_modules/.bin/webdriver-manager update"

    connect:
      server:
        options:
          port: 9001,
          base: 'spec/test_app'

    requirejs:
      compile:
        options:
          baseUrl: "spec/test_app/scripts"
          mainConfigFile: "spec/test_app/scripts/app.js"
          include: ["app"]
          out: "spec/test_app/scripts/main.js"

  grunt.registerTask 'lint', ['coffeelint']

  grunt.registerTask 'test', (target) ->
    return grunt.task.run [
      'requirejs:compile'
      'shell:webdriverManagerUpdate'
      'connect:server'
      "protractor:#{target}"
    ]

  grunt.registerTask 'ci', (target) ->
    return grunt.task.run [
      'lint'
      "test:#{target}"
    ]

  grunt.registerTask 'default', ['ci:firefox']
