* ["\_\_\_" should appear in the "\_\_\_" drop down list]("\_\_\_"-should-appear-in-the-"\_\_\_"-drop-down-list)
    * [regex](regex)
    * [execution](execution)
        * [with the "should" expectation](with-the-"should"-expectation)
        * [with the "should not" expectation](with-the-"should-not"-expectation)
    * [timing](timing)
# "\_\_\_" should appear in the "\_\_\_" drop down list
## regex
 regex should match "...should appear..."

```
verifyStepMatch('"Mountain Time" should appear in the "Time Zone" drop down list');
```


 regex should match "...should not appear..."

```
verifyStepMatch('"Mountain Time" should not appear in the "Time Zone" drop down list');
```


 regex should capture the option text, expectation, element type, and drop down list name

```
verifyStepCaptures('"Mountain Time" should appear in the "Time Zone" drop down list', 'should', 'Mountain Time', 'Time Zone', ' drop down list');
```


 regex should capture the option text, expectation, drop down list name, and a blank string if no element type is provided

```
verifyStepCaptures('"Mountain Time" should appear in the "Time Zone Drop Down List"', 'should', 'Mountain Time', 'Time Zone Drop Down List', '');
```


## execution
### with the "should" expectation
 with the "should" expectation should succeed if the expected option is in the drop down list

```
return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with the "should" expectation should fail if the expected option is not in the drop down list

```
return executeStep('"Pacific Standard" should appear in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with the "should not" expectation
 with the "should not" expectation should fail if the expected option is in the drop down list

```
return executeStep('"Mountain Standard" should not appear in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with the "should not" expectation should succeed if the expected option is not in the drop down list

```
return executeStep('"Pacific Standard" should not appear in the "Time Zone" drop down list', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## timing
 timing should wait for the drop down list to be present before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>'); }, 200 )").then(() => {
  return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
