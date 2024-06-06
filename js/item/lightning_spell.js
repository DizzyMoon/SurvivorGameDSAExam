import Item from "./item.js";

class LightningSpell extends Item {
  constructor() {
    super();
    this.name = "Lightning Spell";
    this.description = "A powerfull spell that deals damage to enemy in a radius";
    this.icon = "content/item_icons/staff/staff_03c.png";
    this.iconName = "lightningSpell";
  }
}

export default LightningSpell;