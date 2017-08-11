* [I should be on the "\_\_\_" page](i-should-be-on-the-"\_\_\_"-page)
    * [regex](regex)
    * [execution](execution)
# I should be on the "\_\_\_" page
## regex
 regex should match "I should be on..."

```
verifyStepMatch('I should be on the "Home" page');
```


 regex should match "I reach..."

```
verifyStepMatch('I reach the "Home" page');
```


 regex should match "I am taken to"

```
verifyStepMatch('I am taken to the "Home" page');
```


 regex should capture the page name

```
verifyStepCaptures('I should be on the "Home" page', 'Home');
```


 regex should not capture "should be on"

```
verifyStepDoesNotCapture('I should be on the "Home" page', 'should be on');
```


## execution
 execution should set the currentPage on the World

```
return executeStep('I should be on the "Test" page', function() {
  expect(world.currentPage).to.equal(stubPage);
});
```


 execution should call waitForLoaded on the page

```
return executeStep('I should be on the "Test" page', function() {
  expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
});
```
