var app = angular.module( 'spindle', [] );

var editorConverter = Markdown.getSanitizingConverter(),
    editor = new Markdown.Editor( editorConverter );

editor.run();
