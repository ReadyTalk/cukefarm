chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'

chai.use chaiAsPromised
expect = chai.expect

ElementHelper = require '../lib/support/ElementHelper.js'
{World} = require '../lib/support/World.js'

describe 'elementHelper', ->

  elementHelper = new ElementHelper()

  before ->
    browser.get 'http://localhost:9001/'
    browser.manage().timeouts().implicitlyWait 100

  it 'should exist on the World', ->
    world = new World(->)
    expect(world.elementHelper).to.be.an.instanceOf ElementHelper

  describe 'hasClass()', ->

    afterEach ->
      browser.driver.switchTo().defaultContent()
      browser.driver.executeScript "fixtures.cleanUp();"

    it 'should return true if the element has the given class', ->
      browser.driver.executeScript "fixtures.set('<input id=\"testCheckbox\" class=\"test-class\"/>');"
      browser.driver.switchTo().frame('js-fixtures')
      el = $ 'input#testCheckbox'
      expect(elementHelper.hasClass(el, 'test-class')).to.eventually.equal true

    it 'should return false if the element does not have the given class', ->
      browser.driver.executeScript "fixtures.set('<input id=\"testCheckbox\" class=\"test-class\"/>');"
      browser.driver.switchTo().frame('js-fixtures')
      el = $ 'input#testCheckbox'
      expect(elementHelper.hasClass(el, 'fake-class')).to.eventually.equal false

    it 'should return false if the element has no class', ->
      browser.driver.executeScript "fixtures.set('<input id=\"testCheckbox\"/>');"
      browser.driver.switchTo().frame('js-fixtures')
      el = $ 'input#testCheckbox'
      expect(elementHelper.hasClass(el, 'missing-class')).to.eventually.equal false
