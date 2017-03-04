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
        return browser.driver.executeScript("$('body').append('<button id=\"testButton\">Button</button>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('button#testButton').remove();");
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
        return browser.driver.executeScript("$('body').append('<button id=\"testButton\" disabled>Button</button>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('button#testButton').remove();");
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

  describe('timing', function() {
    before(function() {
      world.currentPage = {
        testButton: $('button#testButton')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove();");
    });

    it('should wait for the element to be present before verifying', function() {
      return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<button id=\"testButton\">Button</button>'); }, 200 )").then(() => {
        return executeStep('the "Test" button should be enabled', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
