//var Cucumber = require('cucumber');
//var sinon = require('sinon');
//var Promise = require('q');
//var sinonAsPromised = require('sinon-as-promised')(Promise);
//var path = require('path');
//var World = require('../lib/support/World.js');
//var uuidV4 = require('uuid/v4');

//var chai = require('chai');
//var sinonChai = require('sinon-chai');
//chai.use(sinonChai);
//var expect = chai.expect;

//describe('General Step Defs', function() {
//  var currentStepResult, executeStep, initScenarioRunner, lookupStepDefinition, required_options, sandbox, scenarioRunner, stepPattern, supportCodeFilePaths, supportCodeLibrary, verifyStepCaptures, verifyStepDoesNotCapture, verifyStepMatch, world;

//   Load dependencies into support code library
//  require('../lib/step_definitions/GeneralStepDefs');
//  require('../lib/support/Transform');
//  require('../lib/support/World');

//  var supportCodeLibrary = Cucumber.SupportCodeLibraryBuilder.build({
//    cwd: process.cwd(),
//    fns: Cucumber.getSupportCodeFns()
//  });

//  var ScenarioRunner = require('../node_modules/cucumber/lib/runtime/scenario_runner');
//  var scenarioRunner = new ScenarioRunner.default({
//    eventBroadcaster: {},
//    options: {},
//    scenario: {},
//    supportCodeLibrary: supportCodeLibrary
//  });
//  var world = scenarioRunner.world;

//  var currentStepResult = null;
//  var runtime = null;
//  var sandbox = sinon.sandbox.create();
//  var stepPattern = '';

//  var stepRunner = require('../node_modules/cucumber/lib/runtime/step_runner.js').default;
//  console.log(stepRunner.run());

//  supportCodeLibrary.registerHandler('StepResult', function(stepResult, callback) {
//    currentStepResult = stepResult;
//    return callback();
//  });

//  required_options = {
//    strict: false,
//    failFast: false,
//    dryRun: false
//  };

//  world = supportCodeLibrary.instantiateNewWorld();
//  initScenarioRunner = function() {
//    var event_broadcaster, scenario;
//    scenario = {
//      getAttachments: function() {}
//    };
//    event_broadcaster = Cucumber.Runtime.EventBroadcaster(supportCodeLibrary.getListeners());
//    return scenarioRunner = new Cucumber.Runtime.ScenarioRunner(scenario, supportCodeLibrary, event_broadcaster, required_options);
//  };

//  initScenarioRunner();

//  var lookupStepDefinition = function(stepName) {
//    var stepDefinitions = supportCodeLibrary.stepDefinitions.filter((stepDefinition) => {
//      return stepDefinition.matchesStepName({
//        stepName: stepName,
//        transformLookup: supportCodeLibrary.transformLookup
//      })
//    });

//    expect(stepDefinitions.length).to.equal(1, 'Could not find Step Definition for step: ' + stepName);
//    return(stepDefinitions[0]);
//  };

//  var executeStep = (stepName, verification, keyword) => {
//    keyword = keyword || 'Given';
//    verification = verification || function() {};

//    return scenarioRunner.runStep({
//      arguments: [],
//      name: stepName
//    }).then(function(stepResult) {
//      currentStepResult = stepResult;
//      verification();
//    });
//  };

//  var verifyStepMatch = function(stepName, pattern) {
//    var stepDef;
//    if (pattern == null) {
//      pattern = stepPattern;
//    }

//    stepDef = lookupStepDefinition(stepName);
//    expect(stepDef).to.exist;
//    expect(stepDef.pattern.toString()).to.equal(pattern);
//  };

//  var verifyStepCaptures = function() {
//    var stepName = arguments[0];
//    var args = [].slice.call(arguments, 1);

//    var stepDef = lookupStepDefinition(stepName);
//    var regexp = stepDef.getCucumberExpression(supportCodeLibrary.transformLookup)._regexp;

//    args.forEach(function(arg) {
//      expect(regexp.exec(stepName)).to.contain(arg);
//    })
//  };

//  var verifyStepDoesNotCapture = function() {
//    var stepName = arguments[0];
//    var args = [].slice.call(arguments, 1);

//    var stepDef = lookupStepDefinition(stepName);
//    var regexp = stepDef.getCucumberExpression(supportCodeLibrary.transformLookup)._regexp;

