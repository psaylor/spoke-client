require.config({
    paths: {
        'jquery': 'https://code.jquery.com/jquery-1.11.0.min',
        'ractive': 'https://cdnjs.cloudflare.com/ajax/libs/ractive/0.7.2/ractive.min',
        'modernizr': 'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min',
        'socketio': 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min',
        'socketio-stream': 'third-party/socket.io-stream',
        'promise': 'https://cdn.jsdelivr.net/bluebird/latest/bluebird.min',
    },
});

require(['jquery', 'crossBrowserAudio', 'microphone', 'recorder', 'recognizer'], 
    function($, crossBrowserAudio, mic, recorder, recognizer) {
        console.log("Loaded requirements for main.js");

});