class Skeleton extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    this.health = 10;
    this.speed = 0.3;
    this.alive = true;
    this.stunned = false;
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
}

export default Skeleton;
