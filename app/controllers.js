app.controller( 'SpindleCtrl', [ '$scope', function( $scope ) {
  $scope.passages = [
    {
      x: 400,
      y: 200,
      title:  'hello this is a title',
      text: 'maximum horoscopes decide contemporary conundrums'
    },
    {
      x: 200,
      y: 150,
      title: 'hello this is a second test',
      text: 'how will this work?'
    },
    {
      x: 30,
      y: 50,
      title: 'and here is a third test',
      text: 'oh come on, we can think of better text than this'
    }
  ];

  console.log( $scope.passages[0] );
}]);

