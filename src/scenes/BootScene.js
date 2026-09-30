class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }
  preload() {
    // Aquí se cargarán los sprites reales (this.load.image('char_knight', 'assets/characters/knight.png')...).
    // Si una clave ya existe, PlaceholderArt no la sustituye.
  }
  create() { PlaceholderArt.build(this); this.scene.start('Menu'); }
}
