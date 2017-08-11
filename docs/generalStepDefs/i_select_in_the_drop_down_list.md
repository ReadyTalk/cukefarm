* [I select "\_\_\_" in the "\_\_\_" drop down list](i-select-"\_\_\_"-in-the-"\_\_\_"-drop-down-list)
    * [regex](regex)
    * [execution](execution)
    * [timing](timing)
# I select "\_\_\_" in the "\_\_\_" drop down list
## regex
 regex should match 'I select "Mountain Standard" in the "Time Zone" drop down list'

```
verifyStepMatch('I select "Mountain Standard" in the "Time Zone" drop down list');
```


 regex should capture the option text, element name, and element type

```
verifyStepCaptures('I select "Mountain Standard" in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone', ' drop down list');
```


 regex should capture the option text, element name, and a blank string if no element type is provided

```
verifyStepCaptures('I select "Mountain Standard" in the "Time Zone"', 'Mountain Standard', 'Time Zone', '');
```


## execution
 execution should select the correct option by its text from the correct drop-down

```
return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
  return Promise.all([
    expect(element(By.cssContainingText('option', 'Eastern Standard')).isSelected()).to.eventually.equal(false),
    expect(element(By.cssContainingText('option', 'Central Standard')).isSelected()).to.eventually.equal(false),
    expect(element(By.cssContainingText('option', 'Mountain Standard')).isSelected()).to.eventually.equal(true)
  ]);
});
```


## timing
 timing should wait for the drop down menu to appear before selecting

```
return browser.driver.executeScript("setTimeout( function() { $(\"div#test\").append(' <select id=\"timezone\"> <option selected>Eastern Standard</option> <option>Mountain Standard</option> <option>Central Standard</option> </select>'); }, 200 )").then(() => {
  return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function() {
    expect(currentStepResult.status).to.equal(Cucumber.Status.PASSED);
  });
});
```
