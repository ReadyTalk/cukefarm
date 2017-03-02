describe('the "___" should be present', function() {
  describe('regex', function() {
    beforeEach(function() {
      currentStepResult = {};
    });

    before(function() {
      stepPattern = 'the "{name:elementName}"{type:elementType} should be present';
    });

    it('should match \'the "Home Button" should be present\'', function() {
      verifyStepMatch('the "Home Button" should be present');
    });

    it('should capture the element name and type', function() {
      verifyStepCaptures('the "Home" button should be present', 'Home', ' button');
    });

    it('should capture the element name and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Home Button" should be present', 'Home Button', '');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        button: $('button#testButton')
      };
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

      it('should succeed', function() {
        return executeStep('the "Button" should be present', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });

    describe('without element present', function() {
      it('should fail', function() {
        return executeStep('the "Button" should be present', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
});

describe('I should be on the "___" page', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'I (should be on|reach|am taken to) the "{pageName:captureString}" page';
    });

    it('should match "I should be on..."', function() {
      verifyStepMatch('I should be on the "Home" page');
    });

    it('should match "I reach..."', function() {
      verifyStepMatch('I reach the "Home" page');
    });

    it('should match "I am taken to"', function() {
      verifyStepMatch('I am taken to the "Home" page');
    });

    it('should capture the page name', function() {
      verifyStepCaptures('I should be on the "Home" page', 'Home');
    });

    it('should not capture "should be on"', function() {
      verifyStepDoesNotCapture('I should be on the "Home" page', 'should be on');
    });
  });

  describe('execution', function() {
    var stubPage;
    stubPage = {};

    beforeEach(function() {
      stubPage = {
        waitForLoaded: sinon.stub().resolves()
      };

      world.pageObjectMap = {
        Test: function() {
          return stubPage;
        }
      };
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should set the currentPage on the World', function() {
      return executeStep('I should be on the "Test" page', function() {
        expect(world.currentPage).to.equal(stubPage);
      });
    });

    it('should call waitForLoaded on the page', function() {
      return executeStep('I should be on the "Test" page', function() {
        expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
      });
    });
  });
});

describe('"___" should have the text "___"', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = '(the |)"{name:elementName}"{type:elementType} should (have|contain) the text "{text:captureString}"';
    });

    it('should match \'the "Test Field" should...\'', function() {
      verifyStepMatch('the "Test Field" should contain the text "Text String"');
    });

    it('should match \'"Test Field" should...\'', function() {
      verifyStepMatch('"Test Field" should contain the text "Text String"');
    });

    it('should match \'..."Test Field" should contain...\'', function() {
      verifyStepMatch('the "Test Field" should contain the text "Text String"');
    });

    it('should match \'..."Test Field" should have...\'', function() {
      verifyStepMatch('the "Test Field" should have the text "Text String"');
    });

    it('should capture the element name, element type, and text string', function() {
      verifyStepCaptures('the "Test" field should contain the text "Text String"', 'Test', ' field', 'Text String');
    });

    it('should capture the element name, text string, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Test Field" should contain the text "Text String"', 'Test Field', '', 'Text String');
    });

    it('should not capture "the" or "contain"', function() {
      verifyStepDoesNotCapture('the "Test Field" should contain the text "Text String"', 'the', 'contain');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testSpan: $('span#testSpan'),
        testInput: $('input#testInput')
      };
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if the element does not contain the expected text', function() {
        return executeStep('the "Test Span" should contain the text "Fake Text"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with an input', function() {
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if the element does not contain the expected text', function() {
        return executeStep('the "Test Input" should contain the text "Input Text"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
});

describe('"___" should appear in the "___" drop down list', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = '"{option:captureString}" should appear in the "{name:elementName}"{type:elementType}';
    });

    it('should match \'"Mountain Time" should appear in the "Time Zone" drop down list\'', function() {
      verifyStepMatch('"Mountain Time" should appear in the "Time Zone" drop down list');
    });

    it('should capture the option text, element type, and drop down list name', function() {
      verifyStepCaptures('"Mountain Time" should appear in the "Time Zone" drop down list', 'Mountain Time', 'Time Zone', ' drop down list');
    });

    it('should capture the option text, drop down list name, and a blank string if no element type is provided', function() {
      verifyStepCaptures('"Mountain Time" should appear in the "Time Zone Drop Down List"', 'Mountain Time', 'Time Zone Drop Down List', '');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        timeZoneSelect: $('select#timezone')
      };
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
        expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
      });
    });

    it('should fail if the expected option is not in the drop down list', function() {
      return executeStep('"Pacific Standard" should appear in the "Time Zone" drop down list', function() {
        expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
      });
    });
  });
});

