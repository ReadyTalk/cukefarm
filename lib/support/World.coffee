rek = require('rekuire')
chai = require('chai')
chaiAsPromised = require('chai-as-promised')
ElementHelper = rek('ElementHelper')
Transform = rek('Transform')

class World
  Q: require('q')
  elementHelper: new ElementHelper()
  transform: new Transform()
  currentPage: null
  pageObjectMap: null

  constructor: (callback) ->
    chai.use(chaiAsPromised)
    @expect = chai.expect

    callback()

module.exports.World = World