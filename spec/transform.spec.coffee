{expect} = require 'chai'
rek = require 'rekuire'

Transform = rek 'Transform'
{World} = rek 'World'

describe 'transform', ->

  transform = new Transform()

  it 'should exist on the World', ->
    world = new World(->)
    expect(world.transform).to.be.an.instanceOf Transform

  describe 'shouldToBoolean()', ->

    it 'should convert the string "should" to true', ->
      expect(transform.shouldToBoolean('should')).to.equal true

    it 'should convert the string "should not" to false', ->
      expect(transform.shouldToBoolean('should not')).to.equal false

  describe 'stringToVariableName()', ->

    it 'should make the first letter of a string lower case', ->
      expect(transform.stringToVariableName('Test')).to.equal 'test'

    it 'should not affect letters after the first letter', ->
      expect(transform.stringToVariableName('TEST')).to.equal 'tEST'

    it 'should remove spaces', ->
      expect(transform.stringToVariableName('Test String')).to.equal 'testString'

    it 'should replace "&" with "And"', ->
      expect(transform.stringToVariableName('Tom & Jerry')).to.equal 'tomAndJerry'

  describe 'elementTypeToVariableName()', ->

    it 'should convert the string "drop down list" to "Select"', ->
      expect(transform.elementTypeToVariableName('drop down list')).to.equal 'Select'

    it 'should capitalize the first letter of other strings and pass them through', ->
      expect(transform.elementTypeToVariableName('button')).to.equal 'Button'
