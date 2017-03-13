function ElementHelper() {
  this.hasClass = function(element, cls) {
    return element.getAttribute('class').then(function(classes) {
      return classes.split(' ').indexOf(cls) !== -1;
    });
  };

  this.waitForDisplayedByName = function(elementName, world) {
    return browser.wait(() => {
      return world.currentPage[elementName].isDisplayed().then(
        (isDisplayed) => {
          return isDisplayed;
        }, (err) => {
          if (err.name !== 'NoSuchElementError') {
            throw err;
          }
        }
      );
    }, 5000);
  }
};

module.exports = ElementHelper;
