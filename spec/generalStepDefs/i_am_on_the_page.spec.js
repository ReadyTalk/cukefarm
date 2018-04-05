describe('I am on the "___" page', function() {

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = 'I (am on)(go to) the "{captureString}" page';
    });

    beforeEach(function() {
      currentStepResult = {};
    });

    it('should match "I am on..."', function() {
      return verifyStepMatch('I am on the "Test" page');
    });

    it('should match "I go to..."', function() {
      return verifyStepMatch('I go to the "Test" page');
    });

    it('should not capture "am on"', function() {
      return verifyStepDoesNotCapture('I am on the "Test" page', 'am on');
    });

    it('should capture the page name', function() {
      return verifyStepCaptures('I go to the "Test" page', 'Test');
    });
  });

  describe('execution', function() {
    var stubPage = {};

    beforeEach(function() {
      stubPage = {
        get: sinon.stub().resolves(),
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
      return executeStep('I am on the "Test" page', function() {
        expect(world.currentPage).to.equal(stubPage);
      });
    });

    it('should call get on the page', function() {
      return executeStep('I am on the "Test" page', function() {
        expect(stubPage.get.calledOnce).to.equal(true);
      });
    });

    it('should call waitForLoaded on the page', function() {
      return executeStep('I am on the "Test" page', function() {
        expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
      });
    });

    it('should provide a clear error message if the Page Object was not added to the PageObjectMap', function() {
      return executeStep('I am on the "Missing" page', function() {
        expect(currentStepResult.exception.toString()).to.equal("Error: Could not find page with name 'Missing' in the PageObjectMap, did you remember to add it?");
      });
    });
  });
});
