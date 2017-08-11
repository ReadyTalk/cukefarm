* [I refresh the page](i-refresh-the-page)
    * [regex](regex)
    * [execution](execution)
# I refresh the page
## regex
 regex should match "I refresh the page"

```
verifyStepMatch('I refresh the page');
```


## execution
 execution should refresh the page

```
return executeStep('I refresh the page', function() {
  expect(browser.refresh).to.have.been.calledOnce;
});
```
