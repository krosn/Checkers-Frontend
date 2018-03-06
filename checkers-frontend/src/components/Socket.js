import React from 'react';
import openSocket from 'socket.io-client';
var socket;

function subscribeToGame(cb) {
  socket =  socket = openSocket('http://localhost:8000');
  socket.on('timer', gameData => cb(null, gameData));
  socket.emit('subscribeToTimer', 1000);
}

function sendMessage(eventName, message) {
	socket.emit('move', message);
}

export { subscribeToGame, sendMessage };