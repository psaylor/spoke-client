define(['jquery', 'socketio', 'socketio-stream'],
    function($, io, ioStream) {

        // Maintain a mapping from paths to socket connections
        var socket = null;

        var getSocket = function (config) {
            if (socket) {
                return socket;
            } else {
                socket = _initializeSocket(config);
                return socket;
            }
        };

        var _initializeSocket = function (config) {
            config = config || {};
            var path = config.path;
            var url = config.url;
            if (url) {
                var socket = io(url, {path: path});
            } else {
                var socket = io({path: path});
            }

            socket.on('connect', function () {
                console.log('Client socket connected to ', path);
            });
            
            socket.on('disconnect', function () {
                console.log('Client socket disconnected from', path);
            });
            return socket;
        };

        return {
            getSocket: getSocket,
            _initializeSocket: _initializeSocket,
            ioStream: ioStream,
        };
});


