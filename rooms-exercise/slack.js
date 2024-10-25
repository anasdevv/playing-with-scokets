const express = require('express');
const app = express();
const socketio = require('socket.io');
const namespaces = require('./data/namespace');
app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
  socket.emit('welcome', 'welcome to server');
  socket.on('clientConnect', (data) => {
    console.log('socket id ', socket?.id);
  });
  socket.emit('nsList', namespaces);
});
