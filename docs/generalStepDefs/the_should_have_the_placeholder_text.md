* [the "\_\_\_" should have the placeholder text "\_\_\_"](the-"\_\_\_"-should-have-the-placeholder-text-"\_\_\_")
    * [regex](regex)
    * [timing](timing)
        * [with the "should" expectation](with-the-"should"-expectation)
        * [with the "should not" expectation](with-the-"should-not"-expectation)
    * [execution](execution)
# the "\_\_\_" should have the placeholder text "\_\_\_"
## regex
 regex should match a step starting with "the..."

```
verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
```


 regex should match a step that does not start with "the..."

```
verifyStepMatch('"Username Field" should have the placeholder text "Enter Username"');
```


 regex should match "...should have the placeholder text..."

```
verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
```


 regex should match "...should contain the placeholder text..."

```
verifyStepMatch('the "Username Field" should contain the placeholder text "Enter Username"');
```


 regex should capture the element name, element type, expectation, and placeholder text

```
verifyStepCaptures('the "Username" field should have the placeholder text "Enter Username"', 'Username', ' field', 'should', 'Enter Username');
```


 regex should capture the element name, placeholder text, expectation, and a blank string if no element type is provided

```
verifyStepCaptures('the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', '', 'should', 'Enter Username');
```


 regex should not capture "the" or "have"

```
verifyStepDoesNotCapture('the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have');
```


## timing
### with the "should" expectation
 with the "should" expectation should succeed if the element contains the expected placeholder text

```
return executeStep('the "Test Input" should have the placeholder text "Test Placeholder"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with the "should" expectation should fail if the element does not contain the expected placeholder text

```
return executeStep('the "Test Input" should have the placeholder text "Fake Placeholder"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with the "should not" expectation
 with the "should not" expectation should succeed if the element contains the expected placeholder text

```
return executeStep('the "Test Input" should not have the placeholder text "Test Placeholder"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with the "should not" expectation should fail if the element does not contain the expected placeholder text

```
return executeStep('the "Test Input" should not have the placeholder text "Fake Placeholder"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## execution
 execution should wait for the element to be displayed before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('div#test').append('<input id=\"testInput\" placeholder=\"Test Placeholder\" />'); }, 200 )").then(() => {
  return executeStep('the "Test Input" should have the placeholder text "Test Placeholder"', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
