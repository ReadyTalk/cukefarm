var { defineSupportCode } = require('cucumber');

defineSupportCode(function({addTransform}) {
  addTransform({
    typeName: 'shouldToBoolean',
    captureGroupRegexps: ['should|should not'],
    transformer: transform.shouldToBoolean
  });

  addTransform({
    typeName: 'elementName',
    captureGroupRegexps: ['[^"]*'],
    transformer: transform.stringToVariableName
  });

  addTransform({
    typeName: 'elementType',
    captureGroupRegexps: [' button| checkbox| drop down list| field| link| select| tab|'],
    transformer: transform.elementTypeToVariableName
  });

  addTransform({
    typeName: 'captureString',
    captureGroupRegexps: ['[^"]*'],
    transformer: function(string) { return string; }
  });
});

var transform = new Transform();

function Transform() {
  this.shouldToBoolean = function(expectation) {
    return expectation === 'should';
  };

  this.stringToVariableName = function(string) {
    var firstWord, i, len, varName, word, words;

    varName = "";
    string = string.replace('&', 'And');

    words = string.split(' ');
    firstWord = words.shift();
    varName += firstWord.charAt(0).toLowerCase() + firstWord.substring(1);

    words = words.map(function(word) {
      return word.charAt(0).toUpperCase() + word.substring(1);
    });

    for (i = 0; i < words.length; i++) {
      word = words[i];
      varName += word;
    }

    return varName;
  };

  this.elementTypeToVariableName = function(string) {
    string = string.trim();
    if (string === "drop down list") {
      return "Select";
    } else {
      return string.charAt(0).toUpperCase() + string.substring(1);
    }
  };
};

module.exports = Transform;
