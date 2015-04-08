module.exports = (grunt) ->

  require('time-grunt') grunt
  require('jit-grunt') grunt,
    protractor: 'grunt-protractor-runner'
    connect: 'grunt-contrib-connect'
    coffee: 'grunt-contrib-coffee'

  grunt.initConfig
    coffee:
      compile:
        expand: true,
        cwd: './src/',
        src: ['**/*.coffee'],
        dest: 'lib',
        ext: '.js'
        extDot: 'last'
      compileTests:
        expand: true,
        cwd: './spec/',
        src: ['*.coffee'],
        dest: '.tmp',
        ext: '.js'
        extDot: 'last'

    coffeelint:
      options:
        configFile: 'coffeelint.json'
      all: [
        'Gruntfile.coffee'
        'src/**/*.coffee'
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
      generateApiDocs:
        command: [
          "node_modules/docha/bin/docha -p '.tmp/elementHelper.spec.js' -o 'docs/elementHelper.md' -e _"
          "node_modules/docha/bin/docha -p '.tmp/generalStepDefs.spec.js' -o 'docs/generalStepDefs.md' -e _"
          "node_modules/docha/bin/docha -p '.tmp/transform.spec.js' -o 'docs/transform.md' -e _"
        ].join '&'

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

  grunt.registerTask 'generateApiDocs', [
    'coffee:compileTests'
    'shell:generateApiDocs'
  ]

  grunt.registerTask 'test', (target = 'firefox') ->
    return grunt.task.run [
      'coffee:compile'
      'requirejs:compile'
      'shell:webdriverManagerUpdate'
      'connect:server'
      "protractor:#{target}"
    ]

  grunt.registerTask 'ci', (target = 'firefox') ->
    return grunt.task.run [
      'lint'
      "test:#{target}"
      'generateApiDocs'
    ]

  grunt.registerTask 'default', ['ci:firefox']
