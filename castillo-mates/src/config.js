const CONFIG = {
  W: 1280, H: 720, SAVE_KEY: 'castillo-mates-v1', ROUNDS: 3, UNLOCK_STARS: 2,
  OPS_PER_ROOM: 3,
  BOSS: { hits: 5, time: { easy: 75, medium: 60, hard: 60 } },
  FONT: '"Trebuchet MS","Comic Sans MS",Arial,sans-serif',
  // walk: salto/balanceo/velocidad al caminar · idle: respiración · cheer: estilo de celebración · tints: color de partículas
  CHARACTERS: [
    { id: 'knight', name: 'Caballero', trait: '🗡️ Espada', color: 0x4a90e2, attack: 'sword', cheer: 'spin', cheerFx: '🗡️', hurtFx: '💫',
      walk: { hop: 16, dur: 160, sway: 0, speed: 1.6 }, idle: { sy: 1.04, sx: 0.98, dur: 700 }, tints: [0xffffff, 0xbfe3ff, 0xffd23f] },
    { id: 'warrior', name: 'Guerrera', trait: '🪓 Hacha', color: 0xe94f8b, attack: 'axe', cheer: 'stomp', cheerFx: '💪', hurtFx: '😤',
      walk: { hop: 8, dur: 220, sway: 4, speed: 1.9 }, idle: { sy: 1.03, sx: 1.02, dur: 900 }, tints: [0xff7fb0, 0xffd23f, 0xffffff] },
    { id: 'princess', name: 'Princesa', trait: '✨ Magia', color: 0xb46be0, attack: 'magic', cheer: 'twirl', cheerFx: '💖', hurtFx: '😢',
      walk: { hop: 26, dur: 270, sway: 6, speed: 1.7 }, idle: { sy: 1.02, sx: 0.99, dur: 1100, bob: 8 }, tints: [0xb46be0, 0xffffff, 0xff7fb0] },
    { id: 'dragon', name: 'Dragón', trait: '🔥 Fuego', color: 0x4cc36b, attack: 'fire', cheer: 'flap', cheerFx: '🔥', hurtFx: '💨',
      walk: { hop: 12, dur: 150, sway: 10, speed: 2 }, idle: { sy: 1.06, sx: 0.96, dur: 450 }, tints: [0xff8a1f, 0xffe066, 0xff5a3c] }
  ],
  DIFFS: [
    { id: 'easy', name: 'Fácil', color: 0x4cc36b, icon: '🌱' },
    { id: 'medium', name: 'Medio', color: 0xf5a623, icon: '⚔️' },
    { id: 'hard', name: 'Difícil', color: 0xe94f4f, icon: '🐉' }
  ],
  PRAISE: ['¡Genial!', '¡Muy bien!', '¡Lo has conseguido!', '¡Fantástico!'],
  RETRY: ['¡Casi!', 'Prueba otra vez', 'Vamos a pensarlo']
};
