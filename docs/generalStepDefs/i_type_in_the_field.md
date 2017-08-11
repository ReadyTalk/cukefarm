* [I type "\_\_\_" in the "\_\_\_" field](i-type-"\_\_\_"-in-the-"\_\_\_"-field)
    * [regex](regex)
    * [execution](execution)
    * [timing](timing)
# I type "\_\_\_" in the "\_\_\_" field
## regex
 regex should match "...in..."

```
verifyStepMatch('I type "First" in the "Name" field');
```


 regex should match "...into..."

```
verifyStepMatch('I type "First" into the "Name" field');
```


 regex should not capture "to"

```
verifyStepDoesNotCapture('I type "First" into the "Name" field', 'to');
```


 regex should capture the text and field name

```
verifyStepCaptures('I type "First" in the "Name" field', 'First', 'Name');
```


## execution
 execution should clear and send the text to the field

```
return executeStep('I type "First" in the "Name" field', function() {
  expect(world.currentPage.nameField.clear).to.have.been.calledOnce;
  expect(world.currentPage.nameField.sendKeys).to.have.been.calledOnce;
  expect(world.currentPage.nameField.sendKeys).to.have.been.calledWithExactly('First');
});
```


## timing
 timing should wait for the input to appear before typing

```
return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append('<input id=\"name\" type=\"text\"></input>'); }, 200 )").then(() => {
  return executeStep('I type "First" in the "Name" field', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
