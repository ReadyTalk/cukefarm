requirejs.config({
  paths: {
    fixtures: '../../../node_modules/js-fixtures/fixtures'
  }
});

requirejs(['fixtures'], function(fixtures) {});
