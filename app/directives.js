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
  .directive( 'editable', function() {
    var converter = Markdown.getSanitizingConverter();

    return {
      require: '?ngModel',

      link: function( scope, element, attrs, ngModel ) {
        // Do nothing if no ng-model exists.
        if ( !ngModel ) { return; }

        // Format and initialize the view in Markdown.
        ngModel.$render = function() {
          element.html( converter.makeHtml( ngModel.$viewValue || '' ) );
        };

        element.bind( 'click', function( event ) {
          // Necessary to compare it against string representation.
          if ( element.attr( 'contenteditable' ) === 'false' ) {
            // Set editable to true and populate with underlying markup.
            // nl2br adds <br> tag before \n, so we'll have to remove extra \n.
            element.attr( 'contenteditable', true );
            element.html( nl2br( ngModel.$viewValue, false ).replace( /\n/g, '' ) );
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
          ngModel.$setViewValue( element.html().replace( /<div><br><\/div>/g, '\n' )
                                               .replace( /<br>/g, '\n' )
                                               .replace( /<div>/g, '\n' )
                                               .replace( /<\/div>/g, '' ) );
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
