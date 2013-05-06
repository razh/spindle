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
        element.removeClass( 'selected' );
        $document.unbind( 'mousemove', mousemove );
        $document.unbind( 'mouseup', mouseup );
      }
    };
  })
  .directive( 'resizable', function() {
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
  })
  // Simple editable directive.
  .directive( 'editable', function() {
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
  })
  // Editable directive with support for markdown.
  .directive( 'markdownEditable', function() {
    var converter = Markdown.getSanitizingConverter();

    function convertToHtml( string ) {
      // nl2br adds <br> tag before \n, so we'll have to remove extra \n.
      return nl2br( string, false )
        .replace( /\n/g, '' )
        // Replace consecutive spaces with non-breaking space.
        .replace( /  /g, '&nbsp; ' );
    }

    function convertToMarkdown( string ) {
      return string
       // Remove extraneous <pre> and <span> tags.
       .replace( /<pre style="[a-zA-Z0-9\-:; ]*">/g, '' )
       .replace( /<\/pre>/g, '' )
       .replace( /<span style="[a-zA-Z0-9\-:; ]*">/g, '' )
       .replace( /<\/span>/g, '' )
       // Replace <div> and <br> tag combinations with new lines.
       .replace( /<div><br><\/div>/g, '\n' )
       .replace( /<br>/g, '\n' )
       .replace( /<div>/g, '\n' )
       .replace( /<\/div>/g, '' )
       .replace( /&nbsp;/g, ' ' )
       // Handle non-alphanumeric character codes.
       .replace( /&gt;/g, '>' )
       .replace( /&lt;/g, '<' );
    }

    return {
      require: '?ngModel',

      link: function( scope, element, attrs, ngModel ) {
        // Do nothing if no ng-model exists.
        if ( !ngModel ) { return; }

        // Format and initialize the view in Markdown.
        ngModel.$render = function() {
          element.html( converter.makeHtml( convertToMarkdown( ngModel.$viewValue || '' ) ) );
        };

        element.bind( 'click', function() {
          // Necessary to compare it against string representation.
          if ( element.attr( 'contenteditable' ) === 'false' ) {
            // Set editable to true and populate with underlying markup.
            element.attr( 'contenteditable', true );
            element.html( convertToHtml( ngModel.$viewValue ) );
          }
        });

        // No dragging while editing.
        element.bind( 'mousedown', function( event ) {
          event.stopPropagation();
        });

        element.bind( 'blur', function() {
          if ( element.attr( 'contenteditable' ) === 'true' ) {
            scope.$apply( read );
            element.html( converter.makeHtml( ngModel.$viewValue ) );
            element.attr( 'contenteditable', false );
          }
        });

        function read() {
          // Replace what Chrome uses to add new lines to contenteditable divs.
          ngModel.$setViewValue( convertToMarkdown( element.html() ) );
        }
      }
    };
  })
  .directive( 'markdownInput', function() {
    return function( scope, element, attrs ) {
      element.bind( 'mousedown', function( event ) {
        event.stopPropagation();
      });
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
