// Require dependencies
global.Cucumber = require('cucumber');
global.sinon = require('sinon');
var Promise = require('q');
global.sinonAsPromised = require('sinon-as-promised')(Promise);
global.path = require('path');

global.chai = require('chai');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
global.expect = chai.expect;

// Init Cucumber infrastructure
Cucumber.supportCodeLibraryBuilder.reset(process.cwd());
global.supportCodeLibrary = Cucumber.supportCodeLibraryBuilder.finalize()

// Set up supportCodeLibrary
require('../../../lib/step_definitions/GeneralStepDefs');
require('../../../lib/support/Transform');
require('../../../lib/support/World');

global.TestCaseRunner = require('../../../node_modules/cucumber/lib/runtime/test_case_runner');
global.testCaseRunner = new TestCaseRunner.default({
  eventBroadcaster: {},
  skip: false,
  testCase: {
    uri: "fakeUri",
    pickle: {
      locations: [
        { line: "fakeLine" }
      ]
    }
  },
  supportCodeLibrary: supportCodeLibrary,
  worldParameters: {}
});
global.world = testCaseRunner.world;

// Init helper functions
global.currentStepResult = null;
global.runtime = null;
global.sandbox = sinon.sandbox.create();
global.stepPattern = '';

global.lookupStepDefinition = function(stepName) {
  var stepDefinitions = supportCodeLibrary.stepDefinitions.filter((stepDefinition) => {
    return stepDefinition.matchesStepName({
      stepName: stepName,
      parameterTypeRegistry: supportCodeLibrary.parameterTypeRegistry
    })
  });

  expect(stepDefinitions.length).to.equal(1, 'Could not find Step Definition for step: ' + stepName);
  return(stepDefinitions[0]);
};

global.executeStep = (stepName, verification, keyword) => {
  keyword = keyword || 'Given';
  verification = verification || function() {};

  return testCaseRunner.runStep({
    arguments: [],
    text: stepName
  }).then(function(stepResult) {
    console.log(stepResult);
    currentStepResult = stepResult;
    return verification();
  });
};

global.verifyStepMatch = function(stepName, pattern) {
  var stepDef;
  if (pattern == null) {
    pattern = stepPattern;
  }

  stepDef = lookupStepDefinition(stepName);
  expect(stepDef).to.exist;
  expect(stepDef.pattern.toString()).to.equal(pattern);
};

global.verifyStepCaptures = function() {
  var stepName = arguments[0];
  var args = [].slice.call(arguments, 1);

  var stepDef = lookupStepDefinition(stepName);
  var regexp = stepDef.getCucumberExpression(supportCodeLibrary.parameterTypeRegistry)._treeRegexp._re;

  args.forEach(function(arg) {
    expect(regexp.exec(stepName)).to.contain(arg);
  })
};

global.verifyStepDoesNotCapture = function() {
  var stepName = arguments[0];
  var args = [].slice.call(arguments, 1);

  var stepDef = lookupStepDefinition(stepName);
  var regexp = stepDef.getCucumberExpression(supportCodeLibrary.parameterTypeRegistry)._treeRegexp._re;

  args.forEach(function(arg) {
    expect(regexp.exec(stepName)).to.not.contain(arg);
  })
};
