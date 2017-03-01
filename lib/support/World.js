var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then, setWorldConstructor}) {
  setWorldConstructor(World);
});

var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var ElementHelper = require('./ElementHelper.js');
var Transform = require('./Transform.js');

function World() {
  this.Q = require('q');
  this.elementHelper = new ElementHelper();
  this.transform = new Transform();

  this.currentPage = null;
  this.pageObjectMap = null;

  chai.use(chaiAsPromised);
  this.expect = chai.expect;
};

module.exports = World;
