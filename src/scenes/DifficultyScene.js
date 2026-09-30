class DifficultyScene extends Phaser.Scene {
  constructor() { super('Difficulty'); }
  create() {
    drawBackdrop(this); title(this, 90, '¿Qué reto eliges?');
    new AnswerButton(this, 70, 60, '←', 0x6a5acd, () => this.scene.start('Character'), 90, 80, 44);
    const P = ProgressManager.data;
    const note = this.add.text(640, 640, '', { fontFamily: CONFIG.FONT, fontSize: '32px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 6 }).setOrigin(0.5);
    CONFIG.DIFFS.forEach((d, i) => {
      const x = 240 + i * 400, open = P.unlocked[d.id], n = (P.map[d.id] || []).reduce((a, b) => a + (b || 0), 0);
      const b = new AnswerButton(this, x, 340, `${open ? d.icon : '🔒'}\n${d.name}`, open ? d.color : 0x8d84a6, btn => {
        if (!open) { btn.enabled = true; AudioManager.sfx('wrong'); this.tweens.add({ targets: btn, angle: { from: -4, to: 4 }, duration: 70, yoyo: true, repeat: 3, onComplete: () => btn.setAngle(0) });
          note.setText(`Completa ${CONFIG.UNLOCK_AFTER_ZONES} zonas del reto anterior`); return; }
        AudioManager.unlock(); AudioManager.sfx('transition'); ProgressManager.set('difficulty', d.id);
        this.cameras.main.fadeOut(300); this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Map'));
      }, 340, 330, 60);
      this.add.text(x, 470, d.examples, { fontFamily: CONFIG.FONT, fontSize: '26px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 5 }).setOrigin(0.5);
      this.add.text(x, 560, `⭐ ${n}/${CONFIG.ZONES.length * 3}`, { fontFamily: CONFIG.FONT, fontSize: '40px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 6 }).setOrigin(0.5);
    });
    this.cameras.main.fadeIn(300);
  }
}
