import SkeletonEnemy from "./enemy/skeletonEnemy.js";
import { Chunk, Tile } from "./entities.js";
import Player from "./player/player.js";
import Bat from "./enemy/batEnemy.js";
import BerserkersGloves from "./item/berserkers_gloves.js";
import MithrilMail from "./item/mithril_mail.js";
import FiasBlessing from "./item/fias_blessing.js";
import LightningGrieves from "./item/lightning_grieves.js";
import LightningSpell from "./item/lightning_spell.js";
import Weapon from "./player/weapon.js";

class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
    this.preloadKeys = [];

    this.itemPool = [
      new BerserkersGloves(),
      new FiasBlessing(),
      new LightningGrieves(),
      new MithrilMail(),
      new LightningSpell(),
    ];

    this.LightningSpell = null;

    this.isAttacking = false;
    this.skeletonList = [];
    this.batList = [];
    this.player;
    this.enemyCollisionGroup;
    this.hitboxCollisionGroup;
    //this.attackCooldown = false; // Initialize attack cooldown flag
    this.attackCooldownDuration = 1000;
  }

  // Player stats
  updatePlayerStats() {
    const { health, xp, xpToLevelUp, speed, attackSpeed, items } = this.player;
    const level = this.player.getLevel();

    const itemNames = items.map((item) => item.name + ": Level " + item.level);

    document.getElementById("health").innerText = `Health: ${health}`;
    document.getElementById("xp").innerText = `XP: ${xp} / ${xpToLevelUp}`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("speed").innerText = `Speed: ${speed}`;
    document.getElementById(
      "attack-speed"
    ).innerText = `Attack Speed: ${attackSpeed}`;
    document.getElementById("items").innerText = `Items: ${
      items.length ? itemNames.join(", ") : ""
    }`;
  }

  calculateEnemySpawningPoints(numPoints) {
    // Clear previous spawning points container
    if (this.enemySpawningPointsContainer) {
      this.enemySpawningPointsContainer.destroy();
    }

    // Create a new container for spawning points
    this.enemySpawningPointsContainer = this.add.container().setDepth(10);

    // Get the camera's world view
    const cameraView = this.cameras.main.worldView;

    // Calculate positions just outside the camera view for spawning points
    const padding = 50; // Padding to ensure enemies spawn just outside the camera view
    const horizontalSpacing =
      (cameraView.width - padding * 2) / (numPoints - 1);
    const verticalSpacing = (cameraView.height - padding * 2) / (numPoints - 1);

    // Function to create spawning points and corresponding dots
    const createPoint = (x, y) => {
      // Create a container for the point
      const pointContainer = this.add.container(x, y).setDepth(10);

      // Create the red dot as a child of the point container
      const dot = this.add.circle(0, 0, 3, 0xff0000); // Relative position to the point
      pointContainer.add(dot); // Add dot as a child of the point container

      // Add the point container to the main container
      this.enemySpawningPointsContainer.add(pointContainer); // Add point container to the main container
    };
    // Bottom Edge
    for (let i = 0; i < numPoints; i++) {
      const x = cameraView.left + padding + i * horizontalSpacing;
      const y = cameraView.bottom + padding;
      createPoint(x, y);
    }

    // Right Edge
    for (let i = 0; i < numPoints; i++) {
      const x = cameraView.right + padding;
      const y = cameraView.top + padding + i * verticalSpacing;
      createPoint(x, y);
    }

    // Top Edge
    for (let i = 0; i < numPoints; i++) {
      const x = cameraView.right - padding - i * horizontalSpacing;
      const y = cameraView.top - padding;
      createPoint(x, y);
    }

    // Left Edge
    for (let i = 0; i < numPoints; i++) {
      const x = cameraView.left - padding;
      const y = cameraView.bottom - padding - i * verticalSpacing;
      createPoint(x, y);
    }
  }

  preload() {
    this.itemPool.forEach((item) => {
      this.load.spritesheet(item.iconName, item.icon, {
        frameWidth: 48,
        frameHeight: 48,
      });

      this.preloadKeys.push(item.iconName);
    });

    this.load.image("sprDirt", "content/tiles/dirt.png");
    this.preloadKeys.push("sprDirt");

    this.load.image("sprGrass", "content/tiles/grass.png");
    this.preloadKeys.push("sprGrass");

    this.load.image("sprFlowers", "content/tiles/flowers.png");
    this.preloadKeys.push("sprFlowers");

    this.load.spritesheet("playerIdle", "content/player/Idle.png", {
      frameWidth: 180,
      frameHeight: 180,
    });
    this.load.spritesheet("playerRun", "content/player/Run.png", {
      frameWidth: 180,
      frameHeight: 180,
    });

    this.load.spritesheet("playerAttack", "content/player/Attack1.png", {
      frameWidth: 180,
      frameHeight: 180,
    });

    this.load.spritesheet("playerHeavyAttack", "content/player/Attack2.png", {
      frameWidth: 180,
      frameHeight: 180,
    });

    //Bat enemy
    this.load.spritesheet(
      "batEnemyFlight",
      "content/enemy/flying eye/Flight.png",
      {
        frameWidth: 150,
        frameHeight: 150,
      }
    );

    // skeleton enemy
    this.load.spritesheet(
      "skeletonEnemyIdle",
      "content/enemy/skeleton/Idle.png",
      {
        frameWidth: 150,
        frameHeight: 150,
      }
    );

    this.load.spritesheet(
      "skeletonEnemyDeath",
      "content/enemy/skeleton/Death.png",
      {
        frameWidth: 150,
        frameHeight: 150,
      }
    );

    this.load.spritesheet(
      "skeletonEnemyHit",
      "content/enemy/skeleton/Take Hit.png",
      {
        frameWidth: 150,
        frameHeight: 150,
      }
    );

    //this.load.image("playerIdle", "content/player/idle.png");
  }

  killEnemy(enemy) {}

  hitEnemy(player, enemy) {
    if (enemy.stunned || !this.isAttacking) {
      // If attack is on cooldown or player is not attacking, return early
      return;
    }

    console.log(`Hit enemy at (${enemy.x}, ${enemy.y})`);

    // Perform attack logic...
    this.playAnimation(enemy, "skeletonEnemyHit");
    enemy.health -= 3;

    // Start attack cooldown
    enemy.stunned = true;
    this.time.delayedCall(this.attackCooldownDuration, () => {
      enemy.stunned = false; // Reset attack cooldown flag
    });

    if (enemy.health <= 0) {
      // Enemy defeated
      this.playAnimation(enemy, "skeletonEnemyDeath");
      Phaser.Utils.Array.Remove(this.skeletonList, enemy);
      enemy.alive = false;
      this.player.addXP(200); // add xp after defeating an enemy
    } else {
      // Enemy still alive
      this.time.delayedCall(500, () => {
        this.playAnimation(enemy, "skeletonEnemyIdle");
      });
    }
  }

  create() {
    //Initialize item pool

    //this.physics.world.debugDrawBody = true;

    this.enemyCollisionGroup = this.physics.add.group();

    this.cameraBounds = this.cameras.main.getBounds();

    // Define an array to store enemy spawning points
    this.enemySpawningPoints = [];

    // Calculate initial spawning points
    this.calculateEnemySpawningPoints(8);

    this.cameras.main.on("camera.scroll", () => {
      this.calculateEnemySpawningPoints(8);
    });

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

    /*
    const gloves = this.add.sprite(centerX, centerY, "berserkersGloves");
    gloves.setDepth(100);
    gloves.setInteractive();
    gloves.on("pointerdown", () => {
      console.log("You clicked the gloves");
    });
    */

    this.chunkSize = 16;
    this.tileSize = 16;
    //this.playerSpeed = 2;
    this.enemySpeed = 0.2;

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
    // this.player = this.physics.add
    //   .sprite(centerX, centerY, "playerIdle")
    //   .setSize(30, 60);
    // this.player.setDepth(10);

    this.player = new Player(this, centerX, centerY, "playerIdle");
    this.player.setDepth(10);

    //Setup player attack hitbox
    this.hitbox = this.physics.add
      .sprite(this.player.x + 20, this.player.y, "content/player/hitbox.png")
      .setSize(50, 50);
    //this.hitbox.setVisible(false);

    this.hitboxCollisionGroup = this.physics.add.group();
    this.hitboxCollisionGroup.add(this.hitbox);

    this.physics.add.overlap(
      this.hitbox,
      this.skeletonList,
      this.hitEnemy,
      null,
      this
    );

    this.anims.create({
      key: "playerIdle",
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

    this.anims.create({
      key: "skeletonEnemyHit",
      frames: this.anims.generateFrameNumbers("skeletonEnemyHit", {
        start: 0,
        end: 3,
      }),
    });

    this.anims.create({
      key: "skeletonEnemyDeath",
      frames: this.anims.generateFrameNumbers("skeletonEnemyDeath", {
        start: 0,
        end: 3,
      }),
    });

    this.player.anims.play("playerIdle");

    this.cameras.main.startFollow(this.player);
    //this.player.setCollideWorldBounds(true);

    //setup skeleton enemy
    this.anims.create({
      key: "skeletonEnemyIdle",
      frames: this.anims.generateFrameNumbers("skeletonEnemyIdle", {
        start: 0,
        end: 3,
      }),
      frameRate: 12,
      repeat: -1,
    });

    // Bat animation setup
    this.anims.create({
      key: "batEnemyFlight",
      frames: this.anims.generateFrameNumbers("batEnemyFlight", {
        start: 0,
        end: 7,
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemies,
      callbackScope: this,
      loop: true,
    });

    //this.spawnEnemy;
  }

  spawnEnemies() {
    this.spawnSkeleton();
    //this.spawnBat();
  }

  SkeletonAI(enemy, player) {
    let directionX = player.x - enemy.x;
    let directionY = player.y - enemy.y;

    //Normalize Vector
    var length = Math.sqrt(directionX * directionX + directionY * directionY);
    directionX /= length;
    directionY /= length;

    enemy.x += directionX * this.enemySpeed;
    enemy.y += directionY * this.enemySpeed;
  }

  spawnSkeleton() {
    const randomPoint = Phaser.Utils.Array.GetRandom(
      this.enemySpawningPointsContainer.list
    );

    const spawnX = randomPoint.x;
    const spawnY = randomPoint.y;

    const enemy = new SkeletonEnemy(this, spawnX, spawnY, "skeletonEnemyIdle");
    enemy.setDepth(10);
    this.playAnimation(enemy, "skeletonEnemyIdle");
    this.skeletonList.push(enemy);
    this.enemyCollisionGroup.add(enemy);
  }

  spawnBat() {
    if (this.batList.length < 10) {
      const randomPoint = Phaser.Utils.Array.GetRandom(
        this.enemySpawningPointsContainer.list
      );

      const spawnX = randomPoint.x;
      const spawnY = randomPoint.y;

      const bat = new Bat(this, spawnX, spawnY, "batEnemyFlight");
      this.playAnimation(bat, "batEnemyFlight");
      bat.setDepth(10);
      this.batList.push(bat);
      this.enemyCollisionGroup.add(bat);
    }
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

  toggleRuleOfAlignment(on) {
    this.batList.forEach((bat) => {
      on ? (bat.ruleOfAlignmentOn = true) : (bat.ruleOfAlignmentOn = false);
    });
  }

  toggleRuleOfSeperation(on) {
    this.batList.forEach((bat) => {
      on ? (bat.ruleOfSeparationOn = true) : (bat.ruleOfSeparationOn = false);
    });
  }

  toggleRuleOfCohesion(on) {
    this.batList.forEach((bat) => {
      on ? (bat.ruleOfCohesionOn = true) : (bat.ruleOfCohesionOn = false);
    });
  }

  toggleFollowPlayer(on) {
    this.batList.forEach((bat) => {
      on ? (bat.followPlayerOn = true) : (bat.followPlayerOn = false);
    });
  }

  update() {
    // ensure player have weapon and is enabled
    if (this.player.weaponEnabled && this.player.weapon) {
      this.player.weapon.update();
    }

    const ruleOfAlignment = document.getElementById("rule-of-alignment");
    const ruleOfSeparation = document.getElementById("rule-of-seperation");
    const ruleOfCohesion = document.getElementById("rule-of-cohesion");
    const followPlayerCheckbox = document.getElementById(
      "follow-player-toggle"
    );

    ruleOfAlignment.addEventListener("change", () => {
      ruleOfAlignment.checked
        ? this.toggleRuleOfAlignment(true)
        : this.toggleRuleOfAlignment(false);
    });

    ruleOfSeparation.addEventListener("change", () => {
      ruleOfSeparation.checked
        ? this.toggleRuleOfSeperation(true)
        : this.toggleRuleOfSeperation(false);
    });

    ruleOfCohesion.addEventListener("change", () => {
      ruleOfCohesion.checked
        ? this.toggleRuleOfCohesion(true)
        : this.toggleRuleOfCohesion(false);
    });

    followPlayerCheckbox.addEventListener("change", () => {
      followPlayerCheckbox.checked
        ? this.toggleFollowPlayer(true)
        : this.toggleFollowPlayer(false);
    });

    this.calculateEnemySpawningPoints(8);

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

    // Apply Enemy AI
    this.skeletonList.forEach((skeleton) => {
      skeleton.ai(this.player);
    });

    this.batList.forEach((bat) => {
      bat.boids(this.batList, this.player);
    });

    //Movement Controller
    if (this.keyW.isDown) {
      this.player.y -= this.player.speed;
    }
    if (this.keyS.isDown) {
      this.player.y += this.player.speed;
    }
    if (this.keyA.isDown) {
      this.player.x -= this.player.speed;
    }
    if (this.keyD.isDown) {
      this.player.x += this.player.speed;
    }

    if (this.isAttacking) {
      return;
    }

    //Animation Controller

    if (this.keyW.isDown) {
      this.playAnimation(this.player, "run");
    } else if (this.keyA.isDown) {
      this.player.direction = "left";
      this.player.flipSprite(true);
      //this.flipSprite(this.player, true);
      this.playAnimation(this.player, "run");
    } else if (this.keyS.isDown) {
      this.playAnimation(this.player, "run");
    } else if (this.keyD.isDown) {
      this.player.direction = "right";
      //this.flipSprite(this.player, false);
      this.player.flipSprite(false);
      this.playAnimation(this.player, "run");
    } else {
      this.playAnimation(this.player, "playerIdle");
    }

    // diplay updated player stats
    this.updatePlayerStats();
  }

  playerAttack() {
    this.isAttacking = true;

    if (this.player.direction == "right") {
      this.hitbox.setPosition(this.player.x + 20, this.player.y);
    } else {
      this.hitbox.setPosition(this.player.x - 20, this.player.y);
    }
    //this.hitbox.setVisible(true);

    const attackDuration = 500 / this.player.attackSpeed;

    this.time.delayedCall(attackDuration, () => {
      //this.hitbox.setVisible = false;
    });

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

export default SceneMain;
