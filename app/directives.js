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
  .directive( 'editable', function() {
    return {
      require: '?ngModel',

      link: function( scope, element, attrs, ngModel ) {
        element.bind( 'click', function() {
          element.attr( 'contenteditable', 'true' );
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

        // Initialize element to current value.
        element.html( ngModel.$viewValue );

        function read() {
          ngModel.$setViewValue( element.html() );
        }
      }
    };
  });
