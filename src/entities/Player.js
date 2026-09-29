// Toda la animación va por tweens sobre una sola imagen con clave 'char_<id>':
// para usar sprite sheets reales basta con cambiar la creación de this.sprite.
class Player {
  constructor(scene, x, y, charId) {
    this.scene = scene; this.def = CONFIG.CHARACTERS.find(c => c.id === charId) || CONFIG.CHARACTERS[0]; this.baseY = y;
    this.shadow = scene.add.ellipse(x, y + 2, 120, 24, 0x000000, 0.25).setDepth(6);
    this.sprite = scene.add.image(x, y, 'char_' + this.def.id).setOrigin(0.5, 1).setDepth(7);
    this.idle();
  }
  update() { this.shadow.x = this.sprite.x; }
  stop() { this.scene.tweens.killTweensOf(this.sprite); this.sprite.setScale(1).setAngle(0).setDepth(7).y = this.baseY; this.hold = false; }
  idle() {
    this.stop(); const i = this.def.idle, s = this.sprite;
    this.scene.tweens.add({ targets: s, scaleY: { from: 1, to: i.sy }, scaleX: { from: 1, to: i.sx }, duration: i.dur, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    if (i.bob) this.scene.tweens.add({ targets: s, y: this.baseY - i.bob, duration: i.dur, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
  }
  walkTo(x, cb) {
    this.stop(); const s = this.sprite, w = this.def.walk; s.setFlipX(x < s.x);
    this.scene.tweens.add({ targets: s, y: this.baseY - w.hop, duration: w.dur, yoyo: true, repeat: -1, ease: 'Sine.out' });
    if (w.sway) this.scene.tweens.add({ targets: s, angle: { from: -w.sway, to: w.sway }, duration: w.dur, yoyo: true, repeat: -1 });
    this.scene.tweens.add({ targets: s, x, duration: Math.abs(x - s.x) * w.speed + 100, ease: 'Linear', onComplete: () => { this.idle(); cb && cb(); } });
  }
  fx(emoji, up) { // emoji flotante sobre el personaje
    const e = this.scene.add.text(this.sprite.x, this.baseY - up, emoji, { fontSize: '60px' }).setOrigin(0.5).setDepth(40);
    this.scene.tweens.add({ targets: e, y: e.y - 60, alpha: 0, duration: 1000, onComplete: () => e.destroy() });
  }
  celebrate(cb) { // cada personaje celebra a su manera (def.cheer)
    this.stop(); const s = this.sprite, by = this.baseY, st = this.def.cheer, tw = this.scene.tweens; let dur;
    if (st === 'spin') { dur = 650; tw.add({ targets: s, y: by - 100, duration: 300, yoyo: true, ease: 'Quad.out' }); tw.add({ targets: s, angle: 360, duration: 600 }); }
    else if (st === 'stomp') {
      dur = 800; this.seq([{ y: by - 70, duration: 170, ease: 'Quad.out' }, { y: by, duration: 170, ease: 'Quad.in' }, { y: by - 90, duration: 190, ease: 'Quad.out' }, { y: by, duration: 190, ease: 'Quad.in' }]);
      this.scene.time.delayedCall(340, () => this.scene.cameras.main.shake(100, 0.004)); this.scene.time.delayedCall(720, () => this.scene.cameras.main.shake(140, 0.006));
    } else if (st === 'twirl') { dur = 950; tw.add({ targets: s, y: by - 70, duration: 450, yoyo: true, ease: 'Sine.inOut' }); tw.add({ targets: s, angle: 720, scale: 1.12, duration: 900, ease: 'Sine.inOut' }); }
    else { dur = 750; tw.add({ targets: s, y: by - 120, duration: 350, yoyo: true, ease: 'Quad.out' }); tw.add({ targets: s, scaleX: { from: 1, to: 0.7 }, duration: 60, yoyo: true, repeat: 5 }); }
    burst(this.scene, s.x, by - 150, this.def.tints, 26); this.fx(this.def.cheerFx, 260);
    this.scene.time.delayedCall(dur, () => { this.idle(); cb && cb(); });
  }
  oops() {
    if (this.hold) { this.scene.tweens.add({ targets: this.sprite, angle: { from: -10, to: 10 }, duration: 90, yoyo: true, repeat: 3, onComplete: () => this.sprite.setAngle(0) }); return; }
    this.stop();
    this.scene.tweens.add({ targets: this.sprite, angle: { from: -10, to: 10 }, scaleY: 0.9, duration: 90, yoyo: true, repeat: 3, onComplete: () => this.idle() });
    const q = this.scene.add.text(this.sprite.x, this.baseY - 250, '❓', { fontSize: '60px' }).setOrigin(0.5).setDepth(40);
    this.scene.tweens.add({ targets: q, y: q.y - 40, alpha: 0, duration: 900, onComplete: () => q.destroy() });
  }
  attack(targetX, cb) {
    this.stop();
    const s = this.sprite, homeX = s.x, a = this.def.attack, melee = a === 'sword' || a === 'shield' || a === 'axe';
    const emoji = { sword: '🗡️', shield: '🛡️', axe: '🪓', magic: '✨', fire: '🔥' }[a];
    const d = targetX > s.x ? 1 : -1; s.setFlipX(d < 0); AudioManager.sfx('attack');
    const hit = () => {
      burst(this.scene, targetX, this.baseY - 70, this.def.tints, 10); if (a === 'fire') this.scene.cameras.main.shake(100, 0.004);
      const e = this.scene.add.text(targetX, this.baseY - 70, emoji, { fontSize: a === 'axe' ? '130px' : '90px' }).setOrigin(0.5).setDepth(40);
      this.scene.tweens.add({ targets: e, scale: { from: 0.4, to: 1.8 }, alpha: { from: 1, to: 0 }, angle: melee ? 90 : 0, duration: 400, onComplete: () => e.destroy() });
      cb && cb();
    };
    if (melee) {
      this.scene.tweens.add({ targets: s, x: targetX - 150 * d, duration: 280, ease: 'Back.in', onComplete: () => {
        hit(); this.scene.tweens.add({ targets: s, x: homeX, duration: 400, delay: 150, onComplete: () => this.idle() }); } });
    } else {
      this.scene.tweens.add({ targets: s, scaleX: 0.9, scaleY: 1.1, duration: 150, yoyo: true, onComplete: () => this.idle() });
      const p = this.scene.add.text(s.x + 70 * d, this.baseY - 130, emoji, { fontSize: a === 'fire' ? '95px' : '70px' }).setOrigin(0.5).setDepth(40);
      this.scene.tweens.add({ targets: p, x: targetX, angle: 360, duration: 350, delay: 150, onComplete: () => { p.destroy(); hit(); } });
    }
  }
  seq(steps, cb) {
    const run = i => i >= steps.length ? cb && cb() : this.scene.tweens.add(Object.assign({ targets: this.sprite, onComplete: () => run(i + 1) }, steps[i]));
    run(0);
  }
  jump(x, cb) { // saltar un agujero
    this.stop(); const s = this.sprite; s.setFlipX(x < s.x); s.setDepth(12); AudioManager.sfx('jump');
    this.scene.tweens.add({ targets: s, y: this.baseY - 200, duration: 380, yoyo: true, ease: 'Quad.out' });
    this.scene.tweens.add({ targets: s, angle: 360, duration: 760 });
    this.scene.tweens.add({ targets: s, x, duration: 760, onComplete: () => { burst(this.scene, x, this.baseY, [0xd9b38c, 0xffffff], 12); this.idle(); cb && cb(); } });
  }
  finishClimb(wallX, h, cb) { // termina de subir, cruza la cima y baja por el otro lado
    const y0 = this.baseY, d = wallX > this.sprite.x ? 1 : -1; this.sprite.setDepth(12).setFlipX(d < 0); AudioManager.sfx('jump');
    this.seq([{ y: y0 - h, angle: -8, duration: 300 }, { x: wallX, angle: 0, duration: 350 }, { x: wallX + 130 * d, y: y0, duration: 450, ease: 'Quad.in' }],
      () => { burst(this.scene, this.sprite.x, y0, [0xd9b38c, 0xffffff], 12); this.idle(); cb && cb(); });
  }
  hurt(cb) { // te alcanza un ataque: parpadeo rojo y empujón
    const s = this.sprite, hx = s.x, f = s.flipX ? -1 : 1;
    AudioManager.sfx('wrong'); this.scene.cameras.main.shake(150, 0.006); s.setTint(0xff8080);
    const e = this.scene.add.text(hx, s.y - 250, this.def.hurtFx, { fontSize: '56px' }).setOrigin(0.5).setDepth(40);
    this.scene.tweens.add({ targets: e, y: e.y - 40, alpha: 0, duration: 900, onComplete: () => e.destroy() });
    this.scene.tweens.add({ targets: s, x: hx - 35 * f, angle: { from: -12, to: 12 }, duration: 90, yoyo: true, repeat: 2,
      onComplete: () => { s.x = hx; s.setAngle(0).clearTint(); cb && cb(); } });
  }
  hopTo(x, y, cb) { // saltar a otra plataforma (salas verticales)
    this.stop(); const s = this.sprite; s.setDepth(12).setFlipX(x < s.x); AudioManager.sfx('jump');
    this.scene.tweens.add({ targets: s, x, duration: 800 });
    this.seq([{ y: Math.min(s.y, y) - 120, duration: 350, ease: 'Quad.out' }, { y, duration: 450, ease: 'Quad.in' }],
      () => { this.baseY = y; this.shadow.y = y + 2; burst(this.scene, x, y, [0xd9b38c, 0xffffff], 10); this.idle(); cb && cb(); });
  }
  exit(cb) {
    this.stop(); burst(this.scene, this.sprite.x, this.sprite.y - 100, this.def.tints, 12);
    this.scene.tweens.add({ targets: [this.sprite, this.shadow], alpha: 0, duration: 350, onComplete: cb });
    this.scene.tweens.add({ targets: this.sprite, scale: 0.5, duration: 350 });
  }
}
