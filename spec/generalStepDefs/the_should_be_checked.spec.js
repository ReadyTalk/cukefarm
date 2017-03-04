describe('the "___" should be checked', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be checked';
    });

    it('should match "...should..."', function() {
      verifyStepMatch('the "Enable Emails" checkbox should be checked');
    });

    it('should match "...should not..."', function() {
      verifyStepMatch('the "Enable Emails" checkbox should not be checked');
    });

    it('should capture the element name, element type, and expectation', function() {
      verifyStepCaptures('the "Enable Emails" checkbox should be checked', 'Enable Emails', ' checkbox', 'should');
    });

    it('should capture the element name, expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Enable Emails Checkbox" should be checked', 'Enable Emails Checkbox', 'should');
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
        return browser.driver.executeScript("$('body').append('<input id=\"testCheckbox\" type=\"checkbox\" checked/>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('input#testCheckbox').remove();");
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
        return browser.driver.executeScript("$('body').append('<input id=\"testCheckbox\" type=\"checkbox\"/>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('input#testCheckbox').remove();");
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

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testCheckbox: $('input#testCheckbox')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove();");
    });

    it('should succeed if it expects the checkbox to be selected', function() {
      return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<input id=\"testCheckbox\" type=\"checkbox\" checked/>'); }, 200 )").then(() => {
        return executeStep('the "Test" checkbox should be checked', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
