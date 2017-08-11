* [the title should equal "\_\_\_"](the-title-should-equal-"\_\_\_")
    * [regex](regex)
    * [execution](execution)
        * [with a "should" expectation](with-a-"should"-expectation)
        * [with a "should not" expectation](with-a-"should-not"-expectation)
# the title should equal "\_\_\_"
## regex
 regex should match "...should equal..."

```
verifyStepMatch('the title should equal "My Title"');
```


 regex should match "...should not equal..."

```
verifyStepMatch('the title should not equal "My Title"');
```


 regex should capture the title and the expectation

```
verifyStepCaptures('the title should equal "My Title"', 'should', 'My Title');
```


## execution
### with a "should" expectation
 with a "should" expectation should succeed if the page title matches the supplied title

```
return executeStep('the title should equal "Protractor Integration Test Page"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```


 with a "should" expectation should fail if the page title does not match the supplied title

```
return executeStep('the title should equal "Fake Title"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


### with a "should not" expectation
 with a "should not" expectation should fail if the page title matches the supplied title

```
return executeStep('the title should not equal "Protractor Integration Test Page"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.FAILED);
});
```


 with a "should not" expectation should succeed if the page title does not match the supplied title

```
return executeStep('the title should not equal "Fake Title"', function() {
  expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
});
```
