define(['sharedAudio'],
    function(sharedAudio) {

        var context = sharedAudio.audioContext;

        sharedAudio.audioStreamPromise.done(function(audioStreamSource) { 
            console.log("Done. Got audioStreamSource", typeof(audioStreamSource));
        });

});