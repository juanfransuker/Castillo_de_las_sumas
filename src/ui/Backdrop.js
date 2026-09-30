function drawBackdrop(scene, castle) {
  const g = scene.add.graphics();
  g.fillGradientStyle(0x5b3fa0, 0x5b3fa0, 0xf59ac0, 0xf59ac0, 1).fillRect(0, 0, CONFIG.W, CONFIG.H);
  for (let i = 0; i < 40; i++) g.fillStyle(0xffffff, 0.3 + Math.random() * 0.5).fillCircle(Math.random() * 1280, Math.random() * 380, 1 + Math.random() * 2.5);
  if (castle) {
    g.fillStyle(0x3a2a6a).fillRect(300, 440, 680, 280).fillRect(250, 370, 120, 350).fillRect(910, 370, 120, 350).fillRect(560, 340, 160, 380);
    g.fillStyle(0xd94a4a).fillTriangle(240, 370, 310, 280, 380, 370).fillTriangle(900, 370, 970, 280, 1040, 370).fillTriangle(550, 340, 640, 240, 730, 340);
    g.fillStyle(0xffd23f).fillRoundedRect(295, 410, 30, 46, { tl: 15, tr: 15, bl: 0, br: 0 }).fillRoundedRect(955, 410, 30, 46, { tl: 15, tr: 15, bl: 0, br: 0 }).fillRoundedRect(625, 390, 30, 46, { tl: 15, tr: 15, bl: 0, br: 0 });
    g.fillStyle(0xffd23f).fillRoundedRect(590, 560, 100, 160, { tl: 50, tr: 50, bl: 0, br: 0 });
  }
}
function title(scene, y, text, size = 72) {
  return scene.add.text(640, y, text, { fontFamily: CONFIG.FONT, fontSize: size + 'px', fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 10, align: 'center' }).setOrigin(0.5);
}
