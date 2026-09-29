class ResultScene extends Phaser.Scene {
  constructor() { super('Result'); }
  init(d) { this.stats = d.stats; }
  create() {
    const e = this.stats.errors, stars = !this.stats.bossWon ? 1 : e === 0 ? 3 : e <= 2 ? 2 : 1, coins = this.stats.correct + stars;
    const unlocked = ProgressManager.record(ProgressManager.data.difficulty, stars, coins);
    drawBackdrop(this); title(this, 90, this.stats.bossWon ? '¡Aventura superada!' : '¡Casi lo logras!');
    for (let i = 0; i < 3; i++) {
      const s = this.add.image(440 + i * 200, 250, 'star').setScale(0).setTint(i < stars ? 0xffd23f : 0x6b5b8a);
      this.tweens.add({ targets: s, scale: 3.2, angle: 360, duration: 500, delay: 400 + i * 450, ease: 'Back.out',
        onStart: () => { if (i < stars) { AudioManager.sfx('reward'); burst(this, s.x, s.y, [0xffd23f, 0xffffff], 14); } } });
    }
    const tx = { fontFamily: CONFIG.FONT, fontSize: '40px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 7 };
    this.add.text(640, 400, `🪙 +${coins}`, tx).setOrigin(0.5);
    if (unlocked) this.add.text(640, 460, `🔓 ¡Nuevo reto: ${unlocked}!`, tx).setOrigin(0.5);
    const hero = new Player(this, 180, 620, ProgressManager.data.character);
    const jump = () => hero.celebrate(() => this.time.delayedCall(600, jump)); this.time.delayedCall(1200, jump);
    new AnswerButton(this, 520, 620, 'Otra vez', 0x4cc36b, () => this.scene.start('Game', { index: 0, order: Run.newOrder() }), 300, 100, 44);
    new AnswerButton(this, 860, 620, 'Menú', 0xf5a623, () => this.scene.start('Menu'), 260, 100, 44);
    this.cameras.main.fadeIn(300);
  }
}
