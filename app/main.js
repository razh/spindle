var app = angular.module( 'spindle', [] );

var editorConverter = Markdown.getSanitizingConverter(),
    editor = new Markdown.Editor( editorConverter );

editor.run();


// var italicButton = document.getElementById( 'wmd-italic-button' );
// italicButton.style.left = '10';
