app.directive( 'editor', function() {
  var converter = Markdown.getSanitizingConverter();

  return function( scope, element, attrs ) {
    // Hack to make sure each element is initialized with the right id.
    angular.forEach( element.children(), function( child ) {
      child.id += '-' + scope.$index;
    });

    var editor = new Markdown.Editor( converter, '-' + scope.$index );
    editor.run();

    // Add classes to the various buttons.
    var buttons = element.children()[0].childNodes[0].childNodes;
    angular.forEach( buttons, function( child ) {
      // Very hacky. We copy over the id attribute without the id number.
      var matches = child.id.match( /wmd-[a-z]*-button/ );
      if ( matches ) {
        child.className += ' ' + matches[0];
      }
    });
  };
});
