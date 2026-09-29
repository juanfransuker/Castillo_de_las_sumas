function burst(scene, x, y, tints, n = 24) {
  const e = scene.add.particles(x, y, 'star', { speed: { min: 150, max: 420 }, angle: { min: 0, max: 360 }, scale: { start: 0.7, end: 0 },
    lifespan: 900, gravityY: 350, tint: tints, emitting: false }).setDepth(50);
  e.explode(n); scene.time.delayedCall(1200, () => e.destroy());
}
function shootAt(scene, fx, fy, emoji, p, done) { // proyectil que te alcanza
  const e = scene.add.text(fx, fy, emoji, { fontSize: '60px' }).setOrigin(0.5).setDepth(40);
  scene.tweens.add({ targets: e, x: p.sprite.x, y: p.sprite.y - 100, angle: 540, duration: 500, onComplete: () => { e.destroy(); burst(scene, p.sprite.x, p.sprite.y - 100, [0xff8080, 0xffd23f], 10); p.hurt(done); } });
}
function dropOn(scene, p, emoji, done) { // algo cae sobre ti
  const e = scene.add.text(p.sprite.x, -40, emoji, { fontSize: '60px' }).setOrigin(0.5).setDepth(40);
  scene.tweens.add({ targets: e, y: p.sprite.y - 150, angle: 360, duration: 450, ease: 'Quad.in', onComplete: () => { e.destroy(); burst(scene, p.sprite.x, p.sprite.y - 150, [0xff8080, 0xffd23f], 10); p.hurt(done); } });
}
// Interfaz de cada obstáculo (una sala = CONFIG.OPS_PER_ROOM operaciones). scene.X(x) refleja la sala si va de derecha a izquierda.
//   progress(p, step, done): operaciones intermedias · solve(p, done): la última · punish(p, done): al fallar (el jugador pierde un corazón)
//   exitX = salida · skipCheer = sin salto de celebración antes de resolver.
const N_OPS = () => CONFIG.OPS_PER_ROOM;
class Rock {
  constructor(scene, x, y) { this.scene = scene; this.x = x; this.y = y; this.sprite = scene.add.image(x, y, 'rock').setOrigin(0.5, 1).setDepth(5); }
  hit(step) {
    burst(this.scene, this.x, this.y - 50, [0x7d8794, 0xa2adba], 8); this.scene.cameras.main.shake(120, 0.004);
    this.scene.tweens.add({ targets: this.sprite, scale: 1 - 0.12 * (step + 1), angle: { from: -6, to: 6 }, duration: 60, yoyo: true, repeat: 2, onComplete: () => this.sprite.setAngle(0) });
  }
  breakUp() {
    burst(this.scene, this.x, this.y - 50, [0x7d8794, 0xa2adba, 0xffffff], 20); this.scene.cameras.main.shake(180, 0.006);
    this.scene.tweens.add({ targets: this.sprite, scale: 1.3, alpha: 0, duration: 250, onComplete: () => this.sprite.destroy() });
  }
}
class DoorStage { // castillo: golpes a la roca y luego se abre la puerta
  constructor(scene) {
    this.scene = scene; this.exitX = scene.X(1100); this.door = new Door(scene, scene.X(1100), 545); this.rock = new Rock(scene, scene.X(620), 545);
    if (scene.dir < 0) this.door.c.setScale(-1, 1);
  }
  progress(p, step, done) { p.attack(this.rock.x, () => { this.rock.hit(step); this.scene.time.delayedCall(450, done); }); }
  solve(p, done) {
    p.attack(this.rock.x, () => { this.rock.breakUp();
      this.scene.time.delayedCall(400, () => { AudioManager.sfx('door'); this.door.shake(() => { this.door.open(); this.scene.time.delayedCall(500, done); }); }); });
  }
  punish(p, done) { // la roca te lanza una piedra
    const r = this.rock.sprite; this.scene.tweens.add({ targets: r, angle: { from: -8, to: 8 }, duration: 60, yoyo: true, repeat: 3, onComplete: () => r.setAngle(0) });
    shootAt(this.scene, this.rock.x, 470, '🪨', p, done);
  }
}
class Hole { // bosque: cada acierto coloca una piedra; al final salta. Si fallas, te caes
  constructor(scene) {
    this.scene = scene; this.exitX = scene.X(1180); this.skipCheer = true; const X = v => scene.X(v);
    const g = scene.add.graphics().setDepth(2);
    g.fillStyle(0x5a3a22).fillEllipse(X(650), 548, 270, 66).fillStyle(0x140d24).fillEllipse(X(650), 552, 236, 48);
    g.fillStyle(0xffffff, 0.15).fillEllipse(X(620), 546, 80, 12);
  }
  progress(p, step, done) {
    const sc = this.scene, x = sc.X(545 + (step + 1) * (210 / N_OPS())), st = sc.add.ellipse(x, -40, 64, 24, 0xa2adba).setStrokeStyle(4, 0x7d8794).setDepth(3);
    AudioManager.sfx('attack');
    sc.tweens.add({ targets: st, y: 552, duration: 500, ease: 'Bounce.out', onComplete: () => { burst(sc, x, 552, [0xd9b38c, 0xffffff], 8); sc.time.delayedCall(250, done); } });
  }
  solve(p, done) { p.walkTo(this.scene.X(470), () => p.jump(this.scene.X(830), done)); }
  punish(p, done) {
    const s = p.sprite, sc = this.scene, base = p.baseY;
    p.walkTo(sc.X(520), () => {
      sc.tweens.killTweensOf(s); s.setDepth(1); p.shadow.setVisible(false); AudioManager.sfx('wrong');
      sc.tweens.add({ targets: s, x: sc.X(650), duration: 300, onComplete: () => {
        sc.tweens.add({ targets: s, y: base + 90, scaleX: 0.6, scaleY: 0.6, alpha: 0, duration: 450, onComplete: () => {
          sc.cameras.main.shake(150, 0.006); s.setPosition(sc.X(230), -220).setAlpha(1).setScale(1).setDepth(7); p.shadow.setVisible(true);
          sc.tweens.add({ targets: s, y: base, duration: 700, ease: 'Bounce.out', onComplete: () => { p.idle(); done(); } }); } }); } });
    });
  }
}
class Monster { // mazmorra: varios golpes (corazones) y huye. Si fallas, te ataca
  constructor(scene) {
    this.scene = scene; this.exitX = scene.X(1180); this.x = scene.X(640); const key = Phaser.Utils.Array.GetRandom(['slime', 'ghost', 'bat', 'goblin', 'golem']);
    this.y = key === 'bat' ? 500 : 545;
    this.s = scene.add.image(this.x, this.y, key).setOrigin(0.5, 1).setDepth(6);
    this.hearts = scene.add.text(this.x, 380, '❤️'.repeat(N_OPS()), { fontSize: '34px' }).setOrigin(0.5).setDepth(8);
    scene.tweens.add({ targets: this.s, scaleY: { from: 1, to: 0.9 }, scaleX: { from: 1, to: 1.06 }, duration: 500, yoyo: true, repeat: -1 });
  }
  progress(p, step, done) {
    p.attack(this.x, () => {
      this.hearts.setText('❤️'.repeat(N_OPS() - 1 - step)); burst(this.scene, this.x, this.y - 50, [0xffd23f, 0xffffff], 10);
      this.scene.cameras.main.shake(120, 0.004); this.s.setTint(0xffffff);
      this.scene.tweens.add({ targets: this.s, x: { from: this.x - 14, to: this.x + 14 }, duration: 50, yoyo: true, repeat: 3, onComplete: () => { this.s.clearTint(); this.s.x = this.x; } });
      this.scene.time.delayedCall(550, done);
    });
  }
  solve(p, done) {
    p.attack(this.x, () => {
      this.hearts.setText(''); burst(this.scene, this.x, this.y - 50, [0xffd23f, 0xffffff, 0x6fdc8c], 20);
      this.scene.tweens.killTweensOf(this.s);
      this.scene.tweens.add({ targets: this.s, x: this.x + 500 * this.scene.dir, y: this.y - 250, angle: 720, alpha: 0, duration: 700, onComplete: () => this.scene.time.delayedCall(200, done) });
    });
  }
  punish(p, done) {
    AudioManager.sfx('attack');
    this.scene.tweens.add({ targets: this.s, x: this.x - 320 * this.scene.dir, duration: 260, yoyo: true, ease: 'Quad.in', onYoyo: () => p.hurt(done), onComplete: () => { this.s.x = this.x; } });
  }
}
class Wall { // torre: cada acierto sube un tramo; al final cruza la cima. Si fallas, te cae un ladrillo
  constructor(scene) {
    this.scene = scene; this.exitX = scene.X(1180); this.skipCheer = true; this.x = scene.X(780); this.climbed = false; const g = scene.add.graphics().setDepth(2), x = this.x;
    g.fillStyle(0x9a8ab8).fillRoundedRect(x - 80, 305, 160, 240, 10); g.lineStyle(3, 0x7c6c9c);
    for (let y = 340; y < 545; y += 40) g.lineBetween(x - 80, y, x + 80, y);
    for (let r = 0; r < 5; r++) for (let bx = x - 80 + (r % 2 ? 40 : 0); bx < x + 80; bx += 80) g.lineBetween(bx, 305 + r * 40 + 35, bx, 305 + r * 40 + 75);
    g.fillStyle(0xb8a9d6).fillRoundedRect(x - 92, 291, 184, 18, 8); g.fillStyle(0x58c25a).fillCircle(x - 60, 520, 18).fillCircle(x - 40, 535, 14);
  }
  progress(p, step, done) {
    const s = p.sprite, up = () => {
      this.climbed = true; p.hold = true; s.setDepth(9); this.scene.tweens.killTweensOf(s); s.setScale(1); AudioManager.sfx('jump');
      this.scene.tweens.add({ targets: s, angle: { from: -8, to: 8 }, duration: 110, yoyo: true, repeat: 1 });
      this.scene.tweens.add({ targets: s, y: p.baseY - 60 * (step + 1), duration: 450, onComplete: () => { s.setAngle(0); done(); } });
    };
    step === 0 ? p.walkTo(this.scene.X(650), up) : up();
  }
  solve(p, done) { this.climbed ? p.finishClimb(this.x, 250, done) : p.walkTo(this.scene.X(650), () => p.finishClimb(this.x, 250, done)); }
  punish(p, done) { dropOn(this.scene, p, '🧱', done); }
}
class Descent { // pozo (sala vertical): cada acierto baja una plataforma; al final salta al suelo
  constructor(scene) {
    this.scene = scene; this.exitX = 1180; this.skipCheer = true; const g = scene.add.graphics().setDepth(2);
    for (let i = 0; i < N_OPS(); i++) { const t = this.pos(i); g.fillStyle(0x9a8ab8).fillRoundedRect(t.x - 140, t.y, 280, 30, 8).fillStyle(0xb8a9d6).fillRoundedRect(t.x - 140, t.y, 280, 10, 6); }
  }
  pos(i) { return { x: i % 2 ? 1080 : 200, y: 270 + Math.round(i * 275 / N_OPS()) }; }
  progress(p, step, done) { const t = this.pos(step + 1); p.hopTo(t.x, t.y, done); }
  solve(p, done) { p.hopTo(700, 545, done); }
  punish(p, done) { dropOn(this.scene, p, '🪨', done); }
}
function createObstacle(scene, kind) { return new ({ door: DoorStage, hole: Hole, monster: Monster, wall: Wall, descent: Descent })[kind](scene); }
