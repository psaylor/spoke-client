var express = require('express');
var path = require('path');
var http = require('http');

var rr = require('ractive-render');
var app = express();

app.engine('html', rr.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);
rr.clearCache();

app.use(express.static(path.join(__dirname, '../lib')));

app.get('/', function (req, res) {
    res.render('test');
});

var port = 3001;

app.set('port', port);

var server = http.createServer(app);
server.listen(port);