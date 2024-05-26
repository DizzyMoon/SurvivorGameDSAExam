class PlayerStats {
  constructor() {
    this.direction = "right";
    this.baseHealth = 100;
    this.health = this.baseHealth;
    this.baseSpeed = 1.3;
    this.speed = this.baseSpeed;
    this.baseAttackSpeed = 2;
    this.attackSpeed = this.baseAttackSpeed;
    this.items = [];
    this.xp = 0;
    this.xpToLevelUp = 1000;
    this.level = 1;
    this.updateStats();
  }

  addXP(amount) {
    this.xp += amount;
    this.checkLevelUp();
  }

  // level up player
  checkLevelUp() {
    const newLevel = Math.floor(this.xp / this.xpToLevelUp) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.updateStats();
    }
  }

  // Buf player stats each level up
  updateStats() {
    const healthIncreaseFactor = 1.1; // +10% health
    const speedIncreaseFactor = 1.05; // +5% movement speed
    const attackSpeedIncreaseFactor = 1.1; // +10% attack speed

    this.health = Math.round(this.baseHealth * Math.pow(healthIncreaseFactor, this.level - 1));
    this.speed = parseFloat((this.baseSpeed * Math.pow(speedIncreaseFactor, this.level - 1)).toFixed(2));
    this.attackSpeed = parseFloat((this.baseAttackSpeed * Math.pow(attackSpeedIncreaseFactor, this.level - 1)).toFixed(2));
  }

  // player level
  getLevel() {
    return this.level;
  }
}

export default PlayerStats;
