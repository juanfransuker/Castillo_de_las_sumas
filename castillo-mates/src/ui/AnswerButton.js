// Botón redondeado genérico (respuestas, menús). Container para poder animarlo.
class AnswerButton extends Phaser.GameObjects.Container {
  constructor(scene, x, y, label, color, onClick, w = 210, h = 110, fs = 64) {
    super(scene, x, y);
    this.value = null; this.w = w; this.h = h; this.enabled = true;
    this.bg = scene.add.graphics();
    this.txt = scene.add.text(0, 0, label, { fontFamily: CONFIG.FONT, fontSize: fs + 'px', fontStyle: 'bold', color: '#ffffff',
      stroke: '#3a2a55', strokeThickness: 6, align: 'center' }).setOrigin(0.5);
    this.add([this.bg, this.txt]); this.setSize(w, h); this.setInteractive({ useHandCursor: true });
    this.on('pointerdown', () => {
      if (!this.enabled) return;
      scene.tweens.add({ targets: this, scaleX: 0.93, scaleY: 0.93, duration: 60, yoyo: true });
      onClick(this);
    });
    scene.add.existing(this); this.draw(color);
  }
  draw(color) {
    const { w, h } = this, g = this.bg; g.clear();
    g.fillStyle(0x000000, 0.28).fillRoundedRect(-w / 2, -h / 2 + 8, w, h, 26);
    g.fillStyle(color).fillRoundedRect(-w / 2, -h / 2, w, h, 26);
    g.fillStyle(0xffffff, 0.25).fillRoundedRect(-w / 2 + 10, -h / 2 + 8, w - 20, h / 3, 18);
    g.lineStyle(5, 0xffffff, 0.9).strokeRoundedRect(-w / 2, -h / 2, w, h, 26);
  }
  markCorrect() {
    this.draw(0x4cc36b);
    this.scene.tweens.add({ targets: this, scaleX: 1.2, scaleY: 1.2, duration: 200, yoyo: true, repeat: 1 });
    const ring = this.scene.add.circle(this.x, this.y, 60, 0xffffff, 0.5).setDepth(5);
    this.scene.tweens.add({ targets: ring, scale: 3, alpha: 0, duration: 600, onComplete: () => ring.destroy() });
  }
  markWrong() {
    this.enabled = false; this.draw(0x9a8fb0); this.alpha = 0.7; const x = this.x;
    this.scene.tweens.add({ targets: this, x: { from: x - 12, to: x + 12 }, duration: 60, yoyo: true, repeat: 3, onComplete: () => { this.x = x; } });
  }
  pulse() { this.scene.tweens.add({ targets: this, scaleX: 1.12, scaleY: 1.12, duration: 300, yoyo: true, repeat: 3 }); }
  disable() { this.enabled = false; this.alpha = 0.45; }
}
