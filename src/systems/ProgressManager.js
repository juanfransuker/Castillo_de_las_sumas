const ProgressManager = {
  data: null,
  defaults() {
    return { character: 'knight', difficulty: 'easy', stars: { easy: 0, medium: 0, hard: 0 }, coins: 0,
      unlocked: { easy: true, medium: false, hard: false }, completed: 0, items: [], map: { easy: [], medium: [], hard: [] } };
  },
  load() {
    let s = null; try { s = JSON.parse(localStorage.getItem(CONFIG.SAVE_KEY)); } catch (e) {}
    this.data = Object.assign(this.defaults(), s || {});
    if (this.data.character === 'knightess') this.data.character = 'warrior';
    return this.data;
  },
  save() { try { localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(this.data)); } catch (e) {} },
  set(k, v) { this.data[k] = v; this.save(); },
  zoneStars(diff, i) { return (this.data.map[diff] || [])[i] || 0; },
  zonesDone(diff) { return CONFIG.ZONES.filter((_, i) => this.zoneStars(diff, i) > 0).length; },
  zoneUnlocked(diff, i) { return i === 0 || this.zoneStars(diff, i - 1) > 0; },
  // Guarda el resultado de una zona. Devuelve el nombre de la dificultad recién desbloqueada (o null).
  record(diff, zone, stars, coins) {
    const d = this.data; d.map[diff] = d.map[diff] || [];
    d.map[diff][zone] = Math.max(d.map[diff][zone] || 0, stars); d.coins += coins; d.completed++;
    const i = CONFIG.DIFFS.findIndex(x => x.id === diff), next = CONFIG.DIFFS[i + 1];
    let unlocked = null;
    if (next && this.zonesDone(diff) >= CONFIG.UNLOCK_AFTER_ZONES && !d.unlocked[next.id]) { d.unlocked[next.id] = true; unlocked = next.name; }
    this.save(); return unlocked;
  }
};
