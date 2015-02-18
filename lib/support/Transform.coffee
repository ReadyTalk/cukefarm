class Transform

  shouldToBoolean: (expectation) ->
    expectation is 'should'

  stringToVariableName: (string) ->
    varName = ""
    string = string.replace '&', 'And'
    words = string.split ' '
    firstWord = words.shift()
    varName += firstWord.charAt(0).toLowerCase() + firstWord.substring(1)
    words = words.map (word) -> word.charAt(0).toUpperCase() + word.substring(1)
    varName += word for word in words
    return varName

  elementTypeToVariableName: (string) ->
    if string is "drop down list"
      return "Select"
    else
      return string.charAt(0).toUpperCase() + string.substring(1)

module.exports = Transform