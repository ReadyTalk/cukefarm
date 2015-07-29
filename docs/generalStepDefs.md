# General Step Defs
## \_\_\_ (covered by \_\_\_)
### regex
 regex should match "I am on the Moon (covered by MoonUnit)"

```
return verifyStepMatch('I am on the Moon (covered by MoonUnit)');
```


## I am on the "\_\_\_" page
### regex
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


### execution
 execution should set the currentPage on the World

```
executeStep('I am on the "Test" page');
return expect(world.currentPage).to.equal(stubPage);
```


 execution should call get on the page

```
executeStep('I am on the "Test" page');
return expect(stubPage.get.calledOnce).to.equal(true);
```


 execution should call waitForLoaded on the page

```
executeStep('I am on the "Test" page');
return expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
```


 execution should provide a clear error message if the Page Object was not added to the PageObjectMap

```
var callbackSpy;
callbackSpy = sinon.spy();
executeStep('I am on the "Missing" page', callbackSpy);
return expect(callbackSpy.getCall(0).args[0].getFailureException()).to.equal("Could not find page with name 'Missing' in the PageObjectMap, did you remember to add it?");
```


## I have a \_\_\_x\_\_\_ screen size
### regex
 regex should match "I have..."

```
return verifyStepMatch('I have a 800x600 screen size');
```


 regex should match "I change to..."

```
return verifyStepMatch('I change to a 800x600 screen size');
```


 regex should match "I resize to..."

```
return verifyStepMatch('I resize to a 800x600 screen size');
```


 regex should match "I rotate to..."

```
return verifyStepMatch('I rotate to a 800x600 screen size');
```


 regex should not capture "have"

```
return verifyStepDoesNotCapture('I have a 800x600 screen size', 'have');
```


 regex should capture the dimensions

```
return verifyStepCaptures('I have a 800x600 screen size', '800', '600');
```


### execution
 execution should set the browser resolution

```
executeStep('I have a 800x600 screen size');
return browser.manage().window().getSize().then(function(size) {
  expect(size.width).to.equal(800);
  return expect(size.height).to.equal(600);
});
```


## I navigate backwards in my browser
### regex
 regex should match "I navigate..."

```
return verifyStepMatch('I navigate backwards in my browser');
```


 regex should match "I click..."

```
return verifyStepMatch('I click back in my browser');
```


 regex should match "...backwards..."

```
return verifyStepMatch('I click backwards in my browser');
```


 regex should match "...back..."

```
return verifyStepMatch('I navigate back in my browser');
```


 regex should not capture "navigate" or "backwards"

```
return verifyStepDoesNotCapture('I navigate backwards in my browser', 'navigate', 'backwards');
```


### execution
 execution should navigate backward in the browser

```
executeStep('I navigate backwards in my browser');
return expect(navigateSpy.calledOnce).to.equal(true);
```


## I type "\_\_\_" in the "\_\_\_" field
### regex
 regex should match "...in..."

```
return verifyStepMatch('I type "First" in the "Name" field');
```


 regex should match "...into..."

```
return verifyStepMatch('I type "First" into the "Name" field');
```


 regex should not capture "to"

```
return verifyStepDoesNotCapture('I type "First" into the "Name" field', 'to');
```


 regex should capture the text and field name

```
return verifyStepCaptures('I type "First" in the "Name" field', 'First', 'Name');
```


### execution
 execution should clear and send the text to the field

```
executeStep('I type "First" in the "Name" field');
expect(world.transform.stringToVariableName.calledOnce).to.equal(true);
expect(world.currentPage.nameField.clear.calledOnce).to.equal(true);
expect(world.currentPage.nameField.sendKeys.calledOnce).to.equal(true);
return expect(world.currentPage.nameField.sendKeys.calledWithExactly('First')).to.equal(true);
```


## I click the "\_\_\_" link
### regex
 regex should match "...link"

```
return verifyStepMatch('I click the "Search" link');
```


 regex should match "...button"

```
return verifyStepMatch('I click the "Search" button');
```


 regex should match "...drop down list"

```
return verifyStepMatch('I click the "Search" drop down list');
```


 regex should match "...tab"

```
return verifyStepMatch('I click the "Search" tab');
```


 regex should match an empty element type

```
return verifyStepMatch('I click the "Search"');
```


 regex should capture the element name and type

