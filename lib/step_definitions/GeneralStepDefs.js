var {defineSupportCode} = require('cucumber');

defineSupportCode(function({Given, When, Then, setWorldConstructor}) {
  Given(/^.*(covered by .*)$/, function () {});

  Given('I (am on|go to) the "{pageName:captureString}" page', function(pageName) {
    if (this.pageObjectMap[pageName] == null) {
      throw new Error("Could not find page with name '" + pageName + "' in the PageObjectMap, did you remember to add it?");
    }
    this.currentPage = new this.pageObjectMap[pageName];
    this.currentPage.get();
    return this.currentPage.waitForLoaded();
  });

  Given('I (have|change to|resize to|rotate to) a {width:int}x{height:int} screen size', function(width, height) {
    return browser.manage().window().setSize(parseInt(width, 10), parseInt(height, 10));
  });

  When('I (navigate|click) (backwards|back) in my browser', function() {
    return browser.navigate().back();
  });

  When('I type "{text:captureString}" in(to|) the "{name:elementName}"{type:elementType}', function(text, name, type) {
    var field = name + type;
    this.currentPage[field].clear();
    return this.currentPage[field].sendKeys(text);
  });

  When('I click the "{name:elementName}"{type:elementType}', function(name, type) {
    var element = name + type;
    return this.currentPage[element].click();
  });

  When('I refresh the page', function() {
    return browser.refresh();
  });

  When('I select "{optionText:captureString}" in the "{name:elementName}"{type:elementType}', function(optionText, name, type) {
    var list = name + type;
    return this.currentPage[list].element(protractor.By.cssContainingText('option', optionText)).click();
  });

  Then('the title {expectation:shouldToBoolean} equal "{text:captureString}"', function(expectation, text) {
    if (expectation) {
      return this.expect(browser.getTitle()).to.eventually.equal(text);
    } else {
      return this.expect(browser.getTitle()).not.to.eventually.equal(text);
    }
  });

  Then('the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be active', function(name, type, expectation) {
    var element = name + type;
    return this.expect(this.elementHelper.hasClass(this.currentPage[element], 'active')).to.eventually.equal(expectation);
  });

  Then('the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be present', function(name, type, expectation) {
    var element = name + type;
    return this.expect(this.currentPage[element].isPresent()).to.eventually.equal(expectation);
  });

  Then('I (should be on|reach|am taken to) the "{pageName:captureString}" page', function(pageName) {
    this.currentPage = new this.pageObjectMap[pageName];
    return this.currentPage.waitForLoaded();
  });

  Then('(the |)"{name:elementName}"{type:elementType} {expectation:shouldToBoolean} (have|contain) the text "{text:captureString}"', function(name, type, expectation, text) {
    this.element = this.currentPage[name + type];

    var elementText = this.element.getTagName().then((tagName) => {
      if (tagName === "input") {
        return this.element.getAttribute('value');
      } else {
        return this.element.getText();
      };
    });

    if (expectation) {
      return this.expect(elementText).to.eventually.contain(text);
    } else {
      return this.expect(elementText).not.to.eventually.contain(text);
    }
  });

  Then('"{option:captureString}" {expectation:shouldToBoolean} appear in the "{name:elementName}"{type:elementType}', function(option, expectation, name, type) {
    this.list = this.currentPage[name + type];

    var optionsText = this.list.all(By.tagName('option')).map(function(element, index) {
      return element.getText();
    });

    if (expectation) {
      return this.expect(optionsText).to.eventually.contain(option);
    } else {
      return this.expect(optionsText).not.to.eventually.contain(option);
    }
  });

  Then('the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be displayed', function(name, type, expectation) {
    return isDisplayed = this.currentPage[name + type].isDisplayed().then((isDisplayed) => {
      this.expect(isDisplayed).to.equal(expectation);
    }, (err) => {
      if (err.name === 'NoSuchElementError') {
        this.expect(false).to.equal(expectation);
      } else {
        throw err;
      }
    });
  });

  Then('(the |)"{name:elementName}"{type:elementType} {expectation:shouldToBoolean} (have|contain) the placeholder text "{text:captureString}"', function(name, type, expectation, text) {
    var element = this.currentPage[name + type];
    if (expectation) {
      return this.expect(element.getAttribute('placeholder')).to.eventually.contain(text);
    } else {
      return this.expect(element.getAttribute('placeholder')).not.to.eventually.contain(text);
    }
  });

  Then('the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be enabled', function(name, type, expectation) {
    return this.expect(this.currentPage[name + type].isEnabled()).to.eventually.equal(expectation);
  });

  Then('"{text:captureString}" {expectation:shouldToBoolean} be (selected|displayed) in the "{name:elementName}"{type:elementType}', function(text, expectation, name, type) {
    var list = this.currentPage[name + type];
    var option = list.element(By.cssContainingText('option', text));
    return this.expect(option.isSelected()).to.eventually.equal(expectation);
  });

  Then('the "{name:elementName}"{type:elementType} {expectation:shouldToBoolean} be checked', function(name, type, expectation) {
    return this.expect(this.currentPage[name + type].isSelected()).to.eventually.equal(expectation);
  });
});
