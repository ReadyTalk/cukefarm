describe('"___" should be selected in the "___" drop down list', function() {
  describe('regex', function() {
    before(function() {
      stepPattern = '"{text:captureString}" {expectation:shouldToBoolean} be (selected|displayed) in the "{name:elementName}"{type:elementType}';
    });

    it('should match \'...should be selected...\'', function() {
      verifyStepMatch('"Mountain Standard" should be selected in the "Time Zone" drop down list');
    });

    it('should match \'...should not be selected...\'', function() {
      verifyStepMatch('"Mountain Standard" should not be selected in the "Time Zone" drop down list');
    });

    it('should match \'...should be displayed...\'', function() {
      verifyStepMatch('"Mountain Standard" should be displayed in the "Time Zone" drop down list');
    });

    it('should capture the option text, expectation, list name, and element type', function() {
      verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'should', 'Time Zone', ' drop down list');
    });

    it('should capture the option text, expectation, list name, and a blank string if no element type is provided', function() {
      verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone Drop Down List"', 'Mountain Standard', 'should', 'Time Zone Drop Down List', '');
    });

    it('should not capture "selected"', function() {
      verifyStepDoesNotCapture('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected');
    });
  });

  describe('execution', function() {
    before(function() {
      world.currentPage = {
        timeZoneSelect: $('select#timezone')
      };
    });

    beforeEach(function() {
      browser.driver.executeScript("fixtures.set(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>');");
      return browser.driver.switchTo().frame('js-fixtures');
    });

    afterEach(function() {
      browser.driver.switchTo().defaultContent();
      return browser.driver.executeScript("fixtures.cleanUp();");
    });

    describe('with the "should" expectation', function() {
      it('should succeed if the expected option is selected', function() {
        return executeStep('"Eastern Standard" should be selected in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });

      it('should fail if the expected option is not selected', function() {
        return executeStep('"Mountain Standard" should be selected in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });
    });

    describe('with the "should not" expectation', function() {
      it('should succeed if the expected option is selected', function() {
        return executeStep('"Eastern Standard" should not be selected in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
        });
      });

      it('should fail if the expected option is not selected', function() {
        return executeStep('"Mountain Standard" should not be selected in the "Time Zone" drop down list', function() {
          expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
        });
      });
    });
  });
});
