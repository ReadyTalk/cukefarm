describe('I have a ___x___ screen size', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'I (have|change to|resize to|rotate to) a {width:int}x{height:int} screen size';
    });

    it('should match "I have..."', function() {
      verifyStepMatch('I have a 800x600 screen size');
    });

    it('should match "I change to..."', function() {
      verifyStepMatch('I change to a 800x600 screen size');
    });

    it('should match "I resize to..."', function() {
      verifyStepMatch('I resize to a 800x600 screen size');
    });

    it('should match "I rotate to..."', function() {
      verifyStepMatch('I rotate to a 800x600 screen size');
    });

    it('should not capture "have"', function() {
      verifyStepDoesNotCapture('I have a 800x600 screen size', 'have');
    });

    it('should capture the dimensions', function() {
      verifyStepCaptures('I have a 800x600 screen size', '800', '600');
    });
  });

  describe('execution', function() {
    it('should set the browser resolution', function() {
      return executeStep('I have a 800x600 screen size', function() {
        return browser.manage().window().getSize().then(function(size) {
          expect(size.width).to.equal(800);
          expect(size.height).to.equal(600);
        });
      });
    });
  });
});
