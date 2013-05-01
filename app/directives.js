app.directive( 'draggable', function( $document ) {
    return function( scope, element, attrs ) {
        var startX = scope.passage.x || 0,
            startY = scope.passage.y || 0,
            x = startX,
            y = startY;

        element.css({
          top:  startY + 'px',
          left: startX + 'px'
        });

        element.bind( 'mousedown', function( event ) {
          startX = event.screenX - x;
          startY = event.screenY - y;
          $document.bind( 'mousemove', mousemove );
          $document.bind( 'mouseup', mouseup );
        });

        function mousemove( event ) {
          y = event.screenY - startY;
          x = event.screenX - startX;
          element.css({
            top:  y + 'px',
            left: x + 'px'
          });

          element.attr( 'x', x );
          element.attr( 'y', y );
        }

        function mouseup() {
          $document.unbind( 'mousemove', mousemove );
          $document.unbind( 'mouseup', mouseup );
        }
    };
  })
  .directive( 'resizable', function() {
    var touchSupport = 'ontouchstart' in window;

    return function( scope, element, attrs ) {
      var width = scope.passage.width || 120;

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
  })
  .directive( 'editable', function() {
    return {
      require: '?ngModel',

      link: function( scope, element, attrs, ngModel ) {
        element.bind( 'click', function( event ) {
          element.attr( 'contenteditable', 'true' );
        });

        element.bind( 'mousedown', function( event ) {
          event.stopPropagation();
        });

        // Do nothing if no ng-model exists.
        if ( !ngModel ) { return; }

        ngModel.$render = function() {
          element.html( ngModel.$viewValue || '' );
        };

        // Update on change.
        element.bind( 'blur keyup change', function() {
          scope.$apply( read );
        });

        element.bind( 'blur', function() {
          element.attr( 'contenteditable', 'false' );
        });

        // Initialize element to current value.
        element.html( ngModel.$viewValue );

        function read() {
          ngModel.$setViewValue( element.html() );
        }
      }
    };
  })
  .directive( 'fullscreen', function() {
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
