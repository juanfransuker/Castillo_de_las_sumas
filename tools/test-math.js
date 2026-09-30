// Uso: node tools/test-math.js  -> muestra ejemplos por dificultad y tier y valida miles de ejercicios.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ctx = {}; vm.createContext(ctx);
for (const f of ['config', 'math/DifficultyManager', 'math/MathGenerator']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../src', f + '.js'), 'utf8'), ctx);
const DM = vm.runInContext('DifficultyManager', ctx), MG = vm.runInContext('MathGenerator', ctx);
let bad = 0;
for (const d of ['easy', 'medium', 'hard']) {
  console.log(`\n== ${d} ==`);
  DM.tiers[d].forEach((_, t) => {
    let lo = 1e9, hi = -1e9; const ex = [];
    for (let i = 0; i < 3000; i++) {
      const p = MG.generate(d, t), v = eval(p.text.replace('×', '*').replace('÷', '/'));
      if (v !== p.answer || !Number.isInteger(v) || v < 0 || new Set(p.options).size !== 3 || !p.options.includes(p.answer) || p.options.some(o => o < 0)) bad++;
      if (p.kind === 'division' && p.a % p.b) bad++;
      lo = Math.min(lo, p.answer); hi = Math.max(hi, p.answer); if (i < 4) ex.push(p.text);
    }
    console.log(`tier ${t}: ${ex.join(' | ')}   (resultados ${lo}..${hi})`);
  });
}
const CF = vm.runInContext('CONFIG', ctx), Z = CF.ZONES.length;
console.log('\n== tier por zona (primera operación .. jefe) ==');
for (const d of ['easy', 'medium', 'hard']) console.log(d + ': ' + CF.ZONES.map((z, i) => { const zp = 0.5 * i / (Z - 1); return DM.tierFor(d, zp) + '..' + DM.tierFor(d, zp + 0.5); }).join('  '));
console.log('\nerrores:', bad);
