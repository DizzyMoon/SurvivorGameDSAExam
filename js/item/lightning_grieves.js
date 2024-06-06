import Item from "./item.js";

class LightningGrieves extends Item {
  constructor() {
    super();
    this.name = "Lightning Grieves";
    this.description = "Raises movement speed";
    this.speedModifier = 0.2;
    this.icon = "content/item_icons/boots/boots_01d.png";
    this.iconName = "lightningGrieves";
  }
}

export default LightningGrieves;
