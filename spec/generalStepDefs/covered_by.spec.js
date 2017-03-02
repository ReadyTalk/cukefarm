describe('___ (covered by ___)', function() {
  //before(function() {
  //  browser.get('http://localhost:9001/');
  //  return browser.manage().timeouts().implicitlyWait(100);
  //});

  describe('regex', function() {
    before(function() {
      stepPattern = '/^.*(covered by .*)$/';
    });

    it('should match "I am on the Moon (covered by MoonUnit)"', function() {
      verifyStepMatch('I am on the Moon (covered by MoonUnit)');
    });
  });
});
