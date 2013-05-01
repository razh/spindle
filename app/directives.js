angular.module( 'drag', [] )
 .directive( 'draggable', function( $document ) {
    return function( scope, element, attr ) {
        var startX = 0,
            startY = 0,
            x = 0,
            y = 0;

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
