app.directive( 'input', function() {
  return function( scope, element, attrs ) {
    element.bind( 'mousedown', function( event ) {
      event.stopPropagation();
    });
  };
});
