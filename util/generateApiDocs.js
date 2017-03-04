var child_process = require('child_process');
var execSync = child_process.execSync;

execSync("docha -p 'lib/elementHelper.spec.js' -o 'docs/elementHelper.md' -e _");
execSync("docha -p 'lib/generalStepDefs.spec.js' -o 'docs/generalStepDefs.md' -e _");
execSync("docha -p 'lib/transform.spec.js' -o 'docs/transform.md' -e _");
