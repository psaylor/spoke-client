/*
    * Promisify access to getUserMedia
    * borrowed from https://github.com/janlelis/promiseUserMedia.js/blob/master/promiseUserMedia.js under MIT license
    */

define(["promise","modernizr"],function(e,t){window.AudioContext=t.prefixed("AudioContext",window),navigator.getUserMedia=t.prefixed("getUserMedia",navigator);var n=window.AudioContext;console.log("AudioContext set up",n),navigator.getUserMedia||(console.err("Browser does not support getUserMedia"),alert("Browser does not support getUserMedia")),console.log("defining crossBrowserAudio");var r=function i(t){return new e(function(n,r){if(!i.isAvailable){var s=new Error("getUserMedia is not supported");s.name="MediaNotSupportedError",r(s)}else i.getUserMedia.call(navigator,t,n,r)})};return r.getUserMedia=navigator.getUserMedia,r.isAvailable=!!r.getUserMedia,{AudioContext:n,getUserMedia:navigator.getUserMedia,promiseUserMedia:r}});