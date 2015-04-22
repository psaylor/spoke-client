define(['jquery', 'sharedAudio', 'utils', 'clientSocket'],
    function($, sharedAudio, utils, clientSocket) {
        console.log("> Loading recorder.js");

        var context = sharedAudio.audioContext;

        var socket = clientSocket.socket;
        var ioStream = clientSocket.ioStream;

        socket.on('audioStreamResult', function(result) {
            console.log('Audio stream result for', result);
        });

        /*
            Adding events following naming conventions from jquery bind
            http://api.jquery.com/bind/
            namespaced to be event.project.module, e.g. start.spoke.recorder
            Use object passing in the on(eventName, customObj, fn) to add things
            to event.data to be passed back to you when the event method is 
            executed, read more here https://api.jquery.com/event.data/

            Note: using eventName start works fine for putting the event listener
            on the recordButton, however, if you want to emit the event on the
            recorder object, then trigger('start') actually calls the start
            function of Recorder instead of going to the listener, so we have to
            change the eventName
        */

        /**
        * Create a new Recorder instance for element that is toggled by clicking
        * element. Requires a backend socket.io setup for receiving the audio stream,
        * but the socket.io event names can be configured.
        */
        var Recorder = function (element, options) {

            if(!(this instanceof Recorder)) {
                return new Recorder(element, options);
            }
            console.log('Creating new Recorder on element', element);
            options = options || {};
            this.settings = $.extend({}, Recorder.DEFAULTS, options);
            this.recordBtn = $(element);
            this.$this = $(this);

            this.recording = false;

            this.binaryAudioStream = null;
            this.audioMetadata = this.settings.audioMetadata;
            this.audioMetadata['sampleRate'] = context.sampleRate;
            console.log('Recorder AudioMetaData:', this.audioMetadata);

            this._setupAudioNodes();
            var self = this;
            this.recordBtn.click(function toggleRecord () {
                self.toggle.call(self);
            });
        };

        Recorder.DEFAULTS = {
            // numInputChannels: 1, // not supported yet
            bufferLength: 2048,
            bufferConversion: utils.convertFloat32ToInt16,
            socketioEvents: {
                emitAudioStream: 'audioStream',
            },
            audioMetadata: {},
        };

        Recorder.socket = socket;
        Recorder.ioStream = ioStream;

        /**
            Initializes the javascript processor node for recording audio
        */
        Recorder.prototype._setupAudioNodes = function () {
            // Alias the current Recorder object
            var self = this;
            // Create a javascript processor node to handle recording, 
            // called whenever bufferLength frames have  been sampled
            this.scriptRecorderNode = context.createScriptProcessor(
                this.settings.bufferLength, 1, 1);
            // Specify the processing function
            this.scriptRecorderNode.onaudioprocess = function onaudioprocess (audioProcessingEvent) {
                self._recorderProcess.call(self, audioProcessingEvent);
            };
        };

        /**
            Creates a new stream for sending the audio to the server
        */
        Recorder.prototype._setupStream = function (buffer) {
            console.log("Setting up new stream");
            this.binaryAudioStream = ioStream.createStream();
            var eventName = this.settings.socketioEvents.emitAudioStream;
            ioStream(socket).emit(eventName, this.binaryAudioStream, this.audioMetadata);
        };

        /**
            Converts the buffer of WebAudio audio samples and sends it to the
            socket.io server
        */
        Recorder.prototype._recorderProcess = function (audioProcessingEvent) {
            /*
                Since we are recording in mono we only need the left channel
                We get PCM data samples from the left channel, which are in
                Float32, then convert those samples to 16-bit signed integers
                by default. The conversion method can be configured in options.
            */
            var left = audioProcessingEvent.inputBuffer.getChannelData(0); 
            var converted = this.settings.bufferConversion(left);

            /* this is hacky but avoids a lot of overhead, should make a wrapper
            library that includes this function though since Buffer is a Node.js thing
            or just make all client side with browserify instead of requirejs */
            this.binaryAudioStream.writeAudio(converted);
        };

        Recorder.prototype.startRecording = function () {
            this.recording = true;
            this.recordBtn.trigger('start.spoke.recorder');
            this.$this.trigger('start.spoke.recorder');
            // connect recorder to the previous destination so it gets called
            this.scriptRecorderNode.connect(context.destination);

            console.log("Setting up recorder.");
            var self = this;
            sharedAudio.audioStreamPromise.then(function (audioStreamSource) {
                console.log("Then got audioStreamSource for recorder");
                audioStreamSource.connect(self.scriptRecorderNode);
                console.log("Recorder started");
            }).catch(function (err) {
                console.log('Audio streaming error in recorder:', err);
                self.stop();
            });

            // TODO: emit startRecording event to listeners (not socket.io)
        };

        Recorder.prototype.stopRecording = function () {
            this.scriptRecorderNode.disconnect();
            this.binaryAudioStream.end();
            this.binaryAudioStream = null;
            this.recording = false;
            this.recordBtn.trigger('stop.spoke.recorder');
            this.$this.trigger('stop.spoke.recorder');
            // TODO: emit stopRecording event to listeners (note, not socket.io)
        };

        Recorder.prototype.toggle = function () {
            if (this.recording) {
                console.log("Disconnecting recorder");
                this.stopRecording();
            } else {
                console.log("Starting recorder");
                this._setupStream();
                this.startRecording();
            }
        };

        return Recorder;
});