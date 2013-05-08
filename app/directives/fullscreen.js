app.directive( 'fullscreen', function() {
  return function( scope, element, attrs ) {

    var x = element.attr( 'x' ),
        y = element.attr( 'y' ),
        width = element.attr( 'width' );

    function toFullscreen() {
      element.unbind( 'dblclick', toFullscreen );

      x = element.attr( 'x' );
      y = element.attr( 'y' );
      width = element.attr( 'width' );

      element.css({
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
      });

      element.bind( 'dblclick', toWindowed );
    }

    function toWindowed() {
      element.unbind( 'dblclick', toWindowed );

      element.css({
        top: y + 'px',
        left: x + 'px',
        width: width + 'px',
        height: 'auto'
      });

      element.bind( 'dblclick', toFullscreen );
      console.log( x + ', ' + y + ', ' + width );
    }

    element.bind( 'dblclick', toFullscreen );
  };
});
