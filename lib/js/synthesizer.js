define(['jquery', 'sharedAudio', 'sharedSocket', 'utils'],
    function($, sharedAudio, sharedSocket, utils) {
        console.log("> Loading synthesizer.js");

        try {
            var SpeechSynthesis = window.speechSynthesis;
            var SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
            console.log('Got SpeechSynthesis');
        } catch(e) {
            var SpeechSynthesis = Object;
            var SpeechSynthesisUtterance = Object;
            console.log('Error getting SpeechSynthesis:', e);
            return;
        }

        /**
        * Create a new Synthesizer using the Web Speech API SpeechRecognition
        * if available.
        */
        var Synthesizer = function (utteranceText, options) {
            if(!(this instanceof Synthesizer)) {
                return new Synthesizer(element, options);
            }
            console.log('Creating new Synthesizer for text', utteranceText);
            options = options || {};
            this.settings = $.extend({}, Synthesizer.DEFAULTS, options);
            this.utteranceText = utteranceText;
            // Wrap this Recorder instance with jQuery so we can trigger custom events
            this.$this = $(this);
            var self = this; //alias for referencing inside functions

            this._setupSynthesis();
            if (this.settings.autoPlay) {
                this.play();
            }

        };

        Synthesizer.DEFAULTS = {
            autoPlay: true,
            voiceIndex: 0,
            rate: 1,
            volume: 1,
            pitch: 1,
            // add other  config options here
        };

        Synthesizer.SpeechSynthesis = SpeechSynthesis;
        Synthesizer.SpeechSynthesisUtterance = SpeechSynthesisUtterance;

        Synthesizer.prototype._setupSynthesis = function () {
            this.utterance = new Synthesizer.SpeechSynthesisUtterance(this.utteranceText);
            this.utterance.volume = this.settings.volume;
            this.utterance.rate = this.settings.rate;
            this.utterance.pitch = this.settings.pitch;

            var self = this;

            this.utterance.onend = function (event) {
                console.log('SpeechSynthesisUtterance end event', event);
                self.$this.trigger('end.spoke.synthesizer', [event]);
            };

            this.utterance.onstart = function (event) {
                console.log('SpeechSynthesisUtterance start event', event);
                self.$this.trigger('start.spoke.synthesizer', [event]);
            };

            this.utterance.onboundary = function (event) {
                console.log('SpeechSynthesisUtterance reached boundary', event);
                self.$this.trigger('boundary.spoke.synthesizer', [event]);
            };
        };

        Synthesizer.prototype.play = function () {
            // end any other utterances and remove them from the play queue
            Synthesizer.SpeechSynthesis.cancel();
            // queue and play this utterance now
            Synthesizer.SpeechSynthesis.speak(this.utterance);
            if (Synthesizer.SpeechSynthesis.paused) {
                Synthesizer.SpeechSynthesis.resume();
            }
        };

        Synthesizer.prototype.stop = function() {
            // should this pause or cancel?
            Synthesizer.SpeechSynthesis.pause();
        };

        Synthesizer.getVoices = function () {
            return Synthesizer.SpeechSynthesis.getVoices();
        };
       
        /**
        * Convenience function for adding listeners to events triggered by this
        * instance (so you don't have to wrap the object in jquery yourself).
        */
        Synthesizer.prototype.on = function (eventName, handler) {
            return this.$this.on(eventName, handler);
        };

        return Synthesizer;
});