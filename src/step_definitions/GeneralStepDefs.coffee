module.exports = ->

  @World = require('../support/World').World

  # No-op step
  # Use this step to provide documentation within a scenario of steps that should be occuring but that won't be
  #   implemented at the E2E level since they are already covered at a lower level.
  @Given /^.*\(covered by .*\)$/, () ->

  @Given /^I (?:am on|go to) the "([^"]*)" page$/, (pageName) ->
    unless @pageObjectMap[pageName]?
      throw new Error "Could not find page with name '#{pageName}' in the PageObjectMap, did you remember to add it?"
    @currentPage = new @pageObjectMap[pageName]
    @currentPage.get()
    @currentPage.waitForLoaded()

  @Given /^I (?:have|change to|resize to|rotate to) a (\d+)x(\d+) screen size$/, (width, height) ->
    browser.manage().window().setSize parseInt(width, 10), parseInt(height, 10)

  @When /^I (?:navigate|click) (?:backwards|back) in my browser$/, () ->
    browser.navigate().back()

  @When /^I type "([^"]*)" in(?:to)? the "([^"]*)" field$/, (text, fieldName) ->
    field = @transform.stringToVariableName(fieldName + 'Field')
    @currentPage[field].clear()
    @currentPage[field].sendKeys(text)

  @When /^I click the "([^"]*)"(?: )?(link|button|drop down list|tab|)$/, (elementName, elementType) ->
    elementType = @transform.elementTypeToVariableName(elementType)
    element = @transform.stringToVariableName(elementName + elementType)
    @currentPage[element].click()

  @When /^I refresh the page$/, () ->
    browser.refresh()

  @When /^I select "([^"]*)" in the "([^"]*)" drop down list$/, (optionText, list) ->
    @currentPage[@transform.stringToVariableName(list + 'Select')].then (select) ->
      select.element(protractor.By.cssContainingText('option', optionText)).click()

  @Then /^the title should equal "([^"]*)"$/, (text) ->
    @expect(browser.getTitle()).to.eventually.equal text

  @Then /^the "([^"]*)" (should|should not) be active$/, (tabName, expectation) ->
    @tabName = @transform.stringToVariableName tabName
    @expectation = @transform.shouldToBoolean expectation
    @expect(@elementHelper.hasClass(@currentPage[@tabName], 'active')).to.eventually.equal @expectation

  @Then /^the "([^"]*)" should be present$/, (el) ->
    @el = @transform.stringToVariableName el
    @expect(@currentPage[@el].isPresent()).to.eventually.equal true

  @Then /^I (?:should be on|reach|am taken to) the "([^"]*)" page$/, (pageName) ->
    @currentPage = new @pageObjectMap[pageName]
    @currentPage.waitForLoaded()

  @Then /^(?:the )?"([^"]*)" should (?:have|contain) the text "([^"]*)"$/, (el, text) ->
    @el = @currentPage[@transform.stringToVariableName el]
    elText = @el.getTagName().then (tagName) =>
      isInput = tagName is "input"
      if (isInput)
        @el.getAttribute 'value'
      else
        @el.getText()
    @expect(elText).to.eventually.contain text

  @Then /^"([^"]*)" should appear in the "([^"]*)" drop down list$/, (option, list) ->
    @list = @currentPage[@transform.stringToVariableName(list + 'Select')]
    optionsPromise = @list.all(By.tagName 'option').then (elements) =>
      options = (element.getText() for element in elements)
      @Q.all(options)
    @expect(optionsPromise).to.eventually.contain option

  @Then /^the "([^"]*)" (should|should not) be displayed$/, (el, shouldBeDisplayed) ->
    @shouldBeDisplayed = @transform.shouldToBoolean shouldBeDisplayed
    @el = @transform.stringToVariableName el
    isDisplayed = @currentPage[@el].isDisplayed().then (isDisplayed) =>
      @expect(isDisplayed).to.equal(@shouldBeDisplayed)
    , (err) =>
      return @expect(false).to.equal(@shouldBeDisplayed) if err.name is 'NoSuchElementError'
      throw err

  @Then /^(?:the )?"([^"]*)" should (?:have|contain) the placeholder text "([^"]*)"$/, (el, text) ->
    @el = @currentPage[@transform.stringToVariableName el]
    @expect(@el.getAttribute 'placeholder').to.eventually.contain text

  @Then /^the "([^"]*)"(?: )?(button|field|drop down list|) (should|should not) be enabled$/, (el, elType, expectation) ->
    elementType = @transform.elementTypeToVariableName(elType)
    @el = @transform.stringToVariableName(el + elementType)
    @expectation = @transform.shouldToBoolean expectation
    @expect(@currentPage[@el].isEnabled()).to.eventually.equal @expectation

  @Then /^"([^"]*)" should be (?:selected|displayed) in the "([^"]*)" drop down list$/, (optionText, list) ->
    @list = @currentPage[@transform.stringToVariableName(list + 'Select')]
    option = @list.element(By.cssContainingText 'option', optionText)
    @expect(option.isSelected()).to.eventually.be.true

  @Then /^the "([^"]*)"(?: )?(checkbox|) (should|should not) be checked$/,  (el, elType, expectation) ->
    elementType = @transform.elementTypeToVariableName(elType)
    @el = @transform.stringToVariableName(el + elementType)
    @expectation = @transform.shouldToBoolean expectation
    @expect(@currentPage[@el].isSelected()).to.eventually.equal @expectation