//    args.forEach(function(arg) {
//      expect(regexp.exec(stepName)).to.not.contain(arg);
//    })
//  };

//  before(function() {
//    browser.get('http://localhost:9001/');
//    return browser.manage().timeouts().implicitlyWait(100);
//  });

//  beforeEach(function() {
//    currentStepResult = {};
//  });

//  describe('___ (covered by ___)', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = '/^.*(covered by .*)$/';
//      });

//      it('should match "I am on the Moon (covered by MoonUnit)"', function() {
//        verifyStepMatch('I am on the Moon (covered by MoonUnit)');
//      });
//    });
//  });

//  describe('I am on the "___" page', function() {
//    describe('regex', function() {
//      before(function() {
//        return stepPattern = 'I (am on|go to) the "{pageName:captureString}" page';
//      });

//      it('should match "I am on..."', function() {
//        return verifyStepMatch('I am on the "Test" page');
//      });

//      it('should match "I go to..."', function() {
//        return verifyStepMatch('I go to the "Test" page');
//      });

//      it('should not capture "am on"', function() {
//        return verifyStepDoesNotCapture('I am on the "Test" page', 'am on');
//      });

//      it('should capture the page name', function() {
//        return verifyStepCaptures('I go to the "Test" page', 'Test');
//      });
//    });

//    describe('execution', function() {
//      var stubPage = {};

//      beforeEach(function() {
//        stubPage = {
//          get: sinon.stub().resolves(),
//          waitForLoaded: sinon.stub().resolves()
//        };

//        world.pageObjectMap = {
//          Test: function() {
//            return stubPage;
//          }
//        };
//      });

//      afterEach(function() {
//        sandbox.restore();
//      });

//      it('should set the currentPage on the World', function() {
//        return executeStep('I am on the "Test" page', function() {
//          expect(world.currentPage).to.equal(stubPage);
//        });
//      });

//      it('should call get on the page', function() {
//        return executeStep('I am on the "Test" page', function() {
//          expect(stubPage.get.calledOnce).to.equal(true);
//        });
//      });

//      it('should call waitForLoaded on the page', function() {
//        return executeStep('I am on the "Test" page', function() {
//          expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
//        });
//      });

//      it('should provide a clear error message if the Page Object was not added to the PageObjectMap', function() {
//        return executeStep('I am on the "Missing" page', function() {
//          expect(currentStepResult.failureException.toString()).to.equal("Error: Could not find page with name 'Missing' in the PageObjectMap, did you remember to add it?");
//        });
//      });
//    });
//  });

//  describe('I have a ___x___ screen size', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I (have|change to|resize to|rotate to) a {width:int}x{height:int} screen size';
//      });

//      it('should match "I have..."', function() {
//        verifyStepMatch('I have a 800x600 screen size');
//      });

//      it('should match "I change to..."', function() {
//        verifyStepMatch('I change to a 800x600 screen size');
//      });

//      it('should match "I resize to..."', function() {
//        verifyStepMatch('I resize to a 800x600 screen size');
//      });

//      it('should match "I rotate to..."', function() {
//        verifyStepMatch('I rotate to a 800x600 screen size');
//      });

//      it('should not capture "have"', function() {
//        verifyStepDoesNotCapture('I have a 800x600 screen size', 'have');
//      });

//      it('should capture the dimensions', function() {
//        verifyStepCaptures('I have a 800x600 screen size', '800', '600');
//      });
//    });

//    describe('execution', function() {
//      it('should set the browser resolution', function() {
//        return executeStep('I have a 800x600 screen size', function() {
//          return browser.manage().window().getSize().then(function(size) {
//            expect(size.width).to.equal(800);
//            expect(size.height).to.equal(600);
//          });
//        });
//      });
//    });
//  });

//  describe('I navigate backwards in my browser', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I (navigate|click) (backwards|back) in my browser';
//      });

//      it('should match "I navigate..."', function() {
//        verifyStepMatch('I navigate backwards in my browser');
//      });

//      it('should match "I click..."', function() {
//        verifyStepMatch('I click back in my browser');
//      });

//      it('should match "...backwards..."', function() {
//        verifyStepMatch('I click backwards in my browser');
//      });

//      it('should match "...back..."', function() {
//        verifyStepMatch('I navigate back in my browser');
//      });

