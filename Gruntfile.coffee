module.exports = (grunt) ->

  require('time-grunt') grunt
  require('jit-grunt') grunt,
    protractor: 'grunt-protractor3-runner'
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
        webdriverManagerUpdate: true
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
      generateApiDocs:
        command: [
          "docha -p '.tmp/elementHelper.spec.js' -o 'docs/elementHelper.md' -e _"
          "docha -p '.tmp/generalStepDefs.spec.js' -o 'docs/generalStepDefs.md' -e _"
          "docha -p '.tmp/transform.spec.js' -o 'docs/transform.md' -e _"
        ].join '&'

    express:
      server:
        options:
          port: 9001,
          bases: ['spec/test_app', 'node_modules/js-fixtures']
          livereload: true

  grunt.registerTask 'lint', ['coffeelint']

  grunt.registerTask 'generateApiDocs', [
    'coffee:compileTests'
    'shell:generateApiDocs'
  ]

  grunt.registerTask 'test', (target = 'firefox') ->
    return grunt.task.run [
      'coffee:compile'
      'express:server'
      "protractor:#{target}"
    ]

  grunt.registerTask 'ci', (target = 'firefox') ->
    return grunt.task.run [
      'lint'
      "test:#{target}"
      'generateApiDocs'
    ]

  grunt.registerTask 'default', ['ci:firefox']
