path = require 'path'
express = require 'express'
child_process = require 'child_process'

execSync = child_process.execSync
spawn = child_process.spawn

app = express()
app.set 'port', 9001

app.use express.static(path.join(__dirname, '..', 'spec/test_app'))
app.use express.static(path.join(__dirname, '..', '/node_modules/js-fixtures'))

server = app.listen app.get('port'), ->
  console.log "Test app is running on port: #{app.get('port')}"

  wdUpdate = spawn 'webdriver-manager', ['update']

  wdUpdate.stdout.on 'data', (data) ->
    process.stdout.write data

  wdUpdate.stderr.on 'data', (data) ->
    process.stdout.write data

  wdUpdate.on 'close', (code) ->
    protractor = spawn 'protractor', [path.join(__dirname, '..', 'spec/conf/protractor.spec.conf.coffee')]

    protractor.stdout.on 'data', (data) ->
      process.stdout.write data

    protractor.stderr.on 'data', (data) ->
      process.stdout.write data

    protractor.on 'close', (code) ->
      process.exit code
