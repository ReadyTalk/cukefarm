var Transform = require('../lib/support/Transform');
var World = require('../lib/support/World')
var expect = require('chai').expect;

describe('transform', function() {
  var transform;

  before(function() {
    transform = new Transform();
  })

  it('should exist on the World', function() {
    var world;
    world = new World(function() {});
    return expect(world.transform).to.be.an.instanceOf(Transform);
  });

  describe('shouldToBoolean()', function() {
    it('should convert the string "should" to true', function() {
      expect(transform.shouldToBoolean('should')).to.equal(true);
    });

    it('should convert the string "should not" to false', function() {
      expect(transform.shouldToBoolean('should not')).to.equal(false);
    });
  });

  describe('stringToVariableName()', function() {
    it('should make the first letter of a string lower case', function() {
      expect(transform.stringToVariableName('Test')).to.equal('test');
    });

    it('should not affect letters after the first letter', function() {
      expect(transform.stringToVariableName('TEST')).to.equal('tEST');
    });

    it('should remove spaces', function() {
      expect(transform.stringToVariableName('Test String')).to.equal('testString');
    });

    it('should replace "&" with "And"', function() {
      expect(transform.stringToVariableName('Tom & Jerry')).to.equal('tomAndJerry');
    });
  });

  return describe('elementTypeToVariableName()', function() {
    it('should convert the string "drop down list" to "Select"', function() {
      expect(transform.elementTypeToVariableName('drop down list')).to.equal('Select');
    });

    it('should capitalize the first letter of other strings and pass them through', function() {
      expect(transform.elementTypeToVariableName('button')).to.equal('Button');
    });
  });
});
