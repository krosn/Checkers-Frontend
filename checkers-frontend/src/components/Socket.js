import openSocket from 'socket.io-client';
var socket;

function subscribeToGame(room, clientPlayer, cbMove, cbJoin) {
  socket = openSocket('http://localhost:8000');
  socket.emit('subscribe', room, clientPlayer);
  socket.on(room, gameData => cbMove(null, gameData));
  socket.on(room +'join', joinData => cbJoin(null, joinData));
}

function sendMove(room, message) {
	socket.emit('sendToServer', room, message);
}

export { subscribeToGame, sendMove };