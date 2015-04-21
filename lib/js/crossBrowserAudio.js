/* Loads Modernizr into the window object (not AMD compatible yet) */
define(['promise', 'modernizr'], function(Promise, Modernizr) {

    window.AudioContext = Modernizr.prefixed('AudioContext', window);
    navigator.getUserMedia = Modernizr.prefixed('getUserMedia', navigator);

    var audioContext =  window.AudioContext;
    console.log("AudioContext set up", audioContext);
    if (! navigator.getUserMedia) {
        console.err("Browser does not support getUserMedia");
        alert("Browser does not support getUserMedia");
    }

    console.log("defining crossBrowserAudio");

    /*
    * Promisify access to getUserMedia
    * borrowed from https://github.com/janlelis/promiseUserMedia.js/blob/master/promiseUserMedia.js under MIT license
    */
    var promiseUserMedia = function promiseUserMedia(sessionOptions) {
        return new Promise(function promiseUserMediaPromise(resolve, reject) {
            if (!promiseUserMedia.isAvailable) {
                var error = new Error('getUserMedia is not supported');
                error.name = "MediaNotSupportedError";
                reject(error);
            } else {
                // seems to need to be called with call in order to work
                promiseUserMedia.getUserMedia.call(navigator, sessionOptions, resolve, reject);
            }
        });
    };

    promiseUserMedia.getUserMedia = navigator.getUserMedia;
    promiseUserMedia.isAvailable = !! promiseUserMedia.getUserMedia;

    return {
        AudioContext: audioContext,
        getUserMedia: navigator.getUserMedia,
        promiseUserMedia: promiseUserMedia,
    };
});