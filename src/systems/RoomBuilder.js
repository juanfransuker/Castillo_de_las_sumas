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
    if (s.__castle) { g.fillStyle(0xb6a9d8).fillRect(575, 300, 130, 180).fillRect(545, 270, 50, 210).fillRect(685, 270, 50, 210); g.fillStyle(0xd94a4a).fillTriangle(540, 270, 570, 215, 600, 270).fillTriangle(680, 270, 710, 215, 740, 270); g.fillStyle(0x7a6aa0).fillRoundedRect(615, 400, 50, 80, { tl: 25, tr: 25, bl: 0, br: 0 }); }
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
  entrada: { draw(s) { s.__castle = true; THEMES.forest.draw(s); } },
  patio: { draw(s) { const g = s.add.graphics().setDepth(0); RoomBuilder.sky(g, 0x7fd4ff, 0xdff6ff);
    g.fillStyle(0xb8a98a).fillRect(0, 250, 1280, 270); for (let x = 0; x < 1280; x += 80) g.fillRect(x, 215, 50, 40);
    [150, 1130].forEach(x => { g.fillStyle(0xa8997a).fillRect(x - 60, 120, 120, 400); g.fillStyle(0xd94a4a).fillTriangle(x - 80, 120, x, 40, x + 80, 120); });
    g.lineStyle(3, 0x9c8d70); for (let y = 290; y < 510; y += 44) g.lineBetween(0, y, 1280, y);
    g.fillStyle(0x6b5a48).fillRoundedRect(570, 330, 140, 190, { tl: 70, tr: 70, bl: 0, br: 0 });
    g.fillStyle(0x9aa0a8).fillRect(0, 510, 1280, 210); g.lineStyle(3, 0x7d838c); for (let x = 0; x < 1280; x += 120) g.lineBetween(x, 516, x - 30, 720); [560, 620, 680].forEach(y => g.lineBetween(0, y, 1280, y));
    [330, 950].forEach(x => { g.fillStyle(0x9a5b2e).fillRoundedRect(x - 24, 478, 48, 34, 8); g.fillStyle(0x58c25a).fillCircle(x, 470, 20); g.fillStyle(0xff7fb0).fillCircle(x - 10, 462, 8).fillCircle(x + 10, 466, 8); });
    RoomBuilder.banner(s, 430, 0x3fa7f5); RoomBuilder.banner(s, 850, 0x3fa7f5); } },
  salon: { draw(s) { THEMES.castle.draw(s); const g = s.add.graphics().setDepth(1);
    [240, 1040].forEach(x => { g.fillStyle(0xaee1ff).fillRoundedRect(x - 50, 250, 100, 200, { tl: 50, tr: 50, bl: 0, br: 0 }); g.lineStyle(6, 0x5d4e7a).strokeRoundedRect(x - 50, 250, 100, 200, { tl: 50, tr: 50, bl: 0, br: 0 }).lineBetween(x, 250, x, 450).lineBetween(x - 50, 340, x + 50, 340); });
    g.fillStyle(0xc0392b).fillPoints([{ x: 200, y: 514 }, { x: 1080, y: 514 }, { x: 1250, y: 720 }, { x: 30, y: 720 }], true);
    g.lineStyle(6, 0xffd23f).lineBetween(200, 514, 30, 720).lineBetween(1080, 514, 1250, 720); } },
  biblioteca: { draw(s) { const g = s.add.graphics().setDepth(0); g.fillStyle(0x6b4a2e).fillRect(0, 0, 1280, 520); const pal = [0xe94f4f, 0x3fa7f5, 0xffd23f, 0x58c25a, 0xb46be0, 0xff9f43];
    [20, 270, 520, 770, 1020].forEach(x0 => { g.fillStyle(0x4a3020).fillRect(x0, 50, 230, 455);
      for (let r = 0; r < 4; r++) { const y = 70 + r * 108; for (let bx = x0 + 10; bx < x0 + 215; bx += 20) { const h = Phaser.Math.Between(50, 84); g.fillStyle(Phaser.Utils.Array.GetRandom(pal)).fillRect(bx, y + 88 - h, 16, h); } g.fillStyle(0x7a5232).fillRect(x0, y + 88, 230, 10); } });
    RoomBuilder.floor(g, 0x5a3a22, 0x3f2715); [380, 900].forEach(x => RoomBuilder.torch(s, x, 330)); } },
  mazmorras: { draw(s) { THEMES.dungeon.draw(s); } },
  torre: { draw(s) { THEMES.tower.draw(s); } },
  tesoro: { draw(s) { const g = s.add.graphics().setDepth(0); RoomBuilder.brick(g, 0x7a5a2a, 0x8a6a30, 0x7a5a2a); RoomBuilder.floor(g, 0xc79a3a, 0xa77a1f);
    for (let i = 0; i < 30; i++) { const x = Phaser.Math.Between(20, 1260), y = Phaser.Math.Between(30, 480); g.fillStyle(Phaser.Utils.Array.GetRandom([0x7fe0ff, 0xff7fb0, 0x8be08b, 0xffffff])).fillTriangle(x - 8, y, x + 8, y, x, y + 14); }
    [[110, 120], [1170, 120], [300, 70], [980, 80]].forEach(([x, w]) => { g.fillStyle(0xf2c230).fillEllipse(x, 540, w * 1.6, w * 0.6); g.fillStyle(0xffe98a); for (let k = 0; k < 6; k++) g.fillCircle(x - w / 2 + k * w / 5, 530 + (k % 2) * 10, 9); });
    [380, 900].forEach(x => RoomBuilder.torch(s, x, 330)); } },
  final: { draw(s) { const g = s.add.graphics().setDepth(0); RoomBuilder.sky(g, 0x3a1f70, 0xc05a9a);
    for (let i = 0; i < 70; i++) g.fillStyle(0xffffff, 0.4 + Math.random() * 0.6).fillCircle(Math.random() * 1280, Math.random() * 500, 1 + Math.random() * 2.5);
    [160, 1120].forEach(x => { g.fillStyle(0xd8c8ff).fillRect(x - 40, 120, 80, 390).fillStyle(0xffd23f).fillRect(x - 52, 100, 104, 26).fillRect(x - 52, 500, 104, 14); });
    [[420, 0x7fe0ff], [860, 0xff7fb0]].forEach(([x, c]) => g.fillStyle(c, 0.85).fillTriangle(x - 30, 510, x + 30, 510, x, 400));
    RoomBuilder.floor(g, 0x5b3fa0, 0x3f2a80);
    g.fillStyle(0x8e3fb0).fillPoints([{ x: 200, y: 514 }, { x: 1080, y: 514 }, { x: 1250, y: 720 }, { x: 30, y: 720 }], true);
    g.lineStyle(6, 0xffd23f).lineBetween(200, 514, 30, 720).lineBetween(1080, 514, 1250, 720); } },
  boss: { draw(s) { const g = s.add.graphics().setDepth(0);
    RoomBuilder.sky(g, 0x8a3f6b, 0xf59a5b); g.fillStyle(0x6b2f55).fillEllipse(200, 520, 700, 320).fillEllipse(1100, 520, 700, 300);
    RoomBuilder.floor(g, 0x7a4a5a, 0x5e3347);
    [[60, 640], [140, 690], [1180, 650], [1230, 700], [1120, 700]].forEach(([x, y]) => { g.fillStyle(0xffd23f).fillCircle(x, y, 26).fillStyle(0xffe98a).fillCircle(x - 6, y - 6, 10); });
    [380, 900].forEach(x => RoomBuilder.torch(s, x, 330)); } }
};
