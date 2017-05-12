describe('I type "___" in the "___" field', function() {
  this.timeout(6000);

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = 'I type "{captureString}" in(to) the "{elementName}"{elementType}';
    });

    it('should match "...in..."', function() {
      verifyStepMatch('I type "First" in the "Name" field');
    });

    it('should match "...into..."', function() {
      verifyStepMatch('I type "First" into the "Name" field');
    });

    it('should not capture "to"', function() {
      verifyStepDoesNotCapture('I type "First" into the "Name" field', 'to');
    });

    it('should capture the text and field name', function() {
      verifyStepCaptures('I type "First" in the "Name" field', 'First', 'Name');
    });
  });

  describe('execution', function() {
    beforeEach(function() {
      sandbox.stub(browser, 'wait').resolves();

      world.currentPage = {
        nameField: {
          clear: sinon.stub(),
          sendKeys: sinon.stub().resolves()
        }
      };
    });

    afterEach(function() {
      sandbox.restore();
    });

    it('should clear and send the text to the field', function() {
      return executeStep('I type "First" in the "Name" field', function() {
        expect(world.currentPage.nameField.clear).to.have.been.calledOnce;
        expect(world.currentPage.nameField.sendKeys).to.have.been.calledOnce;
        expect(world.currentPage.nameField.sendKeys).to.have.been.calledWithExactly('First');
      });
    });
  });

  describe('timing', function() {
    beforeEach(function() {
      world.currentPage = {
        nameField: $('input#name')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove()");
    });

    it('should wait for the input to appear before typing', function() {
      return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append('<input id=\"name\" type=\"text\"></input>'); }, 200 )").then(() => {
        return executeStep('I type "First" in the "Name" field', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
