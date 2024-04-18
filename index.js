const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

let bonziPosition = { x: 0, y: 0 };

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.emit('initialPosition', bonziPosition);

  socket.on('moveBonzi', (position) => {
    bonziPosition = position;
    socket.broadcast.emit('updateBonzi', bonziPosition);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
