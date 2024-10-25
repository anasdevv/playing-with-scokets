const settings = require('../../consts').settings;

class Player {
  constructor(socketId, playerConfig, playerData) {
    this.socketId = socketId;
    this.playerConfig = playerConfig;
    this.playerData = playerData;
  }
}
module.exports = Player;
