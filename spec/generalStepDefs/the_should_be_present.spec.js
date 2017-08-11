describe('the "___" should be present', function() {

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
      stepPattern = 'the "{elementName}"{elementType} {shouldToBoolean} be present';
    });

    it('should match "...should be present"', function() {
      verifyStepMatch('the "Home Button" should be present');
    });

    it('should match "...should not be present"', function() {
      verifyStepMatch('the "Home Button" should be present');
    });

    it('should capture the element name, element type, and expectation', function() {
      verifyStepCaptures('the "Home" button should be present', 'Home', ' button', 'should');
    });

    it('should capture the element name, expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Home Button" should be present', 'Home Button', '', 'should');
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
        return browser.driver.executeScript("$('body').append('<button id=\"testButton\">');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('button#testButton').remove();");
      });

      it('should succeed if it expects the element to be present', function() {
        return executeStep('the "Button" should be present', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element not to be present', function() {
        return executeStep('the "Button" should not be present', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('without element present', function() {
      it('should fail if it expects the element to be present', function() {
        return executeStep('the "Button" should be present', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should succeed if it expects the element not to be present', function() {
        return executeStep('the "Button" should not be present', function() {
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
      return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<button id=\"testButton\">'); }, 200 )").then(() => {
        return executeStep('the "Button" should be present', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
