const PlaceholderArt = {
  build(scene) { CONFIG.CHARACTERS.forEach(c => this.character(scene, c)); this.star(scene); this.rock(scene); this.monsters(scene); },
  gfx(scene) { return scene.make.graphics({ x: 0, y: 0, add: false }); },
  character(scene, c) {
    const key = 'char_' + c.id; if (scene.textures.exists(key)) return;
    const g = this.gfx(scene), W = 180, H = 240, cx = 90, dragon = c.id === 'dragon';
    const skin = dragon ? 0x6fdc8c : 0xffd9b3;
    if (dragon) { // alas y cola
      g.fillStyle(0xff9f43).fillTriangle(30, 150, 0, 90, 55, 130).fillTriangle(150, 150, 180, 90, 125, 130);
      g.fillStyle(0x4cc36b).fillTriangle(140, 215, 178, 190, 150, 170);
    }
    if (c.id === 'princess') g.fillStyle(0xf7c948).fillEllipse(cx, 112, 126, 112);
    if (c.id === 'warrior') { g.fillStyle(0xc0562f).fillEllipse(cx, 108, 118, 100).fillCircle(cx - 64, 140, 16).fillCircle(cx - 64, 165, 13).fillCircle(cx + 64, 140, 16).fillCircle(cx + 64, 165, 13); }
    g.fillStyle(0x4a3a2a).fillEllipse(65, H - 12, 46, 22).fillEllipse(115, H - 12, 46, 22);
    if (c.id === 'princess') g.fillStyle(c.color).fillTriangle(cx - 66, H - 16, cx + 66, H - 16, cx, 122);
    else g.fillStyle(c.color).fillRoundedRect(cx - 45, 128, 90, 96, 28);
    if (c.id === 'warrior') g.fillStyle(0xb8c4d6).fillCircle(cx - 48, 136, 20).fillCircle(cx + 48, 136, 20);
    if (dragon) g.fillStyle(0xfff0c2).fillEllipse(cx, 178, 52, 66);
    g.fillStyle(skin).fillCircle(cx - 56, 178, 15).fillCircle(cx + 56, 178, 15); // manos
    if (dragon) g.fillStyle(0xfff0c2).fillTriangle(cx - 38, 62, cx - 28, 26, cx - 12, 56).fillTriangle(cx + 38, 62, cx + 28, 26, cx + 12, 56);
    g.fillStyle(skin).fillCircle(cx, 100, 52);
    if (dragon) g.fillStyle(0x9af0ae).fillEllipse(cx, 120, 50, 30);
    if (c.id === 'knight') {
      g.fillStyle(0xb8c4d6).fillRoundedRect(cx - 54, 46, 108, 42, { tl: 40, tr: 40, bl: 6, br: 6 });
      g.fillStyle(c.id === 'knight' ? 0xe94f4f : 0xff7fb0).fillEllipse(cx, 40, 26, 36);
    }
    if (c.id === 'princess') {
      g.fillStyle(0xffd23f).fillRect(cx - 36, 52, 72, 18).fillTriangle(cx - 36, 52, cx - 26, 28, cx - 16, 52)
        .fillTriangle(cx - 10, 52, cx, 24, cx + 10, 52).fillTriangle(cx + 16, 52, cx + 26, 28, cx + 36, 52);
    }
    if (c.id === 'warrior') { g.fillStyle(0xe94f4f).fillRect(cx - 46, 66, 92, 16); g.fillStyle(0xffd23f).fillCircle(cx, 74, 8); }
    g.fillStyle(0xffffff).fillCircle(cx - 20, 104, 13).fillCircle(cx + 20, 104, 13);
    g.fillStyle(0x2a1f45).fillCircle(cx - 18, 106, 6).fillCircle(cx + 22, 106, 6);
    g.fillStyle(0xff8fa3, 0.6).fillEllipse(cx - 38, 122, 16, 10).fillEllipse(cx + 38, 122, 16, 10);
    g.lineStyle(4, 0x7a3b2e).beginPath().arc(cx, 116, 15, 0.2, Math.PI - 0.2).strokePath();
    if (c.id === 'knight') { // espada (derecha) y escudo (izquierda)
      g.fillStyle(0xdfe6f0).fillRect(cx + 58, 112, 8, 68).fillTriangle(cx + 58, 112, cx + 66, 112, cx + 62, 98); g.fillStyle(0xffd23f).fillRect(cx + 50, 176, 24, 7);
      g.fillStyle(0x2f6fbd).fillCircle(cx - 62, 172, 28).lineStyle(4, 0xffd23f).strokeCircle(cx - 62, 172, 28); g.fillStyle(0xffd23f).fillCircle(cx - 62, 172, 8);
    }
    if (c.id === 'warrior') { g.fillStyle(0x8a5a30).fillRect(cx + 58, 105, 7, 82); g.fillStyle(0xb8c4d6).fillTriangle(cx + 65, 108, cx + 87, 100, cx + 65, 138); }
    if (c.id === 'princess') { g.fillStyle(0xffd23f).fillRect(cx + 59, 122, 5, 58).fillCircle(cx + 61, 112, 13); g.fillStyle(0xff7fb0).fillCircle(cx + 61, 112, 6); }
    if (c.id === 'dragon') g.fillStyle(0xffd23f).fillTriangle(cx - 50, 88, cx - 70, 82, cx - 52, 106).fillTriangle(cx + 50, 88, cx + 70, 82, cx + 52, 106);
    g.generateTexture(key, W, H); g.destroy();
  },
  monsters(scene) {
    const mk = (key, w, h, fn) => { if (scene.textures.exists(key)) return; const g = this.gfx(scene); fn(g); g.generateTexture(key, w, h); g.destroy(); };
    const eyes = (g, cx, cy, d) => { g.fillStyle(0xffffff).fillCircle(cx - d, cy, 13).fillCircle(cx + d, cy, 13); g.fillStyle(0x2a1f45).fillCircle(cx - d + 2, cy + 2, 6).fillCircle(cx + d + 2, cy + 2, 6); };
    const smile = (g, x, y, r) => g.lineStyle(4, 0x2a1f45).beginPath().arc(x, y, r, 0.3, Math.PI - 0.3).strokePath();
    mk('slime', 140, 110, g => { g.fillStyle(0x5fd66f).fillRoundedRect(5, 25, 130, 85, { tl: 65, tr: 65, bl: 25, br: 25 }); g.fillStyle(0xa6f0ae).fillEllipse(45, 48, 34, 16); eyes(g, 70, 70, 22); smile(g, 70, 80, 14); });
    mk('ghost', 120, 140, g => { g.fillStyle(0xf2f2ff).fillRoundedRect(10, 10, 100, 110, { tl: 50, tr: 50, bl: 0, br: 0 }); [25, 55, 85].forEach(x => g.fillCircle(x + 5, 120, 17)); eyes(g, 60, 55, 20); smile(g, 60, 72, 10); });
    mk('bat', 150, 100, g => { g.fillStyle(0x7a5cc8).fillTriangle(0, 20, 60, 50, 40, 90).fillTriangle(150, 20, 90, 50, 110, 90).fillCircle(75, 55, 40).fillTriangle(48, 28, 55, 0, 68, 24).fillTriangle(102, 28, 95, 0, 82, 24); eyes(g, 75, 52, 15); smile(g, 75, 66, 10); });
    mk('goblin', 130, 150, g => { g.fillStyle(0x8f5a2a).fillRoundedRect(35, 90, 60, 55, 18); g.fillStyle(0x7ed957).fillTriangle(5, 60, 35, 50, 38, 85).fillTriangle(125, 60, 95, 50, 92, 85).fillCircle(65, 65, 42); eyes(g, 65, 62, 16); smile(g, 65, 78, 10); });
    mk('golem', 140, 130, g => { g.fillStyle(0x9aa3b5).fillRoundedRect(10, 15, 120, 115, { tl: 40, tr: 40, bl: 14, br: 14 }); g.fillStyle(0x6fb56f).fillEllipse(40, 28, 40, 16); eyes(g, 70, 65, 22); smile(g, 70, 85, 14); });
    mk('boss_slime', 260, 235, g => { g.fillStyle(0x5fd66f).fillRoundedRect(10, 60, 240, 175, { tl: 120, tr: 120, bl: 40, br: 40 }); g.fillStyle(0xa6f0ae).fillEllipse(75, 105, 60, 26);
      g.fillStyle(0xffd23f).fillRect(85, 40, 90, 26).fillTriangle(85, 40, 95, 8, 110, 40).fillTriangle(115, 40, 130, 0, 145, 40).fillTriangle(150, 40, 165, 8, 175, 40); eyes(g, 130, 135, 34); smile(g, 130, 165, 30); });
    mk('boss_golem', 260, 235, g => { g.fillStyle(0x8f98a8).fillRoundedRect(60, 70, 140, 140, 24).fillRoundedRect(10, 90, 58, 110, 20).fillRoundedRect(192, 90, 58, 110, 20).fillRoundedRect(75, 200, 50, 35, 10).fillRoundedRect(135, 200, 50, 35, 10).fillRoundedRect(85, 10, 90, 80, 26);
      g.fillStyle(0x6fb56f).fillEllipse(110, 75, 50, 18); g.fillStyle(0xffd23f).fillCircle(112, 45, 13).fillCircle(148, 45, 13); g.fillStyle(0x2a1f45).fillCircle(114, 47, 6).fillCircle(150, 47, 6); smile(g, 130, 62, 14); });
    const slime = (c, h) => g => { g.fillStyle(c).fillRoundedRect(5, 25, 130, 85, { tl: 65, tr: 65, bl: 25, br: 25 }); g.fillStyle(h).fillEllipse(45, 48, 34, 16); eyes(g, 70, 70, 22); smile(g, 70, 80, 14); };
    mk('goldslime', 140, 110, slime(0xf2c230, 0xffe98a)); mk('purpleslime', 140, 110, slime(0xa06be0, 0xd8b0ff));
    mk('mushroom', 130, 140, g => { g.fillStyle(0xf3e3c3).fillRoundedRect(35, 70, 60, 65, 18); g.fillStyle(0xe94f4f).fillRoundedRect(5, 8, 120, 70, { tl: 60, tr: 60, bl: 12, br: 12 }); g.fillStyle(0xffffff).fillCircle(35, 38, 10).fillCircle(68, 24, 9).fillCircle(98, 42, 10); eyes(g, 65, 100, 14); smile(g, 65, 112, 10); });
    mk('pumpkin', 130, 120, g => { g.fillStyle(0xff9f43).fillEllipse(65, 72, 122, 96); g.lineStyle(4, 0xd97a1f).lineBetween(45, 30, 40, 112).lineBetween(85, 30, 90, 112).lineBetween(65, 26, 65, 118); g.fillStyle(0x58c25a).fillRect(60, 6, 10, 24); eyes(g, 65, 68, 20); smile(g, 65, 84, 18); });
    mk('armor', 120, 160, g => { g.fillStyle(0xe94f4f).fillEllipse(60, 12, 26, 36); g.fillStyle(0xb8c4d6).fillRoundedRect(22, 80, 76, 68, 18).fillEllipse(35, 150, 40, 18).fillEllipse(85, 150, 40, 18).fillCircle(60, 50, 40); g.fillStyle(0x2a1f45).fillRoundedRect(36, 42, 48, 18, 8); g.fillStyle(0xffe066).fillCircle(50, 51, 6).fillCircle(70, 51, 6); g.fillStyle(0xffd23f).fillCircle(60, 110, 9); });
    mk('book', 140, 120, g => { g.fillStyle(0xffffff).fillTriangle(0, 30, 22, 50, 18, 90).fillTriangle(140, 30, 118, 50, 122, 90); g.fillStyle(0x8e5bd6).fillRoundedRect(20, 14, 100, 96, 10); g.fillStyle(0xfff3d6).fillRect(28, 22, 84, 80); g.lineStyle(3, 0xc9b98a).lineBetween(70, 22, 70, 102); eyes(g, 70, 56, 22); smile(g, 70, 72, 14); });
    mk('owl', 120, 150, g => { g.fillStyle(0x5b3fa0).fillTriangle(22, 48, 98, 48, 60, 0); g.fillStyle(0xffd23f).fillCircle(60, 30, 7); g.fillStyle(0x8a5a30).fillEllipse(60, 100, 100, 100); g.fillStyle(0xf3e3c3).fillEllipse(60, 115, 60, 70); g.fillStyle(0x5b3fa0).fillEllipse(60, 50, 116, 22); eyes(g, 60, 78, 20); g.fillStyle(0xff9f43).fillTriangle(54, 92, 66, 92, 60, 104); });
    mk('mimic', 140, 110, g => { g.fillStyle(0x8a5a30).fillRoundedRect(5, 50, 130, 58, 10); g.fillStyle(0xa8703f).fillRoundedRect(5, 8, 130, 50, { tl: 50, tr: 50, bl: 4, br: 4 }); g.fillStyle(0xffd23f).fillRect(60, 8, 20, 100); g.fillStyle(0xff8fa3).fillEllipse(70, 62, 50, 22); g.fillStyle(0xffffff); for (let x = 15; x < 125; x += 22) g.fillTriangle(x, 54, x + 16, 54, x + 8, 68); eyes(g, 70, 32, 24); });
    mk('bush', 150, 120, g => { g.fillStyle(0x3fae54).fillCircle(45, 78, 40).fillCircle(105, 78, 40).fillCircle(75, 52, 46); g.fillStyle(0x58c25a).fillEllipse(60, 40, 40, 16); eyes(g, 75, 72, 22); smile(g, 75, 88, 14); });
    mk('books', 140, 110, g => { g.fillStyle(0xe94f4f).fillRoundedRect(10, 72, 120, 32, 6); g.fillStyle(0x3fa7f5).fillRoundedRect(22, 42, 100, 32, 6); g.fillStyle(0x58c25a).fillRoundedRect(14, 12, 110, 32, 6); g.fillStyle(0xffffff).fillCircle(58, 58, 8).fillCircle(86, 58, 8); g.fillStyle(0x2a1f45).fillCircle(60, 60, 4).fillCircle(88, 60, 4); });
    mk('barrel', 120, 120, g => { g.fillStyle(0x9a5b2e).fillRoundedRect(10, 8, 100, 108, { tl: 30, tr: 30, bl: 24, br: 24 }); g.fillStyle(0x5e3a1a).fillRect(10, 30, 100, 8).fillRect(10, 88, 100, 8); eyes(g, 60, 62, 18); smile(g, 60, 74, 12); });
    mk('chest', 140, 110, g => { g.fillStyle(0x8a5a30).fillRoundedRect(8, 48, 124, 58, 8); g.fillStyle(0xa8703f).fillRoundedRect(8, 12, 124, 44, { tl: 50, tr: 50, bl: 4, br: 4 }); g.fillStyle(0xffd23f).fillRect(56, 12, 28, 94).fillCircle(70, 62, 12); g.fillStyle(0x2a1f45).fillCircle(70, 62, 4); });
    mk('boss_goblin', 260, 235, g => { g.fillStyle(0x8f5a2a).fillRoundedRect(75, 125, 110, 105, 26); g.fillStyle(0x7ed957).fillTriangle(10, 100, 70, 65, 64, 125).fillTriangle(250, 100, 190, 65, 196, 125).fillCircle(130, 105, 66); g.fillStyle(0xffd23f).fillRect(95, 36, 70, 22).fillTriangle(95, 36, 105, 8, 118, 36).fillTriangle(120, 36, 130, 0, 140, 36).fillTriangle(142, 36, 155, 8, 165, 36); eyes(g, 130, 100, 26); smile(g, 130, 122, 28); g.fillStyle(0xffffff).fillTriangle(105, 140, 115, 158, 125, 140).fillTriangle(135, 140, 145, 158, 155, 140); });
    mk('boss_armor', 260, 235, g => { g.fillStyle(0xb8c4d6).fillRoundedRect(60, 95, 140, 130, 26).fillCircle(52, 115, 30).fillCircle(208, 115, 30).fillRoundedRect(75, 200, 50, 35, 10).fillRoundedRect(135, 200, 50, 35, 10); g.fillStyle(0xcfd8e6).fillRoundedRect(85, 12, 90, 90, 30); g.fillStyle(0xe94f4f).fillEllipse(130, 10, 30, 44); g.fillStyle(0x2a1f45).fillRoundedRect(98, 52, 64, 20, 10); g.fillStyle(0xffe066).fillCircle(115, 62, 8).fillCircle(145, 62, 8); g.fillStyle(0xffd23f).fillCircle(130, 150, 16); g.fillStyle(0xdfe6f0).fillRect(222, 40, 14, 150).fillTriangle(222, 40, 236, 40, 229, 22); });
    mk('boss_book', 260, 235, g => { g.fillStyle(0xffffff).fillTriangle(30, 110, 0, 70, 30, 160).fillTriangle(230, 110, 260, 70, 230, 160); g.fillStyle(0x8e5bd6).fillRoundedRect(30, 30, 200, 195, 16); g.fillStyle(0xffd23f).fillRoundedRect(30, 30, 200, 14, 8); g.fillStyle(0xfff3d6).fillRect(46, 54, 168, 158); g.lineStyle(4, 0xc9b98a).lineBetween(130, 54, 130, 212); eyes(g, 130, 110, 38); smile(g, 130, 150, 34); g.fillStyle(0xe94f4f).fillRect(170, 212, 16, 22); });
    mk('boss_mimic', 260, 235, g => { g.fillStyle(0x8a5a30).fillRoundedRect(20, 120, 220, 112, 16); g.fillStyle(0xa8703f).fillRoundedRect(20, 25, 220, 100, { tl: 100, tr: 100, bl: 8, br: 8 }); g.fillStyle(0xffd23f).fillRect(108, 25, 44, 207); g.fillStyle(0xff8fa3).fillEllipse(130, 140, 110, 42); g.fillStyle(0xffffff); for (let x = 30; x < 220; x += 36) g.fillTriangle(x, 122, x + 26, 122, x + 13, 150); eyes(g, 130, 72, 44); g.fillStyle(0xffd23f).fillCircle(40, 228, 12).fillCircle(220, 228, 12).fillCircle(70, 232, 12).fillCircle(190, 232, 12); });
    mk('boss_wizard', 260, 235, g => { g.fillStyle(0x6a4bc0).fillTriangle(40, 232, 220, 232, 130, 90); g.fillStyle(0xffd9b3).fillCircle(130, 100, 44); g.fillStyle(0xf2f2ff).fillTriangle(92, 108, 168, 108, 130, 185); g.fillStyle(0x5b3fa0).fillTriangle(72, 80, 188, 80, 130, 2).fillEllipse(130, 80, 150, 26); g.fillStyle(0xffd23f).fillCircle(130, 48, 9); eyes(g, 130, 96, 16); g.fillStyle(0x8a5a30).fillRect(225, 60, 10, 172); g.fillStyle(0x7fe0ff).fillCircle(230, 52, 20); });
    mk('boss', 260, 235, g => {
      g.fillStyle(0x8e5bd6).fillTriangle(30, 120, 0, 40, 90, 90).fillTriangle(230, 120, 260, 40, 170, 90);
      g.fillStyle(0xff9f43).fillCircle(130, 140, 90).fillEllipse(90, 225, 60, 24).fillEllipse(170, 225, 60, 24);
      g.fillStyle(0xfff0c2).fillEllipse(130, 175, 92, 80).fillTriangle(80, 70, 90, 20, 115, 62).fillTriangle(180, 70, 170, 20, 145, 62);
      eyes(g, 130, 115, 30); g.fillStyle(0xff8fa3, 0.6).fillEllipse(75, 150, 24, 14).fillEllipse(185, 150, 24, 14); smile(g, 130, 140, 26);
    });
  },
  star(scene) {
    if (scene.textures.exists('star')) return;
    const g = this.gfx(scene), pts = [];
    for (let i = 0; i < 10; i++) { const r = i % 2 ? 12 : 30, a = -Math.PI / 2 + i * Math.PI / 5; pts.push({ x: 32 + r * Math.cos(a), y: 34 + r * Math.sin(a) }); }
    g.fillStyle(0xffffff).fillPoints(pts, true); g.generateTexture('star', 64, 64); g.destroy();
  },
  rock(scene) {
    if (scene.textures.exists('rock')) return;
    const g = this.gfx(scene);
    g.fillStyle(0x7d8794).fillRoundedRect(0, 20, 140, 92, { tl: 60, tr: 60, bl: 18, br: 18 });
    g.fillStyle(0xa2adba).fillEllipse(50, 44, 40, 20);
    g.fillStyle(0xffffff).fillCircle(50, 72, 10).fillCircle(90, 72, 10);
    g.fillStyle(0x2a1f45).fillCircle(52, 74, 5).fillCircle(92, 74, 5);
    g.lineStyle(4, 0x2a1f45).beginPath().arc(70, 84, 12, 0.3, Math.PI - 0.3).strokePath();
    g.generateTexture('rock', 140, 112); g.destroy();
  }
};
