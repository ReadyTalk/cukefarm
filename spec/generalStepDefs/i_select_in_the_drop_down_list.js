describe('I select "___" in the "___" drop down list', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = 'I select "{optionText:captureString}" in the "{name:elementName}"{type:elementType}';
    });

    it('should match \'I select "Mountain Standard" in the "Time Zone" drop down list\'', function() {
      verifyStepMatch('I select "Mountain Standard" in the "Time Zone" drop down list');
    });

    it('should capture the option text, element name, and element type', function() {
      verifyStepCaptures('I select "Mountain Standard" in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone', ' drop down list');
    });

    it('should capture the option text, element name, and a blank string if no element type is provided', function() {
      verifyStepCaptures('I select "Mountain Standard" in the "Time Zone"', 'Mountain Standard', 'Time Zone', '');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        timeZoneSelect: $('select#timezone')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');").then(function() {
        return browser.driver.switchTo().frame('js-fixtures');
      });
    });

    afterEach(function() {
      return browser.driver.switchTo().defaultContent().then(function() {
        return browser.driver.executeScript("fixtures.cleanUp();");
      });
    });

    it('should select the correct option by its text from the correct drop-down', function() {
      return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
        return Promise.all([expect(element(By.cssContainingText('option', 'Eastern Standard')).isSelected()).to.eventually.equal(false), expect(element(By.cssContainingText('option', 'Central Standard')).isSelected()).to.eventually.equal(false), expect(element(By.cssContainingText('option', 'Mountain Standard')).isSelected()).to.eventually.equal(true)]);
      });
    });
  });
});
