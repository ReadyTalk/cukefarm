var chai = require('chai');
var expect = chai.expect;
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var ElementHelper = require('../lib/support/ElementHelper');
var World = require('../lib/support/World');

describe('elementHelper', function() {
  var elementHelper = new ElementHelper();

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  it('should exist on the World', function() {
    var world;
    world = new World(function() {});
    expect(world.elementHelper).to.be.an.instanceOf(ElementHelper);
  });

  describe('hasClass()', function() {
    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove();");
    });

    it('should return true if the element has the given class', function() {
      var el;
      browser.driver.executeScript("$('body').append('<input id=\"testCheckbox\" class=\"test-class\"/>')");
      el = $('input#testCheckbox');
      expect(elementHelper.hasClass(el, 'test-class')).to.eventually.equal(true);
    });

    it('should return false if the element does not have the given class', function() {
      var el;
      browser.driver.executeScript("$('body').append('<input id=\"testCheckbox\" class=\"test-class\"/>')");
      el = $('input#testCheckbox');
      expect(elementHelper.hasClass(el, 'fake-class')).to.eventually.equal(false);
    });

    it('should return false if the element has no class', function() {
      var el;
      browser.driver.executeScript("$('body').append('<input id=\"testCheckbox\"/>')");
      el = $('input#testCheckbox');
      expect(elementHelper.hasClass(el, 'missing-class')).to.eventually.equal(false);
    });
  });
});
