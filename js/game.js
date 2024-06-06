import SceneMain from "./SceneMain.js";
import SceneLevelUp from "./SceneLevelUp.js";

var config = {
  type: Phaser.WEBGL,
  width: 640,
  height: 640,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
      Gravity: { x: 0, y: 0 },
    },
  },
  scene: [SceneMain, SceneLevelUp],
  pixelArt: true,
  roundPixels: true,
};

var game = new Phaser.Game(config);
