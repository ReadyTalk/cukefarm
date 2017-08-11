(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      template: '<div id="testDiv"></div>'
    })
    .Class({
      constructor:[ng.core.ElementRef, function(eltRef){
        this.eltRef = eltRef;
        console.log(this.eltRef);
        console.log(this.eltRef.nativeElement);
      }]
    });
})(window.app || (window.app = {}));
