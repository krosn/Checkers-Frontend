import React from 'react';
import openSocket from 'socket.io-client';
var socket;

function subscribeToGame(cb) {
  socket =  socket = openSocket('http://localhost:8000');
  socket.on('move', gameData => cb(null, gameData));
}

function sendMove(message) {
	socket.emit('sendToServer', message);
}

export { subscribeToGame, sendMove };