define(['jquery', 'sharedAudio', 'reactiveUi', 'clientSocket', 'utils'],
    function($, sharedAudio, ui, clientSocket, utils) {

        try {
            var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
            console.log('Got recognition');
        } catch(e) {
            var recognition = Object;
            console.log('Error getting recognition:', e);
            return;
        }

        var listening = false;

        var socket = clientSocket.socket;
        var ioStream = clientSocket.ioStream;

        var uiData = ui.data;
        var uiComponent = ui.component;

        var ACCEPT_MATCHING_WORDS_THRESHOLD = 3;

        var acceptOrRejectSpeech = function (expectedText, recognizedText, index) {
            var expected = utils.normalizeString(expectedText).split(' ');
            var recognized = utils.normalizeString(recognizedText).split(' ');
            console.log('Expected:', expected);
            console.log('Recognized:', recognized);
            var matchCount = 0;
            for (var i = 0; i < expected.length; i++) {
                if ($.inArray(expected[i], recognized) >= 0) {
                    matchCount++;
                }
                if (matchCount >= ACCEPT_MATCHING_WORDS_THRESHOLD) {
                    break;
                }
            }
            var accept = matchCount >= ACCEPT_MATCHING_WORDS_THRESHOLD;
            console.log('Accept utterance for', index, ':', accept);
            if (accept) {
                uiData.acceptedState[index] = ui.AcceptedStateEnum.ACCEPTED;
            } else {
                uiData.acceptedState[index] = ui.AcceptedStateEnum.REJECTED;
            }
            uiComponent.set('acceptedState', uiData.acceptedState);
        };


        var recognizeButtonSetup = function (recordBtn) {
            recordBtn = $(recordBtn);
            var expectedText = recordBtn.data('text');
            var index = recordBtn.data('uttindex');
            var fragment = recordBtn.data('uttid');

            var recognition = new SpeechRecognition();
            recognition.continuous = true;

            recognition.onresult = function (event) {
                console.log('Recognition result', event);
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        var text = event.results[i][0].transcript.trim();
                        console.log('Text result for', index, fragment, ':', text);
                        acceptOrRejectSpeech(expectedText, text, index);
                    }
                }
            };

            recognition.onend = function () {
                listening = false;
            };

            var toggleRecognition = function () {
                console.log('Toggling recognition');
                if (listening) {
                    recognition.stop();
                } else {
                    listening = true;
                    recognition.start();
                }
            };

            recordBtn.click(toggleRecognition);

        };

        var recordButtons = $("button.record-btn");
        recordButtons.map(function(i, btn) {
            recognizeButtonSetup(btn);
        });

        return {};
});