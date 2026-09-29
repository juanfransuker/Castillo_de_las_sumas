// Cada dificultad = lista de "tiers" (uno por puerta). Ajusta rangos aquí.
// ops: pesos (%) · min/max: rango de operandos (cifras) · carry: false=sin llevadas, true=con llevadas (60%)
// maxResult: tope del resultado · fmin/fmax: factores/divisor · qmin/qmax: cociente · negative: permite negativos
const DifficultyManager = {
  tiers: {
    easy: [
      { ops: { addition: 70, subtraction: 30 }, min: 1, max: 5, maxResult: 9 },
      { ops: { addition: 50, subtraction: 50 }, min: 1, max: 9, maxResult: 10 },
      { ops: { addition: 50, subtraction: 50 }, min: 2, max: 9, maxResult: 18 }
    ],
    medium: [
      { ops: { addition: 50, subtraction: 50 }, min: 10, max: 49, carry: false },
      { ops: { addition: 40, subtraction: 40, multiplication: 20 }, min: 12, max: 89, carry: true, fmin: 2, fmax: 5 },
      { ops: { addition: 30, subtraction: 30, multiplication: 40 }, min: 20, max: 99, carry: true, fmin: 2, fmax: 9 }
    ],
    hard: [
      { ops: { addition: 25, subtraction: 25, multiplication: 25, division: 25 }, min: 100, max: 499, carry: false, fmin: 2, fmax: 9, qmin: 2, qmax: 9 },
      { ops: { addition: 25, subtraction: 25, multiplication: 25, division: 25 }, min: 100, max: 899, carry: true, fmin: 3, fmax: 9, qmin: 3, qmax: 12 },
      { ops: { addition: 20, subtraction: 20, multiplication: 30, division: 30 }, min: 200, max: 999, carry: true, fmin: 6, fmax: 12, qmin: 5, qmax: 12 }
    ]
  },
  get(diff, round) { const t = this.tiers[diff]; return t[Math.min(round, t.length - 1)]; }
};
