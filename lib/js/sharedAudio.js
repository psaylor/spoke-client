define(['jquery', 'crossBrowserAudio', 'promise'],
    function($, crossBrowserAudio, Promise) { 

        var context = new crossBrowserAudio.AudioContext();

        var SESSION = {audio: true, video: false};

        var audioStreamPromise = crossBrowserAudio.promiseUserMedia(SESSION)
            .then(function fulfilledHandler(localMediaStream) {
                console.log("SharedAudio got localmediastream", typeof(localMediaStream));
                var audioStreamSource = context.createMediaStreamSource(localMediaStream);
                console.log("Created audio stream", typeof(audioStreamSource));
                return audioStreamSource;
            })
            .error(function rejectHandler(error) {
                alert('getUserMedia: ' + error.name + '\n' + error.message);
                console.log('Media access rejected.', error);
            });

        var promiseDecodeAudioData = function promiseDecodeAudioData(audioBuffer) {
            return new Promise(function decodeAudioDataPromise(resolve, reject) {
                context.decodeAudioData.call(context, audioBuffer, resolve, reject);
            });
        };

        var promisePlayAudioData = function promisePlayAudioData (decodedAudioBuffer) {
            return new Promise(function playAudioDataPromise(resolve, reject) {
                var source = context.createBufferSource();
                source.buffer = decodedAudioBuffer;
                source.connect(context.destination);
                source.start();
                source.onended = resolve;
            });
        };

        var sharedAudio = {
            audioContext: context,
            audioStreamPromise: audioStreamPromise,
            promiseDecodeAudioData: promiseDecodeAudioData,
            promisePlayAudioData: promisePlayAudioData,
        };

        return sharedAudio;
});