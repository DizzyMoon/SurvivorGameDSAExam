import Item from "./item.js";

class MithrilMail extends Item {
  constructor() {
    super();
    this.healthModifier = 0.3;
    this.name = "Mithril Mail";
    this.description = "Raises health";
    this.icon = "content/item_icons/armor/armor_01b.png";
    this.iconName = "mithrilMail";
  }
}

export default MithrilMail;
