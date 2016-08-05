child_process = require 'child_process'
execSync = child_process.execSync

execSync 'coffee -o lib -c src'
