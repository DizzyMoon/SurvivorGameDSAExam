export class Chunk {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.tiles = this.scene.add.group();
    this.isLoaded = false;
  }

  unload() {
    if (this.isLoaded) {
      this.tiles.clear(true, true);

      this.isLoaded = false;
    }
  }

  load() {
    if (!this.isLoaded) {
      for (var x = 0; x < this.scene.chunkSize; x++) {
        for (var y = 0; y < this.scene.chunkSize; y++) {
          var tileX =
            this.x * (this.scene.chunkSize * this.scene.tileSize) +
            x * this.scene.tileSize;
          var tileY =
            this.y * (this.scene.chunkSize * this.scene.tileSize) +
            y * this.scene.tileSize;

          var perlinValue = noise.perlin2(tileX / 200, tileY / 200);

          var key = "";
          var animationKey = "";

          if (perlinValue < 0.2) {
            key = "sprGrass";
            //animationKey = "sprDirt";
          } else if (perlinValue >= 0.2 && perlinValue < 0.3) {
            key = "sprFlowers";
          } else if (perlinValue >= 0.3) {
            key = "sprDirt";
          }

          var tile = new Tile(this.scene, tileX, tileY, key);

          if (animationKey !== "") {
            tile.play(animationKey);
          }

          this.tiles.add(tile);
        }
      }

      this.isLoaded = true;
    }
  }
}

export class Tile extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scene;
    this.scene.add.existing(this);
    this.setOrigin(0);
  }
}

export class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key) {
    super(scene, x, y, key);
    this.scene = scne;
    this.scene.add.existing(this);
    this.setOrigin(0);
  }
}
