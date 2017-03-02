describe('I click the "___" link', function() {
  describe('regex', function() {
    before(function() {
      browser.get('http://localhost:9001/');
      return browser.manage().timeouts().implicitlyWait(100);
    });

    before(function() {
      stepPattern = 'I click the "{name:elementName}"{type:elementType}';
    });

    it('should match "...link"', function() {
      verifyStepMatch('I click the "Search" link');
    });

    it('should match "...button"', function() {
      verifyStepMatch('I click the "Search" button');
    });

    it('should match "...drop down list"', function() {
      verifyStepMatch('I click the "Search" drop down list');
    });

    it('should match "...tab"', function() {
      verifyStepMatch('I click the "Search" tab');
    });

    it('should match an empty element type', function() {
      verifyStepMatch('I click the "Search"');
    });

    it('should capture the element name and type', function() {
      verifyStepCaptures('I click the "Search" tab', 'Search', ' tab');
    });

    it('should capture the element name and a blank string if no element type is provided', function() {
      verifyStepCaptures('I click the "Search"', 'Search', '');
    });
  });

  describe('execution', function() {
    beforeEach(function() {
      world.currentPage = {
        searchButton: {
          click: sinon.stub()
        }
      };
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should click the element', function() {
      return executeStep('I click the "Search" button', function() {
        expect(world.currentPage.searchButton.click).to.have.been.calledOnce;
      });
    });
  });
});
