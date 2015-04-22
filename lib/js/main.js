require.config({
    paths: {
        'jquery': 'https://code.jquery.com/jquery-1.11.0.min',
        'ractive': 'https://cdnjs.cloudflare.com/ajax/libs/ractive/0.7.2/ractive.min',
        /*M*/
        'modernizr': 'https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min',
        'socketio': 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.5/socket.io.min',
        'socketio-stream': 'third-party/socket.io-stream',
        'promise': 'https://cdn.jsdelivr.net/bluebird/latest/bluebird.min',
    },
    shim: {
        'modernizr': {
            exports: 'Modernizr',
        },
    },
});

require(['jquery', 'crossBrowserAudio', 'microphone', 'recorder'], 
    function($, crossBrowserAudio, mic, Recorder) {
        /**
        * YOUR CODE HERE
        */
        var volumeMeterElement = $('.myVolumeMeter');
        var volumeMeterColorLayer = $('.fa-microphone.stroked');
        var volumeMeter = mic.VolumeMeter(volumeMeterElement);
        $(volumeMeter).on('volumeLevel.spoke.volumeMeter', function (event, volumeLevel) {
            /* Do whatever you want with the volume level here */
        });

        var recordButtonElement = $(".myRecordButton");
        var onStartEventData = {
            index: 5,
            uttId: 4,
            myname: 'trish',
        };
        var recorder = Recorder(recordButtonElement);

        // Can add listener either on the recordBtn passed in, or on the 
        // recorder instance by first wrapping it as a jQuery object
        recordButtonElement.on('start.spoke.recorder', onStartEventData, 
            function (event) {
            console.log('Recording started for', event.data);
        });

        $(recorder).on('start.spoke.recorder', {me: 'trish'}, function (e) {
            console.log('Started spoke recorder:', e);
            volumeMeterColorLayer.toggleClass('stroked-blue stroked-red');
        });

        $(recorder).on('stop.spoke.recorder', {me: 'patricia'}, function (e) {
            console.log('Stopped spoke recorder:', e);
            volumeMeterColorLayer.toggleClass('stroked-blue stroked-red');
        });

});