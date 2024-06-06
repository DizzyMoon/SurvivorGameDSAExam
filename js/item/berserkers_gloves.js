import Item from "./item.js";

class BerserkersGloves extends Item {
  constructor() {
    super();
    this.name = "Berserkers Gloves";
    this.description = "Raises attack speed";
    this.attackSpeedModifier = 1.5;
    this.icon = "content/item_icons/gloves/gloves_01e.png";
    this.iconName = "berserkersGloves";
  }
}

export default BerserkersGloves;
