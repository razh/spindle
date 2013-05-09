// Adapted from code taken from: http://docs.angularjs.org/guide/compiler.
app.directive( 'draggable', function( $document ) {
  return function( scope, element, attrs ) {
    var startX = attrs.x || 0,
        startY = attrs.y || 0,
        x = startX,
        y = startY;

    element.css({
      top:  startY + 'px',
      left: startX + 'px'
    });

    element.bind( 'mousedown', function( event ) {
      // Stop if not left mouse button.
      if ( event.which !== 1 ) {
        return;
      }

      element.addClass( 'selected' );
      startX = event.screenX - x;
      startY = event.screenY - y;
      $document.bind( 'mousemove', mousemove );
      $document.bind( 'mouseup', mouseup );
    });

    function mousemove( event ) {
      y = Math.max( 0, event.screenY - startY );
      x = Math.max( 0, event.screenX - startX );
      element.css({
        top:  y + 'px',
        left: x + 'px'
      });

      element.attr( 'x', x );
      element.attr( 'y', y );
    }

    function mouseup() {
      element.removeClass( 'selected' );
      $document.unbind( 'mousemove', mousemove );
      $document.unbind( 'mouseup', mouseup );
    }
  };
});
