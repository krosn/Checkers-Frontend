import openSocket from 'socket.io-client';
var socket;

function subscribeToGame(room, clientPlayer, cb, endTurn) {
	socket = openSocket('http://localhost:8000');
    socket.emit('subscribe', room, clientPlayer);
    socket.on(room + 'join', joinData => cb(null, joinData));
    socket.on(room + 'turnEnd', joinData => endTurn(null));
}

function subscribeToBoard(room, clientPlayer, cb, endTurn) {
    socket.on(room+clientPlayer, gameData => cb(null, gameData));
    socket.on(room + 'turnEnd', joinData => endTurn(null));
}

function sendMove(room, clientPlayer, message) {
	console.log("sending as "+clientPlayer);

	if(clientPlayer === "1") {
	    socket.emit('sendToServer', room+"2", message);
	} else {
	    socket.emit('sendToServer', room+"1", message);
	}
}

function endTurn(room) {
	socket.emit('sendToServer', room+'turnEnd');
}

export { subscribeToGame, subscribeToBoard, sendMove, endTurn };