const ProgressManager = {
  data: null,
  defaults() {
    return { character: 'knight', difficulty: 'easy', stars: { easy: 0, medium: 0, hard: 0 }, coins: 0,
      unlocked: { easy: true, medium: false, hard: false }, completed: 0, items: [] };
  },
  load() {
    let s = null; try { s = JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY)); } catch (e) {}
    this.data = Object.assign(this.defaults(), s || {});
    if (this.data.character === 'knightess') this.data.character = 'warrior';
    return this.data;
  },
  save() { try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(this.data)); } catch (e) {} },
  set(k, v) { this.data[k] = v; this.save(); },
  // Devuelve el nombre de la dificultad recién desbloqueada (o null)
  record(diff, stars, coins) {
    const d = this.data; d.stars[diff] = Math.max(d.stars[diff], stars); d.coins += coins; d.completed++;
    const i = CONFIG.DIFFS.findIndex(x => x.id === diff), next = CONFIG.DIFFS[i + 1];
    let unlocked = null;
    if (next && stars >= CONFIG.UNLOCK_STARS && !d.unlocked[next.id]) { d.unlocked[next.id] = true; unlocked = next.name; }
    this.save(); return unlocked;
  }
};
