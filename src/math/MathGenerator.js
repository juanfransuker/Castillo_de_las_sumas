const MathGenerator = {
  rand(a, b, rng) { return a + Math.floor(rng() * (b - a + 1)); },
  pick(w, rng) {
    const keys = Object.keys(w); let r = rng() * keys.reduce((s, k) => s + w[k], 0);
    for (const k of keys) { r -= w[k]; if (r <= 0) return k; }
    return keys[0];
  },
  shuffle(a, rng) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  hasCarry(a, b) { while (a || b) { if (a % 10 + b % 10 >= 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; },
  hasBorrow(a, b) { while (b) { if (a % 10 < b % 10) return true; a = Math.floor(a / 10); b = Math.floor(b / 10); } return false; },

  generate(diff, round = 0, rng = Math.random) {
    const cfg = DifficultyManager.get(diff, round);
    const kind = this.pick(cfg.ops, rng);
    const need = cfg.carry === true && rng() < 0.6;
    const p = this[kind](cfg, rng, need);
    p.kind = kind; p.options = this.options(p.answer, rng); p.hint = this.hint(p);
    return p;
  },
  addition(cfg, rng, need) {
    let a, b, n = 0;
    do {
      a = this.rand(cfg.min, cfg.max, rng); b = this.rand(cfg.min, cfg.max, rng); n++;
      const c = this.hasCarry(a, b);
      var ok = !(cfg.maxResult && a + b > cfg.maxResult) && !(cfg.carry === false && c) && !(need && !c);
    } while (!ok && n < 80);
    return { a, b, text: `${a} + ${b}`, answer: a + b };
  },
  subtraction(cfg, rng, need) {
    let a, b, n = 0;
    do {
      a = this.rand(cfg.min, cfg.max, rng); b = this.rand(cfg.min, cfg.max, rng); n++;
      if (!cfg.negative && b > a) [a, b] = [b, a];
      const c = this.hasBorrow(a, b);
      var ok = a - b >= (cfg.min >= 10 ? 3 : 1) && !(cfg.carry === false && c) && !(need && !c);
    } while (!ok && n < 80);
    return { a, b, text: `${a} - ${b}`, answer: a - b };
  },
  multiplication(cfg, rng) {
    const a = this.rand(cfg.fmin || 2, cfg.fmax || 5, rng), b = this.rand(cfg.fmin || 2, cfg.fmax || 5, rng);
    return { a, b, text: `${a} × ${b}`, answer: a * b };
  },
  division(cfg, rng) {
    const b = this.rand(cfg.fmin || 2, cfg.fmax || 5, rng), q = this.rand(cfg.qmin || 2, cfg.qmax || 9, rng);
    return { a: b * q, b, text: `${b * q} ÷ ${b}`, answer: q };
  },
  options(ans, rng) {
    const set = new Set([ans]);
    const offs = this.shuffle(ans > 20 ? [1, 2, 10, -10, 5, -1, -2] : [1, 2, -1, -2, 3, -3], rng);
    for (const o of offs) if (set.size < 3 && ans + o >= 0) set.add(ans + o);
    for (let k = 1; set.size < 3; k++) set.add(ans + k);
    return this.shuffle([...set], rng);
  },
  hint(p) {
    const A = '🍎';
    if (p.kind === 'addition') return p.a <= 10 && p.b <= 10 && p.a + p.b <= 12 ? A.repeat(p.a) + '  +  ' + A.repeat(p.b) : '¿Cuántos hay en total?';
    if (p.kind === 'subtraction') return p.a <= 12 ? A.repeat(p.a - p.b) + '❌'.repeat(p.b) : '¿Cuántos quedan?';
    if (p.kind === 'multiplication') return `${p.a} grupos de ${p.b}`;
    return `Reparte ${p.a} en grupos de ${p.b}`;
  }
};
