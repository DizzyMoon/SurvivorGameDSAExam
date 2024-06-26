import BerserkersGloves from "./item/berserkers_gloves.js";
import FiasBlessing from "./item/fias_blessing.js";
import LightningGrieves from "./item/lightning_grieves.js";
import LightningSpell from "./item/lightning_spell.js";
import MithrilMail from "./item/mithril_mail.js";
import Weapon from "./player/weapon.js";

class SceneLevelUp extends Phaser.Scene {
  constructor() {
    super({ key: "sceneLevelUp" });
    this.itemPool = [
      new BerserkersGloves(),
      new FiasBlessing(),
      new LightningGrieves(),
      new MithrilMail(),
      new LightningSpell(),
    ];
  }

  unpause() {
    this.refferer.resume("scenemain");
  }

  preload() {
    this.itemPool.forEach((item) => {
      this.load.spritesheet(item.iconName, item.icon, {
        frameWidth: 48,
        frameHeight: 48,
      });
    });
  }

  generateItem(duplicates) {
    let newItem;
    do {
      newItem = this.itemPool[Math.floor(Math.random() * this.itemPool.length)];
    } while (duplicates.some((item) => item.name === newItem.name));

    return newItem;
  }

  handleItemChoice(item, player) {
    if (item instanceof LightningSpell) {
      let existingItem = this.player.items.find((i) => i.name === item.name);
      if (!existingItem) {
        this.player.addItem(item);
        const initialRadius = 50; // level 1 radius 50
        const weapon = new Weapon(
          this.scene.get("SceneMain"),
          this.player,
          initialRadius
        );
        this.player.addWeapon(weapon);
        this.player.enableWeapon();
      }

      if (existingItem) {
        existingItem.level++;
        if (item instanceof LightningSpell && player.weapon) {
          const newRadius = 50 + (existingItem.level - 1) * 10; // increase radius by 10 for each level
          player.weapon.updateRadius(newRadius);
        }
      }
    } else {
      let existingItem = player.items.find((i) => i.name === item.name);
      if (existingItem) {
        existingItem.level++;
      } else {
        player.addItem(item);
      }
    }

    player.applyModifiers();
    this.scene.resume("SceneMain");
    this.scene.stop();
  }

  create(data) {
    const backgroundColor = 0x3498db; // Color code (hexadecimal)
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, backgroundColor)
      .setOrigin(0, 0);

    this.player = data.playerData;
    let duplicates = [];

    const item1 = this.generateItem(duplicates);
    duplicates.push(item1);

    const item2 = this.generateItem(duplicates);
    duplicates.push(item2);

    const item3 = this.generateItem(duplicates);
    duplicates.push(item3);

    const centerX = this.cameras.main.width / 2;
    const centerY = this.cameras.main.height / 2;

    const sprite1 = this.add.sprite(centerX, centerY, item1.iconName);
    sprite1.setDepth(100);
    sprite1.setInteractive();
    sprite1.on("pointerdown", () => {
      this.handleItemChoice(item1, this.player);
      console.log("You clicked the " + item1.name);
    });

    const banner = this.add.text(centerX, centerY - 150, "Level Up!", {
      fontSize: 64,
    });
    banner.setDepth(1000);
    banner.setOrigin(0.5);

    const name1 = this.add.text(centerX, centerY + 50, item1.name);
    name1.setOrigin(0.5);
    const description1 = this.add.text(
      centerX,
      centerY + 80,
      item1.description,
      {
        fontSize: 13,
      }
    );

    description1.setOrigin(0.5);

    const sprite2 = this.add.sprite(centerX + 200, centerY, item2.iconName);
    sprite2.setDepth(100);
    sprite2.setInteractive();
    sprite2.on("pointerdown", () => {
      this.handleItemChoice(item2, this.player);
      console.log("You clicked the " + item2.name);
    });

    const name2 = this.add.text(centerX + 200, centerY + 50, item2.name);
    name2.setOrigin(0.5);
    const description2 = this.add.text(
      centerX + 200,
      centerY + 80,
      item2.description,
      {
        fontSize: 13,
      }
    );
    description2.setOrigin(0.5);

    const sprite3 = this.add.sprite(centerX - 200, centerY, item3.iconName);
    sprite3.setDepth(100);
    sprite3.setInteractive();
    sprite3.on("pointerdown", () => {
      this.handleItemChoice(item3, this.player);
      console.log("You clicked the " + item3.name);
    });

    const name3 = this.add.text(centerX - 200, centerY + 50, item3.name);
    name3.setOrigin(0.5);
    const description3 = this.add.text(
      centerX - 200,
      centerY + 80,
      item3.description,
      {
        fontSize: 13,
      }
    );
    description3.setOrigin(0.5);
  }

  update() {}
}

export default SceneLevelUp;
