class ResultScene extends Phaser.Scene {
  constructor() { super('Result'); }
  init(d) { this.stats = d.stats; this.zone = d.zone || 0; }
  create() {
    const P = ProgressManager.data, diff = P.difficulty, Z = CONFIG.ZONES, z = Z[this.zone], won = this.stats.bossWon, e = this.stats.errors;
    const stars = !won ? 0 : e === 0 ? 3 : e <= 2 ? 2 : 1, coins = this.stats.correct + stars;
    const firstTime = won && ProgressManager.zoneStars(diff, this.zone) === 0;
    const unlocked = ProgressManager.record(diff, this.zone, stars, coins);
    drawBackdrop(this); title(this, 80, won ? '¡Zona superada!' : '¡Casi lo logras!');
    this.add.text(640, 145, `${z.icon} ${z.name}`, { fontFamily: CONFIG.FONT, fontSize: '36px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 6 }).setOrigin(0.5);
    for (let i = 0; i < 3; i++) {
      const s = this.add.image(440 + i * 200, 270, 'star').setScale(0).setTint(i < stars ? 0xffd23f : 0x6b5b8a);
      this.tweens.add({ targets: s, scale: 3.2, angle: 360, duration: 500, delay: 400 + i * 450, ease: 'Back.out',
        onStart: () => { if (i < stars) { AudioManager.sfx('reward'); burst(this, s.x, s.y, [0xffd23f, 0xffffff], 14); } } });
    }
    const tx = { fontFamily: CONFIG.FONT, fontSize: '38px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 7 };
    this.add.text(640, 400, `🪙 +${coins}`, tx).setOrigin(0.5);
    let y = 450;
    if (firstTime && this.zone < Z.length - 1) { this.add.text(640, y, `🔓 ¡Nueva zona: ${Z[this.zone + 1].name}!`, tx).setOrigin(0.5); y += 50; }
    if (firstTime && this.zone === Z.length - 1) { this.add.text(640, y, '👑 ¡Has salvado el castillo!', tx).setOrigin(0.5); y += 50; }
    if (unlocked) this.add.text(640, y, `🔓 ¡Nuevo reto: ${unlocked}!`, tx).setOrigin(0.5);
    const hero = this.hero = new Player(this, 180, 620, P.character);
    const jump = () => hero.celebrate(() => this.time.delayedCall(600, jump)); this.time.delayedCall(1200, jump);
    const again = () => this.scene.start('Game', { zone: this.zone, index: 0 }), map = () => this.scene.start('Map');
    new AnswerButton(this, 520, 630, won ? 'Mapa' : 'Otra vez', 0x4cc36b, won ? map : again, 300, 110, 48);
    new AnswerButton(this, 860, 630, won ? 'Otra vez' : 'Mapa', 0xf5a623, won ? again : map, 300, 110, 48);
    this.cameras.main.fadeIn(300);
  }
  update() { this.hero && this.hero.update(); }
}
