app.directive( 'editable', function() {
  // Simple editable directive.
  return {
    require: '?ngModel',

    link: function( scope, element, attrs, ngModel ) {
      if ( !ngModel ) { return; }

      ngModel.$render = function() {
        element.html( ngModel.$viewValue || '' );
      };

      element.bind( 'click', function() {
        if ( element.attr( 'contenteditable' ) === 'false' ) {
          element.attr( 'contenteditable', true );
        }
      });

      element.bind( 'change keyup', function() {
        if ( element.attr( 'contenteditable' ) === 'true' ) {
          scope.$apply( read );
        }
      });

      element.bind( 'blur', function() {
        if ( element.attr( 'contenteditable' ) === 'true' ) {
          scope.$apply( read );
          element.attr( 'contenteditable', false );
        }
      });

      function read() {
        ngModel.$setViewValue( element.html() );
      }
    }
  };
});
