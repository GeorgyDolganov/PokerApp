// var express = require( 'express' );
// var socket = require( 'socket.io' );
// var app = express();
// var http = require( 'http' );
// var server = http.createServer( app );
// var io = socket.listen( server );

// io.sockets.on('connection', function (socket) {
//     console.log('socket connected');

//     socket.on('disconnect', function () {
//         console.log('socket disconnected');
//     });

//     socket.emit('text', 'Вы успешно подключились к серверу');
// });

// server.listen(3000);

// var server = require('http').createServer();
// var io = require('socket.io')(server);

// io.sockets.on('connection', function (socket) {
//     console.log('socket connected');

//     socket.on('disconnect', function () {
//         console.log('socket disconnected');
//     });

//     socket.emit('text', 'Подсоединение выполненно успешно');
// });

// server.listen(3000);

var socket = require( 'socket.io' );
var express = require( 'express' );
var http = require( 'http' );

var app = express();
var server = http.createServer( app );

var io = socket.listen( server );

io.sockets.on( 'connection', function( client ) {
	console.log( "New client !"+client.handshake.sessionID);
	
	client.on( 'message', function( data ) {
		console.log( 'Message received ' + data.message );
		io.sockets.emit( 'message', { message: data.message } );
	});
});

server.listen( 3000 );