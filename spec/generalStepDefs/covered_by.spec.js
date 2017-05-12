describe('___ (covered by ___)', function() {
  this.timeout(6000);

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = '/^.*(covered by .*)$/';
    });

    it('should match "I am on the Moon (covered by MoonUnit)"', function() {
      verifyStepMatch('I am on the Moon (covered by MoonUnit)');
    });
  });
});
