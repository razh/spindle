app.directive( 'markdownEditable', function() {
  // Editable directive with support for markdown.
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
});
