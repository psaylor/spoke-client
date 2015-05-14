define(['jquery', 'sharedAudio', 'sharedSocket', 'utils'],
    function($, sharedAudio, sharedSocket, utils) {
        console.log("> Loading recognizer.js");

        try {
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            console.log('Got recognition');
        } catch(e) {
            var recognition = Object;
            console.log('Error getting recognition:', e);
            return;
        }

        /**
        * Create a new Recognizer using the Web Speech API SpeechRecognition
        * if available.
        */
        var Recognizer = function (element, options) {
            if(!(this instanceof Recognizer)) {
                return new Recognizer(element, options);
            }
            console.log('Creating new Recognizer on element', element);
            options = options || {};
            this.settings = $.extend({}, Recognizer.DEFAULTS, options);
            this.element = $(element);
            // Wrap this Recorder instance with jQuery so we can trigger custom events
            this.$this = $(this);
            var self = this; //alias for referencing inside functions

            this.listening = false;
            this._setupRecognition();
            this.element.click(function toggleRecognition () {
                self.toggle.call(self);
            });

        };

        Recognizer.DEFAULTS = {
            continuous: true,
            // add other SpeechRecognition config options here
        };

        Recognizer.SpeechRecognition = SpeechRecognition;

        Recognizer.prototype._setupRecognition = function () {
            this.recognition = new Recognizer.SpeechRecognition();
            this.recognition.continuous = this.settings.continuous;

            var self = this;

            this.recognition.onresult = function (event) {
                self.$this.trigger('result.spoke.recognizer', event);
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        var text = event.results[i][0].transcript.trim();
                        console.log('Text result:', text);
                        // trigger the finalResult event with additional parameter
                        // text
                        self.$this.trigger('finalResult.spoke.recognizer', [text]);
                    }
                }
            };

            this.recognition.onend = function () {
                console.log('Recognition ended.');
                self.listening = false;
                self.$this.trigger('stop.spoke.recognizer');
            };
        };

        Recognizer.prototype._startRecognition = function () {
            this.listening = true;
            this.recognition.start();
            this.$this.trigger('start.spoke.recognizer');
        };

        Recognizer.prototype._stopRecognition = function () {
            this.recognition.stop();
        }

        Recognizer.prototype.toggle = function () {
            console.log('toggleRecognition');
            if (this.listening) {
                this._stopRecognition();
            } else {
                this._startRecognition();
            }
        };

        /**
        * Convenience function for adding listeners to events triggered by this
        * instance (so you don't have to wrap the object in jquery yourself).
        */
        Recognizer.prototype.on = function (eventName, handler) {
            return this.$this.on(eventName, handler);
        };

        return {
            Recognizer: Recognizer,
        };
});