//      it('should not capture "navigate" or "backwards"', function() {
//        verifyStepDoesNotCapture('I navigate backwards in my browser', 'navigate', 'backwards');
//      });
//    });

//    describe('execution', function() {
//      var navigateSpy;
//      navigateSpy = sinon.spy();

//      beforeEach(function() {
//        sinon.stub(browser, 'navigate', function() {
//          return {
//            back: navigateSpy
//          };
//        });
//      });

//      afterEach(function() {
//        return browser.navigate.restore();
//      });

//      it('should navigate backward in the browser', function() {
//        return executeStep('I navigate backwards in my browser', function() {
//          return expect(navigateSpy.calledOnce).to.equal(true);
//        });
//      });
//    });
//  });

//  describe('I type "___" in the "___" field', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I type "{text:captureString}" in(to|) the "{name:elementName}"{type:elementType}';
//      });

//      it('should match "...in..."', function() {
//        verifyStepMatch('I type "First" in the "Name" field');
//      });

//      it('should match "...into..."', function() {
//        verifyStepMatch('I type "First" into the "Name" field');
//      });

//      it('should not capture "to"', function() {
//        verifyStepDoesNotCapture('I type "First" into the "Name" field', 'to');
//      });

//      it('should capture the text and field name', function() {
//        verifyStepCaptures('I type "First" in the "Name" field', 'First', 'Name');
//      });
//    });

//    describe('execution', function() {
//      beforeEach(function() {
//        world.currentPage = {
//          nameField: {
//            clear: sinon.stub(),
//            sendKeys: sinon.stub().resolves()
//          }
//        };
//      });

//      afterEach(function() {
//        sandbox.restore();
//      });

//      it('should clear and send the text to the field', function() {
//        return executeStep('I type "First" in the "Name" field', function() {
//          expect(world.currentPage.nameField.clear).to.have.been.calledOnce;
//          expect(world.currentPage.nameField.sendKeys).to.have.been.calledOnce;
//          expect(world.currentPage.nameField.sendKeys).to.have.been.calledWithExactly('First');
//        });
//      });
//    });
//  });

//  describe('I click the "___" link', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I click the "{name:elementName}"{type:elementType}';
//      });

//      it('should match "...link"', function() {
//        verifyStepMatch('I click the "Search" link');
//      });

//      it('should match "...button"', function() {
//        verifyStepMatch('I click the "Search" button');
//      });

//      it('should match "...drop down list"', function() {
//        verifyStepMatch('I click the "Search" drop down list');
//      });

//      it('should match "...tab"', function() {
//        verifyStepMatch('I click the "Search" tab');
//      });

//      it('should match an empty element type', function() {
//        verifyStepMatch('I click the "Search"');
//      });

//      it('should capture the element name and type', function() {
//        verifyStepCaptures('I click the "Search" tab', 'Search', ' tab');
//      });

//      it('should capture the element name and a blank string if no element type is provided', function() {
//        verifyStepCaptures('I click the "Search"', 'Search', '');
//      });
//    });

//    describe('execution', function() {
//      beforeEach(function() {
//        world.currentPage = {
//          searchButton: {
//            click: sinon.stub()
//          }
//        };
//      });

//      afterEach(function() {
//        sandbox.restore();
//      });

//      it('should click the element', function() {
//        return executeStep('I click the "Search" button', function() {
//          expect(world.currentPage.searchButton.click).to.have.been.calledOnce;
//        });
//      });
//    });
//  });

//  describe('I refresh the page', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I refresh the page';
//      });

//      it('should match "I refresh the page"', function() {
//        verifyStepMatch('I refresh the page');
//      });
//    });

//    describe('execution', function() {
//      beforeEach(function() {
//        sinon.stub(browser, 'refresh');
//      });

//      afterEach(function() {
//        browser.refresh.restore();
//      });

//      it('should refresh the page', function() {
//        return executeStep('I refresh the page', function() {
//          expect(browser.refresh).to.have.been.calledOnce;
//        });
//      });
//    });
//  });

//  describe('I select "___" in the "___" drop down list', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I select "{optionText:captureString}" in the "{name:elementName}"{type:elementType}';
//      });

//      it('should match \'I select "Mountain Standard" in the "Time Zone" drop down list\'', function() {
//        verifyStepMatch('I select "Mountain Standard" in the "Time Zone" drop down list');
//      });

