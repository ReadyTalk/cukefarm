describe('I should be on the "___" page', function() {
  this.timeout(6000);

  describe('regex', function() {
    before(function() {
      stepPattern = 'I (should be on|reach|am taken to) the "{pageName:captureString}" page';
    });

    it('should match "I should be on..."', function() {
      verifyStepMatch('I should be on the "Home" page');
    });

    it('should match "I reach..."', function() {
      verifyStepMatch('I reach the "Home" page');
    });

    it('should match "I am taken to"', function() {
      verifyStepMatch('I am taken to the "Home" page');
    });

    it('should capture the page name', function() {
      verifyStepCaptures('I should be on the "Home" page', 'Home');
    });

    it('should not capture "should be on"', function() {
      verifyStepDoesNotCapture('I should be on the "Home" page', 'should be on');
    });
  });

  describe('execution', function() {
    var stubPage;
    stubPage = {};

    beforeEach(function() {
      stubPage = {
        waitForLoaded: sinon.stub().resolves()
      };

      world.pageObjectMap = {
        Test: function() {
          return stubPage;
        }
      };
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should set the currentPage on the World', function() {
      return executeStep('I should be on the "Test" page', function() {
        expect(world.currentPage).to.equal(stubPage);
      });
    });

    it('should call waitForLoaded on the page', function() {
      return executeStep('I should be on the "Test" page', function() {
        expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
      });
    });
  });
});
