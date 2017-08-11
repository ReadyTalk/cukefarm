* [I have a \_\_\_x\_\_\_ screen size](i-have-a-\_\_\_x\_\_\_-screen-size)
    * [regex](regex)
    * [execution](execution)
# I have a \_\_\_x\_\_\_ screen size
## regex
 regex should match "I have..."

```
verifyStepMatch('I have a 800x600 screen size');
```


 regex should match "I change to..."

```
verifyStepMatch('I change to a 800x600 screen size');
```


 regex should match "I resize to..."

```
verifyStepMatch('I resize to a 800x600 screen size');
```


 regex should match "I rotate to..."

```
verifyStepMatch('I rotate to a 800x600 screen size');
```


 regex should not capture "have"

```
verifyStepDoesNotCapture('I have a 800x600 screen size', 'have');
```


 regex should capture the dimensions

```
verifyStepCaptures('I have a 800x600 screen size', '800', '600');
```


## execution
 execution should set the browser resolution

```
return executeStep('I have a 800x600 screen size', function() {
  return browser.manage().window().getSize().then(function(size) {
    expect(size.width).to.equal(800);
    expect(size.height).to.equal(600);
  });
});
```
