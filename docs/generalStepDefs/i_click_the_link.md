* [I click the "\_\_\_" link](i-click-the-"\_\_\_"-link)
    * [regex](regex)
    * [execution](execution)
    * [timing](timing)
# I click the "\_\_\_" link
## regex
 regex should match "...link"

```
verifyStepMatch('I click the "Search" link');
```


 regex should match "...button"

```
verifyStepMatch('I click the "Search" button');
```


 regex should match "...drop down list"

```
verifyStepMatch('I click the "Search" drop down list');
```


 regex should match "...tab"

```
verifyStepMatch('I click the "Search" tab');
```


 regex should match an empty element type

```
verifyStepMatch('I click the "Search Button"');
```


 regex should capture the element name and type

```
verifyStepCaptures('I click the "Search" tab', 'Search', ' tab');
```


 regex should capture the element name and a blank string if no element type is provided

```
verifyStepCaptures('I click the "Search"', 'Search', '');
```


## execution
 execution should click the element

```
return executeStep('I click the "Search" button', function() {
  expect(world.currentPage.searchButton.click).to.have.been.calledOnce;
});
```


## timing
 timing should wait for the button to appear before clicking

```
return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append('<button id=\"search\"></button>'); }, 200 )").then(() => {
  return executeStep('I click the "Search" button', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
