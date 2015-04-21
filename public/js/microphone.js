define(['jquery', 'sharedAudio', 'reactiveUi'],
    function($, sharedAudio, ui) {

        var context = sharedAudio.audioContext;
        
        var ANALYSER_FFT_SIZE = 128;
        var AUDIO_SAMPLING_RATE = context.sampleRate;

        /* Computes and returns the average of the values in a typed array */
        var getAverage = function(typedArray, fromIndex, toIndex) {
            var valueSum = 0;

            var fromIndex = fromIndex || 0;
            var toIndex = toIndex || typedArray.length;

            for (var i = fromIndex; i < toIndex; i++) {
                valueSum += typedArray[i];
            }

            var average = valueSum / (toIndex - fromIndex);
            return average;
        };

        var getFrequencyIndex = function(frequency) {
            var index = Math.floor((frequency * ANALYSER_FFT_SIZE) / AUDIO_SAMPLING_RATE);
            return index;
        };

        var minFreqIndex = getFrequencyIndex(300);
        var maxFreqIndex = getFrequencyIndex(3300);

        var volumeMeters = $('.fa-microphone.fill');
        var MAX_METER_HEIGHT = 100;
        var BASE_METER_HEIGHT = 35;
        var remainingHeight = MAX_METER_HEIGHT - BASE_METER_HEIGHT;

        /* Given the current volumeLevel, updates the height of the volumeMeter */
        // should make this calculation configurable by passing in function to use
        // for calculating the new height
        // volumeLevel is between 0 and 1, where 1 is max volume
        var adjustVolumeMeter = function(volumeMeter, volumeLevel) {
            var filledHeight = (volumeLevel * remainingHeight) + BASE_METER_HEIGHT;
            filledHeight = filledHeight.toFixed();
            var grayHeight = MAX_METER_HEIGHT - 
                Math.min(filledHeight, MAX_METER_HEIGHT);
            ui.component.set('meterMaxHeight', grayHeight + '%');
        };

        var setupAudioNodesForMeter = function () {

            var analyser = context.createAnalyser();
            analyser.smoothingTimeConstant = 0.5;
            analyser.fftSize = ANALYSER_FFT_SIZE;

            // called whenever the 2048 frames have been sampled, approx 21 times a second
            var javascriptNode = context.createScriptProcessor(2048, 1, 1);
            javascriptNode.connect(context.destination);
            javascriptNode.onaudioprocess = function () {
                var array = new Uint8Array(analyser.frequencyBinCount);
                analyser.getByteFrequencyData(array);
                var volumeLevel = getAverage(array, minFreqIndex, maxFreqIndex) / 255;
                adjustVolumeMeter(volumeMeters, volumeLevel);
            };

            sharedAudio.audioStreamPromise.then(function(audioStreamSource) {
                console.log("Microphone icon got access to audioStreamSource", typeof(audioStreamSource));
                audioStreamSource.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(context.destination);
                return audioStreamSource;
            });
                
        };

        setupAudioNodesForMeter();

        return {};
});