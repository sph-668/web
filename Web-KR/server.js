// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function (request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function () {
    console.log('Starting server on port 5000');
});

var players = {};
io.on('connection', function (socket) {
    socket.on('new player', function () {
        players[socket.id] = {
            x_prev: null,
            y_prev: null,
            x_cur: null,
            y_cur: null,
            color: null,
            thick: null,
            cl: false
        };
    });
    socket.on('movement', function (data) {
        var player = players[socket.id] || {};
        player.x_prev = data.x_prev;
        player.y_prev = data.y_prev;
        player.x_cur = data.x_cur;
        player.y_cur = data.y_cur;
        player.color = data.color;
        player.thick = data.thick;
        player.cl = data.cl;
        io.sockets.emit('state', players);
    });
});

