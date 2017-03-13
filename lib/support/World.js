var {defineSupportCode} = require('cucumber');

defineSupportCode(function({setWorldConstructor}) {
  setWorldConstructor(World);
});

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var ElementHelper = require('./ElementHelper');
var Transform = require('./Transform');

// Ensure step defs are loaded into Cucumber
var GeneralStepDefs = require('../step_definitions/GeneralStepDefs');

function World() {
  this.Q = require('q');
  this.elementHelper = new ElementHelper();
  this.transform = new Transform();

  this.currentPage = null;

  chai.use(chaiAsPromised);
  this.expect = chai.expect;
};

module.exports = World;
