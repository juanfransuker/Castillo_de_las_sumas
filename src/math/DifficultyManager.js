// Cada dificultad tiene 6 tiers (de más fácil a más difícil). La partida avanza por ellos según el progreso
// (sala + operación dentro de la sala; el jefe usa los últimos) y se corrige con la adaptación (-1/0/+1).
// ops: pesos (%) · min/max: rango de operandos · carry: false=sin llevadas, true=con llevadas (60%) · maxResult: tope de la suma
// fmin/fmax: factores (× y divisor) · qmin/qmax: cociente (÷, siempre exacta) · negative: permite resultados negativos
const DifficultyManager = {
  tiers: {
    easy: [
      { ops: { addition: 80, subtraction: 20 }, min: 1, max: 5, maxResult: 5 },
      { ops: { addition: 65, subtraction: 35 }, min: 1, max: 5, maxResult: 9 },
      { ops: { addition: 55, subtraction: 45 }, min: 1, max: 9, maxResult: 10 },
      { ops: { addition: 50, subtraction: 50 }, min: 2, max: 9, maxResult: 14 },
      { ops: { addition: 50, subtraction: 50 }, min: 2, max: 9, maxResult: 18 },
      { ops: { addition: 50, subtraction: 50 }, min: 3, max: 12, maxResult: 20 }
    ],
    medium: [
      { ops: { addition: 50, subtraction: 50 }, min: 10, max: 49, carry: false },
      { ops: { addition: 60, subtraction: 40 }, min: 10, max: 69, carry: true },
      { ops: { addition: 35, subtraction: 35, multiplication: 30 }, min: 10, max: 59, carry: true, fmin: 2, fmax: 5 },
      { ops: { addition: 30, subtraction: 30, multiplication: 40 }, min: 20, max: 89, carry: true, fmin: 2, fmax: 7 },
      { ops: { addition: 25, subtraction: 25, multiplication: 50 }, min: 30, max: 99, carry: true, fmin: 3, fmax: 9 },
      { ops: { addition: 25, subtraction: 25, multiplication: 50 }, min: 40, max: 99, carry: true, fmin: 4, fmax: 10 }
    ],
    hard: [
      { ops: { addition: 25, subtraction: 25, multiplication: 25, division: 25 }, min: 100, max: 399, carry: false, fmin: 2, fmax: 5, qmin: 2, qmax: 5 },
      { ops: { addition: 25, subtraction: 25, multiplication: 25, division: 25 }, min: 100, max: 599, carry: true, fmin: 2, fmax: 9, qmin: 2, qmax: 9 },
      { ops: { addition: 20, subtraction: 20, multiplication: 30, division: 30 }, min: 100, max: 799, carry: true, fmin: 3, fmax: 9, qmin: 3, qmax: 12 },
      { ops: { addition: 20, subtraction: 20, multiplication: 30, division: 30 }, min: 150, max: 899, carry: true, fmin: 4, fmax: 12, qmin: 4, qmax: 12 },
      { ops: { addition: 20, subtraction: 20, multiplication: 30, division: 30 }, min: 200, max: 999, carry: true, fmin: 6, fmax: 12, qmin: 5, qmax: 12 },
      { ops: { addition: 15, subtraction: 15, multiplication: 35, division: 35 }, min: 300, max: 999, carry: true, fmin: 7, fmax: 12, qmin: 6, qmax: 15 }
    ]
  },
  get(diff, tier) { const t = this.tiers[diff]; return t[Math.max(0, Math.min(tier, t.length - 1))]; },
  // progress 0..1 (+ adaptación) -> índice de tier
  tierFor(diff, progress, adapt = 0) {
    const T = this.tiers[diff].length;
    return Math.max(0, Math.min(T - 1, Math.round(progress * (T - 1)) + adapt));
  }
};
