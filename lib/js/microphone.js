define(['jquery', 'sharedAudio', 'utils'],
    function($, sharedAudio, utils) {
        console.log("> Loading microphone.js");

        var context = sharedAudio.audioContext;

        var audioSamplingRate = context.sampleRate;

        // TODO accept ractive component for element instead of just jquery
        var VolumeMeter = function (element, options) {

            // Make using the 'new' keyword optional
            if (!(this instanceof VolumeMeter)) {
                return new VolumeMeter(element, options);
            }

            options = options || {};
            this.settings = $.extend({}, VolumeMeter.DEFAULTS, options);
            // Wrap this VolumeMeter instance with jQuery so we can trigger custom events
            this.$this = $(this);
            this.element = $(element);
            this.adjustable = this.element.find('.vol-adjust');
            
            this.autoAdjust = this.settings.autoAdjust;
            this.adjustableHeight = this.settings.maxMeterHeight - 
                this.settings.minMeterHeight;

            this.minFreqIndex = this._getFrequencyIndex(this.settings.minFrequency);
            this.maxFreqIndex = this._getFrequencyIndex(this.settings.maxFrequency);

            this._setupMeterElement();
            this._setupAudioNodes();
        };

        VolumeMeter.DEFAULTS = {
            /* Options for the Analyser node*/
            analyserFftSize: 128,
            smoothingTimeConstant: 0.5,

            /* Options for the ScriptProcessorNode */
            scriptBufferSize: 2048,
            numInputChannels: 1,
            numOutputChannels: 1,

            autoAdjust: true,
            selectable: true,

            /* Options for the min/max adjusted height the meter can have */
            minMeterHeight: 35, // minHeight in %
            maxMeterHeight: 100, // maxHeight in %

            /* Options for the frequency range we use to determine volume level */
            minFrequency: 300,
            maxFrequency: 3300,
        };

        VolumeMeter.prototype._setupAudioNodes = function () {
            var self = this; // alias the current VolumeMeter object
            // Create the analyser node
            this.analyser = context.createAnalyser();
            this.analyser.smoothingTimeConstant = this.settings.smoothingTimeConstant;
            this.analyser.fftSize = this.settings.analyserFftSize;

            // Create the javascript processor node
            // called whenever the 2048 frames have been sampled, approx 21 times a second
            this.javascriptNode = context.createScriptProcessor(
                this.settings.scriptBufferSize, this.settings.numInputChannels,
                this.settings.numOutputChannels);
            this.javascriptNode.connect(context.destination);
            this.javascriptNode.onaudioprocess = function onaudioprocess () {
                // call the VolumeMeter's onaudioprocess function as if from the
                // VolumeMeter itself
                self._onaudioprocess.call(self);
            };
            // Add this to the global scope to ensure it doesn't get garbage collected
            utils.addGlobalVariable('spokeJavascriptNode', this.javascriptNode);

            console.log('Created analyser node:', typeof(this.analyser), this.analyser);
            console.log('Created script processor node:', typeof(this.javascriptNode), this.javascriptNode);

            // Hook up the analyser and the script processor to the audio stream
            sharedAudio.audioStreamPromise.then(function(audioStreamSource) {
                console.log("Microphone icon got access to audioStreamSource", typeof(audioStreamSource), audioStreamSource);
                audioStreamSource.connect(self.analyser);
                self.analyser.connect(self.javascriptNode);
                self.javascriptNode.connect(context.destination);
                return audioStreamSource;
            }).catch(function (err) {
                console.log('Audio streaming error in microphone:', err);
            });
        };

        VolumeMeter.prototype._setupMeterElement = function () {
            if (!this.settings.selectable) {
                this.element.addClass('glyph');
            }
        };

        VolumeMeter.prototype._onaudioprocess = function () {
            var array = new Uint8Array(this.analyser.frequencyBinCount);
            this.analyser.getByteFrequencyData(array);
            var volumeLevel = this._computeVolumeLevel(array);
            this.$this.trigger('volumeLevel.spoke.volumeMeter', [volumeLevel]);
            if (this.autoAdjust) {
                this.adjustVolumeMeter(volumeLevel);
            }
        };

        VolumeMeter.prototype._getFrequencyIndex = function (frequency) {
            var index = Math.floor((frequency * this.settings.analyserFftSize) / audioSamplingRate);
            return index;
        };
        
        VolumeMeter.prototype._computeMeterHeight = function (volumeLevel) {
            var filledHeight = (volumeLevel * this.adjustableHeight) +
                this.settings.minMeterHeight;
            filledHeight = filledHeight.toFixed();
            var grayHeight = this.settings.maxMeterHeight - 
                Math.min(filledHeight, this.settings.maxMeterHeight);
            return grayHeight;
        };

        VolumeMeter.prototype._computeVolumeLevel = function (typedAudioArray) {
            var avg = utils.average(typedAudioArray, this.minFreqIndex, this.maxFreqIndex);
            var normalized = avg / 256;
            return normalized;
        };

        /**
        * Given the current volumeLevel, updates the height of the volumeMeter.
        * volumeLevel is a float between 0 and 1, where 1 is max volume.
        */
        VolumeMeter.prototype.adjustVolumeMeter = function (volumeLevel) {
            var adjustedHeight = this._computeMeterHeight(volumeLevel);
            this.adjustable.css('max-height', adjustedHeight + '%');
        };

        /**
        * Convenience function for adding listeners to events triggered by this
        * instance (so you don't have to wrap the object in jquery yourself).
        */
        VolumeMeter.prototype.on = function (eventName, handler) {
            this.$this.on(eventName, handler);
        };

        return {
            VolumeMeter: VolumeMeter,
        };
});