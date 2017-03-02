describe('I type "___" in the "___" field', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'I type "{text:captureString}" in(to|) the "{name:elementName}"{type:elementType}';
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
});
