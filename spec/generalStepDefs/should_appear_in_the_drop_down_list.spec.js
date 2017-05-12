describe('"___" should appear in the "___" drop down list', function() {
  this.timeout(6000);

  before(function() {
    browser.manage().timeouts().implicitlyWait(100);
    return browser.get('http://localhost:9001/');
  });

  describe('regex', function() {
    before(function() {
      stepPattern = '"{captureString}" {shouldToBoolean} appear in the "{elementName}"{elementType}';
    });

    it('should match "...should appear..."', function() {
      verifyStepMatch('"Mountain Time" should appear in the "Time Zone" drop down list');
    });

    it('should match "...should not appear..."', function() {
      verifyStepMatch('"Mountain Time" should not appear in the "Time Zone" drop down list');
    });

    it('should capture the option text, expectation, element type, and drop down list name', function() {
      verifyStepCaptures('"Mountain Time" should appear in the "Time Zone" drop down list', 'should', 'Mountain Time', 'Time Zone', ' drop down list');
    });

    it('should capture the option text, expectation, drop down list name, and a blank string if no element type is provided', function() {
      verifyStepCaptures('"Mountain Time" should appear in the "Time Zone Drop Down List"', 'should', 'Mountain Time', 'Time Zone Drop Down List', '');
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
      return browser.driver.executeScript("$('select#timezone').remove();");
    });

    describe('with the "should" expectation', function() {
      it('should succeed if the expected option is in the drop down list', function() {
        return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if the expected option is not in the drop down list', function() {
        return executeStep('"Pacific Standard" should appear in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with the "should not" expectation', function() {
      it('should fail if the expected option is in the drop down list', function() {
        return executeStep('"Mountain Standard" should not appear in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should succeed if the expected option is not in the drop down list', function() {
        return executeStep('"Pacific Standard" should not appear in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });

  describe('timing', function() {
    before(function() {
      world.currentPage = {
        timeZoneSelect: $('select#timezone')
      };
    });

    beforeEach(function() {
      return browser.driver.executeScript("$('body').append('<div id=\"test\"></div>')");
    });

    afterEach(function() {
      return browser.driver.executeScript("$('div#test').remove();");
    });

    it('should wait for the drop down list to be present before verifying', function() {
      return browser.driver.executeScript("setTimeout( function() { $('div#test').append(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>'); }, 200 )").then(() => {
        return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
