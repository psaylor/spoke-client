var express = require('express');
var path = require('path');
var http = require('http');
var rr = require('ractive-render');
var socketIO = require('socket.io');
var ss = require('socket.io-stream');
var fs = require('fs');

var app = express();

app.engine('html', rr.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
rr.clearCache();

app.use(express.static(path.join(__dirname, '../lib')));
app.use(express.static(path.join(__dirname, 'js/')));
app.use(express.static(path.join(__dirname, 'css/')));

app.get('/', function (req, res) {
    res.render('test');
});

var port = 3001;

app.set('port', port);

var server = http.createServer(app);
var io = socketIO(server);
io.on('connection', function (socket) {
    console.log('Connected to client socket');
    ss(socket).on('audioStream', function (stream, data) {
        console.log('Receiving stream audio with data', data);
        stream.on('data', function (d) {
            // console.log('Got data', typeof(d), d.length);
        });
        stream.on('end', function (){
            console.log('End of audio stream');
        });
    });

    socket.on('playRequest', function () {
        console.log('Received play request');
        // setup a stream to communicate with client
        var stream = ss.createStream();
        var meta = {type: 'rain'};
        ss(socket).emit('playResult', stream, meta);

        // pipe the wav file onto that stream
        var wavStream = fs.createReadStream(__dirname + '/rain.wav');
        wavStream.pipe(stream);
    });
});
server.listen(port);