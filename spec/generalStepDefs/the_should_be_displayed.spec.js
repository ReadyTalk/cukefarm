describe('the "___" should be displayed', function() {
  this.timeout(6000);

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = 'the "{elementName}"{elementType} {shouldToBoolean} be displayed';
    });

    it('should match "...should be displayed"', function() {
      verifyStepMatch('the "Save Button" should be displayed');
    });

    it('should match "...should not be displayed"', function() {
      verifyStepMatch('the "Cancel Button" should not be displayed');
    });

    it('should capture the element name, element type, and expectation', function() {
      verifyStepCaptures('the "Cancel" button should not be displayed', 'Cancel', 'should not');
    });

    it('should capture the element name, expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', '', 'should not');
    });
  });

  describe('execution', function() {
    beforeEach(function() {
      world.currentPage = {
        testSpan: element(By.css('span#testSpan'))
      };
    });

    afterEach(function() {
      delete world.currentPage;
    });

    describe('with the element displayed', function() {
      beforeEach(function() {
        return browser.driver.executeScript("$('body').append('<span id=\"testSpan\">Span Text</span>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('span#testSpan').remove();");
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
        return browser.driver.executeScript("$('body').append('<span id=\"testSpan\" style=\"display:none;\">Span Text</span>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('span#testSpan').remove();");
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

  describe('timing', function() {
    before(function() {
      world.currentPage = {
        testSpan: element(By.css('span#testSpan'))
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove();");
    });

    it('should wait for the element to be displayed before verifying', function() {
      return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<span id=\"testSpan\">Span Text</span>'); }, 200 )").then(() => {
        return executeStep('the "Test Span" should be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
