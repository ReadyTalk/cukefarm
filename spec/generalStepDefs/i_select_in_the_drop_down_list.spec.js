describe('I select "___" in the "___" drop down list', function() {

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = 'I select "{captureString}" in the "{elementName}"{elementType}';
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
      return browser.driver.executeScript("$('body').append(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('select#timezone').remove()");
    });

    it('should select the correct option by its text from the correct drop-down', function() {
      return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
        return Promise.all([
          expect(element(By.cssContainingText('option', 'Eastern Standard')).isSelected()).to.eventually.equal(false),
          expect(element(By.cssContainingText('option', 'Central Standard')).isSelected()).to.eventually.equal(false),
          expect(element(By.cssContainingText('option', 'Mountain Standard')).isSelected()).to.eventually.equal(true)
        ]);
      });
    });
  });

  describe('timing', function() {
    beforeEach(function() {
      world.currentPage = {
        timeZoneSelect: $('select#timezone')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove()");
    });

    it('should wait for the drop down menu to appear before selecting', function() {
      return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>'); }, 200 )").then(() => {
        return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
