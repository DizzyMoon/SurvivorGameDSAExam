class Bat extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.health = 2;
    this.speed = 2;
    this.alive = true;
    this.stunned = false;
    this.ruleOfAlignmentOn = true;
    this.ruleOfSeparationOn = true;
    this.ruleOfCohesionOn = true;
    this.turnSpeed = 0.03;
    this.body.setSize(30, 60);
    this.maxSpeed = 2; // Max speed to avoid excessive speeds
  }

  ruleOfSeparation(bats) {
    const desiredSeparation = 100; // Smaller radius for separation
    let steer = new Phaser.Math.Vector2(0, 0);
    let count = 0;

    bats.forEach((bat) => {
      if (bat !== this) {
        let d = Phaser.Math.Distance.Between(this.x, this.y, bat.x, bat.y);
        if (d > 0 && d < desiredSeparation) {
          let diff = new Phaser.Math.Vector2(this.x - bat.x, this.y - bat.y);
          diff = diff.normalize().scale(2 / d); // Weight by distance
          steer.add(diff);
          count++;
        }
      }
    });

    if (count > 0) {
      steer.scale(1 / count);
    }

    return steer;
  }

  ruleOfAlignment(bats) {
    const neighborDist = 100; // Larger radius for alignment
    let sum = new Phaser.Math.Vector2(0, 0);
    let count = 0;

    bats.forEach((bat) => {
      if (bat !== this) {
        let d = Phaser.Math.Distance.Between(this.x, this.y, bat.x, bat.y);
        if (d > 0 && d < neighborDist) {
          sum.add(bat.body.velocity);
          count++;
        }
      }
    });

    if (count > 0) {
      sum.scale(1 / count);
      sum = sum.normalize().scale(this.speed);
      let steer = sum.subtract(this.body.velocity);
      return steer;
    } else {
      return new Phaser.Math.Vector2(0, 0);
    }
  }

  ruleOfCohesion(bats) {
    const neighborDist = 100; // Same as alignment
    let sum = new Phaser.Math.Vector2(0, 0);
    let count = 0;

    bats.forEach((bat) => {
      if (bat !== this) {
        let d = Phaser.Math.Distance.Between(this.x, this.y, bat.x, bat.y);
        if (d > 0 && d < neighborDist) {
          sum.add(new Phaser.Math.Vector2(bat.x, bat.y));
          count++;
        }
      }
    });

    if (count > 0) {
      sum.scale(1 / count);
      return new Phaser.Math.Vector2(sum.x - this.x, sum.y - this.y)
        .normalize()
        .scale(this.speed);
    } else {
      return new Phaser.Math.Vector2(0, 0);
    }
  }

  steerTowardsPlayer(player) {
    let steer = new Phaser.Math.Vector2(player.x - this.x, player.y - this.y);
    steer = steer.normalize().scale(this.speed);
    return steer;
  }

  updatePosition(steerSeparation, steerAlignment, steerCohesion, steerPlayer) {
    let acceleration = new Phaser.Math.Vector2(0, 0);

    if (this.ruleOfSeparation) {
      acceleration.add(steerSeparation.scale(10)); // Increase separation force
    }
    if (this.ruleOfAlignMent) {
      acceleration.add(steerAlignment);
    }
    if (this.ruleOfCohesion) {
      acceleration.add(steerCohesion);
    }
    //acceleration.add(steerPlayer);

    if (acceleration.length() > this.turnSpeed) {
      acceleration = acceleration.normalize().scale(this.turnSpeed);
    }

    this.body.velocity.add(acceleration);
    if (this.body.velocity.length() > this.maxSpeed) {
      this.body.velocity = this.body.velocity.normalize().scale(this.maxSpeed);
    }

    this.x += this.body.velocity.x;
    this.y += this.body.velocity.y;
  }

  boids(bats, player) {
    const steerSeparation = this.ruleOfSeparation(bats);
    const steerAlignment = this.ruleOfAlignment(bats);
    const steerCohesion = this.ruleOfCohesion(bats);
    const steerPlayer = this.steerTowardsPlayer(player);

    this.updatePosition(
      steerSeparation,
      steerAlignment,
      steerCohesion,
      steerPlayer
    );
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

export default Bat;
