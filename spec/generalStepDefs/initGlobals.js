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

// Set up supportCodeLibrary
require('../../lib/step_definitions/GeneralStepDefs');
require('../../lib/support/Transform');
require('../../lib/support/World');

// Init Cucumber infrastructure
global.supportCodeLibrary = Cucumber.SupportCodeLibraryBuilder.build({
  cwd: process.cwd(),
  fns: Cucumber.getSupportCodeFns()
});

global.ScenarioRunner = require('../../node_modules/cucumber/lib/runtime/scenario_runner');
global.scenarioRunner = new ScenarioRunner.default({
  eventBroadcaster: {},
  options: {},
  scenario: {},
  supportCodeLibrary: supportCodeLibrary
});
global.world = scenarioRunner.world;

// Init helper functions
global.currentStepResult = null;
global.runtime = null;
global.sandbox = sinon.sandbox.create();
global.stepPattern = '';

global.lookupStepDefinition = function(stepName) {
  var stepDefinitions = supportCodeLibrary.stepDefinitions.filter((stepDefinition) => {
    return stepDefinition.matchesStepName({
      stepName: stepName,
      transformLookup: supportCodeLibrary.transformLookup
    })
  });

  expect(stepDefinitions.length).to.equal(1, 'Could not find Step Definition for step: ' + stepName);
  return(stepDefinitions[0]);
};

global.executeStep = (stepName, verification, keyword) => {
  keyword = keyword || 'Given';
  verification = verification || function() {};

  return scenarioRunner.runStep({
    arguments: [],
    name: stepName
  }).then(function(stepResult) {
    currentStepResult = stepResult;
    verification();
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
  var regexp = stepDef.getCucumberExpression(supportCodeLibrary.transformLookup)._regexp;

  args.forEach(function(arg) {
    expect(regexp.exec(stepName)).to.contain(arg);
  })
};

global.verifyStepDoesNotCapture = function() {
  var stepName = arguments[0];
  var args = [].slice.call(arguments, 1);

  var stepDef = lookupStepDefinition(stepName);
  var regexp = stepDef.getCucumberExpression(supportCodeLibrary.transformLookup)._regexp;

  args.forEach(function(arg) {
    expect(regexp.exec(stepName)).to.not.contain(arg);
  })
};
