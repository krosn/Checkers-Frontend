import React from 'react';
import openSocket from 'socket.io-client';


function subscribeToTimer(cb) {
	const socket = openSocket('http://localhost:8000');
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
}

export { subscribeToTimer };