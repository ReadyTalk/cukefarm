describe('I navigate backwards in my browser', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'I (navigate|click) (backwards|back) in my browser';
    });

    it('should match "I navigate..."', function() {
      verifyStepMatch('I navigate backwards in my browser');
    });

    it('should match "I click..."', function() {
      verifyStepMatch('I click back in my browser');
    });

    it('should match "...backwards..."', function() {
      verifyStepMatch('I click backwards in my browser');
    });

    it('should match "...back..."', function() {
      verifyStepMatch('I navigate back in my browser');
    });

    it('should not capture "navigate" or "backwards"', function() {
      verifyStepDoesNotCapture('I navigate backwards in my browser', 'navigate', 'backwards');
    });
  });

  describe('execution', function() {
    var navigateSpy;
    navigateSpy = sinon.spy();

    beforeEach(function() {
      sinon.stub(browser, 'navigate', function() {
        return {
          back: navigateSpy
        };
      });
    });

    afterEach(function() {
      return browser.navigate.restore();
    });

    it('should navigate backward in the browser', function() {
      return executeStep('I navigate backwards in my browser', function() {
        return expect(navigateSpy.calledOnce).to.equal(true);
      });
    });
  });
});
