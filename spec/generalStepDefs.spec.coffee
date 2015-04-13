rek = require 'rekuire'
Cucumber = require 'cucumber'
sinon = require 'sinon'
Promise = require 'q'
sinonAsPromised = require('sinon-as-promised')(Promise)
{expect} = require 'chai'

{World} = rek 'World'

describe 'General Step Defs', ->

  supportCodeFilePaths = [rek.path 'GeneralStepDefs']
  supportCodeLibrary = Cucumber.Cli.SupportCodeLoader(supportCodeFilePaths).getSupportCodeLibrary();
  ast_tree_walker = new Cucumber.Runtime.AstTreeWalker({}, supportCodeLibrary, {})

  scenario =
    getAttachments: ->
  ast_tree_walker.witnessNewScenario scenario

  stepPattern = ''

  executeStep = (name, callback = (->), keyword = 'Given') =>
    step = new Cucumber.Ast.Step(keyword, name, '', '')
    step.execute ast_tree_walker, callback

  verifyStepMatch = (name, pattern = stepPattern) ->
    stepDef = ast_tree_walker.lookupStepDefinitionByName name
    expect(stepDef).to.exist
    expect(stepDef.getPatternRegexp().toString()).to.equal pattern

  verifyStepCaptures = (stepName, args...) ->
    stepDef = ast_tree_walker.lookupStepDefinitionByName stepName
    expect(stepDef.getPatternRegexp().exec stepName).to.contain arg for arg in args

  verifyStepDoesNotCapture = (stepName, args...) ->
    stepDef = ast_tree_walker.lookupStepDefinitionByName stepName
    expect(stepDef.getPatternRegexp().exec stepName).to.not.contain arg for arg in args

  before ->
    browser.get 'http://localhost:9001/'
    browser.manage().timeouts().implicitlyWait 100

  describe '___ (covered by ___)', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^.*\\(covered by .*\\)$/'

      it 'should match "I am on the Moon (covered by MoonUnit)"', ->
        verifyStepMatch 'I am on the Moon (covered by MoonUnit)'

  describe 'I am on the "___" page', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I (?:am on|go to) the "([^"]*)" page$/'

      it 'should match "I am on..."', ->
        verifyStepMatch 'I am on the "Test" page'

      it 'should match "I go to..."', ->
        verifyStepMatch 'I go to the "Test" page'

      it 'should not capture "am on"', ->
        verifyStepDoesNotCapture 'I am on the "Test" page', 'am on'

      it 'should capture the page name', ->
        verifyStepCaptures 'I go to the "Test" page', 'Test'

    describe 'execution', ->

      stubPage = {}
      world = {}

      beforeEach ->
        stubPage =
          get: sinon.stub().resolves()

        world =
          pageObjectMap:
            Test: ->
              stubPage
        ast_tree_walker.setWorld world

      it 'should set the currentPage on the World', ->
        executeStep 'I am on the "Test" page'
        expect(world.currentPage).to.equal stubPage

      it 'should call get on the page', ->
        executeStep 'I am on the "Test" page'
        expect(stubPage.get.calledOnce).to.equal true

  describe 'I have a ___x___ screen size', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I (?:have|change to|resize to|rotate to) a (\\d+)x(\\d+) screen size$/'

      it 'should match "I have..."', ->
        verifyStepMatch 'I have a 800x600 screen size'

      it 'should match "I change to..."', ->
        verifyStepMatch 'I change to a 800x600 screen size'

      it 'should match "I resize to..."', ->
        verifyStepMatch 'I resize to a 800x600 screen size'

      it 'should match "I rotate to..."', ->
        verifyStepMatch 'I rotate to a 800x600 screen size'

      it 'should not capture "have"', ->
        verifyStepDoesNotCapture 'I have a 800x600 screen size', 'have'

      it 'should capture the dimensions', ->
        verifyStepCaptures 'I have a 800x600 screen size', '800', '600'

    describe 'execution', ->

      it 'should set the browser resolution', ->
        executeStep 'I have a 800x600 screen size'
        browser.manage().window().getSize().then (size) ->
          expect(size.width).to.equal 800
          expect(size.height).to.equal 600

  describe 'I navigate backwards in my browser', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I (?:navigate|click) (?:backwards|back) in my browser$/'

      it 'should match "I navigate..."', ->
        verifyStepMatch 'I navigate backwards in my browser'

      it 'should match "I click..."', ->
        verifyStepMatch 'I click back in my browser'

      it 'should match "...backwards..."', ->
        verifyStepMatch 'I click backwards in my browser'

      it 'should match "...back..."', ->
        verifyStepMatch 'I navigate back in my browser'

      it 'should not capture "navigate" or "backwards"', ->
        verifyStepDoesNotCapture 'I navigate backwards in my browser', 'navigate', 'backwards'

    describe 'execution', ->

      navigateSpy = sinon.spy()

      beforeEach ->
        sinon.stub browser, 'navigate', ->
          back: navigateSpy

      afterEach ->
        browser.navigate.restore()

      it 'should navigate backward in the browser', ->
        executeStep 'I navigate backwards in my browser'
        expect(navigateSpy.calledOnce).to.equal true

  describe 'I type "___" in the "___" field', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I type "([^"]*)" in(?:to)? the "([^"]*)" field$/'

      it 'should match "...in..."', ->
        verifyStepMatch 'I type "First" in the "Name" field'

      it 'should match "...into..."', ->
        verifyStepMatch 'I type "First" into the "Name" field'

      it 'should not capture "to"', ->
        verifyStepDoesNotCapture 'I type "First" into the "Name" field', 'to'

      it 'should capture the text and field name', ->
        verifyStepCaptures 'I type "First" in the "Name" field', 'First', 'Name'

    describe 'execution', ->

      world = {}

      beforeEach ->
        world =
          transform:
            stringToVariableName: sinon.stub().returns 'nameField'
          currentPage:
            nameField:
              clear: sinon.stub()
              sendKeys: sinon.stub().resolves()
        ast_tree_walker.setWorld world

      it 'should clear and send the text to the field', ->
        executeStep 'I type "First" in the "Name" field'
        expect(world.transform.stringToVariableName.calledOnce).to.equal true
        expect(world.currentPage.nameField.clear.calledOnce).to.equal true
        expect(world.currentPage.nameField.sendKeys.calledOnce).to.equal true
        expect(world.currentPage.nameField.sendKeys.calledWithExactly('First')).to.equal true

  describe 'I click the "___" link', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I click the "([^"]*)"(?: )?(link|button|drop down list|tab|)$/'

      it 'should match "...link"', ->
        verifyStepMatch 'I click the "Search" link'

      it 'should match "...button"', ->
        verifyStepMatch 'I click the "Search" button'

      it 'should match "...drop down list"', ->
        verifyStepMatch 'I click the "Search" drop down list'

      it 'should match "...tab"', ->
        verifyStepMatch 'I click the "Search" tab'

      it 'should match an empty element type', ->
        verifyStepMatch 'I click the "Search"'

      it 'should capture the element name and type', ->
        verifyStepCaptures 'I click the "Search" tab', 'Search', 'tab'

      it 'should capture the element name and a blank string if no element type is provided', ->
        verifyStepCaptures 'I click the "Search"', 'Search', ''

      it 'should not capture the space', ->
        verifyStepDoesNotCapture 'I click the "Search" tab', ' '

    describe 'execution', ->

      world = {}

      beforeEach ->
        world =
          transform:
            elementTypeToVariableName: sinon.stub().returns 'Button'
            stringToVariableName: sinon.stub().returns 'searchButton'
          currentPage:
            searchButton:
              click: sinon.stub()
        ast_tree_walker.setWorld world

      it 'should click the element', ->
        executeStep 'I click the "Search" button'
        expect(world.transform.elementTypeToVariableName.calledOnce).to.equal true
        expect(world.transform.stringToVariableName.calledOnce).to.equal true
        expect(world.transform.stringToVariableName.calledWithExactly('SearchButton')).to.equal true
        expect(world.currentPage.searchButton.click.calledOnce).to.equal true

  describe 'I refresh the page', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I refresh the page$/'

      it 'should match "I refresh the page"', ->
        verifyStepMatch 'I refresh the page'

    describe 'execution', ->

      beforeEach ->
        sinon.stub browser, 'refresh'

      afterEach ->
        browser.refresh.restore()

      it 'should refresh the page', ->
        executeStep 'I refresh the page'
        expect(browser.refresh.calledOnce).to.equal true

  describe 'I select "___" in the "___" drop down list', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I select "([^"]*)" in the "([^"]*)" drop down list$/'

      it 'should match \'I select "Mountain Standard" in the "Time Zone" drop down list\'', ->
        verifyStepMatch 'I select "Mountain Standard" in the "Time Zone" drop down list'

      it 'should capture the option text and the name of the drop down list', ->
        verifyStepCaptures 'I select "Mountain Standard" in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          timeZoneSelect: $ 'select#timezone'
        ast_tree_walker.setWorld world

      beforeEach ->
        browser.driver.executeScript "fixtures.set('
          <select id=\"timezone\">
            <option selected>Eastern Standard</option>
            <option>Mountain Standard</option>
            <option>Central Standard</option>
          </select>');"
        browser.driver.switchTo().frame('js-fixtures')

      afterEach ->
        browser.driver.switchTo().defaultContent()
        browser.driver.executeScript "fixtures.cleanUp();"

      it 'should select the correct option by its text from the correct drop-down', ->
        executeStep 'I select "Mountain Standard" in the "Time Zone" drop down list', (stepResult) ->
          expect(element(By.cssContainingText 'option', 'Mountain Standard').isSelected()).to.eventually.equal true
          expect(element(By.cssContainingText 'option', 'Eastern Standard').isSelected()).to.eventually.equal false
          expect(element(By.cssContainingText 'option', 'Central Standard').isSelected()).to.eventually.equal false

  describe 'the title should equal "___"', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^the title should equal "([^"]*)"$/'

      it 'should match \'the title should equal "My Title"\'', ->
        verifyStepMatch 'the title should equal "My Title"'

      it 'should capture the title', ->
        verifyStepCaptures 'the title should equal "My Title"', 'My Title'

    describe 'execution', ->

      before ->
        world = new World ->
        ast_tree_walker.setWorld world

      it 'should succeed if the page title matches the supplied title', ->
        executeStep 'the title should equal "Protractor Integration Test Page"', (stepResult) ->
          expect(stepResult.isSuccessful()).to.equal true

      it 'should fail if the page title does not match the supplied title', ->
        executeStep 'the title should equal "Fake Title"', (stepResult) ->
          expect(stepResult.isFailed()).to.equal true

  describe 'the "___" should be active', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^the "([^"]*)" (should|should not) be active$/'

      it 'should match "...should be active"', ->
        verifyStepMatch 'the "Active Field" should be active'

      it 'should match "...should not be active"', ->
        verifyStepMatch 'the "Inactive Field" should not be active'

      it 'should capture the element name and expectation', ->
        verifyStepCaptures 'the "Inactive Field" should not be active', 'Inactive Field', 'should not'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          button: $ 'button#testButton'
        ast_tree_walker.setWorld world

      describe 'with an active element', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<button id=\"testButton\" class=\"active\">');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if it expects the element to be active', ->
          executeStep 'the "Button" should be active', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if it expects the element to be inactive', ->
          executeStep 'the "Button" should not be active', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

      describe 'with an inactive element', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<button id=\"testButton\">');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should fail if it expects the element to be active', ->
          executeStep 'the "Button" should be active', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

        it 'should succeed if it expects the element to be inactive', ->
          executeStep 'the "Button" should not be active', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

  describe 'the "___" should be present', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^the "([^"]*)" should be present$/'

      it 'should match \'the "Home Button" should be present\'', ->
        verifyStepMatch 'the "Home Button" should be present'

      it 'should capture the element name', ->
        verifyStepCaptures 'the "Home Button" should be present', 'Home Button'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          button: $ 'button#testButton'
        ast_tree_walker.setWorld world

      describe 'with element present', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<button id=\"testButton\">');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed', ->
          executeStep 'the "Button" should be present', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

      describe 'without element present', ->

        it 'should fail', ->
          executeStep 'the "Button" should be present', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

  describe 'I should be on the "___" page', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^I (?:should be on|reach|am taken to) the "([^"]*)" page$/'

      it 'should match "I should be on..."', ->
        verifyStepMatch 'I should be on the "Home" page'

      it 'should match "I reach..."', ->
        verifyStepMatch 'I reach the "Home" page'

      it 'should match "I am taken to"', ->
        verifyStepMatch 'I am taken to the "Home" page'

      it 'should capture the page name', ->
        verifyStepCaptures 'I should be on the "Home" page', 'Home'

      it 'should not capture "should be on"', ->
        verifyStepDoesNotCapture 'I should be on the "Home" page', 'should be on'

    describe 'execution', ->

      stubPage = {}
      world = {}

      beforeEach ->
        stubPage =
          waitForLoaded: sinon.stub().resolves()

        world =
          pageObjectMap:
            Test: ->
              stubPage
        ast_tree_walker.setWorld world

      it 'should set the currentPage on the World', ->
        executeStep 'I should be on the "Test" page'
        expect(world.currentPage).to.equal stubPage

      it 'should call waitForLoaded on the page', ->
        executeStep 'I should be on the "Test" page'
        expect(stubPage.waitForLoaded.calledOnce).to.equal true

  describe '"___" should have the text "___"', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^(?:the )?"([^"]*)" should (?:have|contain) the text "([^"]*)"$/'

      it 'should match \'the "Field" should...\'', ->
        verifyStepMatch 'the "Field" should contain the text "Text String"'

      it 'should match \'"Field" should...\'', ->
        verifyStepMatch '"Field" should contain the text "Text String"'

      it 'should match \'..."Field" should contain...\'', ->
        verifyStepMatch 'the "Field" should contain the text "Text String"'

      it 'should match \'..."Field" should have...\'', ->
        verifyStepMatch 'the "Field" should have the text "Text String"'

      it 'should capture the field name and text string', ->
        verifyStepCaptures 'the "Field" should contain the text "Text String"', 'Field', 'Text String'

      it 'should not capture "the" or "contain"', ->
        verifyStepDoesNotCapture 'the "Field" should contain the text "Text String"', 'the', 'contain'

    describe 'execution', ->

      world = {}

      before ->
        world = new World ->
        world.currentPage =
          testSpan: $ 'span#testSpan'
          testInput: $ 'input#testInput'
        ast_tree_walker.setWorld world

      describe 'with a span', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<span id=\"testSpan\">Span Text</span>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if the element contains the expected text', ->
          executeStep 'the "Test Span" should contain the text "Span Text"', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if the element does not contain the expected text', ->
          executeStep 'the "Test Span" should contain the text "Fake Text"', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

      describe 'with an input', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<input id=\"testInput\"/>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if the element contains the expected text', ->
          world.currentPage.testInput.sendKeys("Input Text")
          executeStep 'the "Test Input" should contain the text "Input Text"', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if the element does not contain the expected text', ->
          executeStep 'the "Test Input" should contain the text "Input Text"', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

  describe '"___" should appear in the "___" drop down list', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^"([^"]*)" should appear in the "([^"]*)" drop down list$/'

      it 'should match \'"Mountain Time" should appear in the "Time Zone" drop down list\'', ->
        verifyStepMatch '"Mountain Time" should appear in the "Time Zone" drop down list'

      it 'should capture the option text and drop down list name', ->
        verifyStepCaptures '"Mountain Time" should appear in the "Time Zone" drop down list', 'Mountain Time', 'Time Zone'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          timeZoneSelect: $ 'select#timezone'
        ast_tree_walker.setWorld world

      beforeEach ->
        browser.driver.executeScript "fixtures.set('
                  <select id=\"timezone\">
                    <option selected>Eastern Standard</option>
                    <option>Mountain Standard</option>
                    <option>Central Standard</option>
                  </select>');"
        browser.driver.switchTo().frame('js-fixtures')

      afterEach ->
        browser.driver.switchTo().defaultContent()
        browser.driver.executeScript "fixtures.cleanUp();"

      it 'should succeed if the expected option is in the drop down list', ->
        executeStep '"Mountain Standard" should appear in the "Time Zone" drop down list', (stepResult) ->
          expect(stepResult.isSuccessful()).to.equal true

      it 'should fail if the expected option is not in the drop down list', ->
        executeStep '"Pacific Standard" should appear in the "Time Zone" drop down list', (stepResult) ->
          expect(stepResult.isFailed()).to.equal true

  describe 'the "___" should be displayed', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^the "([^"]*)" (should|should not) be displayed$/'

      it 'should match "...should be displayed"', ->
        verifyStepMatch 'the "Save Button" should be displayed'

      it 'should match "...should not be displayed"', ->
        verifyStepMatch 'the "Cancel Button" should not be displayed'

      it 'should capture the element name and expectation', ->
        verifyStepCaptures 'the "Cancel Button" should not be displayed', 'Cancel Button', 'should not'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          testSpan: element(By.css 'span#testSpan')
        ast_tree_walker.setWorld world

      describe 'with the element displayed', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<span id=\"testSpan\">Span Text</span>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if it expects the element to be displayed', ->
          executeStep 'the "Test Span" should be displayed', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if it expects the element to not be displayed', ->
          executeStep 'the "Test Span" should not be displayed', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

      describe 'without the element displayed', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<span id=\"testSpan\" style=\"display:none;\">Span Text</span>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if it expects the element to not be displayed', ->
          executeStep 'the "Test Span" should not be displayed', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if it expects the element to be displayed', ->
          executeStep 'the "Test Span" should be displayed', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

      describe 'without the element present', ->

        it 'should succeed if it expects the element to not be displayed', ->
          executeStep 'the "Test Span" should not be displayed', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if it expects the element to be displayed', ->
          executeStep 'the "Test Span" should be displayed', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

  describe 'the "___" should have the placeholder text "___"', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^(?:the )?"([^"]*)" should (?:have|contain) the placeholder text "([^"]*)"$/'

      it 'should match a step starting with "the..."', ->
        verifyStepMatch 'the "Username Field" should have the placeholder text "Enter Username"'

      it 'should match a step that does not start with "the..."', ->
        verifyStepMatch '"Username Field" should have the placeholder text "Enter Username"'

      it 'should match "...should have the placeholder text..."', ->
        verifyStepMatch 'the "Username Field" should have the placeholder text "Enter Username"'

      it 'should match "...should contain the placeholder text..."', ->
        verifyStepMatch 'the "Username Field" should contain the placeholder text "Enter Username"'

      it 'should capture the element name and placeholder text', ->
        verifyStepCaptures 'the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', 'Enter Username'

      it 'should not capture "the" or "have"', ->
        verifyStepDoesNotCapture 'the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          testInput: $ 'input#testInput'
        ast_tree_walker.setWorld world

      beforeEach ->
        browser.driver.executeScript "fixtures.set('<input id=\"testInput\" placeholder=\"Test Placeholder\" />');"
        browser.driver.switchTo().frame('js-fixtures')

      afterEach ->
        browser.driver.switchTo().defaultContent()
        browser.driver.executeScript "fixtures.cleanUp();"

      it 'should succeed if the element contains the expected placeholder text', ->
        executeStep 'the "Test Input" should have the placeholder text "Test Placeholder"', (stepResult) ->
          expect(stepResult.isSuccessful()).to.equal true

      it 'should fail if the element does not contain the expected placeholder text', ->
        executeStep 'the "Test Input" should have the placeholder text "Fake Placeholder"', (stepResult) ->
          expect(stepResult.isFailed()).to.equal true

  describe 'the "___" should be enabled', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^the "([^"]*)"(?: )?(button|field|drop down list|) (should|should not) be enabled$/'

      it 'should match \'the "___" button...\'', ->
        verifyStepMatch 'the "Save Configuration" button should be enabled'

      it 'should match \'the "___" field...\'', ->
        verifyStepMatch 'the "Username" field should be enabled'

      it 'should match \'the "___" drop down list...\'', ->
        verifyStepMatch 'the "Timezone" drop down list should be enabled'

      it 'should match a step without an element type', ->
        verifyStepMatch 'the "Save Button" should be enabled'

      it 'should match \'...should be enabled\'', ->
        verifyStepMatch 'the "Save Configuration" button should be enabled'

      it 'should match \'...should not be enabled\'', ->
        verifyStepMatch 'the "Save Configuration" button should not be enabled'

      it 'should capture the element name, element type and the expectation', ->
        verifyStepCaptures 'the "Save Configuration" button should be enabled', 'Save Configuration', 'button', 'should'

      it 'should not capture the optional space', ->
        verifyStepDoesNotCapture 'the "Save Configuration" button should be enabled', ' '

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          testButton: $ 'button#testButton'
        ast_tree_walker.setWorld world

      describe 'with enabled button', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<button id=\"testButton\">Button</button>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if it expects the button to be enabled', ->
          executeStep 'the "Test" button should be enabled', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if it expects the button to be disabled', ->
          executeStep 'the "Test" button should not be enabled', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

      describe 'with disabled button', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<button id=\"testButton\" disabled>Button</button>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should fail if it expects the button to be enabled', ->
          executeStep 'the "Test" button should be enabled', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

        it 'should succeed if it expects the button to be disabled', ->
          executeStep 'the "Test" button should not be enabled', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

  describe '"___" should be selected in the "___" drop down list', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^"([^"]*)" should be (?:selected|displayed) in the "([^"]*)" drop down list$/'

      it 'should match \'...should be selected...\'', ->
        verifyStepMatch '"Mountain Standard" should be selected in the "Time Zone" drop down list'

      it 'should match \'...should be displayed...\'', ->
        verifyStepMatch '"Mountain Standard" should be displayed in the "Time Zone" drop down list'

      it 'should capture the option text and list name', ->
        verifyStepCaptures '"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone'

      it 'should not capture "selected"', ->
        verifyStepDoesNotCapture '"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          timeZoneSelect: $ 'select#timezone'
        ast_tree_walker.setWorld world

      beforeEach ->
        browser.driver.executeScript "fixtures.set('
                          <select id=\"timezone\">
                            <option selected>Eastern Standard</option>
                            <option>Mountain Standard</option>
                            <option>Central Standard</option>
                          </select>');"
        browser.driver.switchTo().frame('js-fixtures')

      afterEach ->
        browser.driver.switchTo().defaultContent()
        browser.driver.executeScript "fixtures.cleanUp();"

      it 'should succeed if the expected option is selected', ->
        executeStep '"Eastern Standard" should be selected in the "Time Zone" drop down list', (stepResult) ->
          expect(stepResult.isSuccessful()).to.equal true

      it 'should fail if the expected option is not selected', ->
        executeStep '"Mountain Standard" should be selected in the "Time Zone" drop down list', (stepResult) ->
          expect(stepResult.isFailed()).to.equal true

  describe 'the "___" should be checked', ->

    describe 'regex', ->

      before ->
        stepPattern = '/^the "([^"]*)"(?: )?(checkbox|) (should|should not) be checked$/'

      it 'should match "...checkbox..."', ->
        verifyStepMatch 'the "Enable Emails" checkbox should be checked'

      it 'should match a step without an element type', ->
        verifyStepMatch 'the "Enable Emails Checkbox" should be checked'

      it 'should match "...should..."', ->
        verifyStepMatch 'the "Enable Emails" checkbox should be checked'

      it 'should match "...should not..."', ->
        verifyStepMatch 'the "Enable Emails" checkbox should not be checked'

    describe 'execution', ->

      before ->
        world = new World ->
        world.currentPage =
          testCheckbox: $ 'input#testCheckbox'
        ast_tree_walker.setWorld world

      describe 'with a selected checkbox', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\" checked/>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should succeed if it expects the checkbox to be selected', ->
          executeStep 'the "Test" checkbox should be checked', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true

        it 'should fail if it expects the checkbox to not be selected', ->
          executeStep 'the "Test" checkbox should not be checked', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

      describe 'with an unselected checkbox', ->

        beforeEach ->
          browser.driver.executeScript "fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\"/>');"
          browser.driver.switchTo().frame('js-fixtures')

        afterEach ->
          browser.driver.switchTo().defaultContent()
          browser.driver.executeScript "fixtures.cleanUp();"

        it 'should fail if it expects the checkbox to be selected', ->
          executeStep 'the "Test" checkbox should be checked', (stepResult) ->
            expect(stepResult.isFailed()).to.equal true

        it 'should succeed if it expects the checkbox to not be selected', ->
          executeStep 'the "Test" checkbox should not be checked', (stepResult) ->
            expect(stepResult.isSuccessful()).to.equal true
