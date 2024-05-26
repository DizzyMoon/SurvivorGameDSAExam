class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.direction = "right";
    this.health = 100;
    this.speed = 1.3;
    this.attackSpeed = 2;
    this.items = [];
    this.xp = 0;
    this.xpToLevelUp = 1000;
    this.body.setSize(30, 60);
    this.body.setOffset(82, 60);
  }

  flipSprite(flipX) {
    this.setScale(flipX ? -1 : 1, 1);
    // Adjust the hitbox offset to keep it in place
    if (flipX) {
      this.body.setOffset(110, 60);
    } else {
      this.body.setOffset(82, 60);
    }
  }
}

export default Player;
