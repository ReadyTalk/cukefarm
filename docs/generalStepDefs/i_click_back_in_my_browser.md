* [I navigate backwards in my browser](i-navigate-backwards-in-my-browser)
    * [regex](regex)
    * [execution](execution)
# I navigate backwards in my browser
## regex
 regex should match "I navigate..."

```
verifyStepMatch('I navigate backwards in my browser');
```


 regex should match "I click..."

```
verifyStepMatch('I click back in my browser');
```


 regex should match "...backwards..."

```
verifyStepMatch('I click backwards in my browser');
```


 regex should match "...back..."

```
verifyStepMatch('I navigate back in my browser');
```


 regex should not capture "navigate" or "backwards"

```
verifyStepDoesNotCapture('I navigate backwards in my browser', 'navigate', 'backwards');
```


## execution
 execution should navigate backward in the browser

```
return executeStep('I navigate backwards in my browser', function() {
  return expect(navigateSpy.calledOnce).to.equal(true);
});
```
