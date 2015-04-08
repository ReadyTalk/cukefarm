class ElementHelper

  hasClass: (element, cls) ->
    element.getAttribute('class').then (classes) ->
      classes.split(' ').indexOf(cls) isnt -1

module.exports = ElementHelper