//      it('should capture the option text, element name, and element type', function() {
//        verifyStepCaptures('I select "Mountain Standard" in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone', ' drop down list');
//      });

//      it('should capture the option text, element name, and a blank string if no element type is provided', function() {
//        verifyStepCaptures('I select "Mountain Standard" in the "Time Zone"', 'Mountain Standard', 'Time Zone', '');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          timeZoneSelect: $('select#timezone')
//        };
//      });

//      beforeEach(function() {
//        return browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');").then(function() {
//          return browser.driver.switchTo().frame('js-fixtures');
//        });
//      });

//      afterEach(function() {
//        return browser.driver.switchTo().defaultContent().then(function() {
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });
//      });

//      it('should select the correct option by its text from the correct drop-down', function() {
//        return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
//          return Promise.all([expect(element(By.cssContainingText('option', 'Eastern Standard')).isSelected()).to.eventually.equal(false), expect(element(By.cssContainingText('option', 'Central Standard')).isSelected()).to.eventually.equal(false), expect(element(By.cssContainingText('option', 'Mountain Standard')).isSelected()).to.eventually.equal(true)]);
//        });
//      });
//    });
//  });

//  describe('the title should equal "___"', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'the title should equal "{text:captureString}"';
//      });

//      it('should match \'the title should equal "My Title"\'', function() {
//        verifyStepMatch('the title should equal "My Title"');
//      });

//      it('should capture the title', function() {
//        verifyStepCaptures('the title should equal "My Title"', 'My Title');
//      });
//    });

//    describe('execution', function() {
//      it('should succeed if the page title matches the supplied title', function() {
//        return executeStep('the title should equal "Protractor Integration Test Page"', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//        });
//      });

//      it('should fail if the page title does not match the supplied title', function() {
//        return executeStep('the title should equal "Fake Title"', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//        });
//      });
//    });
//  });

//  describe('the "___" should be active', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be active';
//      });

//      it('should match "...should be active"', function() {
//        verifyStepMatch('the "Active Field" should be active');
//      });

//      it('should match "...should not be active"', function() {
//        verifyStepMatch('the "Inactive Field" should not be active');
//      });

//      it('should capture the element name, element type, and expectation', function() {
//        verifyStepCaptures('the "Inactive" field should not be active', 'Inactive', ' field', 'should not');
//      });

//      it('should capture the element name, expectation, and a blank string if no element type is provided', function() {
//        verifyStepCaptures('the "Inactive Field" should not be active', 'Inactive Field', '', 'should not');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          button: $('button#testButton')
//        };
//      });

//      describe('with an active element', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<button id=\"testButton\" class=\"active\">');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if it expects the element to be active', function() {
//          return executeStep('the "Button" should be active', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if it expects the element to be inactive', function() {
//          return executeStep('the "Button" should not be active', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });

//      describe('with an inactive element', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<button id=\"testButton\">');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should fail if it expects the element to be active', function() {
//          return executeStep('the "Button" should be active', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });

//        it('should succeed if it expects the element to be inactive', function() {
//          return executeStep('the "Button" should not be active', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });
//      });
//    });
//  });

//  describe('the "___" should be present', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'the "{name:elementName}"{type:elementType} should be present';
//      });

//      it('should match \'the "Home Button" should be present\'', function() {
//        verifyStepMatch('the "Home Button" should be present');
//      });

//      it('should capture the element name and type', function() {
//        verifyStepCaptures('the "Home" button should be present', 'Home', ' button');
//      });

//      it('should capture the element name and a blank string if no element type is provided', function() {
//        verifyStepCaptures('the "Home Button" should be present', 'Home Button', '');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          button: $('button#testButton')
//        };
//      });

//      describe('with element present', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<button id=\"testButton\">');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed', function() {
//          return executeStep('the "Button" should be present', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });
//      });

//      describe('without element present', function() {
//        it('should fail', function() {
//          return executeStep('the "Button" should be present', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });
//    });
//  });

//  describe('I should be on the "___" page', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'I (should be on|reach|am taken to) the "{pageName:captureString}" page';
//      });

//      it('should match "I should be on..."', function() {
//        verifyStepMatch('I should be on the "Home" page');
//      });

//      it('should match "I reach..."', function() {
//        verifyStepMatch('I reach the "Home" page');
//      });

//      it('should match "I am taken to"', function() {
//        verifyStepMatch('I am taken to the "Home" page');
//      });

