* [the "\_\_\_" should be present](the-"\_\_\_"-should-be-present)
    * [regex](regex)
    * [execution](execution)
        * [with element present](with-element-present)
        * [without element present](without-element-present)
    * [timing](timing)
# the "\_\_\_" should be present
## regex
 regex should match "...should be present"

```
verifyStepMatch('the "Home Button" should be present');
```


 regex should match "...should not be present"

```
verifyStepMatch('the "Home Button" should be present');
```


 regex should capture the element name, element type, and expectation

```
verifyStepCaptures('the "Home" button should be present', 'Home', ' button', 'should');
```


 regex should capture the element name, expectation, and a blank string if no element type is provided

```
verifyStepCaptures('the "Home Button" should be present', 'Home Button', '', 'should');
```


## execution
### with element present
 with element present should succeed if it expects the element to be present

```
return executeStep('the "Button" should be present', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with element present should fail if it expects the element not to be present

```
return executeStep('the "Button" should not be present', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### without element present
 without element present should fail if it expects the element to be present

```
return executeStep('the "Button" should be present', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 without element present should succeed if it expects the element not to be present

```
return executeStep('the "Button" should not be present', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## timing
 timing should wait for the element to be present before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<button id=\"testButton\">'); }, 200 )").then(() => {
  return executeStep('the "Button" should be present', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