```
return verifyStepCaptures('I click the "Search" tab', 'Search', 'tab');
```


 regex should capture the element name and a blank string if no element type is provided

```
return verifyStepCaptures('I click the "Search"', 'Search', '');
```


 regex should not capture the space

```
return verifyStepDoesNotCapture('I click the "Search" tab', ' ');
```


### execution
 execution should click the element

```
executeStep('I click the "Search" button');
expect(world.transform.elementTypeToVariableName.calledOnce).to.equal(true);
expect(world.transform.stringToVariableName.calledOnce).to.equal(true);
expect(world.transform.stringToVariableName.calledWithExactly('SearchButton')).to.equal(true);
return expect(world.currentPage.searchButton.click.calledOnce).to.equal(true);
```


## I refresh the page
### regex
 regex should match "I refresh the page"

```
return verifyStepMatch('I refresh the page');
```


### execution
 execution should refresh the page

```
executeStep('I refresh the page');
return expect(browser.refresh.calledOnce).to.equal(true);
```


## I select "\_\_\_" in the "\_\_\_" drop down list
### regex
 regex should match 'I select "Mountain Standard" in the "Time Zone" drop down list'

```
return verifyStepMatch('I select "Mountain Standard" in the "Time Zone" drop down list');
```


 regex should capture the option text and the name of the drop down list

```
return verifyStepCaptures('I select "Mountain Standard" in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone');
```


### execution
 execution should select the correct option by its text from the correct drop-down

```
return executeStep('I select "Mountain Standard" in the "Time Zone" drop down list', function(stepResult) {
  expect(element(By.cssContainingText('option', 'Mountain Standard')).isSelected()).to.eventually.equal(true);
  expect(element(By.cssContainingText('option', 'Eastern Standard')).isSelected()).to.eventually.equal(false);
  return expect(element(By.cssContainingText('option', 'Central Standard')).isSelected()).to.eventually.equal(false);
});
```


## the title should equal "\_\_\_"
### regex
 regex should match 'the title should equal "My Title"'

```
return verifyStepMatch('the title should equal "My Title"');
```


 regex should capture the title

```
return verifyStepCaptures('the title should equal "My Title"', 'My Title');
```


### execution
 execution should succeed if the page title matches the supplied title

