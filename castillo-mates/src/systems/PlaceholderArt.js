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
