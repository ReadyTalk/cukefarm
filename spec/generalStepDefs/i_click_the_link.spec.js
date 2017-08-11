describe('I click the "___" link', function() {

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = 'I click the "{elementName}"{elementType}';
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
      verifyStepMatch('I click the "Search Button"');
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
      sandbox.stub(browser, 'wait').resolves();

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

  describe('timing', function() {
    beforeEach(function() {
      world.currentPage = {
        searchButton: $('button#search')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove()");
    });

    it('should wait for the button to appear before clicking', function() {
      return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append('<button id=\"search\"></button>'); }, 200 )").then(() => {
        return executeStep('I click the "Search" button', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
