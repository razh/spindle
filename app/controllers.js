app.controller( 'SpindleCtrl', [ '$scope', function( $scope ) {
    $scope.passages = [
      {
        x: 400,
        y: 120,
        width: 200,
        title: 'hello this is a title',
        text: 'maximum horoscopes\n\n# Title\ndecide contemporary conundrums\n# one\n\n# two'
      },
      {
        x: 200,
        y: 150,
        title: 'hello this is a second test',
        text: 'how will this work? [displayed text](http://google.com)'
      },
      {
        x: 280,
        y: 0,
        width: 150,
        title: 'and here is a third test',
        text: 'oh come on, we can think of better text than this\n\n    <<&lt;&lt;!@#\n    $%^&*())_+-=[] ) {}'
      },
      {
        x: 500,
        y: 150,
        width: 300,
        title: 'how about a fourth?',
        text: 'something new, and perhaps unexpected *italics* **bold**'
      }
    ];

    console.log( $scope.passages[0] );

    $scope.addPassage = function() {
      $scope.passages.push({
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight,
        title: '',
        text: ''
      });
    };

    $scope.removePassage = function( index ) {
      $scope.passages.splice( index, 1 );
    };

    var visibility = [];
    $scope.togglePassageVisibility = function( index ) {
      visibility[ index ] = !visibility[ index ] || false;
    };

    $scope.isPassageVisible = function( index ) {
      return visibility[ index ] || false;
    };
  }]);
