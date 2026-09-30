// Mapa del castillo: camino de zonas. Se avanza venciendo al jefe de cada zona.
class MapScene extends Phaser.Scene {
  constructor() { super('Map'); }
  create() {
    const P = ProgressManager.data, diff = P.difficulty, Z = CONFIG.ZONES, dc = CONFIG.DIFFS.find(x => x.id === diff);
    drawBackdrop(this); title(this, 58, 'Mapa del castillo', 54);
    this.add.text(640, 116, `${dc.icon} ${dc.name}`, { fontFamily: CONFIG.FONT, fontSize: '32px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 6 }).setOrigin(0.5);
    new AnswerButton(this, 62, 54, '←', 0x6a5acd, () => this.scene.start('Difficulty'), 100, 90, 50);
    this.add.text(1150, 215, '🏰', { fontSize: '210px' }).setOrigin(0.5).setAlpha(0.3);
    const pos = Z.map((_, i) => [120 + i * 148.5, i % 2 ? 400 : 540]);
    const g = this.add.graphics().lineStyle(16, 0xffffff, 0.35); g.beginPath(); g.moveTo(...pos[0]); pos.slice(1).forEach(p => g.lineTo(...p)); g.strokePath();
    let cur = Z.findIndex((_, i) => ProgressManager.zoneStars(diff, i) === 0); if (cur < 0) cur = Z.length - 1;
    Z.forEach((z, i) => {
      const [x, y] = pos[i], un = ProgressManager.zoneUnlocked(diff, i), st = ProgressManager.zoneStars(diff, i), r = i === Z.length - 1 ? 62 : 52;
      const c = this.add.graphics(); c.fillStyle(0x000000, 0.25).fillCircle(x, y + 8, r); c.fillStyle(st ? 0xffd23f : un ? 0x4cc36b : 0x8d84a6).fillCircle(x, y, r); c.lineStyle(6, 0xffffff).strokeCircle(x, y, r);
      this.add.text(x, y, un ? z.icon : '🔒', { fontSize: (r - 4) + 'px' }).setOrigin(0.5);
      this.add.text(x, y + r + 28, z.name + (st ? '\n' + '⭐'.repeat(st) : ''), { fontFamily: CONFIG.FONT, fontSize: '24px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 5, align: 'center' }).setOrigin(0.5);
      if (i === cur) { const ring = this.add.circle(x, y, r + 6, 0xffffff, 0).setStrokeStyle(6, 0xffffff); this.tweens.add({ targets: ring, scale: 1.3, alpha: 0, duration: 1000, repeat: -1 }); }
      this.add.zone(x, y, r * 2 + 30, r * 2 + 30).setInteractive({ useHandCursor: true }).on('pointerdown', () => un ? this.start(i) : this.locked(x, y));
    });
    const m = this.add.image(pos[cur][0], pos[cur][1] - 58, 'char_' + P.character).setOrigin(0.5, 1).setScale(0.42);
    this.tweens.add({ targets: m, y: m.y - 8, duration: 500, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    this.cameras.main.fadeIn(300);
  }
  start(i) {
    AudioManager.unlock(); AudioManager.sfx('transition'); this.cameras.main.fadeOut(300);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Game', { zone: i, index: 0 }));
  }
  locked(x, y) {
    AudioManager.sfx('wrong');
    const t = this.add.text(x, y - 90, '🔒 Vence al jefe anterior', { fontFamily: CONFIG.FONT, fontSize: '30px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 6 }).setOrigin(0.5).setDepth(30);
    this.tweens.add({ targets: t, y: t.y - 40, alpha: 0, duration: 1400, onComplete: () => t.destroy() });
  }
}
