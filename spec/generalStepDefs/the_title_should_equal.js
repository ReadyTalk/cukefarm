describe('the title should equal "___"', function() {
  describe('regex', function() {
    beforeEach(function() {
      currentStepResult = {};
    });

    before(function() {
      stepPattern = 'the title should equal "{text:captureString}"';
    });

    it('should match \'the title should equal "My Title"\'', function() {
      verifyStepMatch('the title should equal "My Title"');
    });

    it('should capture the title', function() {
      verifyStepCaptures('the title should equal "My Title"', 'My Title');
    });
  });

  describe('execution', function() {
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
});
