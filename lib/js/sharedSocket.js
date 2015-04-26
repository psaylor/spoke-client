define(['jquery', 'socketio', 'socketio-stream'],
    function($, io, ioStream) {

        // Maintain a mapping from paths to socket connections
        var sockets = {}; 

        var getSocket = function (path) {
            path = path || '';
            var socket = sockets[path];
            if (socket) {
                return socket;
            } else {
                sockets[path] = _initializeSocket(path);
                return sockets[path];
            }
        };

        var _initializeSocket = function (path) {
            var socket = io({
                path: path,
            });
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


