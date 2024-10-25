let socket = io.connect('http://localhost:8080');

function init() {
  draw();
  console.log('orbs ', orbs);
  socket.emit('init', {
    playerName: player.name,
  });
}
console.log('players__', players);
socket.on('initReturn', (data) => {
  orbs = data.orbs;
  setInterval(() => {
    console.log('player', player);
    socket.emit('tick', {
      xVector: player.xVector,
      yVector: player.yVector,
    });
  }, 33);
});

socket.on('tock', (data) => {
  console.log('data ', data);
  players = data.players;
  console.log('checkmaete ', 'player ', player, players[player.playerIndex]);
  if (players[player.playerIndex].locX) {
    player.locX = players[player.playerIndex].locX;
    player.locY = players[player.playerIndex].locY;
  }
});

socket.on('orbSwitch', (data) => {
  console.log('orbSwitch ', data);
  //   new Promise((resolve) => setTimeout(resolve,3000))
  orbs.splice(data.orbIndex, 1, data.newOrb);
  console.log('orbs ', orbs);
});

socket.on('tickTock', (data) => {
  player.playerIndex = data.playerIndex;
  //   player.locX = players[data.playerIndex].playerData.locX;
  //   player.locY = players[data.playerIndex].playerData.locY;
});

socket.on('updateLeaderBoard', (leaderBoardArray) => {
  document.querySelector('.leader-board').innerHTML = '';
  leaderBoardArray.forEach((p) => {
    if (!p.name) {
      return;
    }
    document.querySelector('.leader-board').innerHTML += `
                <li class="leaderboard-player">${p.name} - ${p.score}</li>
            `;
  });
  const el = leaderBoardArray.find((u) => u.name === player.name);
  document.querySelector('.player-score').innerHTML = el.score;
});

socket.on('playerAbsorbed', (absorbData) => {
  document.querySelector(
    '#game-message'
  ).innerHTML = `${absorbData.absorbed} was absorbed by ${absorbData.absorbedBy}`;
  document.querySelector('#game-message').style.opacity = 1;
  window.setTimeout(() => {
    document.querySelector('#game-message').style.opacity = 0;
  }, 2000);
});
