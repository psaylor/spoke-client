define(['jquery', 'socketio', 'socketio-stream'],
    function($, io, ioStream) {

        var socket = io({
            /*
                May need to specify the path, e.g.
                path: '/nut/socket.io'
                for production hosting on apache
            */
        });

        socket.on("connect", function() {
          console.log("Client socket connected!");
        });

        socket.on("disconnect", function() {
            console.log("Client disconnected from server, please wait...");
        });


        return {
            socket: socket,
            ioStream: ioStream,
        };
});


