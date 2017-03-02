describe('the "___" should be active', function() {
  describe('regex', function() {
    beforeEach(function() {
      currentStepResult = {};
    });

    before(function() {
      stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be active';
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
        browser.driver.executeScript("fixtures.set('<button id=\"testButton\" class=\"active\">');");
        return browser.driver.switchTo().frame('js-fixtures');
      });

      afterEach(function() {
        browser.driver.switchTo().defaultContent();
        return browser.driver.executeScript("fixtures.cleanUp();");
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
        browser.driver.executeScript("fixtures.set('<button id=\"testButton\">');");
        return browser.driver.switchTo().frame('js-fixtures');
      });

      afterEach(function() {
        browser.driver.switchTo().defaultContent();
        return browser.driver.executeScript("fixtures.cleanUp();");
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
});
