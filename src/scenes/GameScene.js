// index 0-2: salas (obstáculo distinto en cada una) · index 3: jefe final a contrarreloj
const BOSS_ATTACK = { boss: '🔥', boss_slime: '💧', boss_golem: '🪨', boss_goblin: '🍅', boss_armor: '🗡️', boss_book: '📚', boss_mimic: '🪙', boss_wizard: '🔮' };
class GameScene extends Phaser.Scene {
  constructor() { super('Game'); }
  init(d) {
    this.index = d.index || 0; this.zone = d.zone || 0; this.order = CONFIG.ZONES[this.zone].rooms; this.bossHits = CONFIG.BOSS.hits + (CONFIG.ZONES[this.zone].extraHits || 0); this.stats = d.stats || { errors: 0, correct: 0, bossWon: false, streak: 0, lives: 3, adapt: 0 };
    const S = this.stats; if (!S.dirs) { S.dirs = [0, 1, 2, 3].map(() => Phaser.Utils.Array.GetRandom([1, -1])); S.boss = CONFIG.ZONES[this.zone].boss; }
    this.isBoss = this.index === 3; this.step = 0; this.wrongs = 0; this.locked = false; this.ended = false; this.timerOn = false; this.buttons = [];
  }
  create() {
    const P = ProgressManager.data; this.diff = P.difficulty;
    const zone = CONFIG.ZONES[this.zone], kind = this.isBoss ? 'boss' : this.order[this.index]; // kind = tipo de obstáculo de la sala
    this.vertical = kind === 'descent'; // sala de arriba a abajo
    this.dir = this.vertical ? 1 : this.stats.dirs[this.index]; // 1: izquierda→derecha, -1: derecha→izquierda
    this.X = x => (this.dir < 0 ? 1280 - x : x);
    THEMES[zone.bg].draw(this);
    this.obstacle = this.isBoss ? null : createObstacle(this, kind, zone);
    this.panel = new QuestionPanel(this, 640, 160);
    this.hud();
    if (this.vertical) {
      this.player = new Player(this, 200, 270, P.character); this.player.sprite.y = -300;
      this.tweens.add({ targets: this.player.sprite, y: 270, duration: 800, ease: 'Bounce.out', onComplete: () => { this.player.idle(); this.timerOn = true; } });
    } else {
      this.player = new Player(this, this.dir > 0 ? -120 : 1400, 545, P.character);
      this.player.walkTo(this.X(230), () => { this.timerOn = true; });
    }
    if (this.isBoss) this.startBoss();
    this.newQuestion();
    this.cameras.main.fadeIn(400);
  }
  update(t, dt) {
    this.player.update();
    if (this.isBoss && this.timerOn && !this.locked && !this.ended) { this.timeLeft -= dt / 1000; this.drawTimer(); if (this.timeLeft <= 0) this.timeUp(); }
  }
  hud() {
    const st = { fontFamily: CONFIG.FONT, fontStyle: 'bold', color: '#fff', stroke: '#3a2a55', strokeThickness: 5 };
    new AnswerButton(this, 62, 54, '🗺️', 0x6a5acd, () => this.scene.start('Map'), 100, 90, 46).setDepth(20);
    this.add.text(640, 14, this.isBoss ? (this.zone === CONFIG.ZONES.length - 1 ? '¡Jefe final!' : '¡Jefe de zona!') : `${CONFIG.ZONES[this.zone].name} · Sala ${this.index + 1} de ${CONFIG.ROUNDS}`, Object.assign({ fontSize: '30px' }, st)).setOrigin(0.5).setDepth(20);
    this.add.text(1230, 40, `🪙 ${ProgressManager.data.coins}`, Object.assign({ fontSize: '44px', strokeThickness: 6 }, st)).setOrigin(1, 0.5).setDepth(20);
    this.livesTxt = this.add.text(1230, 100, '', { fontSize: '46px' }).setOrigin(1, 0.5).setDepth(20); this.updateLives();
    if (!this.isBoss) { this.pipG = this.add.graphics().setDepth(20); this.updatePips(); }
    if (this.isBoss) { this.tbar = this.add.graphics().setDepth(20); this.add.text(365, 42, '⏱️', { fontSize: '26px' }).setOrigin(0.5).setDepth(20); }
  }
  startBoss() {
    this.boss = this.add.image(this.X(1010), 545, this.stats.boss).setOrigin(0.5, 1).setDepth(6);
    this.tweens.add({ targets: this.boss, scaleY: { from: 1, to: 0.93 }, duration: 500, yoyo: true, repeat: -1 });
    this.hp = this.bossHits; this.timeLeft = this.maxTime = CONFIG.BOSS.time[this.diff] * this.bossHits / CONFIG.BOSS.hits;
    this.hearts = this.add.text(this.X(1010), 282, '❤️'.repeat(this.hp), { fontSize: '40px' }).setOrigin(0.5).setDepth(8);
    this.drawTimer();
  }
  drawTimer() {
    const r = Math.max(0, this.timeLeft / this.maxTime), g = this.tbar; g.clear();
    g.fillStyle(0x000000, 0.35).fillRoundedRect(390, 36, 500, 14, 7);
    g.fillStyle(r > 0.5 ? 0x4cc36b : r > 0.25 ? 0xf5a623 : 0xe94f4f).fillRoundedRect(390, 36, Math.max(8, 500 * r), 14, 7);
  }
  newQuestion() {
    this.buttons.forEach(b => b.destroy());
    const N = CONFIG.OPS_PER_ROOM, H = this.bossHits; // progreso 0..1: las salas cubren hasta ~0.9 y el jefe usa los tiers más altos
    const prog = this.isBoss ? 0.75 + 0.25 * (H - this.hp) / Math.max(1, H - 1) : (this.index * N + this.step) / (3 * N);
    const zp = 0.5 * this.zone / (CONFIG.ZONES.length - 1); // el mapa avanza la dificultad: media curva entre zonas, media dentro de cada zona
    const tier = DifficultyManager.tierFor(this.diff, zp + 0.5 * Math.min(1, prog), this.stats.adapt || 0);
    this.q = MathGenerator.generate(this.diff, tier); this.hinted = false; this.locked = false; this.wrongs = 0; this.panel.setQuestion(this.q.text);
    this.tweens.add({ targets: this.panel.c, scale: { from: 0.85, to: 1 }, duration: 250, ease: 'Back.out' });
    const cols = [0x3fa7f5, 0xf5a623, 0xb46be0];
    this.buttons = this.q.options.map((v, i) => { const b = new AnswerButton(this, 370 + i * 270, 635, String(v), cols[i], b => this.onAnswer(b), 240, 130, 76); b.value = v; b.setDepth(10); b.setScale(0); this.tweens.add({ targets: b, scale: 1, duration: 300, delay: i * 80, ease: 'Back.out' }); return b; });
  }
  onAnswer(btn) {
    if (this.locked || this.ended) return;
    AudioManager.sfx('click');
    btn.value === this.q.answer ? this.correct(btn) : this.wrong(btn);
  }
  correct(btn) {
    this.locked = true; this.stats.correct++;
    this.buttons.forEach(b => b !== btn && b.disable());
    btn.markCorrect(); AudioManager.sfx('correct');
    this.panel.say(Phaser.Utils.Array.GetRandom(CONFIG.PRAISE), '#2e9e4f', 46);
    this.reward();
    if (this.isBoss) return this.hitBoss();
    const o = this.obstacle, p = this.player;
    if (this.step < CONFIG.OPS_PER_ROOM - 1) { // operación intermedia: avanza el obstáculo, sin resolverlo aún
      burst(this, p.sprite.x, p.baseY - 150, [0xffd23f, 0xff7fb0], 14);
      return this.time.delayedCall(300, () => o.progress(p, this.step, () => { this.step++; this.updatePips(); this.newQuestion(); }));
    }
    this.step++; this.updatePips();
    const go = () => o.solve(p, () => p.walkTo(o.exitX, () => p.exit(() => this.next())));
    if (o.skipCheer) { burst(this, p.sprite.x, p.baseY - 150, [0xffd23f, 0xff7fb0, 0x6fdc8c, 0x6ec6ff], 26); this.time.delayedCall(300, go); }
    else p.celebrate(go);
  }
  wrong(btn) { // fallar = perder un corazón y recibir el "castigo" propio del obstáculo (sin bloquear el aprendizaje)
    this.locked = true; this.stats.errors++; this.stats.streak = 0; this.stats.lives--; this.wrongs++;
    if (this.wrongs === 2) this.stats.adapt = Math.max(-1, (this.stats.adapt || 0) - 1); // 2 fallos en la misma: baja un tier
    btn.markWrong(); AudioManager.sfx('wrong'); this.updateLives();
    if (!this.hinted) { this.hinted = true; this.panel.say(this.q.hint, '#6b4a2b', 38); }
    else this.panel.say(Phaser.Utils.Array.GetRandom(CONFIG.RETRY), '#c0562f', 44);
    if (this.wrongs >= 2) this.buttons.find(b => b.value === this.q.answer).pulse(); // tras 2 fallos, se resalta la buena
    const after = () => { if (this.stats.lives <= 0) this.loseRoom(); else this.locked = false; };
    this.isBoss ? this.bossPunish(after) : this.obstacle.punish(this.player, after);
  }
  reward() {
    const p = this.player, x = p.sprite.x; this.stats.streak++;
    if (this.stats.streak % 4 === 0) this.stats.adapt = Math.min(1, (this.stats.adapt || 0) + 1); // racha de 4: sube un tier
    this.floatText(x, p.baseY - 260, '+1 ⭐', '#ffd23f');
    if (this.stats.streak % 3 === 0 && this.stats.lives < 3) { this.stats.lives++; this.updateLives(); this.floatText(x - 60, p.baseY - 305, '+❤️', '#ff6b8b'); AudioManager.sfx('reward'); }
    if (this.stats.streak >= 2) this.floatText(x + 40, p.baseY - 215, `¡Racha x${this.stats.streak}!`, '#ff9fd0');
  }
  floatText(x, y, t, c) {
    const e = this.add.text(x, y, t, { fontFamily: CONFIG.FONT, fontSize: '52px', fontStyle: 'bold', color: c, stroke: '#3a2a55', strokeThickness: 7 }).setOrigin(0.5).setDepth(45);
    this.tweens.add({ targets: e, y: y - 70, alpha: 0, duration: 1100, onComplete: () => e.destroy() });
  }
  updateLives() { const l = Math.max(0, this.stats.lives); this.livesTxt.setText('❤️'.repeat(l) + '🖤'.repeat(3 - l)); }
  bossPunish(done) {
    const b = this.boss; this.tweens.add({ targets: b, angle: { from: -8, to: 8 }, duration: 80, yoyo: true, repeat: 2, onComplete: () => b.setAngle(0) });
    shootAt(this, b.x, b.y - 150, BOSS_ATTACK[this.stats.boss], this.player, done);
  }
  loseRoom() { // sin vidas: no hay "game over", se repite la sala con las 3 vidas
    this.ended = true; this.locked = true; this.buttons.forEach(b => b.disable());
    this.panel.say('¡Otra vez, tú puedes!', '#c0562f', 42);
    this.time.delayedCall(1500, () => {
      this.stats.lives = 3; this.stats.streak = 0; this.cameras.main.fadeOut(400);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.restart({ index: this.index, zone: this.zone, stats: this.stats }));
    });
  }
  updatePips() {
    const N = CONFIG.OPS_PER_ROOM, g = this.pipG; g.clear();
    for (let i = 0; i < N; i++) g.fillStyle(i < this.step ? 0xffd23f : 0xffffff, i < this.step ? 1 : 0.45).fillCircle(640 + (i - (N - 1) / 2) * 30, 47, 11).lineStyle(3, 0x3a2a55).strokeCircle(640 + (i - (N - 1) / 2) * 30, 47, 11);
  }
  hitBoss() {
    const p = this.player, b = this.boss;
    p.celebrate(() => p.attack(b.x - 40 * this.dir, () => {
      this.hp--; this.hearts.setText('❤️'.repeat(this.hp));
      burst(this, b.x, b.y - 120, [0xffd23f, 0xff7fb0], 18); b.setTint(0xffffff);
      this.tweens.add({ targets: b, x: { from: this.X(1010) - 15, to: this.X(1010) + 15 }, duration: 50, yoyo: true, repeat: 4, onComplete: () => { b.clearTint(); b.x = this.X(1010); } });
      this.time.delayedCall(900, () => this.hp <= 0 ? this.defeatBoss() : this.newQuestion());
    }));
  }
  defeatBoss() {
    this.ended = true; this.stats.bossWon = true; this.buttons.forEach(b => b.destroy());
    this.panel.say('¡Jefe derrotado!', '#2e9e4f', 46); AudioManager.sfx('reward');
    [0, 300, 600].forEach(d => this.time.delayedCall(d, () => burst(this, this.boss.x + Phaser.Math.Between(-60, 60), this.boss.y - 120, [0xffd23f, 0xffffff, 0xff7fb0], 20)));
    this.tweens.killTweensOf(this.boss);
    this.tweens.add({ targets: this.boss, x: this.X(1500), y: 200, angle: 540, alpha: 0, duration: 1000, delay: 500 });
    this.player.celebrate(); this.time.delayedCall(2200, () => this.next());
  }
  timeUp() {
    this.ended = true; this.locked = true; this.buttons.forEach(b => b.disable()); AudioManager.sfx('wrong');
    this.panel.say('¡Casi! ¡Prueba otra vez!', '#c0562f', 42);
    this.tweens.add({ targets: this.boss, angle: { from: -6, to: 6 }, duration: 120, yoyo: true, repeat: 5 });
    this.time.delayedCall(2200, () => this.next());
  }
  next() {
    AudioManager.sfx('transition'); this.cameras.main.fadeOut(400);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.index < 3) this.scene.restart({ index: this.index + 1, zone: this.zone, stats: this.stats });
      else this.scene.start('Result', { stats: this.stats, zone: this.zone });
    });
  }
}
