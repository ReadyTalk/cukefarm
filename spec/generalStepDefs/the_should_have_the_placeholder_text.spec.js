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

    it('should capture the element name, element type, expectation, and placeholder text', function() {
      verifyStepCaptures('the "Username" field should have the placeholder text "Enter Username"', 'Username', ' field', 'should', 'Enter Username');
    });

    it('should capture the element name, placeholder text, expectation, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', '', 'should', 'Enter Username');
    });

    it('should not capture "the" or "have"', function() {
      verifyStepDoesNotCapture('the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have');
    });
  });

  describe('timing', function() {
    before(function() {
      world.currentPage = {
        testInput: $('input#testInput')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<input id=\"testInput\" placeholder=\"Test Placeholder\" />');");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('input#testInput').remove();");
    });

    describe('with the "should" expectation', function() {
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

    describe('with the "should not" expectation', function() {
      it('should succeed if the element contains the expected placeholder text', function() {
        return executeStep('the "Test Input" should not have the placeholder text "Test Placeholder"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should fail if the element does not contain the expected placeholder text', function() {
        return executeStep('the "Test Input" should not have the placeholder text "Fake Placeholder"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        testInput: $('input#testInput')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove();");
    });

    it('should wait for the element to be displayed before verifying', function() {
      return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<input id=\"testInput\" placeholder=\"Test Placeholder\" />'); }, 200 )").then(() => {
        return executeStep('the "Test Input" should have the placeholder text "Test Placeholder"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
