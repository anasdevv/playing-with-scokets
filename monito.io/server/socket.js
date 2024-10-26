const mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@localhost:27017');

const Machine = require('./models/Machine');

function socketMain(io, socket) {
  console.log('someone connected');
  let macAddr;

  //   a machine has connected , check if its new
  //   if its add!

  socket.on('clientAuth', (key) => {
    if (key === '12jsajdajdsa213') {
      // valid
      socket.join('clients');
    } else if (key === 'asd2sada2') {
      // valid ui client has joined
      socket.join('ui');
      console.log('A react client has joined');
    } else {
      console.log('invalid client has joined. Goodbye');
      socket.disconnect(true);
    }
  });

  socket.on('initPerfData', async (data) => {
    console.log('data', data);
    macAddr = data.macAddr;
    const response = await createIfNotExist(data);
    console.log('response ', response);
  });

  socket.on('perfData', (data) => {
    console.log('data', data);
    socket.to('ui').emit('data', data);
  });
}

// function createIfNotExist(data) {
//   return new Promise((resolve, reject) => {
//     Machine.findOne(
//       {
//         macAddr: data.macAddr,
//       },
//       (err, doc) => {
//         if (err) {
//           throw err;
//         } else if (doc === null) {
//           let newMachine = new Machine(data);
//           newMachine.save();
//           resolve('added');
//         } else {
//           resolve('found');
//         }
//       }
//     );
//   });
// }
async function createIfNotExist(data) {
  try {
    const existingMachine = await Machine.findOne({
      macAddr: data.macAddr,
    });
    if (!existingMachine) {
      // create one
      const newMachine = new Machine(data);
      newMachine.save();
      return 'added';
    }
    return 'found';
  } catch (error) {
    console.log('error ', error);
    throw error;
  }
}
module.exports = socketMain;
