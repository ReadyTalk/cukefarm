* [elementHelper](elementhelper)
    * [hasClass()](hasclass())
# elementHelper
 elementHelper should exist on the World

```
var world;
world = new World(function() {});
expect(world.elementHelper).to.be.an.instanceOf(ElementHelper);
```


## hasClass()
 hasClass() should return true if the element has the given class

```
var el;
browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" class=\"test-class\"/>');");
browser.driver.switchTo().frame('js-fixtures');
el = $('input#testCheckbox');
expect(elementHelper.hasClass(el, 'test-class')).to.eventually.equal(true);
```


 hasClass() should return false if the element does not have the given class

```
var el;
browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\" class=\"test-class\"/>');");
browser.driver.switchTo().frame('js-fixtures');
el = $('input#testCheckbox');
expect(elementHelper.hasClass(el, 'fake-class')).to.eventually.equal(false);
```


 hasClass() should return false if the element has no class

```
var el;
browser.driver.executeScript("fixtures.set('<input id=\"testCheckbox\"/>');");
browser.driver.switchTo().frame('js-fixtures');
el = $('input#testCheckbox');
expect(elementHelper.hasClass(el, 'missing-class')).to.eventually.equal(false);
```
