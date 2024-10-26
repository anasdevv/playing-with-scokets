import io from 'socket.io-client';

let socket = io.connect('http://localhost:6969');
console.log('socket', socket);
socket.emit('clientAuth', 'asd2sada2');
export default socket;
