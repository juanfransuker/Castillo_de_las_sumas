const DOOR_SKINS = {
  gate: { wood: 0x9a5b2e, frame: 0x6b7a8a, band: 0x3b3b4f }, wood: { wood: 0x9a5b2e, frame: 0xa89a7a, band: 0x3b3b4f },
  royal: { wood: 0xb03a3a, frame: 0xffd23f, band: 0xffd23f }, bars: { wood: 0x7d8794, frame: 0x4d5b7a, band: 0x3a3a4a },
  vault: { wood: 0xb8c4d6, frame: 0xc79a3a, band: 0xffd23f }, magic: { wood: 0xb46be0, frame: 0xffd23f, band: 0xffffff }
};
class Door {
  constructor(scene, x, y, skin = 'wood') {
    this.scene = scene; this.x = x; const S = DOOR_SKINS[skin] || DOOR_SKINS.wood;
    const g = scene.add.graphics();
    g.fillStyle(S.frame).fillRoundedRect(-115, -330, 230, 330, { tl: 115, tr: 115, bl: 0, br: 0 });
    g.fillStyle(0xffe9a8).fillRoundedRect(-90, -305, 180, 305, { tl: 90, tr: 90, bl: 0, br: 0 });
    const pg = scene.add.graphics();
    pg.fillStyle(S.wood).fillRoundedRect(0, -305, 180, 305, { tl: 90, tr: 90, bl: 0, br: 0 });
    pg.lineStyle(4, 0x6f3f1c); for (let i = 1; i < 4; i++) pg.lineBetween(i * 45, -300 + (i === 2 ? 0 : 20), i * 45, 0);
    pg.fillStyle(S.band).fillRect(0, -200, 180, 16).fillRect(0, -90, 180, 16);
    pg.fillStyle(0xffd23f).fillCircle(150, -140, 12);
    this.panel = scene.add.container(-90, 0, [pg]);
    this.c = scene.add.container(x, y, [g, this.panel]).setDepth(3);
  }
  shake(cb) {
    this.scene.tweens.add({ targets: this.c, x: { from: this.x - 8, to: this.x + 8 }, duration: 50, yoyo: true, repeat: 5,
      onComplete: () => { this.c.x = this.x; cb && cb(); } });
  }
  open() { this.scene.tweens.add({ targets: this.panel, scaleX: 0.12, duration: 600, ease: 'Cubic.out' }); }
}
