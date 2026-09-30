const CONFIG = {
  W: 1280, H: 720, SAVE_KEY: 'castillo-mates-v1', ROUNDS: 3, UNLOCK_AFTER_ZONES: 2, // zonas completadas para abrir la siguiente dificultad
  // Mapa: cada zona tiene su fondo (bg), sus obstáculos (rooms = tipo de obstáculo de cada sala), sus monstruos y su jefe.
  // block: lo que bloquea la puerta · door/hole/wall: aspecto de cada obstáculo · ledge: plataformas del pozo · extraHits: golpes extra al jefe
  ZONES: [
    { id: 'entrada', name: 'Entrada', icon: '🌲', bg: 'entrada', rooms: ['hole', 'monster', 'door'], monsters: ['slime', 'mushroom'], boss: 'boss_slime', block: 'bush', door: 'gate', hole: 'river', wall: 'hedge' },
    { id: 'patio', name: 'Patio', icon: '⛲', bg: 'patio', rooms: ['wall', 'monster', 'door'], monsters: ['goblin', 'pumpkin'], boss: 'boss_goblin', block: 'barrel', door: 'wood', hole: 'pit', wall: 'hedge' },
    { id: 'salon', name: 'Gran Salón', icon: '🕯️', bg: 'salon', rooms: ['door', 'hole', 'monster'], monsters: ['armor', 'ghost'], boss: 'boss_armor', block: 'barrel', door: 'royal', hole: 'pit', wall: 'stone' },
    { id: 'biblioteca', name: 'Biblioteca', icon: '📚', bg: 'biblioteca', rooms: ['wall', 'descent', 'monster'], monsters: ['book', 'ghost'], boss: 'boss_book', block: 'books', door: 'wood', hole: 'pit', wall: 'shelf', ledge: [0xa8703f, 0xc78a4a] },
    { id: 'mazmorras', name: 'Mazmorras', icon: '⛓️', bg: 'mazmorras', rooms: ['monster', 'hole', 'descent'], monsters: ['golem', 'bat'], boss: 'boss_golem', block: 'rock', door: 'bars', hole: 'pit', wall: 'stone' },
    { id: 'torre', name: 'Torre', icon: '🗼', bg: 'torre', rooms: ['wall', 'descent', 'monster'], monsters: ['owl', 'bat'], boss: 'boss', block: 'rock', door: 'gate', hole: 'pit', wall: 'tower', ledge: [0x7f87a8, 0x9aa3c8] },
    { id: 'tesoro', name: 'Sala del Tesoro', icon: '💰', bg: 'tesoro', rooms: ['door', 'wall', 'monster'], monsters: ['mimic', 'goldslime'], boss: 'boss_mimic', block: 'chest', door: 'vault', hole: 'pit', wall: 'gold', ledge: [0xd9b34a, 0xffd23f] },
    { id: 'final', name: 'Jefe final', icon: '👑', bg: 'final', rooms: ['descent', 'door', 'monster'], monsters: ['purpleslime', 'ghost', 'golem'], boss: 'boss_wizard', block: 'rock', door: 'magic', hole: 'pit', wall: 'tower', ledge: [0xb46be0, 0xd8b0ff], extraHits: 3 }
  ],
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
    { id: 'easy', name: 'Fácil', color: 0x4cc36b, icon: '🌱', examples: '3 + 4   ·   7 − 2' },
    { id: 'medium', name: 'Medio', color: 0xf5a623, icon: '⚔️', examples: '23 + 14   ·   3 × 4' },
    { id: 'hard', name: 'Difícil', color: 0xe94f4f, icon: '🐉', examples: '248 + 137   ·   72 ÷ 9' }
  ],
  PRAISE: ['¡Genial!', '¡Muy bien!', '¡Lo has conseguido!', '¡Fantástico!'],
  RETRY: ['¡Casi!', 'Prueba otra vez', 'Vamos a pensarlo']
};
