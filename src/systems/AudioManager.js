// Sonidos sintetizados con WebAudio: sin archivos externos. Sustituibles luego por assets/audio.
const AudioManager = {
  ctx: null, musicOn: true, playing: false, step: 0,
  unlock() {
    if (!this.ctx) {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      this.ctx = new A(); this.master = this.ctx.createGain(); this.master.gain.value = 0.5; this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
  },
  note(f, delay = 0, dur = 0.15, type = 'sine', vol = 0.25, f2) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  },
  sfx(n) {
    const S = {
      click: () => this.note(660, 0, 0.08, 'triangle'),
      correct: () => [523, 659, 784, 1047].forEach((f, i) => this.note(f, i * 0.09, 0.2, 'triangle', 0.3)),
      wrong: () => { this.note(320, 0, 0.18, 'sine', 0.25, 240); this.note(240, 0.16, 0.25, 'sine', 0.2, 200); },
      jump: () => this.note(300, 0, 0.3, 'sine', 0.2, 800),
      door: () => this.note(140, 0, 0.7, 'sawtooth', 0.15, 50),
      attack: () => this.note(600, 0, 0.25, 'square', 0.12, 120),
      reward: () => [880, 1108, 1318].forEach((f, i) => this.note(f, i * 0.1, 0.25, 'square', 0.12)),
      transition: () => this.note(300, 0, 0.5, 'triangle', 0.2, 900)
    };
    if (S[n]) S[n]();
  },
  startMusic() {
    if (this.playing || !this.ctx) return; this.playing = true;
    const mel = [523, 587, 659, 784, 659, 587, 523, 392];
    const tick = () => {
      if (!this.playing) return;
      if (this.musicOn) { this.note(mel[this.step % 8], 0, 0.35, 'sine', 0.06); if (this.step % 4 === 0) this.note(mel[this.step % 8] / 2, 0, 0.6, 'triangle', 0.05); }
      this.step++; setTimeout(tick, 420);
    };
    tick();
  }
};
