const io = require('../servers').io;
const Orb = require('./classes/Orb');
const PlayerConfig = require('./classes/PlayerConfig');
const PlayerData = require('./classes/PlayerData');
const Player = require('./classes/Player');
const settings = require('../consts').settings;
const checkForOrbCollisions = require('./collision').checkForOrbCollisions;
const checkForPlayerCollisions =
  require('./collision').checkForPlayerCollisions;

let orbs = [];
let players = [];
initGame();

io.on('connect', (socket) => {
  // a player has connected
  let player = {};
  socket.on('init', (data) => {
    // issue a message every 30 fps
    setInterval(() => {
      if (players.length > 0) {
        io.to('game').emit('tock', {
          players,
        });
      }
    }, 33); // there are 30 33s in 1000 milliseconds , or 1/30th of a second , or 1 of a 30fps

    // add the player to game namespace
    socket.join('game');
    let playerConfig = new PlayerConfig();
    let playerData = new PlayerData(data.playerName, socket.id);
    player = new Player(socket.id, playerConfig, playerData);

    // issue a message every 30 fps

    socket.emit('initReturn', {
      orbs,
    });
    players.push(playerData);
    setInterval(() => {
      io.emit('tickTock', {
        playerIndex: players.length - 1,
      });
    }, 33); // there are 30 33s in 1000 milliseconds , or 1/30th of a second , or 1 of a 30fps
    // tick , we know that which direction to move
    socket.on('tick', (data) => {
      // console,
      if (data.xVector === null || data.xVector === undefined) {
        console.log('data', data);
        // throw new Error('Xvector is null from client', data);
        return;
      }
      const speed = playerConfig.speed;
      //   let xV, yV;
      const xV = (player.playerConfig.xVector = data.xVector);
      const yV = (player.playerConfig.yVector = data.yVector);
      console.log('xV', xV);
      // If the player's locX (x-coordinate) is near the left edge (< 5) and they are moving left (xV < 0), or if they are near the right edge (> 500) and moving right (xV > 0), the player only moves vertically (up or down) by updating locY.
      // Similarly, if the player's locY (y-coordinate) is near the top (< 5) and they are moving up (yV > 0), or near the bottom (> 500) and moving down (yV < 0), the player only moves horizontally by updating locX.
      // Otherwise, the player moves in both directions based on xV and yV.

      if (
        (player.playerData.locX < 5 && xV < 0) ||
        (player.playerData.locX > settings.worldWidth && xV > 0)
      ) {
        player.playerData.locY -= speed * yV;
      } else if (
        (player.playerData.locY < 5 && yV > 0) ||
        (player.playerData.locY > settings.worldHeight && yV < 0)
      ) {
        player.playerData.locX += speed * xV;
      } else {
        player.playerData.locX += speed * xV;
        player.playerData.locY -= speed * yV;
      }
      let capturedOrb = checkForOrbCollisions(
        player.playerData,
        player.playerConfig,
        orbs,
        settings
      );
      if (capturedOrb) {
        console.log('collision detected');
        // emit to all sockets  the orb to replace
        const orbData = {
          orbIndex: capturedOrb,
          newOrb: orbs[capturedOrb],
        };
        console.log(orbData);
        io.emit('updateLeaderBoard', getLeaderBoard());
        io.emit('orbSwitch', orbData);
      }
      console.log('checking for death');
      let playerDeath = checkForPlayerCollisions(
        player.playerData,
        player.playerConfig,
        players,
        player.socketId
      );
      if (playerDeath) {
        io.emit('updateLeaderBoard', getLeaderBoard());
        io.emit('playerDeath', playerDeath);
        console.log(
          '\n\n-------------------------------------------------------DEAD-----------------------------------------------------\n\n'
        );
      }
    });
  });

  socket.on('disconnect', () => {
    // find out who just died

    players.forEach((p, i) => {
      if (p.socketId === player.playerData.socketId) {
        players.splice(i, 1);
      }
    });
  });
});

function getLeaderBoard() {
  players.sort((a, b) => b.score - a.score);
  return players.map((curr) => ({
    name: curr.name,
    score: curr.score,
  }));
}

function initGame() {
  for (let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb());
  }
}
module.exports = io;
