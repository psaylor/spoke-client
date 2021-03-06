require.config({
    paths: {
        /* Configure location for third-party libraries, using CDN and a local fallback */
        'jquery': [
            'https://code.jquery.com/jquery-1.11.0.min',
            'third-party/jquery-1.11.0.min',
        ],
        'ractive': [
            'https://cdnjs.cloudflare.com/ajax/libs/ractive/0.7.2/ractive.min',
            'third-party/ractive-0.7.2.min',
        ],
        'modernizr': [
            'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min',
            'third-party/modernizr.custom.68208',
        ],
        'socketio': [
            'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min',
            'third-party/socketio-1.3.5.min',
        ],
        'socketio-stream': 'third-party/socket.io-stream',
        'promise': [
            'https://cdn.jsdelivr.net/bluebird/latest/bluebird.min',
            'third-party/bluebird-2.9.24.min',
        ],
    },
    shim: {
        'modernizr': {
            exports: 'Modernizr',
        },
    },
});

define(['crossBrowserAudio', 'microphone', 'player', 'recognizer', 'recorder', 
    'sharedAudio', 'sharedSocket', 'synthesizer', 'utils'], 
    function(crossBrowserAudio, microphone, Player, recognizer, Recorder,
        sharedAudio, sharedSocket, Synthesizer, utils) {

        console.log('> Loaded', arguments.length, 'Spoke modules.');

        /* Load all Spoke modules and just pass them through in the output */
        return {
            crossBrowserAudio: crossBrowserAudio,
            microphone: microphone,
            Player: Player,
            recognizer: recognizer,
            Recorder: Recorder,
            sharedAudio: sharedAudio,
            sharedSocket: sharedSocket,
            Synthesizer: Synthesizer,
            utils: utils,
        };
});