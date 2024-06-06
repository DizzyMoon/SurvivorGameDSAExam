class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.direction = "right";
    this.baseHealth = 100;
    this.health = this.baseHealth;
    this.baseSpeed = 3;
    this.speed = this.baseSpeed;
    this.speed = 1.3;
    this.baseAttackSpeed = 2;
    this.attackSpeed = this.baseAttackSpeed;
    this.items = [];
    this.xp = 0;
    this.xpToLevelUp = 1000;
    this.level = 1;
    this.body.setSize(30, 60);
    this.body.setOffset(82, 60);
    this.updateStats();
  }

  addItem(item) {
    this.items.push(item);
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

  addXP(amount) {
    this.xp += amount;
    this.checkLevelUp();
  }

  // level up player
  checkLevelUp() {
    const newLevel = Math.floor(this.xp / this.xpToLevelUp) + 1;
    this.scene.scene.launch("sceneLevelUp", { playerData: this });
    this.scene.scene.pause();
    if (newLevel > this.level) {
      this.scene.scene.pause();
      this.level = newLevel;
      this.updateStats();
    }
  }

  // Buf player stats each level up
  updateStats() {
    const healthIncreaseFactor = 1.1; // +10% health
    const speedIncreaseFactor = 1.05; // +5% movement speed
    const attackSpeedIncreaseFactor = 1.1; // +10% attack speed

    this.health = Math.round(
      this.baseHealth * Math.pow(healthIncreaseFactor, this.level - 1)
    );
    this.speed = parseFloat(
      (this.baseSpeed * Math.pow(speedIncreaseFactor, this.level - 1)).toFixed(
        2
      )
    );
    this.attackSpeed = parseFloat(
      (
        this.baseAttackSpeed *
        Math.pow(attackSpeedIncreaseFactor, this.level - 1)
      ).toFixed(2)
    );
  }

  // player level
  getLevel() {
    return this.level;
  }

  addModifiers(item) {}
}

export default Player;
