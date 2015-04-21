define(['jquery', 'ractive'], function($, Ractive) {

    AcceptedStateEnum = {
        UNREAD: 0,
        PENDING: 1,
        ACCEPTED: 2,
        REJECTED: 3,
    };

    var data = {
        meterMaxHeight: '35%',
        recording: false,
        recordingFragment: -1, // index of the fragment currently being recorded if any
        acceptedState: [],
        savedState: [], //true or false
        isRecording: function (fragNum) {
            return this.get('recordingFragment') === fragNum;
        },
        hasBeenRead: function (fragNum) {
            return this.get('acceptedState')[fragNum] !== AcceptedStateEnum.UNREAD;
        },
        isPending: function (fragNum) {
            return this.get('acceptedState')[fragNum] === AcceptedStateEnum.PENDING;
        },
        isAccepted: function (fragNum) {
            return this.get('acceptedState')[fragNum] === AcceptedStateEnum.ACCEPTED;
        },
        isRejected: function (fragNum) {
            return this.get('acceptedState')[fragNum] === AcceptedStateEnum.REJECTED;
        },
        acceptedStateClass: function (fragNum) {
            switch(this.get('acceptedState')[fragNum]) {
                case AcceptedStateEnum.UNREAD:
                    return 'invisible';
                case AcceptedStateEnum.PENDING:
                    return 'alert-info';
                case AcceptedStateEnum.ACCEPTED:
                    return 'alert-success';
                case AcceptedStateEnum.REJECTED:
                    return 'alert-danger';
                default:
                    return 'invalid';
            }
        },
        and: function(a, b) {
            return a && b;
        },
    };

    var element = $('#taskContainer');
    var template = element.html();
    /* Initialize the Ractive component */
    var ractiveComponent = new Ractive({
        el: element,
        template: template,
        data: data,
    });

    ractiveComponent.on('doneReading', function (event) {
        console.log('Done Reading Story');
        // process
    });

    return {
        data: data,
        component: ractiveComponent,
        AcceptedStateEnum: AcceptedStateEnum,
    };

});