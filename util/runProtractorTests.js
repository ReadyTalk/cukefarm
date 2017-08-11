var path = require('path');
var express = require('express');
var child_process = require('child_process');
var execSync = child_process.execSync;
var spawn = child_process.spawn;
var app = express();

app.set('port', 9001);
app.use(express["static"](path.join(__dirname, '..', '/spec/test_app')));

var server = app.listen(app.get('port'), function() {

  var wdUpdate;
  console.log("Test app is running on port: " + (app.get('port')));
  wdUpdate = spawn('webdriver-manager', ['update']);

  wdUpdate.stdout.on('data', function(data) {
    return process.stdout.write(data);
  });

  wdUpdate.stderr.on('data', function(data) {
    return process.stdout.write(data);
  });

  return wdUpdate.on('close', function(code) {
    var protractor;
    protractor = spawn('protractor', [path.join(__dirname, '..', 'spec/conf/protractor.spec.conf.js')]);

    protractor.stdout.on('data', function(data) {
      return process.stdout.write(data);
    });

    protractor.stderr.on('data', function(data) {
      return process.stdout.write(data);
    });

    return protractor.on('close', function(code) {
      return process.exit(code);
    });
  });
});
