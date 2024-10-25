const joinNs = (element, data) => {
  const nsEndpoint = element.getAttribute('ns');
  const { rooms } = data.find((d) => d.endpoint === nsEndpoint);
  console.log('clickedNs ', rooms);
  let roomList = document.querySelector('.room-list');
  roomList.innerHTML = '';
  rooms.forEach((room) => {
    roomList.innerHTML += `<li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`;
  });
};
