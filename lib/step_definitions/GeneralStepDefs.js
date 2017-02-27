var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then, setWorldConstructor}) {
  setWorldConstructor(require('../support/World').World);

  Given('I am ready to test all this (covered by ready.spec.js)', function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback(null, 'pending');
  });

  Given(/^I (?:am on|go to) the "([^"]*)" page$/, function(pageName) {
    if (this.pageObjectMap[pageName] == null) {
      throw new Error("Could not find page with name '" + pageName + "' in the PageObjectMap, did you remember to add it?");
    }
    this.currentPage = new this.pageObjectMap[pageName];
    this.currentPage.get();
    return this.currentPage.waitForLoaded();
  });

  Given(/^I (?:have|change to|resize to|rotate to) a (\d+)x(\d+) screen size$/, function(width, height) {
    return browser.manage().window().setSize(parseInt(width, 10), parseInt(height, 10));
  });

  When(/^I (?:navigate|click) (?:backwards|back) in my browser$/, function() {
    return browser.navigate().back();
  });

  When(/^I type "([^"]*)" in(?:to)? the "([^"]*)" field$/, function(text, fieldName) {
    var field;
    field = this.transform.stringToVariableName(fieldName + 'Field');
    this.currentPage[field].clear();
    return this.currentPage[field].sendKeys(text);
  });

  When(/^I click the "([^"]*)"(?: )?(link|button|drop down list|tab|)$/, function(elementName, elementType) {
    var element;
    elementType = this.transform.elementTypeToVariableName(elementType);
    element = this.transform.stringToVariableName(elementName + elementType);
    return this.currentPage[element].click();
  });

  When(/^I refresh the page$/, function() {
    return browser.refresh();
  });

  When(/^I select "([^"]*)" in the "([^"]*)" drop down list$/, function(optionText, list) {
    return this.currentPage[this.transform.stringToVariableName(list + 'Select')].element(protractor.By.cssContainingText('option', optionText)).click();
  });

  Then(/^the title should equal "([^"]*)"$/, function(text) {
    return this.expect(browser.getTitle()).to.eventually.equal(text);
  });

  Then(/^the "([^"]*)" (should|should not) be active$/, function(tabName, expectation) {
    this.tabName = this.transform.stringToVariableName(tabName);
    this.expectation = this.transform.shouldToBoolean(expectation);
    return this.expect(this.elementHelper.hasClass(this.currentPage[this.tabName], 'active')).to.eventually.equal(this.expectation);
  });

  Then(/^the "([^"]*)" should be present$/, function(el) {
    this.el = this.transform.stringToVariableName(el);
    return this.expect(this.currentPage[this.el].isPresent()).to.eventually.equal(true);
  });

  Then(/^I (?:should be on|reach|am taken to) the "([^"]*)" page$/, function(pageName) {
    this.currentPage = new this.pageObjectMap[pageName];
    return this.currentPage.waitForLoaded();
  });

  Then(/^(?:the )?"([^"]*)" should (?:have|contain) the text "([^"]*)"$/, function(el, text) {
    var elText;
    this.el = this.currentPage[this.transform.stringToVariableName(el)];
    elText = this.el.getTagName().then((function(_this) {
      return function(tagName) {
        var isInput;
        isInput = tagName === "input";
        if (isInput) {
          return _this.el.getAttribute('value');
        } else {
          return _this.el.getText();
        }
      };
    })(this));
    return this.expect(elText).to.eventually.contain(text);
  });

  Then(/^"([^"]*)" should appear in the "([^"]*)" drop down list$/, function(option, list) {
    var optionsText;
    this.list = this.currentPage[this.transform.stringToVariableName(list + 'Select')];
    optionsText = this.list.all(By.tagName('option')).map(function(element, index) {
      return element.getText();
    });
    return this.expect(optionsText).to.eventually.contain(option);
  });

  Then(/^the "([^"]*)" (should|should not) be displayed$/, function(el, shouldBeDisplayed) {
    var isDisplayed;
    this.shouldBeDisplayed = this.transform.shouldToBoolean(shouldBeDisplayed);
    this.el = this.transform.stringToVariableName(el);
    return isDisplayed = this.currentPage[this.el].isDisplayed().then((function(_this) {
      return function(isDisplayed) {
        return _this.expect(isDisplayed).to.equal(_this.shouldBeDisplayed);
      };
    })(this), (function(_this) {
      return function(err) {
        if (err.name === 'NoSuchElementError') {
          return _this.expect(false).to.equal(_this.shouldBeDisplayed);
        }
        throw err;
      };
    })(this));
  });

  Then(/^(?:the )?"([^"]*)" should (?:have|contain) the placeholder text "([^"]*)"$/, function(el, text) {
    this.el = this.currentPage[this.transform.stringToVariableName(el)];
    return this.expect(this.el.getAttribute('placeholder')).to.eventually.contain(text);
  });

  Then(/^the "([^"]*)"(?: )?(button|field|drop down list|) (should|should not) be enabled$/, function(el, elType, expectation) {
    var elementType;
    elementType = this.transform.elementTypeToVariableName(elType);
    this.el = this.transform.stringToVariableName(el + elementType);
    this.expectation = this.transform.shouldToBoolean(expectation);
    return this.expect(this.currentPage[this.el].isEnabled()).to.eventually.equal(this.expectation);
  });

  Then(/^"([^"]*)" should be (?:selected|displayed) in the "([^"]*)" drop down list$/, function(optionText, list) {
    var option;
    this.list = this.currentPage[this.transform.stringToVariableName(list + 'Select')];
    option = this.list.element(By.cssContainingText('option', optionText));
    return this.expect(option.isSelected()).to.eventually.be["true"];
  });

  Then(/^the "([^"]*)"(?: )?(checkbox|) (should|should not) be checked$/, function(el, elType, expectation) {
    var elementType;
    elementType = this.transform.elementTypeToVariableName(elType);
    this.el = this.transform.stringToVariableName(el + elementType);
    this.expectation = this.transform.shouldToBoolean(expectation);
    return this.expect(this.currentPage[this.el].isSelected()).to.eventually.equal(this.expectation);
  });
});
