* ["\_\_\_" should have the text "\_\_\_"]("\_\_\_"-should-have-the-text-"\_\_\_")
    * [regex](regex)
    * [execution](execution)
        * [with a span](with-a-span)
        * [with an input](with-an-input)
            * [and a "should" expectation](and-a-"should"-expectation)
            * [and a "should not" expectation](and-a-"should-not"-expectation)
    * [timing](timing)
# "\_\_\_" should have the text "\_\_\_"
## regex
 regex should match 'the "Test Field" should...'

```
verifyStepMatch('the "Test Field" should contain the text "Text String"');
```


 regex should match 'the "Test Field" should not...'

```
verifyStepMatch('the "Test Field" should not contain the text "Text String"');
```


 regex should match '"Test Field" should...'

```
verifyStepMatch('"Test Field" should contain the text "Text String"');
```


 regex should match '..."Test Field" should contain...'

```
verifyStepMatch('the "Test Field" should contain the text "Text String"');
```


 regex should match '..."Test Field" should have...'

```
verifyStepMatch('the "Test Field" should have the text "Text String"');
```


 regex should capture the element name, element type, expectation, and text string

```
verifyStepCaptures('the "Test" field should contain the text "Text String"', 'Test', ' field', 'should', 'Text String');
```


 regex should capture the element name, text string, and a blank string if no element type is provided

```
verifyStepCaptures('the "Test Field" should contain the text "Text String"', 'Test Field', '', 'should', 'Text String');
```


 regex should not capture "the" or "contain"

```
verifyStepDoesNotCapture('the "Test Field" should contain the text "Text String"', 'the', 'contain');
```


## execution
### with a span
 with a span should succeed if the element contains the expected text

```
return executeStep('the "Test Span" should contain the text "Span Text"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with a span should fail if the element does not contain the expected text

```
return executeStep('the "Test Span" should contain the text "Fake Text"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with an input
#### and a "should" expectation
 and a "should" expectation should succeed if the element contains the expected text

```
element(By.css('input')).sendKeys("Input Text");
return executeStep('the "Test Input" should contain the text "Input Text"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 and a "should" expectation should fail if the element does not contain the expected text

```
return executeStep('the "Test Input" should contain the text "Input Text"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


#### and a "should not" expectation
 and a "should not" expectation should fail if the element contains the expected text

```
element(By.css('input')).sendKeys("Input Text");
return executeStep('the "Test Input" should not contain the text "Input Text"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 and a "should not" expectation should fail if the element does not contain the expected text

```
return executeStep('the "Test Input" should not contain the text "Input Text"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


## timing
 timing should wait for the element to be present before verifying

```
return browser.driver.executeScript("setTimeout( function() { $('body').append('<span id=\"testSpan\">Span Text</span>'); }, 200 )").then(() => {
  return executeStep('the "Test Span" should contain the text "Span Text"', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
