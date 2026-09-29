class QuestionPanel {
  constructor(scene, x, y) {
    this.scene = scene;
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.25).fillRoundedRect(-320, -92, 640, 200, 36);
    g.fillStyle(0xfff3d6).fillRoundedRect(-320, -100, 640, 200, 36);
    g.lineStyle(8, 0x8a5a2b).strokeRoundedRect(-320, -100, 640, 200, 36);
    this.q = scene.add.text(0, -28, '', { fontFamily: CONFIG.FONT, fontSize: '92px', fontStyle: 'bold', color: '#3a2a55' }).setOrigin(0.5);
    this.msg = scene.add.text(0, 58, '', { fontFamily: CONFIG.FONT, fontSize: '34px', fontStyle: 'bold', color: '#6b4a2b', align: 'center', wordWrap: { width: 590 } }).setOrigin(0.5);
    this.c = scene.add.container(x, y, [g, this.q, this.msg]).setDepth(10);
  }
  setQuestion(t) { this.q.setText(t + ' = ?'); this.msg.setText(''); }
  say(t, color = '#6b4a2b', size = 34) {
    this.msg.setText(t).setColor(color).setFontSize(size);
    this.scene.tweens.add({ targets: this.msg, scale: { from: 0.6, to: 1 }, duration: 250, ease: 'Back.out' });
  }
}
