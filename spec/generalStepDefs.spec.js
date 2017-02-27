var Cucumber, Promise, World, expect, path, sinon, sinonAsPromised,
  slice = [].slice;

Cucumber = require('cucumber');

sinon = require('sinon');

Promise = require('q');

sinonAsPromised = require('sinon-as-promised')(Promise);

path = require('path');

expect = require('chai').expect;

World = require('../lib/support/World.js').World;

describe('General Step Defs', function() {
  var currentStepResult, executeStep, initScenarioRunner, lookupStepDefinition, required_options, sandbox, scenarioRunner, stepPattern, supportCodeFilePaths, supportCodeLibrary, verifyStepCaptures, verifyStepDoesNotCapture, verifyStepMatch, world;
  sandbox = sinon.sandbox.create();
  scenarioRunner = {};
  currentStepResult = {};
  supportCodeFilePaths = [path.resolve('./lib/step_definitions/GeneralStepDefs.js')];
  supportCodeLibrary = Cucumber.Cli.SupportCodeLoader(supportCodeFilePaths, []).getSupportCodeLibrary();
  required_options = {
    strict: false,
    failFast: false,
    dryRun: false
  };

  supportCodeLibrary.registerHandler('StepResult', function(stepResult, callback) {
    currentStepResult = stepResult;
    return callback();
  });

  world = supportCodeLibrary.instantiateNewWorld();
  initScenarioRunner = function() {
    var event_broadcaster, scenario;
    scenario = {
      getAttachments: function() {}
    };
    event_broadcaster = Cucumber.Runtime.EventBroadcaster(supportCodeLibrary.getListeners());
    return scenarioRunner = new Cucumber.Runtime.ScenarioRunner(scenario, supportCodeLibrary, event_broadcaster, required_options);
  };

  initScenarioRunner();
  stepPattern = '';
  lookupStepDefinition = function(stepName) {
    var stepDefs;
    stepDefs = supportCodeLibrary.lookupStepDefinitionsByName(stepName);
    expect(stepDefs[0]).to.exist;
    return stepDefs[0];
  };

  executeStep = (function(_this) {
    return function(stepName, callback, keyword) {
      var step, stepDef;
      if (callback == null) {
        callback = (function() {});
      }
      if (keyword == null) {
        keyword = 'Given';
      }
      step = new Cucumber.Ast.Step({
        text: stepName
      });
      stepDef = lookupStepDefinition(stepName);
      return scenarioRunner.executeStep(step, stepDef, callback);
    };
  })(this);

  verifyStepMatch = function(stepName, pattern) {
    var stepDef;
    if (pattern == null) {
      pattern = stepPattern;
    }
    stepDef = lookupStepDefinition(stepName);
    return expect(stepDef.getPatternRegexp().toString()).to.equal(pattern);
  };

  verifyStepCaptures = function() {
    var arg, args, i, len, results, stepDef, stepName;
    stepName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    stepDef = lookupStepDefinition(stepName);
    results = [];
    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
      results.push(expect(stepDef.getPatternRegexp().exec(stepName)).to.contain(arg));
    }
    return results;
  };

  verifyStepDoesNotCapture = function() {
    var arg, args, i, len, results, stepDef, stepName;
    stepName = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
    stepDef = lookupStepDefinition(stepName);
    results = [];
    for (i = 0, len = args.length; i < len; i++) {
      arg = args[i];
      results.push(expect(stepDef.getPatternRegexp().exec(stepName)).to.not.contain(arg));
    }
    return results;
  };

  before(function() {
    browser.get('http://localhost:9001/');
    return browser.manage().timeouts().implicitlyWait(100);
  });

  beforeEach(function() {
    return currentStepResult = {};
  });

  describe('___ (covered by ___)', function() {
    return describe('regex', function() {
      before(function() {
        return stepPattern = '/^.*\\(covered by .*\\)$/';
      });
      return it('should match "I am on the Moon (covered by MoonUnit)"', function() {
        return verifyStepMatch('I am on the Moon (covered by MoonUnit)');
      });
    });
  });

  describe('I am on the "___" page', function() {

    describe('regex', function() {

      before(function() {
        return stepPattern = '/^I (?:am on|go to) the "([^"]*)" page$/';
      });

      it('should match "I am on..."', function() {
        return verifyStepMatch('I am on the "Test" page');
      });

      it('should match "I go to..."', function() {
        return verifyStepMatch('I go to the "Test" page');
      });

      it('should not capture "am on"', function() {
        return verifyStepDoesNotCapture('I am on the "Test" page', 'am on');
      });

      it('should capture the page name', function() {
        return verifyStepCaptures('I go to the "Test" page', 'Test');
      });

    });

    describe('execution', function() {

      var stubPage;
      stubPage = {};

      beforeEach(function() {
        stubPage = {
          get: sinon.stub().resolves(),
          waitForLoaded: sinon.stub().resolves()
        };
        world = {
          pageObjectMap: {
            Test: function() {
              return stubPage;
            }
          }
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });

      afterEach(function() {
        sandbox.restore();
        return initScenarioRunner();
      });

      it('should set the currentPage on the World', function() {
        return executeStep('I am on the "Test" page', function() {
          return expect(world.currentPage).to.equal(stubPage);
        });
      });
      it('should call get on the page', function() {
        return executeStep('I am on the "Test" page', function() {
          return expect(stubPage.get.calledOnce).to.equal(true);
        });
      });
      it('should call waitForLoaded on the page', function() {
        return executeStep('I am on the "Test" page', function() {
          return expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
        });
      });
      return it('should provide a clear error message if the Page Object was not added to the PageObjectMap', function() {
        return executeStep('I am on the "Missing" page', function() {
          return expect(currentStepResult.getFailureException().toString()).to.equal("Error: Could not find page with name 'Missing' in the PageObjectMap, did you remember to add it?");
        });
      });
    });
  });
  describe('I have a ___x___ screen size', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I (?:have|change to|resize to|rotate to) a (\\d+)x(\\d+) screen size$/';
      });
      it('should match "I have..."', function() {
        return verifyStepMatch('I have a 800x600 screen size');
      });
      it('should match "I change to..."', function() {
        return verifyStepMatch('I change to a 800x600 screen size');
      });
      it('should match "I resize to..."', function() {
        return verifyStepMatch('I resize to a 800x600 screen size');
      });
      it('should match "I rotate to..."', function() {
        return verifyStepMatch('I rotate to a 800x600 screen size');
      });
      it('should not capture "have"', function() {
        return verifyStepDoesNotCapture('I have a 800x600 screen size', 'have');
      });
      return it('should capture the dimensions', function() {
        return verifyStepCaptures('I have a 800x600 screen size', '800', '600');
      });
    });
    return describe('execution', function() {
      return it('should set the browser resolution', function() {
        return executeStep('I have a 800x600 screen size', function() {
          return browser.manage().window().getSize().then(function(size) {
            expect(size.width).to.equal(800);
            return expect(size.height).to.equal(600);
          });
        });
      });
    });
  });
  describe('I navigate backwards in my browser', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I (?:navigate|click) (?:backwards|back) in my browser$/';
      });
      it('should match "I navigate..."', function() {
        return verifyStepMatch('I navigate backwards in my browser');
      });
      it('should match "I click..."', function() {
        return verifyStepMatch('I click back in my browser');
      });
      it('should match "...backwards..."', function() {
        return verifyStepMatch('I click backwards in my browser');
      });
      it('should match "...back..."', function() {
        return verifyStepMatch('I navigate back in my browser');
      });
      return it('should not capture "navigate" or "backwards"', function() {
        return verifyStepDoesNotCapture('I navigate backwards in my browser', 'navigate', 'backwards');
      });
    });
    return describe('execution', function() {
      var navigateSpy;
      navigateSpy = sinon.spy();
      beforeEach(function() {
        return sinon.stub(browser, 'navigate', function() {
          return {
            back: navigateSpy
          };
        });
      });
      afterEach(function() {
        return browser.navigate.restore();
      });
      return it('should navigate backward in the browser', function() {
        return executeStep('I navigate backwards in my browser', function() {
          return expect(navigateSpy.calledOnce).to.equal(true);
        });
      });
    });
  });
  describe('I type "___" in the "___" field', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I type "([^"]*)" in(?:to)? the "([^"]*)" field$/';
      });
      it('should match "...in..."', function() {
        return verifyStepMatch('I type "First" in the "Name" field');
      });
      it('should match "...into..."', function() {
        return verifyStepMatch('I type "First" into the "Name" field');
      });
      it('should not capture "to"', function() {
        return verifyStepDoesNotCapture('I type "First" into the "Name" field', 'to');
      });
      return it('should capture the text and field name', function() {
        return verifyStepCaptures('I type "First" in the "Name" field', 'First', 'Name');
      });
    });
    return describe('execution', function() {
      beforeEach(function() {
        world = {
          transform: {
            stringToVariableName: sinon.stub().returns('nameField')
          },
          currentPage: {
            nameField: {
              clear: sinon.stub(),
              sendKeys: sinon.stub().resolves()
            }
          }
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      afterEach(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      return it('should clear and send the text to the field', function() {
        return executeStep('I type "First" in the "Name" field', function() {
          expect(world.transform.stringToVariableName.calledOnce).to.equal(true);
          expect(world.currentPage.nameField.clear.calledOnce).to.equal(true);
          expect(world.currentPage.nameField.sendKeys.calledOnce).to.equal(true);
          return expect(world.currentPage.nameField.sendKeys.calledWithExactly('First')).to.equal(true);
        });
      });
    });
  });
  describe('I click the "___" link', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I click the "([^"]*)"(?: )?(link|button|drop down list|tab|)$/';
      });
      it('should match "...link"', function() {
        return verifyStepMatch('I click the "Search" link');
      });
      it('should match "...button"', function() {
        return verifyStepMatch('I click the "Search" button');
      });
      it('should match "...drop down list"', function() {
        return verifyStepMatch('I click the "Search" drop down list');
      });
      it('should match "...tab"', function() {
        return verifyStepMatch('I click the "Search" tab');
      });
      it('should match an empty element type', function() {
        return verifyStepMatch('I click the "Search"');
      });
      it('should capture the element name and type', function() {
        return verifyStepCaptures('I click the "Search" tab', 'Search', 'tab');
      });
      it('should capture the element name and a blank string if no element type is provided', function() {
        return verifyStepCaptures('I click the "Search"', 'Search', '');
      });
      return it('should not capture the space', function() {
        return verifyStepDoesNotCapture('I click the "Search" tab', ' ');
      });
    });
    return describe('execution', function() {
      beforeEach(function() {
        world = {
          transform: {
            elementTypeToVariableName: sinon.stub().returns('Button'),
            stringToVariableName: sinon.stub().returns('searchButton')
          },
          currentPage: {
            searchButton: {
              click: sinon.stub()
            }
          }
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      afterEach(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      return it('should click the element', function() {
        return executeStep('I click the "Search" button', function() {
          expect(world.transform.elementTypeToVariableName.calledOnce).to.equal(true);
          expect(world.transform.stringToVariableName.calledOnce).to.equal(true);
          expect(world.transform.stringToVariableName.calledWithExactly('SearchButton')).to.equal(true);
          return expect(world.currentPage.searchButton.click.calledOnce).to.equal(true);
        });
      });
    });
  });
  describe('I refresh the page', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I refresh the page$/';
      });
      return it('should match "I refresh the page"', function() {
        return verifyStepMatch('I refresh the page');
      });
    });
    return describe('execution', function() {
      beforeEach(function() {
        return sinon.stub(browser, 'refresh');
      });
      afterEach(function() {
        return browser.refresh.restore();
      });
      return it('should refresh the page', function() {
        return executeStep('I refresh the page', function() {
          return expect(browser.refresh.calledOnce).to.equal(true);
        });
      });
    });
  });
  describe('I select "___" in the "___" drop down list', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I select "([^"]*)" in the "([^"]*)" drop down list$/';
      });
      it('should match \'I select "Mountain Standard" in the "Time Zone" drop down list\'', function() {
        return verifyStepMatch('I select "Mountain Standard" in the "Time Zone" drop down list');
      });
      return it('should capture the option text and the name of the drop down list', function() {
        return verifyStepCaptures('I select "Mountain Standard" in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          timeZoneSelect: $('select#timezone')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      beforeEach(function() {
        return browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');").then(function() {
          return browser.driver.switchTo().frame('js-fixtures');
        });
      });
      afterEach(function() {
        return browser.driver.switchTo().defaultContent().then(function() {
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
      });
      return it('should select the correct option by its text from the correct drop-down', function() {
        return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
          return Promise.all([expect(element(By.cssContainingText('option', 'Eastern Standard')).isSelected()).to.eventually.equal(false), expect(element(By.cssContainingText('option', 'Central Standard')).isSelected()).to.eventually.equal(false), expect(element(By.cssContainingText('option', 'Mountain Standard')).isSelected()).to.eventually.equal(true)]);
        });
      });
    });
  });
  describe('the title should equal "___"', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^the title should equal "([^"]*)"$/';
      });
      it('should match \'the title should equal "My Title"\'', function() {
        return verifyStepMatch('the title should equal "My Title"');
      });
      return it('should capture the title', function() {
        return verifyStepCaptures('the title should equal "My Title"', 'My Title');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      it('should succeed if the page title matches the supplied title', function() {
        return executeStep('the title should equal "Protractor Integration Test Page"', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
        });
      });
      return it('should fail if the page title does not match the supplied title', function() {
        return executeStep('the title should equal "Fake Title"', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
  describe('the "___" should be active', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^the "([^"]*)" (should|should not) be active$/';
      });
      it('should match "...should be active"', function() {
        return verifyStepMatch('the "Active Field" should be active');
      });
      it('should match "...should not be active"', function() {
        return verifyStepMatch('the "Inactive Field" should not be active');
      });
      return it('should capture the element name and expectation', function() {
        return verifyStepCaptures('the "Inactive Field" should not be active', 'Inactive Field', 'should not');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          button: $('button#testButton')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      describe('with an active element', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<button id=\"testButton\" class=\"active\">');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if it expects the element to be active', function() {
          return executeStep('the "Button" should be active', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if it expects the element to be inactive', function() {
          return executeStep('the "Button" should not be active', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
      return describe('with an inactive element', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<button id=\"testButton\">');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should fail if it expects the element to be active', function() {
          return executeStep('the "Button" should be active', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
        return it('should succeed if it expects the element to be inactive', function() {
          return executeStep('the "Button" should not be active', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
      });
    });
  });
  describe('the "___" should be present', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^the "([^"]*)" should be present$/';
      });
      it('should match \'the "Home Button" should be present\'', function() {
        return verifyStepMatch('the "Home Button" should be present');
      });
      return it('should capture the element name', function() {
        return verifyStepCaptures('the "Home Button" should be present', 'Home Button');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          button: $('button#testButton')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      describe('with element present', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<button id=\"testButton\">');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        return it('should succeed', function() {
          return executeStep('the "Button" should be present', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
      });
      return describe('without element present', function() {
        return it('should fail', function() {
          return executeStep('the "Button" should be present', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
    });
  });
  describe('I should be on the "___" page', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^I (?:should be on|reach|am taken to) the "([^"]*)" page$/';
      });
      it('should match "I should be on..."', function() {
        return verifyStepMatch('I should be on the "Home" page');
      });
      it('should match "I reach..."', function() {
        return verifyStepMatch('I reach the "Home" page');
      });
      it('should match "I am taken to"', function() {
        return verifyStepMatch('I am taken to the "Home" page');
      });
      it('should capture the page name', function() {
        return verifyStepCaptures('I should be on the "Home" page', 'Home');
      });
      return it('should not capture "should be on"', function() {
        return verifyStepDoesNotCapture('I should be on the "Home" page', 'should be on');
      });
    });
    return describe('execution', function() {
      var stubPage;
      stubPage = {};
      beforeEach(function() {
        stubPage = {
          waitForLoaded: sinon.stub().resolves()
        };
        world = {
          pageObjectMap: {
            Test: function() {
              return stubPage;
            }
          }
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      afterEach(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      it('should set the currentPage on the World', function() {
        executeStep('I should be on the "Test" page');
        return expect(world.currentPage).to.equal(stubPage);
      });
      return it('should call waitForLoaded on the page', function() {
        executeStep('I should be on the "Test" page');
        return expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
      });
    });
  });
  describe('"___" should have the text "___"', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^(?:the )?"([^"]*)" should (?:have|contain) the text "([^"]*)"$/';
      });
      it('should match \'the "Field" should...\'', function() {
        return verifyStepMatch('the "Field" should contain the text "Text String"');
      });
      it('should match \'"Field" should...\'', function() {
        return verifyStepMatch('"Field" should contain the text "Text String"');
      });
      it('should match \'..."Field" should contain...\'', function() {
        return verifyStepMatch('the "Field" should contain the text "Text String"');
      });
      it('should match \'..."Field" should have...\'', function() {
        return verifyStepMatch('the "Field" should have the text "Text String"');
      });
      it('should capture the field name and text string', function() {
        return verifyStepCaptures('the "Field" should contain the text "Text String"', 'Field', 'Text String');
      });
      return it('should not capture "the" or "contain"', function() {
        return verifyStepDoesNotCapture('the "Field" should contain the text "Text String"', 'the', 'contain');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          testSpan: $('span#testSpan'),
          testInput: $('input#testInput')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      describe('with a span', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<span id=\"testSpan\">Span Text</span>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if the element contains the expected text', function() {
          return executeStep('the "Test Span" should contain the text "Span Text"', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if the element does not contain the expected text', function() {
          return executeStep('the "Test Span" should contain the text "Fake Text"', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
      return describe('with an input', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<input id=\"testInput\"/>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if the element contains the expected text', function() {
          element(By.css('input')).sendKeys("Input Text");
          return executeStep('the "Test Input" should contain the text "Input Text"', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if the element does not contain the expected text', function() {
          return executeStep('the "Test Input" should contain the text "Input Text"', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
    });
  });
  describe('"___" should appear in the "___" drop down list', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^"([^"]*)" should appear in the "([^"]*)" drop down list$/';
      });
      it('should match \'"Mountain Time" should appear in the "Time Zone" drop down list\'', function() {
        return verifyStepMatch('"Mountain Time" should appear in the "Time Zone" drop down list');
      });
      return it('should capture the option text and drop down list name', function() {
        return verifyStepCaptures('"Mountain Time" should appear in the "Time Zone" drop down list', 'Mountain Time', 'Time Zone');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          timeZoneSelect: $('select#timezone')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      beforeEach(function() {
        browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');");
        return browser.driver.switchTo().frame('js-fixtures');
      });
      afterEach(function() {
        browser.driver.switchTo().defaultContent();
        return browser.driver.executeScript("fixtures.cleanUp();");
      });
      it('should succeed if the expected option is in the drop down list', function() {
        return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
        });
      });
      return it('should fail if the expected option is not in the drop down list', function() {
        return executeStep('"Pacific Standard" should appear in the "Time Zone" drop down list', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
  describe('the "___" should be displayed', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^the "([^"]*)" (should|should not) be displayed$/';
      });
      it('should match "...should be displayed"', function() {
        return verifyStepMatch('the "Save Button" should be displayed');
      });
      it('should match "...should not be displayed"', function() {
        return verifyStepMatch('the "Cancel Button" should not be displayed');
      });
      return it('should capture the element name and expectation', function() {
        return verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', 'should not');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          testSpan: element(By.css('span#testSpan'))
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      describe('with the element displayed', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<span id=\"testSpan\">Span Text</span>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if it expects the element to be displayed', function() {
          return executeStep('the "Test Span" should be displayed', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if it expects the element to not be displayed', function() {
          return executeStep('the "Test Span" should not be displayed', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
      describe('without the element displayed', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<span id=\"testSpan\" style=\"display:none;\">Span Text</span>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if it expects the element to not be displayed', function() {
          return executeStep('the "Test Span" should not be displayed', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if it expects the element to be displayed', function() {
          return executeStep('the "Test Span" should be displayed', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
      return describe('without the element present', function() {
        it('should succeed if it expects the element to not be displayed', function() {
          return executeStep('the "Test Span" should not be displayed', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if it expects the element to be displayed', function() {
          return executeStep('the "Test Span" should be displayed', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
    });
  });
  describe('the "___" should have the placeholder text "___"', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^(?:the )?"([^"]*)" should (?:have|contain) the placeholder text "([^"]*)"$/';
      });
      it('should match a step starting with "the..."', function() {
        return verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
      });
      it('should match a step that does not start with "the..."', function() {
        return verifyStepMatch('"Username Field" should have the placeholder text "Enter Username"');
      });
      it('should match "...should have the placeholder text..."', function() {
        return verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
      });
      it('should match "...should contain the placeholder text..."', function() {
        return verifyStepMatch('the "Username Field" should contain the placeholder text "Enter Username"');
      });
      it('should capture the element name and placeholder text', function() {
        return verifyStepCaptures('the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', 'Enter Username');
      });
      return it('should not capture "the" or "have"', function() {
        return verifyStepDoesNotCapture('the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          testInput: $('input#testInput')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      beforeEach(function() {
        browser.driver.executeScript("fixtures.set('<input id=\"testInput\" placeholder=\"Test Placeholder\" />');");
        return browser.driver.switchTo().frame('js-fixtures');
      });
      afterEach(function() {
        browser.driver.switchTo().defaultContent();
        return browser.driver.executeScript("fixtures.cleanUp();");
      });
      it('should succeed if the element contains the expected placeholder text', function() {
        return executeStep('the "Test Input" should have the placeholder text "Test Placeholder"', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
        });
      });
      return it('should fail if the element does not contain the expected placeholder text', function() {
        return executeStep('the "Test Input" should have the placeholder text "Fake Placeholder"', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
  describe('the "___" should be enabled', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^the "([^"]*)"(?: )?(button|field|drop down list|) (should|should not) be enabled$/';
      });
      it('should match \'the "___" button...\'', function() {
        return verifyStepMatch('the "Save Configuration" button should be enabled');
      });
      it('should match \'the "___" field...\'', function() {
        return verifyStepMatch('the "Username" field should be enabled');
      });
      it('should match \'the "___" drop down list...\'', function() {
        return verifyStepMatch('the "Timezone" drop down list should be enabled');
      });
      it('should match a step without an element type', function() {
        return verifyStepMatch('the "Save Button" should be enabled');
      });
      it('should match \'...should be enabled\'', function() {
        return verifyStepMatch('the "Save Configuration" button should be enabled');
      });
      it('should match \'...should not be enabled\'', function() {
        return verifyStepMatch('the "Save Configuration" button should not be enabled');
      });
      it('should capture the element name, element type and the expectation', function() {
        return verifyStepCaptures('the "Save Configuration" button should be enabled', 'Save Configuration', 'button', 'should');
      });
      return it('should not capture the optional space', function() {
        return verifyStepDoesNotCapture('the "Save Configuration" button should be enabled', ' ');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          testButton: $('button#testButton')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      describe('with enabled button', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<button id=\"testButton\">Button</button>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if it expects the button to be enabled', function() {
          return executeStep('the "Test" button should be enabled', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if it expects the button to be disabled', function() {
          return executeStep('the "Test" button should not be enabled', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
      return describe('with disabled button', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<button id=\"testButton\" disabled>Button</button>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should fail if it expects the button to be enabled', function() {
          return executeStep('the "Test" button should be enabled', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
        return it('should succeed if it expects the button to be disabled', function() {
          return executeStep('the "Test" button should not be enabled', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
      });
    });
  });
  describe('"___" should be selected in the "___" drop down list', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^"([^"]*)" should be (?:selected|displayed) in the "([^"]*)" drop down list$/';
      });
      it('should match \'...should be selected...\'', function() {
        return verifyStepMatch('"Mountain Standard" should be selected in the "Time Zone" drop down list');
      });
      it('should match \'...should be displayed...\'', function() {
        return verifyStepMatch('"Mountain Standard" should be displayed in the "Time Zone" drop down list');
      });
      it('should capture the option text and list name', function() {
        return verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone');
      });
      return it('should not capture "selected"', function() {
        return verifyStepDoesNotCapture('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          timeZoneSelect: $('select#timezone')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      beforeEach(function() {
        browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');");
        return browser.driver.switchTo().frame('js-fixtures');
      });
      afterEach(function() {
        browser.driver.switchTo().defaultContent();
        return browser.driver.executeScript("fixtures.cleanUp();");
      });
      it('should succeed if the expected option is selected', function() {
        return executeStep('"Eastern Standard" should be selected in the "Time Zone" drop down list', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
        });
      });
      return it('should fail if the expected option is not selected', function() {
        return executeStep('"Mountain Standard" should be selected in the "Time Zone" drop down list', function() {
          return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
  return describe('the "___" should be checked', function() {
    describe('regex', function() {
      before(function() {
        return stepPattern = '/^the "([^"]*)"(?: )?(checkbox|) (should|should not) be checked$/';
      });
      it('should match "...checkbox..."', function() {
        return verifyStepMatch('the "Enable Emails" checkbox should be checked');
      });
      it('should match a step without an element type', function() {
        return verifyStepMatch('the "Enable Emails Checkbox" should be checked');
      });
      it('should match "...should..."', function() {
        return verifyStepMatch('the "Enable Emails" checkbox should be checked');
      });
      return it('should match "...should not..."', function() {
        return verifyStepMatch('the "Enable Emails" checkbox should not be checked');
      });
    });
    return describe('execution', function() {
      before(function() {
        world = new World(function() {});
        world.currentPage = {
          testCheckbox: $('input#testCheckbox')
        };
        sandbox.stub(supportCodeLibrary, 'instantiateNewWorld').returns(world);
        return initScenarioRunner();
      });
      after(function() {
        sandbox.restore();
        return initScenarioRunner();
      });
      describe('with a selected checkbox', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\" checked/>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should succeed if it expects the checkbox to be selected', function() {
          return executeStep('the "Test" checkbox should be checked', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
        return it('should fail if it expects the checkbox to not be selected', function() {
          return executeStep('the "Test" checkbox should not be checked', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
      });
      return describe('with an unselected checkbox', function() {
        beforeEach(function() {
          browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\"/>');");
          return browser.driver.switchTo().frame('js-fixtures');
        });
        afterEach(function() {
          browser.driver.switchTo().defaultContent();
          return browser.driver.executeScript("fixtures.cleanUp();");
        });
        it('should fail if it expects the checkbox to be selected', function() {
          return executeStep('the "Test" checkbox should be checked', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.FAILED);
          });
        });
        return it('should succeed if it expects the checkbox to not be selected', function() {
          return executeStep('the "Test" checkbox should not be checked', function() {
            return expect(currentStepResult.getStatus()).to.equal(Cucumber.Status.PASSED);
          });
        });
      });
    });
  });
});
