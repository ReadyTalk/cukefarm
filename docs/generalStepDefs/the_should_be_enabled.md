* [the "\_\_\_" should be enabled](the-"\_\_\_"-should-be-enabled)
    * [regex](regex)
    * [execution](execution)
        * [with enabled button](with-enabled-button)
        * [with disabled button](with-disabled-button)
    * [timing](timing)
# the "\_\_\_" should be enabled
## regex
 regex should match 'the "\_\_\_" button...'

```
verifyStepMatch('the "Save Configuration" button should be enabled');
```


 regex should match 'the "\_\_\_" field...'

```
verifyStepMatch('the "Username" field should be enabled');
```


 regex should match 'the "\_\_\_" drop down list...'

```
verifyStepMatch('the "Timezone" drop down list should be enabled');
```


 regex should match a step without an element type

```
verifyStepMatch('the "Save Button" should be enabled');
```


 regex should match '...should be enabled'

```
verifyStepMatch('the "Save Configuration" button should be enabled');
```


 regex should match '...should not be enabled'

```
verifyStepMatch('the "Save Configuration" button should not be enabled');
```


 regex should capture the element name, element type, and the expectation

```
verifyStepCaptures('the "Save Configuration" button should be enabled', 'Save Configuration', ' button', 'should');
```


 regex should capture the element name, the expectation, and a blank string if no element type is provided

```
verifyStepCaptures('the "Save Configuration Button" should be enabled', 'Save Configuration Button', '', 'should');
```


## execution
### with enabled button
 with enabled button should succeed if it expects the button to be enabled

```
return executeStep('the "Test" button should be enabled', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with enabled button should fail if it expects the button to be disabled

```
return executeStep('the "Test" button should not be enabled', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with disabled button
 with disabled button should fail if it expects the button to be enabled

```
return executeStep('the "Test" button should be enabled', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with disabled button should succeed if it expects the button to be disabled

```
return executeStep('the "Test" button should not be enabled', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## timing
 timing should wait for the element to be present before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<button id=\"testButton\">Button</button>'); }, 200 )").then(() => {
  return executeStep('the "Test" button should be enabled', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
