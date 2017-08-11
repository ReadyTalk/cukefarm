describe('the title should equal "___"', function() {

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
      stepPattern = 'the title {shouldToBoolean} equal "{captureString}"';
    });

    it('should match "...should equal..."', function() {
      verifyStepMatch('the title should equal "My Title"');
    });

    it('should match "...should not equal..."', function() {
      verifyStepMatch('the title should not equal "My Title"');
    });

    it('should capture the title and the expectation', function() {
      verifyStepCaptures('the title should equal "My Title"', 'should', 'My Title');
    });
  });

  describe('execution', function() {
    describe('with a "should" expectation', function() {
      it('should succeed if the page title matches the supplied title', function() {
        return executeStep('the title should equal "Protractor Integration Test Page"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if the page title does not match the supplied title', function() {
        return executeStep('the title should equal "Fake Title"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with a "should not" expectation', function() {
      it('should fail if the page title matches the supplied title', function() {
        return executeStep('the title should not equal "Protractor Integration Test Page"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should succeed if the page title does not match the supplied title', function() {
        return executeStep('the title should not equal "Fake Title"', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
