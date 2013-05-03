app.controller( 'SpindleCtrl', [ '$scope', function( $scope ) {
  $scope.passages = [
    {
      x: 400,
      y: 200,
      width: 200,
      title:  'hello this is a title',
      text: 'maximum horoscopes decide contemporary conundrums'
    },
    {
      x: 200,
      y: 150,
      title: 'hello this is a second test',
      text: 'how will this work? [[displayed text|and here is a third test]]'
    },
    {
      x: 30,
      y: 50,
      width: 150,
      title: 'and here is a third test',
      text: 'oh come on, we can think of better text than this'
    },
    {
      x: 100,
      y: 300,
      width: 80,
      title: 'how about a fourth?',
      text: 'something new, and perhaps unexpected'
    }
  ];

  console.log( $scope.passages[0] );
}]);

