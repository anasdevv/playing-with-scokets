// const userName = prompt('What is your username');
// const password = prompt('What is your password');

const userName = 'anas';
const password = 'anas';
const socket = io('http://localhost:9000');

socket.on('connect', () => {
  console.log('connected ');
  socket.emit('clientConnect');
});
socket.on('welcome', (message) => {
  console.log('message', message);
});

// listen for ns event , which gives us the namespaces to join

socket.on('nsList', (data) => {
  console.log('data', data);
  const nameSpacesDiv = document.querySelector('.namespaces');
  nameSpacesDiv.innerHTML = '';
  data.forEach((ns) => {
    nameSpacesDiv.innerHTML += `<div class="namespace" ns="${ns?.endpoint}"><img src="${ns?.image}"></div>`;
  });
  const namespaces = document.getElementsByClassName('namespace');
  Array.from(namespaces).forEach((element) => {
    element.addEventListener('click', (e) => {
      joinNs(element, data);
    });
  });
  joinNs(namespaces[0], data);
  console.log(namespaces);
});
