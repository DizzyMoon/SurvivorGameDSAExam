class Skeleton extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.name = "skeleton";
    this.health = 10;
    this.speed = 0.3;
    this.alive = true;
    this.stunned = false;
    this.body.setSize(30, 60);
  }

  ai(player) {
    let directionX = player.x - this.x;
    let directionY = player.y - this.y;

    //Normalize Vector
    var length = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= length;
    directionY /= length;

    this.x += directionX * this.speed;
    this.y += directionY * this.speed;
  }

  flipSprite(flipX) {
    this.setScale(flipX ? -1 : 1, 1);

    // Adjust the hitbox offset to keep it in place
    if (flipX) {
      this.body.setOffset(
        this.body.width - this.originalOffsetX - this.body.width,
        this.body.offset.y
      );
    } else {
      this.body.setOffset(this.originalOffsetX, this.body.offset.y);
    }
  }
}

export default Skeleton;
