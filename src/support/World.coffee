rek = require 'rekuire'
chai = require 'chai'
chaiAsPromised = require 'chai-as-promised'
ElementHelper = rek 'ElementHelper'
Transform = rek 'Transform'

class World
  Q: require 'q'
  elementHelper: new ElementHelper()
  transform: new Transform()
  currentPage: null
  pageObjectMap: null

  constructor: ->
    chai.use chaiAsPromised
    @expect = chai.expect

module.exports.World = World