describe('the "___" should be displayed', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be displayed';
    });

    it('should match "...should be displayed"', function() {
      verifyStepMatch('the "Save Button" should be displayed');
    });

    it('should match "...should not be displayed"', function() {
      verifyStepMatch('the "Cancel Button" should not be displayed');
    });

    it('should capture the element name and expectation', function() {
      verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', 'should not');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testSpan: element(By.css('span#testSpan'))
      };
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to not be displayed', function() {
        return executeStep('the "Test Span" should not be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to be displayed', function() {
        return executeStep('the "Test Span" should be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('without the element present', function() {
      it('should succeed if it expects the element to not be displayed', function() {
        return executeStep('the "Test Span" should not be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to be displayed', function() {
        return executeStep('the "Test Span" should be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });
  });
});

describe('the "___" should have the placeholder text "___"', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = '(the |)"{name:elementName}"{type:elementType} {expectation:shouldToBoolean} (have|contain) the placeholder text "{text:captureString}"';
    });

    it('should match a step starting with "the..."', function() {
      verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
    });

    it('should match a step that does not start with "the..."', function() {
      verifyStepMatch('"Username Field" should have the placeholder text "Enter Username"');
    });

    it('should match "...should have the placeholder text..."', function() {
      verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
    });

    it('should match "...should contain the placeholder text..."', function() {
      verifyStepMatch('the "Username Field" should contain the placeholder text "Enter Username"');
    });

    it('should capture the element name and placeholder text', function() {
      verifyStepCaptures('the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', 'Enter Username');
    });

    it('should not capture "the" or "have"', function() {
      verifyStepDoesNotCapture('the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testInput: $('input#testInput')
      };
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
        expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
      });
    });

    it('should fail if the element does not contain the expected placeholder text', function() {
      return executeStep('the "Test Input" should have the placeholder text "Fake Placeholder"', function() {
        expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
      });
    });
  });
});

describe('the "___" should be enabled', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be enabled';
    });

    it('should match \'the "___" button...\'', function() {
      verifyStepMatch('the "Save Configuration" button should be enabled');
    });

    it('should match \'the "___" field...\'', function() {
      verifyStepMatch('the "Username" field should be enabled');
    });

    it('should match \'the "___" drop down list...\'', function() {
      verifyStepMatch('the "Timezone" drop down list should be enabled');
    });

    it('should match a step without an element type', function() {
      verifyStepMatch('the "Save Button" should be enabled');
    });

    it('should match \'...should be enabled\'', function() {
      verifyStepMatch('the "Save Configuration" button should be enabled');
    });

    it('should match \'...should not be enabled\'', function() {
      verifyStepMatch('the "Save Configuration" button should not be enabled');
    });

    it('should capture the element name, element type, and the expectation', function() {
      verifyStepCaptures('the "Save Configuration" button should be enabled', 'Save Configuration', ' button', 'should');
    });

    it('should capture the element name, the expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Save Configuration Button" should be enabled', 'Save Configuration Button', '', 'should');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testButton: $('button#testButton')
      };
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the button to be disabled', function() {
        return executeStep('the "Test" button should not be enabled', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with disabled button', function() {
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should succeed if it expects the button to be disabled', function() {
        return executeStep('the "Test" button should not be enabled', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});

describe('"___" should be selected in the "___" drop down list', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = '"{text:captureString}" {expectation:shouldToBoolean} be (selected|displayed) in the "{name:elementName}"{type:elementType}';
    });

    it('should match \'...should be selected...\'', function() {
      verifyStepMatch('"Mountain Standard" should be selected in the "Time Zone" drop down list');
    });

    it('should match \'...should be displayed...\'', function() {
      verifyStepMatch('"Mountain Standard" should be displayed in the "Time Zone" drop down list');
    });

    it('should capture the option text, expectation, list name, and element type', function() {
      verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'should', 'Time Zone', ' drop down list');
    });

    it('should capture the option text, expectation, list name, and a blank string if no element type is provided', function() {
      verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone Drop Down List"', 'Mountain Standard', 'should', 'Time Zone Drop Down List', '');
    });

    it('should not capture "selected"', function() {
      verifyStepDoesNotCapture('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        timeZoneSelect: $('select#timezone')
      };
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
        expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
      });
    });

    it('should fail if the expected option is not selected', function() {
      return executeStep('"Mountain Standard" should be selected in the "Time Zone" drop down list', function() {
        expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
      });
    });
  });
});

describe('the "___" should be checked', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be checked';
    });

    it('should match "...checkbox..."', function() {
      verifyStepMatch('the "Enable Emails" checkbox should be checked');
    });

    it('should match a step without an element type', function() {
      verifyStepMatch('the "Enable Emails Checkbox" should be checked');
    });

    it('should match "...should..."', function() {
      verifyStepMatch('the "Enable Emails" checkbox should be checked');
    });

    it('should match "...should not..."', function() {
      verifyStepMatch('the "Enable Emails" checkbox should not be checked');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testCheckbox: $('input#testCheckbox')
      };
    });

    describe('with a selected checkbox', function() {
      beforeEach(function() {
        browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" type=\"checkbox\" checked/>');");
        browser.driver.switchTo().frame('js-fixtures');
      });

      afterEach(function() {
        browser.driver.switchTo().defaultContent();
        browser.driver.executeScript("fixtures.cleanUp();");
      });

      it('should succeed if it expects the checkbox to be selected', function() {
        return executeStep('the "Test" checkbox should be checked', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the checkbox to not be selected', function() {
        return executeStep('the "Test" checkbox should not be checked', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with an unselected checkbox', function() {
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
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should succeed if it expects the checkbox to not be selected', function() {
        return executeStep('the "Test" checkbox should not be checked', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
