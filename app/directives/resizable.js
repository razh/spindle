app.directive( 'resizable', function() {
  var defaultWidth = 120;

  return function( scope, element, attrs ) {
    var width = scope.passage.width || defaultWidth;

    element.css({
      width: width + 'px'
    });

    element.attr( 'width', width );

    element.bind( 'mousedown' , function() {
      element.bind( 'mousemove', mousemove );
      element.bind( 'mouseup', mouseup );
    });

    function mousemove( event ) {
      // Remove 'px' from end of width.
      var widthString = element.css( 'width' );
      width = widthString.substring( 0, widthString.length - 2 );
      element.attr( 'width', width );
    }

    function mouseup( event ) {
      element.unbind( 'mousemove', mousemove );
      element.unbind( 'mouseup', mouseup );
    }
  };
});
