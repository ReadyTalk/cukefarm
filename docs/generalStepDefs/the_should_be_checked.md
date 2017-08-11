* [the "\_\_\_" should be checked](the-"\_\_\_"-should-be-checked)
    * [regex](regex)
    * [execution](execution)
        * [with a selected checkbox](with-a-selected-checkbox)
        * [with an unselected checkbox](with-an-unselected-checkbox)
    * [execution](execution)
# the "\_\_\_" should be checked
## regex
 regex should match "...should..."

```
verifyStepMatch('the "Enable Emails" checkbox should be checked');
```


 regex should match "...should not..."

```
verifyStepMatch('the "Enable Emails" checkbox should not be checked');
```


 regex should capture the element name, element type, and expectation

```
verifyStepCaptures('the "Enable Emails" checkbox should be checked', 'Enable Emails', ' checkbox', 'should');
```


 regex should capture the element name, expectation, and a blank string if no element type is provided

```
verifyStepCaptures('the "Enable Emails Checkbox" should be checked', 'Enable Emails Checkbox', 'should');
```


## execution
### with a selected checkbox
 with a selected checkbox should succeed if it expects the checkbox to be selected

```
return executeStep('the "Test" checkbox should be checked', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with a selected checkbox should fail if it expects the checkbox to not be selected

```
return executeStep('the "Test" checkbox should not be checked', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with an unselected checkbox
 with an unselected checkbox should fail if it expects the checkbox to be selected

```
return executeStep('the "Test" checkbox should be checked', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with an unselected checkbox should succeed if it expects the checkbox to not be selected

```
return executeStep('the "Test" checkbox should not be checked', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## execution
 execution should succeed if it expects the checkbox to be selected

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<input id=\"testCheckbox\" type=\"checkbox\" checked/>'); }, 200 )").then(() => {
  return executeStep('the "Test" checkbox should be checked', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
