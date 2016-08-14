CukeFarm
===

An opinionated template for writing Cucumber tests with Protractor.

CukeFarm provides a set of [Cucumber] Steps that can be used to build feature files that are backed by automation using the [Protractor] framework. It also provides a set of helper functions that can be used when writing your own Step Definitions. Check out the [docs] directory for a full list of the Steps and helper functions. The docs are automatically generated using [docha].

[![Build Status](https://travis-ci.org/ReadyTalk/cukefarm.svg?branch=master)](https://travis-ci.org/ReadyTalk/cukefarm)

# Getting Started

To begin, install Protractor. Follow the instructions in the 'Prerequisites' and 'Setup' sections of the [Protractor Tutorial].

Next, install Cucumber using the following command:

    npm install cucumber --save-dev

# Installation

Install CukeFarm by executing the following command from the root of your project:

    npm install cukefarm --save-dev

# Set Up

## Config Object

CukeFarm provides a generic Protractor config file. However, you must provide some additional options that are specific to your project.

### Necessary Options

* Create file called `protractor.conf.js`
* Use the `require` function to import CukeFarm
* On the CukeFarm config object, create the following properties:
    * `specs = <path_to_your_feature_files>`
    * `capabilities.browserName = <protractor_browser_name>`
* On the CukeFarm config object, push the path to your project specific World file (See 'World Object' below) onto the `cucumberOpts.require` property
* Set the CukeFarm config object as the config property on the module exports object

Below is a sample `protractor.conf.js` file that provides the minimum options necessary to run your tests:

    # protractor.conf.js

    var config = require('cukefarm').config;

    config.specs = '../features/**/*.feature';
    config.capabilities.browserName = 'chrome';
    config.cucumberOpts.require.push('../support/World.js');

    exports.config = config;

### Adding Step Definitions

CukeFarm provides a set of general Step Definitions, but you will likely need to add more that are specific to your project. Simply push the path of your Step Definition files onto the CukeFarm config's `cucumberOpts.require` property:

    # protractor.conf.js

    files = ['./support/World.js', './step_definitions/**/*.js'];
    for (i = 0; i < files.length; i++) {
      config.cucumberOpts.require.push(files[i]);
    }

### Additional Options

There are a number of different options that Protractor looks for when parsing the test config. You can add these additional options in the same way you added the properties above.

For a full list of what options can be passed to Protractor, see their [Reference Configuration File]

## World Object

The CukeFarm World object give you access to a number of helper functions that will aid you in writing your Step Definitions. However, you must provide a Page Object Map specific to your project.

### What is a Page Object Map?

A Page Object Map will map the Page Objects that you create to human language Strings that can be used when writing Gherkin.

### What does a Page Object Map look like?

Here is a sample Page Object Map:

    # PageObjectMap.js

    module.exports = {
      "Page One"   : require('./pages/PageOne'),
      "Page Two"   : require('./pages/PageTwo'),
      "Page Three" : require('./pages/PageThree')
    };

Note: The above sample works, but it requires you to update the map every time you add or remove a Page Object. If you instead define your Page Objects using our Best Practices, you can dynamically create the Page Object Map.

### Adding a Page Object Map to the World

* Create a file called `World.js`
* Use the `require` function to import CukeFarm
* Use the `require` function to import your Page Object Map
* Set the pageObjectMap property of the CukeFarm World _prototype_ to your Page Object Map
    * You must set this on the prototype because Cucumber.js actually instantiates the World itself using a Constructor function
* Set the CukeFarm World object as the World property on the module exports object
* In any Step Definition file that needs access to the World, include the line `this.World = require('path/to/your/World').World`

Below is a sample `World.js` file:

    # World.js

    var World = require('cukefarm').World;

    World.prototype.pageObjectMap = require('./PageObjectMap');

    module.exports.World = World;

### Why use a Page Object Map?

One of the guiding principles of CukeFarm is that steps should be reusable across multiple page objects wherever possible. This allows you to DRY up your code and prevent an explosion of Step Definitions. To enable this design, CukeFarm forces you to store what page you are on. Generally this is done by calling either the `Given I am on the "<something>" page` or the `Then I should be on the "<something>" page` step, which takes the captured Gherkin and instantiates the page it is mapped to. Later when you try to access a WebElement, the step may use the stored page object to access it, eliminating the need for separate steps per page object. For instance, a sample scenario might look like this:

    # Search.feature

    Scenario: Clicking the "Foo" button on the Search Page will fill in the "Bar" field on the Results Page
      Given I am on the "Search" page
      When I type "Foo" in the "Search" field
        And I click the "Search" button
      Then I should be on the "Results" page
        And the "Showing Results For Field" should contain the text "Foo"

# Writing Cucumber Scenarios with CukeFarm

CukeFarm does force you to adhere to certain practices and conventions when writing Cucumber scenarios.

## Page Objects

CukeFarm expects you to organize the representation of your system into objects similar to the [WebDriver Page Object]. CukeFarm has the following expectations of your Page Objects:

### WebElement Property Naming Conventions

Adhering to the following conventions will allow you to use the `stringToVariableName` function on the Transform object to convert captured Gherkin into Page Object keys:

* Every WebElement you intend to interact with on a page should be a property of that Page Object
* Your key should be formatted [nameOfElement][TypeOfElement]. For instance `fooButton`
* Your key should be camel case with the first letter being lower case.

### `waitForLoaded` Function

Each Page Object is expected to have a `waitForLoaded` function that returns a promise. The promise should only resolve if the page successfully loads. A typical `waitForLoaded` function will look something like this:

    this.waitForLoaded = function() {
      return browser.wait((function(_this) {
        return function() {
          return _this.barField.isPresent();
        };
      })(this), 1000);
    };

### `get` Function

To provide easy access for the 'Given I am on the "<something>" page' step to reach your page, your page object should contain a `get` function that somehow navigates to your page. A typical `get` function will look something like this:

    this.get = function() {
      return browser.get('search');
    };

### Export the class

Be sure to export the Page Object _class_ as opposed to an instance of it.

### Best Practices

* Rather than simply exporting the class, export an object that has two properties: the class and a Gherkin name for your Page Object.
    * Why: This allows you to dynamically generate a Page Object Map by grabbing all Page Object files using a library like [node-globules] and accessing the Gherkin name from the Page Object export. See below for an example.

### Example Page Objects

Below is the example Scenario from above along with the Page Objects and Page Object Map necessary to support it:

    # Search.feature

    Scenario: Clicking the "Foo" button on the Search Page will fill in the "Bar" field on the Results Page
      Given I am on the "Search" page
      When I type "Foo" in the "Search" field
        And I click the "Search" button
      Then I should be on the "Results" page
        And the "Showing Results For Field" should contain the text "Foo"


    # PageObjectMap.js

    var file, files, globule, i, len, page, path;

    globule = require('globule');
    path = require('path');

    files = globule.find('e2e/pages/**/*.js');

    for (i = 0; i < files.length; i++) {
      page = require(path.resolve(files[i]));
      module.exports[page.name] = page["class"];
    }


    # SearchPage.js

    var SearchPage = function SearchPage() {

      this.searchField = $('input.search-field');
      this.searchButton = $('button.search-button');

      this.get = function() {
        return browser.get('search');
      };

      this.waitForLoaded = function() {
        return browser.wait((function(_this) {
          return function() {
            return _this.searchButton.isPresent();
          };
        })(this), 30000);
      };
    }

    module.exports = {
      "class": SearchPage,
      name: 'Search'
    };


    # ResultsPage.js

    var ResultsPage = function ResultsPage() {

      this.showingResultsForField = $('span.results-for');

      this.get = function() {
        return browser.get('results');
      };

      this.waitForLoaded = function() {
        return browser.wait((function(_this) {
          return function() {
            return _this.showingResultsForField.isPresent();
          };
        })(this), 30000);
      };
    }

    module.exports = {
      "class": ResultsPage,
      name: 'Results'
    };


    # Search.html

    <html>
      <body>
        <input class="search-field" />
        <button class="search-button">Search</button>
      </body>
    </html>


    # Results.html

    <html>
      <body>
        <span class="results-for">Showing results for Foo</span>
      </body>
    </html>

# Running Scenarios

To run your scenarios, simply execute the following command:

    protractor path/to/your/protractor.conf.js

# Helper Functions

CukeFarm provides helper functions on the following objects that are defined on the World.

## `transform` Object

The `transform` object contains functions to transform strings that were captured by Step Names into other data types to be used in the Step Definition.

## `elementHelper` Object

The `elementHelper` object contains functions to interact with Protractor elements.

# Contributing to CukeFarm

Pull requests are always welcome. Please make sure to adhere to the following guidelines:

## Unit Test your code

In particular, be sure to unit test your Step Definitions. This should be done in two ways:
1. Test that the name (regex) matches what you expect it to match.
2. Test that code within the Step Definition functions as you expect.

Note: The unit tests are the contract for the Step Definition names. Any changes to Step Definition names that do not break any unit tests are considered to be backward compatible and may occur at any time in a minor version or patch. IT IS YOUR RESPONSIBILITY TO SAFEGUARD YOUR FEATURE FILES.

# Running CukeFarm Unit Tests

* Install [Firefox]
* Run `npm install` to download dependencies.
* Run `npm test` to lint all files and run the unit tests.

[Cucumber]:https://www.npmjs.com/package/cucumber
[Protractor]:http://angular.github.io/protractor
[docs]:docs
[docha]:https://github.com/tehsenaus/docha
[Protractor Tutorial]:https://angular.github.io/protractor/#/tutorial
[Reference Configuration File]:https://github.com/angular/protractor/blob/master/docs/referenceConf.js
[WebDriver Page Object]:https://code.google.com/p/selenium/wiki/PageObjects
[node-globules]:https://github.com/cowboy/node-globule
[Firefox]:https://www.mozilla.org/en-US/
