describe('the "___" should be active', function() {

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      browser.get('http://localhost:9001/');
      return browser.manage().timeouts().implicitlyWait(100);
    });

    beforeEach(function() {
      currentStepResult = {};
    });

    before(function() {
      stepPattern = 'the "{elementName}"{elementType} {shouldToBoolean} be active';
    });

    it('should match "...should be active"', function() {
      verifyStepMatch('the "Active Field" should be active');
    });

    it('should match "...should not be active"', function() {
      verifyStepMatch('the "Inactive Field" should not be active');
    });

    it('should capture the element name, element type, and expectation', function() {
      verifyStepCaptures('the "Inactive" field should not be active', 'Inactive', ' field', 'should not');
    });

    it('should capture the element name, expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Inactive Field" should not be active', 'Inactive Field', '', 'should not');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        button: $('button#testButton')
      };
    });

    describe('with an active element', function() {
      beforeEach(function() {
        return browser.driver.executeScript("$('body').append('<button id=\"testButton\" class=\"active\">');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('button#testButton').remove();");
      });

      it('should succeed if it expects the element to be active', function() {
        return executeStep('the "Button" should be active', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to be inactive', function() {
        return executeStep('the "Button" should not be active', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with an inactive element', function() {
      beforeEach(function() {
        return browser.driver.executeScript("$('body').append('<button id=\"testButton\">');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('button#testButton').remove();");
      });

      it('should fail if it expects the element to be active', function() {
        return executeStep('the "Button" should be active', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should succeed if it expects the element to be inactive', function() {
        return executeStep('the "Button" should not be active', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });

  describe('timing', function() {
    before(function() {
      world.currentPage = {
        button: $('button#testButton')
      };
    });

      beforeEach(function() {
        return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('button#testButton').remove();");
      });

    it('should wait for the element to be present before verifying', function() {
      return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append('<button id=\"testButton\" class=\"active\">'); }, 200 )").then(() => {
        return executeStep('the "Button" should be active', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
