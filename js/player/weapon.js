class Weapon {
  constructor(scene, player, radius) {
    this.scene = scene;
    this.player = player;
    this.radius = radius;

    // Create weapon
    this.graphics = scene.add.graphics();
    // this.graphics.lineStyle(5, 0x0000ff, 1);
    // this.graphics.strokeCircle(player.x, player.y, radius);
    this.graphics.setDepth(20);

    // Create a circle hitbox for weapon
    this.hitbox = scene.add.circle(player.x, player.y, radius, 0x0000ff, 0.3);
    scene.physics.add.existing(this.hitbox);
    this.hitbox.body.setCircle(radius);
    this.hitbox.body.setAllowGravity(false);
    this.hitbox.body.setOffset(-radius / 2, -radius / 2); // offset to center
    this.hitbox.setDepth(19);

    // Deal damage every second
    this.scene.time.addEvent({
      delay: 1000,
      callback: this.dealDamage,
      callbackScope: this,
      loop: true,
    });

    // position of weapon and hitbox to follow player
    scene.events.on("update", this.update, this);
  }

  update() {
    this.graphics.clear();
    // this.graphics.lineStyle(5, 0xff0000, 1);
    // this.graphics.strokeCircle(this.player.x, this.player.y, this.radius);

    this.hitbox.setPosition(this.player.x, this.player.y);
  }

  updateRadius(newRadius) {
    this.radius = newRadius;
    this.hitbox.setRadius(newRadius);
    this.hitbox.body.setCircle(newRadius);
    this.hitbox.body.setOffset(-newRadius / 2, -newRadius / 2); // offset to center
  }

  dealDamage() {
    // overlap to detect collision with skeletons
    this.scene.physics.overlap(this.hitbox, this.scene.skeletonList, this.applyDamage, null, this);
    // overlap to detect collision with bats
    this.scene.physics.overlap(this.hitbox, this.scene.batList, this.applyDamage, null, this);
  }

  applyDamage(hitbox, enemy) {
    if (!enemy.stunned) {
      enemy.health -= 1;
      this.scene.playAnimation(enemy, "skeletonEnemyHit");

      enemy.stunned = true;
      this.scene.time.delayedCall(this.scene.attackCooldownDuration, () => {
        enemy.stunned = false;
      });

      if (enemy.health <= 0) {
        this.scene.playAnimation(enemy, "skeletonEnemyDeath");
        Phaser.Utils.Array.Remove(this.scene.skeletonList, enemy);
        Phaser.Utils.Array.Remove(this.scene.batList, enemy);
        enemy.alive = false;
        this.player.addXP(200);
      } else {
        this.scene.time.delayedCall(500, () => {
          this.scene.playAnimation(enemy, "skeletonEnemyIdle");
        });
      }
    }
  }
}

export default Weapon;
