* ["\_\_\_" should be selected in the "\_\_\_" drop down list]("\_\_\_"-should-be-selected-in-the-"\_\_\_"-drop-down-list)
    * [regex](regex)
    * [execution](execution)
        * [with the "should" expectation](with-the-"should"-expectation)
        * [with the "should not" expectation](with-the-"should-not"-expectation)
    * [timing](timing)
# "\_\_\_" should be selected in the "\_\_\_" drop down list
## regex
 regex should match '...should be selected...'

```
verifyStepMatch('"Mountain Standard" should be selected in the "Time Zone" drop down list');
```


 regex should match '...should not be selected...'

```
verifyStepMatch('"Mountain Standard" should not be selected in the "Time Zone" drop down list');
```


 regex should match '...should be displayed...'

```
verifyStepMatch('"Mountain Standard" should be displayed in the "Time Zone" drop down list');
```


 regex should capture the option text, expectation, list name, and element type

```
verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'should', 'Time Zone', ' drop down list');
```


 regex should capture the option text, expectation, list name, and a blank string if no element type is provided

```
verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone Drop Down List"', 'Mountain Standard', 'should', 'Time Zone Drop Down List', '');
```


 regex should not capture "selected"

```
verifyStepDoesNotCapture('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected');
```


## execution
### with the "should" expectation
 with the "should" expectation should succeed if the expected option is selected

```
return executeStep('"Eastern Standard" should be selected in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with the "should" expectation should fail if the expected option is not selected

```
return executeStep('"Mountain Standard" should be selected in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with the "should not" expectation
 with the "should not" expectation should succeed if the expected option is selected

```
return executeStep('"Eastern Standard" should not be selected in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with the "should not" expectation should fail if the expected option is not selected

```
return executeStep('"Mountain Standard" should not be selected in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## timing
 timing should wait for the drop down list to be present before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>'); }, 200 )").then(() => {
  return executeStep('"Eastern Standard" should be selected in the "Time Zone" drop down list', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
