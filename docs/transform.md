* [transform](transform)
    * [shouldToBoolean()](shouldtoboolean())
    * [stringToVariableName()](stringtovariablename())
    * [elementTypeToVariableName()](elementtypetovariablename())
# transform
 transform should exist on the World

```
var world;
world = new World(function() {});
return expect(world.transform).to.be.an.instanceOf(Transform);
```


## shouldToBoolean()
 shouldToBoolean() should convert the string "should" to true

```
expect(transform.shouldToBoolean('should')).to.equal(true);
```


 shouldToBoolean() should convert the string "should not" to false

```
expect(transform.shouldToBoolean('should not')).to.equal(false);
```


## stringToVariableName()
 stringToVariableName() should make the first letter of a string lower case

```
expect(transform.stringToVariableName('Test')).to.equal('test');
```


 stringToVariableName() should not affect letters after the first letter

```
expect(transform.stringToVariableName('TEST')).to.equal('tEST');
```


 stringToVariableName() should remove spaces

```
expect(transform.stringToVariableName('Test String')).to.equal('testString');
```


 stringToVariableName() should replace "&" with "And"

```
expect(transform.stringToVariableName('Tom & Jerry')).to.equal('tomAndJerry');
```


## elementTypeToVariableName()
 elementTypeToVariableName() should convert the string "drop down list" to "Select"

```
expect(transform.elementTypeToVariableName('drop down list')).to.equal('Select');
```


 elementTypeToVariableName() should capitalize the first letter of other strings and pass them through

```
expect(transform.elementTypeToVariableName('button')).to.equal('Button');
```


 elementTypeToVariableName() should trim white space

```
expect(transform.elementTypeToVariableName(' button ')).to.equal('Button');
```
