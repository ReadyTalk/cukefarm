module.exports = ->

  @World = require('../support/World').World

  # No-op step
  # Use this step to provide documentation within a scenario of steps that should be occuring but that won't be
  #   implemented at the E2E level since they are already covered at a lower level.
  @Given /^.*\(covered by .*\)$/, (callback) ->
    callback()

  @Given /^I (?:am on|go to) the "([^"]*)" page$/, (pageName, callback) ->
    @currentPage = new @pageObjectMap[pageName]
    @currentPage.get().then ->
      callback()

  @Given /^I (?:have|change to|resize to|rotate to) a (\d+)x(\d+) screen size$/, (width, height, callback) ->
    browser.manage().window().setSize parseInt(width, 10), parseInt(height, 10)
    callback()

  @When /^I (?:click) (?:backwards|back) in my browser$/, (callback) ->
    browser.navigate().back()
    callback()

  @When /^I type "([^"]*)" in(?:to)? the "([^"]*)" field$/, (text, fieldName, callback) ->
    field = @transform.stringToVariableName(fieldName + 'Field')
    @currentPage[field].clear()
    @currentPage[field].sendKeys(text).then ->
      callback()

  @When /^I click the "([^"]*)"(?: )?(link|button|drop down list|tab|)$/, (elementName, elementType,  callback) ->
    elementType = @transform.elementTypeToVariableName(elementType)
    element = @transform.stringToVariableName(elementName + elementType)
    @currentPage[element].click()
    callback()

  @When /^I refresh the page$/, (callback) ->
    browser.refresh().then callback

  @When /^I select "([^"]*)" in the "([^"]*)" drop down list$/, (optionText, list, callback) ->
    @currentPage[@transform.stringToVariableName(list + 'Select')].then (select) ->
      select.element(protractor.By.cssContainingText('option', optionText)).click().then callback

  @Then /^the title should equal "([^"]*)"$/, (text, callback) ->
    @expect(browser.getTitle()).to.eventually.equal(text).and.notify(callback)

  @Then /^the "([^"]*)" (should|should not) be active$/, (tabName, expectation, callback) ->
    @tabName = @transform.stringToVariableName tabName
    @expectation = @transform.shouldToBoolean expectation
    @expect(@elementHelper.hasClass(@currentPage[@tabName], 'active')).to.eventually.equal(@expectation).and.notify(callback)

  @Then /^the "([^"]*)" should be present$/, (el, callback) ->
    @el = @transform.stringToVariableName el
    @expect(@currentPage[@el].isPresent()).to.eventually.equal(true).and.notify(callback)

  @Then /^I (?:should be on|reach|am taken to) the "([^"]*)" page$/, (pageName, callback) ->
    @currentPage = new @pageObjectMap[pageName]
    @currentPage.waitForLoaded().then ->
      callback()

  @Then /^(?:the )?"([^"]*)" should (?:have|contain) the text "([^"]*)"$/, (el, text, callback) ->
    @el = @currentPage[@transform.stringToVariableName el]
    elText = @el.getTagName().then (tagName) =>
      isInput = tagName is "input"
      if (isInput)
        @el.getAttribute 'value'
      else
        @el.getText()
    @expect(elText).to.eventually.contain(text).and.notify callback

  @Then /^"([^"]*)" should appear in the "([^"]*)" drop down list$/, (option, list, callback) ->
    @list = @currentPage[@transform.stringToVariableName(list + 'Select')]
    optionsPromise = @list.all(By.tagName 'option').then (elements) =>
      options = (element.getText() for element in elements)
      @Q.all(options)
    @expect(optionsPromise).to.eventually.contain(option).and.notify callback

  @Then /^the "([^"]*)" (should|should not) be displayed$/, (el, shouldBeDisplayed, callback) ->
    @shouldBeDisplayed = @transform.shouldToBoolean shouldBeDisplayed
    @el = @transform.stringToVariableName el
    isDisplayed = @currentPage[@el].isDisplayed().then (isDisplayed) =>
      @Q.fcall(-> isDisplayed)
    , (err) =>
      return @Q.fcall(-> false) if err.name is 'NoSuchElementError'
      throw err
    @expect(isDisplayed).to.eventually.equal(@shouldBeDisplayed).and.notify callback

  @Then /^(?:the )?"([^"]*)" should (?:have|contain) the placeholder text "([^"]*)"$/, (el, text, callback) ->
    @el = @currentPage[@transform.stringToVariableName el]
    @expect(@el.getAttribute 'placeholder').to.eventually.contain(text).and.notify callback

  @Then /^the "([^"]*)"(?: )?(button|field|drop down list|) (should|should not) be enabled$/, (el, elType, expectation, callback) ->
    elementType = @transform.elementTypeToVariableName(elType)
    @el = @transform.stringToVariableName(el + elementType)
    @expectation = @transform.shouldToBoolean expectation
    @expect(@currentPage[@el].isEnabled()).to.eventually.equal(@expectation).and.notify callback

  @Then /^"([^"]*)" should be (?:selected|displayed) in the "([^"]*)" drop down list$/, (optionText, list, callback) ->
    @list = @currentPage[@transform.stringToVariableName(list + 'Select')]
    option = @list.element(By.cssContainingText 'option', optionText)
    @expect(option.isSelected()).to.eventually.be.true.and.notify callback

  @Then /^the "([^"]*)"(?: )?(checkbox|) (should|should not) be checked$/,  (el, elType, expectation, callback) ->
    elementType = @transform.elementTypeToVariableName(elType)
    @el = @transform.stringToVariableName(el + elementType)
    @expectation = @transform.shouldToBoolean expectation
    @expect(@currentPage[@el].isSelected()).to.eventually.equal(@expectation).and.notify callback
