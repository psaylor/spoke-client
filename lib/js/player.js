define(['jquery', 'sharedAudio', 'promise'],
    function($, sharedAudio, Promise) {
        console.log("> Loading player.js");

        var context = sharedAudio.audioContext;

        // TODO: Promisify the step from finishing audio consolidation
        // to setting audioDataBuffer to playing the audio if autoPlay
        // TODO: add config for looping and other stuff
        // TODO: should this take a socket instead of an audiostream from a socket?

        /**
        * Creates a Player for an audioStream with optional options. Uses the
        * WebAudio APIs to play the audio from the stream after the stream has
        * finished.
        */
        var Player = function (audioStream, options) {
            if(!(this instanceof Player)) {
                return new Player(audioStream, options);
            }
            console.log('Creating new Player for stream', audioStream);
            options = options || {};
            this.settings = $.extend({}, Player.DEFAULTS, options);

            // Wrap this Recorder instance with jQuery so we can trigger custom events
            this.$this = $(this);
            this.audioStream = audioStream;
            this.audioDataArray = [];
            this.audioDataBuffer = null;
            this._listenToAudioStream();
        };

        Player.DEFAULTS = {
            autoPlay: true, // Automatically play the audio when it finishes loading
        };

        /**
            Initializes the AudioNodes for playing audio
        */
        Player.prototype._listenToAudioStream = function () {
            var self = this;
            this.audioStream.on('data', function (data) {
                self._onAudioData(data);
            });

            this.audioStream.on('end', function () {
                self._onAudioEnd();
            });
        };

        /**
        * Gathers the audio data into an audioDataArray
        */
        Player.prototype._onAudioData = function (data) {
            this.audioDataArray.push(data);
        };

        /**
        * Consolidates all the audio data from audioDataArray into a single
        * Uint8Array
        */
        Player.prototype._onAudioEnd = function () {
            var totalBufferByteLength = 0;
            for (var i = 0; i < this.audioDataArray.length; i++) {
                totalBufferByteLength += this.audioDataArray[i].byteLength;
            }

            this.audioDataBuffer = new Uint8Array(totalBufferByteLength);
            var bufferByteOffset = 0;
            for (var j = 0; j < this.audioDataArray.length; j++) {
                var typedArray = new Uint8Array(this.audioDataArray[j]);
                this.audioDataBuffer.set(typedArray, bufferByteOffset);
                bufferByteOffset += typedArray.byteLength;
            }

            this.$this.trigger('ready.spoke.player');
            if (this.settings.autoPlay) {
                this.playAudio();
            }
        };

        Player.prototype.playAudio = function () {
            var self = this;
            sharedAudio.promiseDecodeAudioData(this.audioDataBuffer.buffer)
                .then(sharedAudio.promisePlayAudioData)
                .then(function() {
                    self.$this.trigger('done.spoke.player');
                });
        };

        /**
        * Convenience function for adding listeners to events triggered by this
        * instance (so you don't have to wrap the object in jquery yourself).
        */
        Player.prototype.on = function (eventName, handler) {
            this.$this.on(eventName, handler);
        };

        return Player;
});