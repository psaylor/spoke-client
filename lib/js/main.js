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

require(['jquery', 'crossBrowserAudio', 'clientSocket', 'microphone', 'recorder', 'player', 'recognizer'], 
    function($, crossBrowserAudio, clientSocket, mic, Recorder, Player, recog) {
        /**
        * YOUR CODE HERE
        */
        var socket = clientSocket.socket;
        var ioStream = clientSocket.ioStream;

        /* Volume Meter Test */
        var volumeMeterElement = $('.myVolumeMeter');
        var volumeMeterColorLayer = $('.fa-microphone.stroked');
        var volumeMeter = mic.VolumeMeter(volumeMeterElement);
        volumeMeter.on('volumeLevel.spoke.volumeMeter', function (event, volumeLevel) {
            /* Do whatever you want with the volume level here */
        });

        /* Recorder Test */
        var recordButtonElement = $(".myRecordButton");
        var onStartEventData = {
            index: 5,
            uttId: 4,
            myname: 'trish',
        };
        var recorder = Recorder(recordButtonElement);

        // Can add listener either on the recordBtn passed in, or on the 
        // recorder instance by first wrapping it as a jQuery object
        // recordButtonElement.on('start.spoke.recorder', onStartEventData, 
        //     function (event) {
        //     console.log('Recording started for', event.data);
        // });

        recorder.on('start.spoke.recorder', {me: 'trish'}, function (e) {
            console.log('Started spoke recorder:', e);
            volumeMeterColorLayer.toggleClass('stroked-blue stroked-red');
        });

        recorder.on('stop.spoke.recorder', {me: 'patricia'}, function (e) {
            console.log('Stopped spoke recorder:', e);
            volumeMeterColorLayer.toggleClass('stroked-blue stroked-red');
        });

        /* Player Test */
        $('.myPlayBtn').on('click', function (event) {
            console.log('Sending play request');
            socket.emit('playRequest');
        });

        // Listen for playback result, and play it
        ioStream(socket).on('playResult', function (audioStream, data) {
            console.log('Playback result for ', data);
            var player = Player(audioStream);
            player.on('ready.spoke.player', function () {
                console.log('Audio ready to play.');
            });
            player.on('done.spoke.player', function () {
                console.log('Audio finished playing.');
            });
        });


        /* Recognizer Test */
        var recognizerButtonElement = $('.myRecognizeButton');
        var recognizerButtonColor = recognizerButtonElement.find('.stroked');
        var resultsElement = $('.myRecognitionResults');
        var recognizer = recog.Recognizer(recognizerButtonElement);

        recognizer.on('start.spoke.recognizer', function (event) {
            console.log('Spoke Recognizer start', event);
            recognizerButtonColor.toggleClass('stroked-green stroked-orange');
        });

        recognizer.on('stop.spoke.recognizer', function (event) {
            console.log('Spoke Recognizer stop', event);
            recognizerButtonColor.toggleClass('stroked-green stroked-orange');
        });

        recognizer.on('finalResult.spoke.recognizer', function (event, data) {
            console.log('Final result from speech recognition:', event, data);
            resultsElement.text(data);
        });

});