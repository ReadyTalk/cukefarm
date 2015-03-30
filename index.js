rek = require('rekuire');
World = rek('World').World;
config = rek('protractor.conf').config;

module.exports = {
  World: World,
  config: config
}
