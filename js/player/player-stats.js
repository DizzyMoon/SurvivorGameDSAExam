class PlayerStats {
  constructor() {
    this.direction = "right";
    this.health = 100;
    this.speed = 1.3;
    this.attackSpeed = 2;
    this.items = [];
    this.xp = 0;
    this.xpToLevelUp = 1000;
  }
}

export default PlayerStats;
