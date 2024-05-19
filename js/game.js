import SceneMain from "./SceneMain.js";

var config = {
  type: Phaser.WEBGL,
  width: 640,
  height: 640,
  backgroundColor: "black",
  physics: {
    default: "arcade",
    arcade: {
      Gravity: { x: 0, y: 0 },
    },
  },
  scene: [SceneMain],
  pixelArt: true,
  roundPixels: true,
};

var game = new Phaser.Game(config);
