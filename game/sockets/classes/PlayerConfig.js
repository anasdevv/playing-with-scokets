const settings = require('../../consts').settings;
class PlayerConfig {
  constructor() {
    this.xVector = 0;
    this.yVector = 0;
    this.zoom = settings.defaultZoom;
    this.speed = settings.defaultSpeed;
  }
}
module.exports = PlayerConfig;
