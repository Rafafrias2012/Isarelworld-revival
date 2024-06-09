const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Store users and their bonzi buddies
const users = {};

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Handle user join
  socket.on('join', (nickname) => {
    users[socket.id] = { nickname, bonzi: null };
    socket.broadcast.emit('userJoined', nickname);
  });

  // Handle bonzi buddy creation
  socket.on('createBonzi', () => {
  const bonzi = {
    x: Math.random() * 500,
    y: Math.random() * 500,
    animation: 'enter',
    frame: 0,
  };
  users[socket.id].bonzi = bonzi;
  socket.emit('bonziCreated', bonzi);
  socket.broadcast.emit('bonziCreated', bonzi);
});

  // Handle bonzi buddy movement
  socket.on('moveBonzi', (x, y) => {
    if (users[socket.id].bonzi) {
      users[socket.id].bonzi.x = x;
      users[socket.id].bonzi.y = y;
      socket.emit('bonziMoved', x, y);
      socket.broadcast.emit('bonziMoved', x, y);
    }
  });

  // Handle user leave
  socket.on('disconnect', () => {
  if (users[socket.id]) {
    const bonzi = users[socket.id].bonzi;
    bonzi.animation = 'leave';
    socket.emit('bonziLeave', bonzi);
    socket.broadcast.emit('bonziLeave', bonzi);
    delete users[socket.id];
  }
});
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
