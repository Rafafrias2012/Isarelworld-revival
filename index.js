const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let bonziPosition = { x: 0, y: 0 };

io.on('connection', (socket) => {
  console.log('A user connected');

  // Send initial position to the new client
  socket.emit('initialPosition', bonziPosition);

  // Update position when a client moves Bonzi Buddy
  socket.on('moveBonzi', (position) => {
    bonziPosition = position;
    // Broadcast the new position to all clients except the one that moved Bonzi
    socket.broadcast.emit('updateBonzi', bonziPosition);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
