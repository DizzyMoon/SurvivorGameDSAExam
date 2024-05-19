class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
    this.isAttacking = false;
  }

  preload() {
    this.load.image("sprDirt", "content/tiles/dirt.png");
    this.load.image("sprGrass", "content/tiles/grass.png");
    this.load.image("sprFlowers", "content/tiles/flowers.png");
    this.load.spritesheet("playerIdle", "content/player/idle.png", {
      frameWidth: 180,
      frameHeight: 180,
    });
    this.load.spritesheet("playerRun", "content/player/run.png", {
      frameWidth: 180,
      frameHeight: 180,
    });

    this.load.spritesheet("playerAttack", "content/player/attack1.png", {
      frameWidth: 180,
      frameHeight: 180,
    });

    this.load.spritesheet("playerHeavyAttack", "content/player/attack2.png", {
      frameWidth: 180,
      frameHeight: 180,
    });

    //this.load.image("playerIdle", "content/player/idle.png");
  }

  create() {
    this.clock = this.time.addEvent({
      delay: 2000, // 2000 milliseconds = 2 seconds
      callback: this.playerAttack,
      callbackScope: this,
      loop: true, // Repeat indefinitely
    });
    /*
    this.anims.create({
      key: "sprWater",
      frames: this.anims.generateFrameNumbers("sprWater"),
      frameRate: 5,
      repeat: -1,
    });
    */

    //create chunks

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    this.chunkSize = 16;
    this.tileSize = 16;
    this.playerSpeed = 2;

    this.cameras.main.setZoom(1);

    /*
    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + this.cameras.main.worldView.width * 0.5,
      this.cameras.main.worldView.y + this.cameras.main.worldView.height * 0.5
    );
    */

    this.chunks = [];

    //Add input keys
    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //setup player
    this.player = this.physics.add.sprite(centerX, centerY, "playerIdle");
    this.player.setDepth(10);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("playerIdle", {
        start: 0,
        end: 10,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("playerRun", {
        start: 0,
        end: 8,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.anims.create({
      key: "attack",
      frames: this.anims.generateFrameNumbers("playerAttack", {
        start: 0,
        end: 6,
      }),
    });

    this.anims.create({
      key: "heavyAttack",
      frames: this.anims.generateFrameNumbers("playerHeavyAttack", {
        start: 0,
        end: 6,
      }),
    });

    this.player.anims.play("idle");

    this.cameras.main.startFollow(this.player);
    //this.player.setCollideWorldBounds(true);
  }

  getChunk(x, y) {
    var chunk = null;
    for (var i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i];
      }
    }
    return chunk;
  }

  update() {
    var snappedChunkX =
      this.chunkSize *
      this.tileSize *
      Math.round(this.player.x / (this.chunkSize * this.tileSize));
    var snappedChunkY =
      this.chunkSize *
      this.tileSize *
      Math.round(this.player.y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

    for (var x = snappedChunkX - 2; x < snappedChunkX + 2; x++) {
      for (var y = snappedChunkY - 2; y < snappedChunkY + 2; y++) {
        var existingChunk = this.getChunk(x, y);

        if (existingChunk == null) {
          var newChunk = new Chunk(this, x, y);
          this.chunks.push(newChunk);
        }
      }
    }

    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];

      if (
        Phaser.Math.Distance.Between(
          snappedChunkX,
          snappedChunkY,
          chunk.x,
          chunk.y
        ) < 3
      ) {
        if (chunk !== null) {
          chunk.load();
        }
      } else {
        if (chunk !== null) {
          chunk.unload();
        }
      }
    }

    //Movement Controller
    if (this.keyW.isDown) {
      this.player.y -= this.playerSpeed;
    }
    if (this.keyS.isDown) {
      this.player.y += this.playerSpeed;
    }
    if (this.keyA.isDown) {
      this.player.x -= this.playerSpeed;
    }
    if (this.keyD.isDown) {
      this.player.x += this.playerSpeed;
    }

    if (this.isAttacking) {
      return;
    }

    //Animation Controller

    if (this.keyW.isDown) {
      this.playAnimation(this.player, "run");
    } else if (this.keyA.isDown) {
      this.flipSprite(this.player, true);
      this.playAnimation(this.player, "run");
    } else if (this.keyS.isDown) {
      this.playAnimation(this.player, "run");
    } else if (this.keyD.isDown) {
      this.flipSprite(this.player, false);
      this.playAnimation(this.player, "run");
    } else {
      this.playAnimation(this.player, "idle");
    }

    /*
    if (this.keyW.isDown) {
      this.followPoint.y -= this.cameraSpeed;
    }
    if (this.keyS.isDown) {
      this.followPoint.y += this.cameraSpeed;
    }
    if (this.keyA.isDown) {
      this.followPoint.x -= this.cameraSpeed;
    }
    if (this.keyD.isDown) {
      this.followPoint.x += this.cameraSpeed;
    }
    */

    //this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
  }

  playerAttack() {
    this.isAttacking = true;

    // Play attack animation with force to override any other animations
    this.playAnimationOverride(this.player, "attack");

    // Stop attacking after the attack animation finishes
    this.time.delayedCall(500, () => {
      this.isAttacking = false; // Reset the attacking flag
    });
  }

  isAnimationPlaying(sprite, animationKey) {
    const currentAnimation = sprite.anims.currentAnim;
    return currentAnimation && currentAnimation.key === animationKey;
  }

  // Play animation only if it's not already playing
  playAnimation(sprite, animationKey) {
    if (!this.isAnimationPlaying(sprite, animationKey)) {
      sprite.anims.play(animationKey);
    }
  }

  flipSprite(sprite, flipX) {
    sprite.setScale(flipX ? -1 : 1, 1);
  }

  playAnimationOverride(sprite, animationKey) {
    sprite.anims.play(animationKey, true);
  }
}