//      it('should capture the page name', function() {
//        verifyStepCaptures('I should be on the "Home" page', 'Home');
//      });

//      it('should not capture "should be on"', function() {
//        verifyStepDoesNotCapture('I should be on the "Home" page', 'should be on');
//      });
//    });

//    describe('execution', function() {
//      var stubPage;
//      stubPage = {};

//      beforeEach(function() {
//        stubPage = {
//          waitForLoaded: sinon.stub().resolves()
//        };

//        world.pageObjectMap = {
//          Test: function() {
//            return stubPage;
//          }
//        };
//      });

//      afterEach(function() {
//        sandbox.restore();
//      });

//      it('should set the currentPage on the World', function() {
//        return executeStep('I should be on the "Test" page', function() {
//          expect(world.currentPage).to.equal(stubPage);
//        });
//      });

//      it('should call waitForLoaded on the page', function() {
//        return executeStep('I should be on the "Test" page', function() {
//          expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
//        });
//      });
//    });
//  });

//  describe('"___" should have the text "___"', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = '(the |)"{name:elementName}"{type:elementType} should (have|contain) the text "{text:captureString}"';
//      });

//      it('should match \'the "Test Field" should...\'', function() {
//        verifyStepMatch('the "Test Field" should contain the text "Text String"');
//      });

//      it('should match \'"Test Field" should...\'', function() {
//        verifyStepMatch('"Test Field" should contain the text "Text String"');
//      });

//      it('should match \'..."Test Field" should contain...\'', function() {
//        verifyStepMatch('the "Test Field" should contain the text "Text String"');
//      });

//      it('should match \'..."Test Field" should have...\'', function() {
//        verifyStepMatch('the "Test Field" should have the text "Text String"');
//      });

//      it('should capture the element name, element type, and text string', function() {
//        verifyStepCaptures('the "Test" field should contain the text "Text String"', 'Test', ' field', 'Text String');
//      });

//      it('should capture the element name, text string, and a blank string if no element type is provided', function() {
//        verifyStepCaptures('the "Test Field" should contain the text "Text String"', 'Test Field', '', 'Text String');
//      });

//      it('should not capture "the" or "contain"', function() {
//        verifyStepDoesNotCapture('the "Test Field" should contain the text "Text String"', 'the', 'contain');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          testSpan: $('span#testSpan'),
//          testInput: $('input#testInput')
//        };
//      });

//      describe('with a span', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<span id=\"testSpan\">Span Text</span>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if the element contains the expected text', function() {
//          return executeStep('the "Test Span" should contain the text "Span Text"', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if the element does not contain the expected text', function() {
//          return executeStep('the "Test Span" should contain the text "Fake Text"', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });

//      describe('with an input', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<input id=\"testInput\"/>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if the element contains the expected text', function() {
//          element(By.css('input')).sendKeys("Input Text");
//          return executeStep('the "Test Input" should contain the text "Input Text"', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if the element does not contain the expected text', function() {
//          return executeStep('the "Test Input" should contain the text "Input Text"', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });
//    });
//  });

//  describe('"___" should appear in the "___" drop down list', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = '"{option:captureString}" should appear in the "{name:elementName}"{type:elementType}';
//      });

//      it('should match \'"Mountain Time" should appear in the "Time Zone" drop down list\'', function() {
//        verifyStepMatch('"Mountain Time" should appear in the "Time Zone" drop down list');
//      });

//      it('should capture the option text, element type, and drop down list name', function() {
//        verifyStepCaptures('"Mountain Time" should appear in the "Time Zone" drop down list', 'Mountain Time', 'Time Zone', ' drop down list');
//      });

//      it('should capture the option text, drop down list name, and a blank string if no element type is provided', function() {
//        verifyStepCaptures('"Mountain Time" should appear in the "Time Zone Drop Down List"', 'Mountain Time', 'Time Zone Drop Down List', '');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          timeZoneSelect: $('select#timezone')
//        };
//      });

//      beforeEach(function() {
//        browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');");
//        return browser.driver.switchTo().frame('js-fixtures');
//      });

//      afterEach(function() {
//        browser.driver.switchTo().defaultContent();
//        return browser.driver.executeScript("fixtures.cleanUp();");
//      });

//      it('should succeed if the expected option is in the drop down list', function() {
//        return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//        });
//      });

