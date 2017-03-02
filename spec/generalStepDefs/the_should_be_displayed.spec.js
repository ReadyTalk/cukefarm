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

    it('should capture the element name, element type, and expectation', function() {
      verifyStepCaptures('the "Cancel" button should not be displayed', 'Cancel', 'should not');
    });

    it('should capture the element name, expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', '', 'should not');
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
