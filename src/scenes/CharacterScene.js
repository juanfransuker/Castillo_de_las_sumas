// Toca un personaje para verlo celebrar y atacar a su manera; "¡Elegir!" confirma.
class CharacterScene extends Phaser.Scene {
  constructor() { super('Character'); }
  create() {
    drawBackdrop(this); title(this, 80, '¿Quién eres?');
    new AnswerButton(this, 70, 60, '🏠', 0x6a5acd, () => this.scene.start('Menu'), 90, 80, 40);
    this.players = []; this.cards = [];
    CONFIG.CHARACTERS.forEach((c, i) => {
      const x = 205 + i * 290; this.cards.push({ c, x, g: this.add.graphics() });
      this.players.push(new Player(this, x, 470, c.id));
      this.add.text(x, 515, c.name, { fontFamily: CONFIG.FONT, fontSize: '38px', fontStyle: 'bold', color: '#3a2a55' }).setOrigin(0.5);
      this.add.text(x, 552, c.trait, { fontFamily: CONFIG.FONT, fontSize: '28px', fontStyle: 'bold', color: '#7a5c9e' }).setOrigin(0.5);
      this.add.zone(x, 370, 250, 400).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.pick(i));
    });
    this.paint();
    new AnswerButton(this, 640, 640, '¡Elegir!', 0x4cc36b, () => { AudioManager.unlock(); AudioManager.sfx('transition'); this.scene.start('Difficulty'); }, 360, 100, 52);
    this.cameras.main.fadeIn(300);
  }
  update() { this.players.forEach(p => p.update()); }
  paint() {
    this.cards.forEach(({ c, g, x }) => {
      const sel = ProgressManager.data.character === c.id;
      g.clear().fillStyle(0xffffff, 0.92).fillRoundedRect(x - 125, 170, 250, 400, 32);
      g.lineStyle(sel ? 10 : 5, sel ? 0xffd23f : c.color).strokeRoundedRect(x - 125, 170, 250, 400, 32);
    });
  }
  pick(i) {
    const c = CONFIG.CHARACTERS[i], p = this.players[i], x = this.cards[i].x;
    AudioManager.unlock(); AudioManager.sfx('correct'); ProgressManager.set('character', c.id); this.paint();
    if (p.busy) return; p.busy = true; this.time.delayedCall(1500, () => { p.busy = false; });
    p.celebrate(() => p.attack(x + 150, () => {}));
  }
}
