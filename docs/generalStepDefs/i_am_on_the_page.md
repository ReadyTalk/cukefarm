* [I am on the "\_\_\_" page](i-am-on-the-"\_\_\_"-page)
    * [regex](regex)
    * [execution](execution)
# I am on the "\_\_\_" page
## regex
 regex should match "I am on..."

```
return verifyStepMatch('I am on the "Test" page');
```


 regex should match "I go to..."

```
return verifyStepMatch('I go to the "Test" page');
```


 regex should not capture "am on"

```
return verifyStepDoesNotCapture('I am on the "Test" page', 'am on');
```


 regex should capture the page name

```
return verifyStepCaptures('I go to the "Test" page', 'Test');
```


## execution
 execution should set the currentPage on the World

```
return executeStep('I am on the "Test" page', function() {
  expect(world.currentPage).to.equal(stubPage);
});
```


 execution should call get on the page

```
return executeStep('I am on the "Test" page', function() {
  expect(stubPage.get.calledOnce).to.equal(true);
});
```


 execution should call waitForLoaded on the page

```
return executeStep('I am on the "Test" page', function() {
  expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
});
```


 execution should provide a clear error message if the Page Object was not added to the PageObjectMap

```
return executeStep('I am on the "Missing" page', function() {
  expect(currentStepResult.failureException.toString()).to.equal("Error: Could not find page with name 'Missing' in the PageObjectMap, did you remember to add it?");
});
```
