define(['jquery', 'sharedAudio', 'reactiveUi', 'clientSocket'],
    function($, sharedAudio, ui, clientSocket) {

        var context = sharedAudio.audioContext;
        var AUDIO_SAMPLING_RATE = context.sampleRate;

        console.log("Recorder.js");

        var socket = clientSocket.socket;
        var ioStream = clientSocket.ioStream;

        var uiData = ui.data;
        var uiComponent = ui.component;

        var recording = false;

        var convertFloat32ToInt16 = function (buffer) {
            var l = buffer.length;
            var buf = new Int16Array(l);
            while (l--) {
                buf[l] = Math.min(1, buffer[l])*0x7FFF;
            }
            return buf.buffer;
        };

        socket.on('audioStreamResult', function(result) {
            console.log('Audio stream result for', result.index, ',', result.fragment,':', result.success);
            uiData.savedState[result.index] = result.success;
            uiComponent.set('savedState', uiData.savedState);
        });

        var recordButtonSetup = function(recordBtn) {
            recordBtn = $(recordBtn);
            var binaryAudioStream = null;
            var audioMetadata = { 
                "fragment": recordBtn.data('uttid'),
                "index": recordBtn.data('uttindex'),
                "text": recordBtn.data('text'),
                "sampleRate": context.sampleRate,
            };

            var setupStream = function() {
                console.log("Setting up new stream");
                binaryAudioStream = ioStream.createStream();
                ioStream(socket).emit('audioStream', binaryAudioStream, audioMetadata);
                return binaryAudioStream;
            };

            var recorderProcess = function (audioProcessingEvent) {
                // since we are recording in mono we only need the left channel
                var left = audioProcessingEvent.inputBuffer.getChannelData(0); // PCM data samples from left channel
                var converted = convertFloat32ToInt16(left);

                /* this is hacky but avoids a lot of overhead, should make a wrapper
                library that includes this function though since Buffer is a Node.js thing
                or just make all client side with browserify instead of requirejs */
                binaryAudioStream.writeAudio(converted);
            };

            var recorderBufferSize = 2048;
            // create a javascript node for recording
            var recorder = context.createScriptProcessor(recorderBufferSize, 1, 1);
            // specify the processing function
            recorder.onaudioprocess = recorderProcess;
            

            var startRecorder = function () {
                recording = true;
                // connect recorder to the previous destination so it gets called
                recorder.connect(context.destination);

                console.log("Setting up recorder.");
                sharedAudio.audioStreamPromise.then(function(audioStreamSource) {
                    console.log("Then got audioStreamSource for recorder");
                    audioStreamSource.connect(recorder);
                    console.log("Recorder started");
                });

                console.log('button data', recordBtn.data());
                uiComponent.set('recordingFragment', recordBtn.data('uttindex'));
                uiComponent.set('recording', recording);
            };

            var stopRecording = function () {
                recorder.disconnect();
                binaryAudioStream.end();
                audioChunk = 0;
                recording = false;
                uiComponent.set('recording', recording);
                uiComponent.set('recordingFragment', -1);
                uiData.acceptedState[recordBtn.data('uttindex')] = ui.AcceptedStateEnum.PENDING;
                uiComponent.set('acceptedState', uiData.acceptedState);
            };

            var toggleRecording = function () {
                console.log("Toggling recording state from", recording);
                if (recording) {
                    console.log("Disconnecting recorder");
                    stopRecording();
                    binaryAudioStream = null;
                } else {
                    console.log("Starting recorder");
                    binaryAudioStream = setupStream();
                    console.log("binaryAudioStream", binaryAudioStream);
                    startRecorder();
                }
            };

            $(recordBtn).click(toggleRecording);
        };

        var recordButtons = $("button.record-btn");
        recordButtons.map(function(i, btn) {
            recordButtonSetup(btn);
        });

        return {};
});