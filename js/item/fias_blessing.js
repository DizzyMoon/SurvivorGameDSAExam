import Item from "./item.js";

class FiasBlessing extends Item {
  constructor() {
    super();
    this.name = "Fias Blessing";
    this.description = "Raises XP gain";
    this.xpModifier = 0.3;
    this.icon = "content/item_icons/leaf/leaf_01a.png";
    this.iconName = "fiasBlessing";
  }
}

export default FiasBlessing;
