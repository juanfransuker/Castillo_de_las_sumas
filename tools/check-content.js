// Uso: node tools/check-content.js -> verifica que cada zona referencia fondos, texturas y aspectos que existen.
const fs = require('fs'), vm = require('vm'), path = require('path'), rd = f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const ctx = { Phaser: { Utils: { Array: { Shuffle: a => a, GetRandom: a => a[0] } } } }; vm.createContext(ctx);
for (const f of ['config.js', 'systems/RoomBuilder.js', 'entities/Door.js', 'entities/Obstacle.js']) vm.runInContext(rd(f), ctx);
const get = n => vm.runInContext(n, ctx), CF = get('CONFIG'), TH = get('THEMES'), DS = get('DOOR_SKINS'), WS = get('WALL_SKINS'), HS = get('HOLE_SKINS'), BT = get('BLOCK_TINTS');
const tex = new Set([...rd('systems/PlaceholderArt.js').matchAll(/mk\('(\w+)'/g)].map(m => m[1])); tex.add('rock');
const gs = rd('scenes/GameScene.js'), ok = [];
let bad = 0; const need = (c, m) => { if (!c) { bad++; console.log('FALTA:', m); } };
CF.ZONES.forEach(z => {
  need(TH[z.bg], `${z.id}: fondo ${z.bg}`); need(tex.has(z.boss), `${z.id}: jefe ${z.boss}`); need(gs.includes(z.boss + ':'), `${z.id}: ataque de ${z.boss}`);
  z.monsters.forEach(m => need(tex.has(m), `${z.id}: monstruo ${m}`)); need(tex.has(z.block) && BT[z.block], `${z.id}: bloque ${z.block}`);
  need(DS[z.door], `${z.id}: puerta ${z.door}`); need(HS[z.hole], `${z.id}: agujero ${z.hole}`); need(WS[z.wall], `${z.id}: pared ${z.wall}`);
  z.rooms.forEach(r => need(['door', 'hole', 'monster', 'wall', 'descent'].includes(r), `${z.id}: obstáculo ${r}`));
  console.log(`${z.icon} ${z.name.padEnd(16)} fondo:${z.bg.padEnd(10)} salas:${z.rooms.join('/').padEnd(22)} monstruos:${z.monsters.join(',').padEnd(24)} jefe:${z.boss}`);
});
console.log(bad ? `\n${bad} problemas` : '\nTodo correcto');
