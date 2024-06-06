class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.direction = "right";
    this.baseHealth = 100;
    this.healthModifier;
    this.health = this.baseHealth;
    this.baseSpeed = 3;
    this.speedModifier;
    this.speed = this.baseSpeed;
    //this.speed = 1.3;
    this.baseAttackSpeed = 2;
    this.attackSpeedModifier;
    this.attackSpeed = this.baseAttackSpeed;
    this.items = [];
    this.weapon = null;
    this.weaponEnabled = false;
    this.xp = 0;
    this.xpModifier;
    this.xpToLevelUp = 1000;
    this.level = 1;
    this.body.setSize(30, 60);
    this.body.setOffset(82, 60);
    this.updateStats();
  }

  getHealthModifier() {
    let modifier = 0;
    this.items.forEach((item) => {
      modifier = modifier + item.healthModifier * item.level;
    });
    return modifier;
  }

  getSpeedModifier() {
    let modifier = 0;
    this.items.forEach((item) => {
      modifier = modifier + item.speedModifier * item.level;
    });
    return modifier;
  }

  getAttackSpeedModifier() {
    let modifier = 0;
    this.items.forEach((item) => {
      modifier = modifier + item.attackSpeedModifier * item.level;
    });
    return modifier;
  }

  getXpModifier() {
    let modifier = 0;
    this.items.forEach((item) => {
      modifier = modifier + item.xpModifier + item.level / 2;
    });

    // Avoid multiplying by 0
    if (modifier === 0) {
      return 1;
    }

    return modifier;
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
    const toAdd = amount * this.getXpModifier();
    this.xp += toAdd;
    this.checkLevelUp();
  }

  applyModifiers() {
    this.health = this.baseHealth + this.getHealthModifier();
    this.attackSpeed = this.baseAttackSpeed + this.getAttackSpeedModifier();
    this.speed = this.baseSpeed + this.getSpeedModifier();
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

  updateWeaponRadius() {
    if (this.weapon) {
      const newRadius = 50 + (this.level - 1) * 10; // Increase radius by 10 per level
      this.weapon.updateRadius(newRadius);
    }
  }

  // player level
  getLevel() {
    return this.level;
  }

  addModifiers(item) {}

  addWeapon(weapon) {
    this.weapon = weapon;
  }

  enableWeapon() {
    this.weaponEnabled = true;
  }

  update() {
    if (this.weaponEnabled && this.weapon) {
      this.weapon.update();
    }
  }
}

export default Player;
