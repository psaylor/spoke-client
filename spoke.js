require.config({
    paths: {
        /* Third Party Libraries */
        'jquery': 'https://code.jquery.com/jquery-1.11.0.min',
        'ractive': 'https://cdnjs.cloudflare.com/ajax/libs/ractive/0.7.2/ractive.min',
        'modernizr': 'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min',
        'socketio': 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min',
        'socketio-stream': 'third-party/socket.io-stream',
        'promise': 'https://cdn.jsdelivr.net/bluebird/latest/bluebird.min',

        /* Internal Libraries */
        'audioStream': 'lib/js/audioStream',
        'clientSocket': 'lib/js/clientSocket',
        'crossBrowserAudio': 'lib/js/crossBrowserAudio',
        'microphone': 'lib/js/microphone',
        'player': 'lib/js/player',
        'recognizer': 'lib/js/recognizer',
        'recorder': 'lib/js/recorder',
        'sharedAudio': 'lib/js/sharedAudio',
        'utils': 'lib/js/utils',
    },
    shim: {
        'modernizr': {
            exports: 'Modernizr',
        },
    },
});

require(['jquery', 'crossBrowserAudio', 'microphone', 'recorder', 'recognizer'], 
    function($, crossBrowserAudio, mic, recorder, recognizer) {
        /**
        * YOUR CODE HERE
        */

});