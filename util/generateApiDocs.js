(() => {
  var child_process, execSync;

  child_process = require('child_process');

  execSync = child_process.execSync;

  execSync('coffee -o .tmp -c spec/*.coffee');

  execSync("docha -p '.tmp/elementHelper.spec.js' -o 'docs/elementHelper.md' -e _");

  execSync("docha -p '.tmp/generalStepDefs.spec.js' -o 'docs/generalStepDefs.md' -e _");

  execSync("docha -p '.tmp/transform.spec.js' -o 'docs/transform.md' -e _");

})();
