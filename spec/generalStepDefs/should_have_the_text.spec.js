describe('"___" should have the text "___"', function() {

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = '(the )"{elementName}"{elementType} {shouldToBoolean} have/contain the text "{captureString}"';
    });

    it('should match \'the "Test Field" should...\'', function() {
      verifyStepMatch('the "Test Field" should contain the text "Text String"');
    });

    it('should match \'the "Test Field" should not...\'', function() {
      verifyStepMatch('the "Test Field" should not contain the text "Text String"');
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

    it('should capture the element name, element type, expectation, and text string', function() {
      verifyStepCaptures('the "Test" field should contain the text "Text String"', 'Test', ' field', 'should', 'Text String');
    });

    it('should capture the element name, text string, and a blank string if no element type is provided', function() {
      verifyStepCaptures('the "Test Field" should contain the text "Text String"', 'Test Field', '', 'should', 'Text String');
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
        return browser.driver.executeScript("$('body').append('<span id=\"testSpan\">Span Text</span>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('span#testSpan').remove();");
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
        return browser.driver.executeScript("$('body').append('<input id=\"testInput\"/>');");
      });

      afterEach(function() {
        return browser.driver.executeScript("$('input#testInput').remove();");
      });

      describe('and a "should" expectation', function() {
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

      describe('and a "should not" expectation', function() {
        it('should fail if the element contains the expected text', function() {
          return element(By.css('input')).sendKeys("Input Text").then(function() {
            return executeStep('the "Test Input" should not contain the text "Input Text"', function() {
              expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
            });
          });
        });

        it('should fail if the element does not contain the expected text', function() {
          return executeStep('the "Test Input" should not contain the text "Input Text"', function() {
            expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
          });
        });
      });
    });
  });

  describe('timing', function() {
    before(function() {
      world.currentPage = {
        testSpan: $('span#testSpan'),
        testInput: $('input#testInput')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('button#testButton').remove();");
    });

    it('should wait for the element to be present before verifying', function() {
      return browser.driver.executeScript("setTimeout( function() { $('body').append('<span id=\"testSpan\">Span Text</span>'); }, 200 )").then(() => {
        return executeStep('the "Test Span" should contain the text "Span Text"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
