* [the "\_\_\_" should be displayed](the-"\_\_\_"-should-be-displayed)
    * [regex](regex)
    * [execution](execution)
        * [with the element displayed](with-the-element-displayed)
        * [without the element displayed](without-the-element-displayed)
        * [without the element present](without-the-element-present)
    * [timing](timing)
# the "\_\_\_" should be displayed
## regex
 regex should match "...should be displayed"

```
verifyStepMatch('the "Save Button" should be displayed');
```


 regex should match "...should not be displayed"

```
verifyStepMatch('the "Cancel Button" should not be displayed');
```


 regex should capture the element name, element type, and expectation

```
verifyStepCaptures('the "Cancel" button should not be displayed', 'Cancel', 'should not');
```


 regex should capture the element name, expectation, and a blank string if no element type is provided

```
verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', '', 'should not');
```


## execution
### with the element displayed
 with the element displayed should succeed if it expects the element to be displayed

```
return executeStep('the "Test Span" should be displayed', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with the element displayed should fail if it expects the element to not be displayed

```
return executeStep('the "Test Span" should not be displayed', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### without the element displayed
 without the element displayed should succeed if it expects the element to not be displayed

```
return executeStep('the "Test Span" should not be displayed', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 without the element displayed should fail if it expects the element to be displayed

```
return executeStep('the "Test Span" should be displayed', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### without the element present
 without the element present should succeed if it expects the element to not be displayed

```
return executeStep('the "Test Span" should not be displayed', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 without the element present should fail if it expects the element to be displayed

```
return executeStep('the "Test Span" should be displayed', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


## timing
 timing should wait for the element to be displayed before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<span id=\"testSpan\">Span Text</span>'); }, 200 )").then(() => {
  return executeStep('the "Test Span" should be displayed', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
