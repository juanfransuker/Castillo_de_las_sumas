// Cada tema = aspecto de sala + obstáculo asociado. Añadir salas: nuevo tema aquí + clase en Obstacle.js.
const Run = { newOrder() { return Phaser.Utils.Array.Shuffle(['forest', 'castle', 'dungeon', 'tower', 'well']).slice(0, 3); } };
const RoomBuilder = {
  brick(g, base, c1, c2) { let i = 0; g.fillStyle(base).fillRect(0, 0, 1280, 520);
    for (let r = 0; r < 11; r++) for (let x = r % 2 ? 0 : -60; x < 1280; x += 120) g.fillStyle(i++ % 2 ? c1 : c2).fillRoundedRect(x + 3, r * 48 + 3, 114, 42, 8); },
  floor(g, c, l) { g.fillStyle(c).fillRect(0, 510, 1280, 210).fillStyle(l).fillRect(0, 506, 1280, 10); g.lineStyle(4, l); for (let x = 0; x < 1280; x += 160) g.lineBetween(x, 516, x - 40, 720); },
  torch(s, x, y) {
    const g = s.add.graphics().setDepth(1);
    g.fillStyle(0x5a3a22).fillRoundedRect(x - 8, y, 16, 70, 6).fillStyle(0x333344).fillRoundedRect(x - 18, y - 6, 36, 14, 6);
    const glow = s.add.circle(x, y - 30, 95, 0xffc857, 0.18).setDepth(1);
    const f = s.add.ellipse(x, y - 26, 30, 48, 0xff8a1f).setDepth(1), f2 = s.add.ellipse(x, y - 18, 16, 28, 0xffe066).setDepth(1);
    s.tweens.add({ targets: [f, f2], scaleY: { from: 0.85, to: 1.2 }, scaleX: { from: 1, to: 0.85 }, duration: 220 + x % 90, yoyo: true, repeat: -1 });
    s.tweens.add({ targets: glow, alpha: { from: 0.12, to: 0.28 }, duration: 400, yoyo: true, repeat: -1 });
  },
  banner(s, x, c = 0xd94a4a) {
    const g = s.add.graphics().setDepth(1);
    g.fillStyle(c).fillRect(x - 36, 0, 72, 150).fillTriangle(x - 36, 150, x + 36, 150, x, 190);
    g.fillStyle(0xffd23f).fillCircle(x, 70, 20).fillStyle(c).fillCircle(x, 70, 10);
  },
  sky(g, top, bot) { g.fillGradientStyle(top, top, bot, bot, 1).fillRect(0, 0, 1280, 520); }
};
const THEMES = {
  castle: { obstacle: 'door', draw(s) { const g = s.add.graphics().setDepth(0);
    RoomBuilder.brick(g, 0x7b6b9e, 0x8677ab, 0x7566a0); RoomBuilder.floor(g, 0xa8703f, 0x8a5a30);
    [380, 900].forEach(x => RoomBuilder.torch(s, x, 330)); [110, 1190].forEach(x => RoomBuilder.banner(s, x)); } },
  forest: { obstacle: 'hole', draw(s) { const g = s.add.graphics().setDepth(0);
    RoomBuilder.sky(g, 0x7fd4ff, 0xdff6ff); g.fillStyle(0xffe066).fillCircle(1100, 110, 60);
    [[200, 90], [700, 60], [950, 150]].forEach(([x, y]) => g.fillStyle(0xffffff, 0.9).fillEllipse(x, y, 160, 50).fillEllipse(x + 40, y - 20, 100, 50));
    g.fillStyle(0x6fcf6f).fillEllipse(300, 540, 900, 300).fillEllipse(1000, 550, 800, 260);
    [90, 420, 880, 1200].forEach(x => { g.fillStyle(0x8a5a30).fillRect(x - 14, 380, 28, 150); g.fillStyle(0x3fae54).fillCircle(x, 350, 70).fillCircle(x - 40, 395, 50).fillCircle(x + 40, 395, 50); });
    g.fillStyle(0x58c25a).fillRect(0, 510, 1280, 210);
    for (let i = 0; i < 40; i++) g.fillStyle(Phaser.Utils.Array.GetRandom([0xff7fb0, 0xffffff, 0xffd23f, 0xb46be0])).fillCircle(Phaser.Math.Between(20, 1260), Phaser.Math.Between(530, 710), 6); } },
  dungeon: { obstacle: 'monster', draw(s) { const g = s.add.graphics().setDepth(0);
    RoomBuilder.brick(g, 0x4d5b7a, 0x55648a, 0x4a5876); RoomBuilder.floor(g, 0x6b6f8a, 0x555a75);
    [160, 640, 1000].forEach((x, i) => { g.lineStyle(6, 0x9aa5c0).lineBetween(x, 0, x, 90 + i * 25); for (let y = 10; y < 90 + i * 25; y += 22) g.strokeCircle(x, y, 7); });
    g.lineStyle(6, 0xb8c4d6).strokeRoundedRect(1090, 200, 110, 130, 10); for (let x = 1112; x < 1200; x += 22) g.lineBetween(x, 200, x, 330);
    [380, 900].forEach(x => RoomBuilder.torch(s, x, 330)); } },
  tower: { obstacle: 'wall', draw(s) { const g = s.add.graphics().setDepth(0);
    RoomBuilder.sky(g, 0x1d1b4a, 0x5b3fa0); for (let i = 0; i < 70; i++) g.fillStyle(0xffffff, 0.4 + Math.random() * 0.6).fillCircle(Math.random() * 1280, Math.random() * 500, 1 + Math.random() * 2.5);
    g.fillStyle(0xfff3b0).fillCircle(1080, 130, 50).fillStyle(0x2c2a66).fillCircle(1100, 118, 44);
    [160, 1180].forEach(x => { g.fillStyle(0x3a3880).fillRoundedRect(x - 60, 230, 120, 250, { tl: 60, tr: 60, bl: 0, br: 0 }); g.fillStyle(0xffd23f).fillCircle(x, 300, 6).fillCircle(x + 20, 350, 4); });
    RoomBuilder.floor(g, 0x6a5f8a, 0x4d4470);
    const d = s.add.text(330, 380, '🐉', { fontSize: '90px' }).setAlpha(0.6).setDepth(1); s.tweens.add({ targets: d, y: 360, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.inOut' }); } },
  well: { obstacle: 'descent', vertical: true, draw(s) { const g = s.add.graphics().setDepth(0); // pozo: se baja de plataforma en plataforma
    RoomBuilder.brick(g, 0x3f4d70, 0x4a5a82, 0x435275); RoomBuilder.floor(g, 0x6b6f8a, 0x555a75);
    [90, 640, 1190].forEach(x => { g.lineStyle(8, 0x9a7a4a).lineBetween(x, 0, x, 190); g.fillStyle(0x9a7a4a).fillCircle(x, 195, 10); });
    [470, 790].forEach(x => RoomBuilder.torch(s, x, 380)); } },
  boss: { draw(s) { const g = s.add.graphics().setDepth(0);
    RoomBuilder.sky(g, 0x8a3f6b, 0xf59a5b); g.fillStyle(0x6b2f55).fillEllipse(200, 520, 700, 320).fillEllipse(1100, 520, 700, 300);
    RoomBuilder.floor(g, 0x7a4a5a, 0x5e3347);
    [[60, 640], [140, 690], [1180, 650], [1230, 700], [1120, 700]].forEach(([x, y]) => { g.fillStyle(0xffd23f).fillCircle(x, y, 26).fillStyle(0xffe98a).fillCircle(x - 6, y - 6, 10); });
    [380, 900].forEach(x => RoomBuilder.torch(s, x, 330)); } }
};