//      it('should fail if the expected option is not in the drop down list', function() {
//        return executeStep('"Pacific Standard" should appear in the "Time Zone" drop down list', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//        });
//      });
//    });
//  });

//  describe('the "___" should be displayed', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be displayed';
//      });

//      it('should match "...should be displayed"', function() {
//        verifyStepMatch('the "Save Button" should be displayed');
//      });

//      it('should match "...should not be displayed"', function() {
//        verifyStepMatch('the "Cancel Button" should not be displayed');
//      });

//      it('should capture the element name and expectation', function() {
//        verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', 'should not');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          testSpan: element(By.css('span#testSpan'))
//        };
//      });

//      describe('with the element displayed', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<span id=\"testSpan\">Span Text</span>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if it expects the element to be displayed', function() {
//          return executeStep('the "Test Span" should be displayed', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if it expects the element to not be displayed', function() {
//          return executeStep('the "Test Span" should not be displayed', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });

//      describe('without the element displayed', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<span id=\"testSpan\" style=\"display:none;\">Span Text</span>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if it expects the element to not be displayed', function() {
//          return executeStep('the "Test Span" should not be displayed', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if it expects the element to be displayed', function() {
//          return executeStep('the "Test Span" should be displayed', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });

//      describe('without the element present', function() {
//        it('should succeed if it expects the element to not be displayed', function() {
//          return executeStep('the "Test Span" should not be displayed', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if it expects the element to be displayed', function() {
//          return executeStep('the "Test Span" should be displayed', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });
//    });
//  });

//  describe('the "___" should have the placeholder text "___"', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = '(the |)"{name:elementName}"{type:elementType} {expectation:shouldToBoolean} (have|contain) the placeholder text "{text:captureString}"';
//      });

//      it('should match a step starting with "the..."', function() {
//        verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
//      });

//      it('should match a step that does not start with "the..."', function() {
//        verifyStepMatch('"Username Field" should have the placeholder text "Enter Username"');
//      });

//      it('should match "...should have the placeholder text..."', function() {
//        verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
//      });

//      it('should match "...should contain the placeholder text..."', function() {
//        verifyStepMatch('the "Username Field" should contain the placeholder text "Enter Username"');
//      });

//      it('should capture the element name and placeholder text', function() {
//        verifyStepCaptures('the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', 'Enter Username');
//      });

//      it('should not capture "the" or "have"', function() {
//        verifyStepDoesNotCapture('the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          testInput: $('input#testInput')
//        };
//      });

//      beforeEach(function() {
//        browser.driver.executeScript("fixtures.set('<input id=\"testInput\" placeholder=\"Test Placeholder\" />');");
//        return browser.driver.switchTo().frame('js-fixtures');
//      });

//      afterEach(function() {
//        browser.driver.switchTo().defaultContent();
//        return browser.driver.executeScript("fixtures.cleanUp();");
//      });

//      it('should succeed if the element contains the expected placeholder text', function() {
//        return executeStep('the "Test Input" should have the placeholder text "Test Placeholder"', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//        });
//      });

//      it('should fail if the element does not contain the expected placeholder text', function() {
//        return executeStep('the "Test Input" should have the placeholder text "Fake Placeholder"', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//        });
//      });
//    });
//  });

//  describe('the "___" should be enabled', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be enabled';
//      });

//      it('should match \'the "___" button...\'', function() {
//        verifyStepMatch('the "Save Configuration" button should be enabled');
//      });

//      it('should match \'the "___" field...\'', function() {
//        verifyStepMatch('the "Username" field should be enabled');
//      });

//      it('should match \'the "___" drop down list...\'', function() {
//        verifyStepMatch('the "Timezone" drop down list should be enabled');
//      });

//      it('should match a step without an element type', function() {
//        verifyStepMatch('the "Save Button" should be enabled');
//      });

//      it('should match \'...should be enabled\'', function() {
//        verifyStepMatch('the "Save Configuration" button should be enabled');
//      });

//      it('should match \'...should not be enabled\'', function() {
//        verifyStepMatch('the "Save Configuration" button should not be enabled');
//      });

//      it('should capture the element name, element type, and the expectation', function() {
//        verifyStepCaptures('the "Save Configuration" button should be enabled', 'Save Configuration', ' button', 'should');
//      });

