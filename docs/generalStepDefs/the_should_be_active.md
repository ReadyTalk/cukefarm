* [the "\_\_\_" should be active](the-"\_\_\_"-should-be-active)
    * [regex](regex)
    * [execution](execution)
        * [with an active element](with-an-active-element)
        * [with an inactive element](with-an-inactive-element)
    * [timing](timing)
# the "\_\_\_" should be active
## regex
 regex should match "...should be active"

```
verifyStepMatch('the "Active Field" should be active');
```


 regex should match "...should not be active"

```
verifyStepMatch('the "Inactive Field" should not be active');
```


 regex should capture the element name, element type, and expectation

```
verifyStepCaptures('the "Inactive" field should not be active', 'Inactive', ' field', 'should not');
```


 regex should capture the element name, expectation, and a blank string if no element type is provided

```
verifyStepCaptures('the "Inactive Field" should not be active', 'Inactive Field', '', 'should not');
```


## execution
### with an active element
 with an active element should succeed if it expects the element to be active

```
return executeStep('the "Button" should be active', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with an active element should fail if it expects the element to be inactive

```
return executeStep('the "Button" should not be active', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with an inactive element
 with an inactive element should fail if it expects the element to be active

```
return executeStep('the "Button" should be active', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with an inactive element should succeed if it expects the element to be inactive

```
return executeStep('the "Button" should not be active', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## timing
 timing should wait for the element to be present before verifying

```
return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append('<button id=\"testButton\" class=\"active\">'); }, 200 )").then(() => {
  return executeStep('the "Button" should be active', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