```
return executeStep('the title should equal "Protractor Integration Test Page"', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 execution should fail if the page title does not match the supplied title

```
return executeStep('the title should equal "Fake Title"', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## the "\_\_\_" should be active
### regex
 regex should match "...should be active"

```
return verifyStepMatch('the "Active Field" should be active');
```


 regex should match "...should not be active"

```
return verifyStepMatch('the "Inactive Field" should not be active');
```


 regex should capture the element name and expectation

```
return verifyStepCaptures('the "Inactive Field" should not be active', 'Inactive Field', 'should not');
```


### execution
#### with an active element
 with an active element should succeed if it expects the element to be active

```
return executeStep('the "Button" should be active', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 with an active element should fail if it expects the element to be inactive

```
return executeStep('the "Button" should not be active', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


#### with an inactive element
 with an inactive element should fail if it expects the element to be active

```
return executeStep('the "Button" should be active', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


 with an inactive element should succeed if it expects the element to be inactive

```
return executeStep('the "Button" should not be active', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


## the "\_\_\_" should be present
### regex
 regex should match 'the "Home Button" should be present'

```
return verifyStepMatch('the "Home Button" should be present');
```


 regex should capture the element name

```
return verifyStepCaptures('the "Home Button" should be present', 'Home Button');
```


### execution
#### with element present
 with element present should succeed

```
return executeStep('the "Button" should be present', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


#### without element present
 without element present should fail

```
return executeStep('the "Button" should be present', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## I should be on the "\_\_\_" page
### regex
 regex should match "I should be on..."

```
return verifyStepMatch('I should be on the "Home" page');
```


 regex should match "I reach..."

```
return verifyStepMatch('I reach the "Home" page');
```


 regex should match "I am taken to"

```
return verifyStepMatch('I am taken to the "Home" page');
```


 regex should capture the page name

```
return verifyStepCaptures('I should be on the "Home" page', 'Home');
```


 regex should not capture "should be on"

```
return verifyStepDoesNotCapture('I should be on the "Home" page', 'should be on');
```


### execution
 execution should set the currentPage on the World

```
executeStep('I should be on the "Test" page');
return expect(world.currentPage).to.equal(stubPage);
```


 execution should call waitForLoaded on the page

```
executeStep('I should be on the "Test" page');
return expect(stubPage.waitForLoaded.calledOnce).to.equal(true);
```


## "\_\_\_" should have the text "\_\_\_"
### regex
 regex should match 'the "Field" should...'

```
return verifyStepMatch('the "Field" should contain the text "Text String"');
```


 regex should match '"Field" should...'

```
return verifyStepMatch('"Field" should contain the text "Text String"');
```


 regex should match '..."Field" should contain...'

```
return verifyStepMatch('the "Field" should contain the text "Text String"');
```


 regex should match '..."Field" should have...'

```
return verifyStepMatch('the "Field" should have the text "Text String"');
```


 regex should capture the field name and text string

```
return verifyStepCaptures('the "Field" should contain the text "Text String"', 'Field', 'Text String');
```


 regex should not capture "the" or "contain"

```
return verifyStepDoesNotCapture('the "Field" should contain the text "Text String"', 'the', 'contain');
```


### execution
#### with a span
 with a span should succeed if the element contains the expected text

```
return executeStep('the "Test Span" should contain the text "Span Text"', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 with a span should fail if the element does not contain the expected text

```
return executeStep('the "Test Span" should contain the text "Fake Text"', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


#### with an input
 with an input should succeed if the element contains the expected text

```
world.currentPage.testInput.sendKeys("Input Text");
return executeStep('the "Test Input" should contain the text "Input Text"', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 with an input should fail if the element does not contain the expected text

```
return executeStep('the "Test Input" should contain the text "Input Text"', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## "\_\_\_" should appear in the "\_\_\_" drop down list
### regex
 regex should match '"Mountain Time" should appear in the "Time Zone" drop down list'

```
return verifyStepMatch('"Mountain Time" should appear in the "Time Zone" drop down list');
```


 regex should capture the option text and drop down list name

```
return verifyStepCaptures('"Mountain Time" should appear in the "Time Zone" drop down list', 'Mountain Time', 'Time Zone');
```


### execution
 execution should succeed if the expected option is in the drop down list

```
return executeStep('"Mountain Standard" should appear in the "Time Zone" drop down list', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 execution should fail if the expected option is not in the drop down list

```
return executeStep('"Pacific Standard" should appear in the "Time Zone" drop down list', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## the "\_\_\_" should be displayed
### regex
 regex should match "...should be displayed"

```
return verifyStepMatch('the "Save Button" should be displayed');
```


 regex should match "...should not be displayed"

```
return verifyStepMatch('the "Cancel Button" should not be displayed');
```


 regex should capture the element name and expectation

```
return verifyStepCaptures('the "Cancel Button" should not be displayed', 'Cancel Button', 'should not');
```


### execution
#### with the element displayed
 with the element displayed should succeed if it expects the element to be displayed

```
return executeStep('the "Test Span" should be displayed', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 with the element displayed should fail if it expects the element to not be displayed

```
return executeStep('the "Test Span" should not be displayed', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


#### without the element displayed
 without the element displayed should succeed if it expects the element to not be displayed

```
return executeStep('the "Test Span" should not be displayed', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 without the element displayed should fail if it expects the element to be displayed

```
return executeStep('the "Test Span" should be displayed', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


#### without the element present
 without the element present should succeed if it expects the element to not be displayed

```
return executeStep('the "Test Span" should not be displayed', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 without the element present should fail if it expects the element to be displayed

```
return executeStep('the "Test Span" should be displayed', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## the "\_\_\_" should have the placeholder text "\_\_\_"
### regex
 regex should match a step starting with "the..."

```
return verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
```


 regex should match a step that does not start with "the..."

```
return verifyStepMatch('"Username Field" should have the placeholder text "Enter Username"');
```


 regex should match "...should have the placeholder text..."

```
return verifyStepMatch('the "Username Field" should have the placeholder text "Enter Username"');
```


 regex should match "...should contain the placeholder text..."

```
return verifyStepMatch('the "Username Field" should contain the placeholder text "Enter Username"');
```


 regex should capture the element name and placeholder text

```
return verifyStepCaptures('the "Username Field" should have the placeholder text "Enter Username"', 'Username Field', 'Enter Username');
```


 regex should not capture "the" or "have"

```
return verifyStepDoesNotCapture('the "Username Field" should have the placeholder text "Enter Username"', 'the', 'have');
```


### execution
 execution should succeed if the element contains the expected placeholder text

```
return executeStep('the "Test Input" should have the placeholder text "Test Placeholder"', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 execution should fail if the element does not contain the expected placeholder text

```
return executeStep('the "Test Input" should have the placeholder text "Fake Placeholder"', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## the "\_\_\_" should be enabled
### regex
 regex should match 'the "\_\_\_" button...'

```
return verifyStepMatch('the "Save Configuration" button should be enabled');
```


 regex should match 'the "\_\_\_" field...'

```
return verifyStepMatch('the "Username" field should be enabled');
```


 regex should match 'the "\_\_\_" drop down list...'

```
return verifyStepMatch('the "Timezone" drop down list should be enabled');
```


 regex should match a step without an element type

```
return verifyStepMatch('the "Save Button" should be enabled');
```


 regex should match '...should be enabled'

```
return verifyStepMatch('the "Save Configuration" button should be enabled');
```


 regex should match '...should not be enabled'

```
return verifyStepMatch('the "Save Configuration" button should not be enabled');
```


 regex should capture the element name, element type and the expectation

```
return verifyStepCaptures('the "Save Configuration" button should be enabled', 'Save Configuration', 'button', 'should');
```


 regex should not capture the optional space

```
return verifyStepDoesNotCapture('the "Save Configuration" button should be enabled', ' ');
```


### execution
#### with enabled button
 with enabled button should succeed if it expects the button to be enabled

```
return executeStep('the "Test" button should be enabled', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 with enabled button should fail if it expects the button to be disabled

```
return executeStep('the "Test" button should not be enabled', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


#### with disabled button
 with disabled button should fail if it expects the button to be enabled

```
return executeStep('the "Test" button should be enabled', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


 with disabled button should succeed if it expects the button to be disabled

```
return executeStep('the "Test" button should not be enabled', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


## "\_\_\_" should be selected in the "\_\_\_" drop down list
### regex
 regex should match '...should be selected...'

```
return verifyStepMatch('"Mountain Standard" should be selected in the "Time Zone" drop down list');
```


 regex should match '...should be displayed...'

```
return verifyStepMatch('"Mountain Standard" should be displayed in the "Time Zone" drop down list');
```


 regex should capture the option text and list name

```
return verifyStepCaptures('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'Mountain Standard', 'Time Zone');
```


 regex should not capture "selected"

```
return verifyStepDoesNotCapture('"Mountain Standard" should be selected in the "Time Zone" drop down list', 'selected');
```


### execution
 execution should succeed if the expected option is selected

```
return executeStep('"Eastern Standard" should be selected in the "Time Zone" drop down list', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 execution should fail if the expected option is not selected

```
return executeStep('"Mountain Standard" should be selected in the "Time Zone" drop down list', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


## the "\_\_\_" should be checked
### regex
 regex should match "...checkbox..."

```
return verifyStepMatch('the "Enable Emails" checkbox should be checked');
```


 regex should match a step without an element type

```
return verifyStepMatch('the "Enable Emails Checkbox" should be checked');
```


 regex should match "...should..."

```
return verifyStepMatch('the "Enable Emails" checkbox should be checked');
```


 regex should match "...should not..."

```
return verifyStepMatch('the "Enable Emails" checkbox should not be checked');
```


### execution
#### with a selected checkbox
 with a selected checkbox should succeed if it expects the checkbox to be selected

```
return executeStep('the "Test" checkbox should be checked', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```


 with a selected checkbox should fail if it expects the checkbox to not be selected

```
return executeStep('the "Test" checkbox should not be checked', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


#### with an unselected checkbox
 with an unselected checkbox should fail if it expects the checkbox to be selected

```
return executeStep('the "Test" checkbox should be checked', function(stepResult) {
  return expect(stepResult.isFailed()).to.equal(true);
});
```


 with an unselected checkbox should succeed if it expects the checkbox to not be selected

```
return executeStep('the "Test" checkbox should not be checked', function(stepResult) {
  return expect(stepResult.isSuccessful()).to.equal(true);
});
```