//      it('should capture the element name, the expectation, and a blank string if no element type is provided', function() {
//        verifyStepCaptures('the "Save Configuration Button" should be enabled', 'Save Configuration Button', '', 'should');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          testButton: $('button#testButton')
//        };
//      });

//      describe('with enabled button', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<button id=\"testButton\">Button</button>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if it expects the button to be enabled', function() {
//          return executeStep('the "Test" button should be enabled', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if it expects the button to be disabled', function() {
//          return executeStep('the "Test" button should not be enabled', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });

//      describe('with disabled button', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<button id=\"testButton\" disabled>Button</button>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should fail if it expects the button to be enabled', function() {
//          return executeStep('the "Test" button should be enabled', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });

//        it('should succeed if it expects the button to be disabled', function() {
//          return executeStep('the "Test" button should not be enabled', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });
//      });
//    });
//  });

//  describe('"___" should be selected in the "___" drop down list', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = '"{text:captureString}" {expectation:shouldToBoolean} be (selected|displayed) in the "{name:elementName}"{type:elementType}';
//      });

//      it('should match \'...should be selected...\'', function() {
//        verifyStepMatch('"Mountain Standard" should be selected in the "Time Zone" drop down list');
//      });

//      it('should match \'...should be displayed...\'', function() {
//        verifyStepMatch('"Mountain Standard" should be displayed in the "Time Zone" drop down list');
//      });

//      it('should capture the option text, expectation, list name, and element type', function() {
//        verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'should', 'Time Zone', ' drop down list');
//      });

//      it('should capture the option text, expectation, list name, and a blank string if no element type is provided', function() {
//        verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone Drop Down List"', 'Mountain Standard', 'should', 'Time Zone Drop Down List', '');
//      });

//      it('should not capture "selected"', function() {
//        verifyStepDoesNotCapture('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          timeZoneSelect: $('select#timezone')
//        };
//      });

//      beforeEach(function() {
//        browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');");
//        return browser.driver.switchTo().frame('js-fixtures');
//      });

//      afterEach(function() {
//        browser.driver.switchTo().defaultContent();
//        return browser.driver.executeScript("fixtures.cleanUp();");
//      });

//      it('should succeed if the expected option is selected', function() {
//        return executeStep('"Eastern Standard" should be selected in the "Time Zone" drop down list', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//        });
//      });

//      it('should fail if the expected option is not selected', function() {
//        return executeStep('"Mountain Standard" should be selected in the "Time Zone" drop down list', function() {
//          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//        });
//      });
//    });
//  });

//  describe('the "___" should be checked', function() {
//    describe('regex', function() {
//      before(function() {
//        stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be checked';
//      });

//      it('should match "...checkbox..."', function() {
//        verifyStepMatch('the "Enable Emails" checkbox should be checked');
//      });

//      it('should match a step without an element type', function() {
//        verifyStepMatch('the "Enable Emails Checkbox" should be checked');
//      });

//      it('should match "...should..."', function() {
//        verifyStepMatch('the "Enable Emails" checkbox should be checked');
//      });

//      it('should match "...should not..."', function() {
//        verifyStepMatch('the "Enable Emails" checkbox should not be checked');
//      });
//    });

//    describe('execution', function() {
//      before(function() {
//        world.currentPage = {
//          testCheckbox: $('input#testCheckbox')
//        };
//      });

//      describe('with a selected checkbox', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\" checked/>');");
//          browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should succeed if it expects the checkbox to be selected', function() {
//          return executeStep('the "Test" checkbox should be checked', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });

//        it('should fail if it expects the checkbox to not be selected', function() {
//          return executeStep('the "Test" checkbox should not be checked', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });
//      });

//      describe('with an unselected checkbox', function() {
//        beforeEach(function() {
//          browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\"/>');");
//          return browser.driver.switchTo().frame('js-fixtures');
//        });

//        afterEach(function() {
//          browser.driver.switchTo().defaultContent();
//          return browser.driver.executeScript("fixtures.cleanUp();");
//        });

//        it('should fail if it expects the checkbox to be selected', function() {
//          return executeStep('the "Test" checkbox should be checked', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
//          });
//        });

//        it('should succeed if it expects the checkbox to not be selected', function() {
//          return executeStep('the "Test" checkbox should not be checked', function() {
//            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
//          });
//        });
//      });
//    });
//  });
//});
