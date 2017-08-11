describe('the "___" should be displayed', function() {

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
    after(function() {
      return browser.driver.executeScript("$('span.testSpan').remove();");
    });

    describe('with the element displayed', function() {
      it('should succeed if it expects the element to be displayed', function() {
        browser.driver.executeScript("$('body').append('<span id=\"testSpan1\" class=\"testSpan\">Span Text</span>');");
        world.currentPage = {
          testSpan: element(By.css('span#testSpan1'))
        };

        return executeStep('the "Test Span" should be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to not be displayed', function() {
        browser.driver.executeScript("$('body').append('<span id=\"testSpan2\" class=\"testSpan\">Span Text</span>');");
        world.currentPage = {
          testSpan: element(By.css('span#testSpan2'))
        };

        return executeStep('the "Test Span" should not be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('without the element displayed', function() {
      it('should succeed if it expects the element to not be displayed', function() {
        browser.driver.executeScript("$('body').append('<span id=\"testSpan3\" class=\"testSpan\" style=\"display:none;\">Span Text</span>');");
        world.currentPage = {
          testSpan: element(By.css('span#testSpan3'))
        };

        return executeStep('the "Test Span" should not be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to be displayed', function() {
        browser.driver.executeScript("$('body').append('<span id=\"testSpan4\" class=\"testSpan\" style=\"display:none;\">Span Text</span>');");
        world.currentPage = {
          testSpan: element(By.css('span#testSpan4'))
        };

        return executeStep('the "Test Span" should be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('without the element present', function() {
      it('should succeed if it expects the element to not be displayed', function() {
        world.currentPage = {
          testSpan: element(By.css('span#testSpan5'))
        };

        return executeStep('the "Test Span" should not be displayed', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if it expects the element to be displayed', function() {
        world.currentPage = {
          testSpan: element(By.css('span#testSpan6'))
        };

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
