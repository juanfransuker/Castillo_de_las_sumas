# El Castillo de los Números — Fase 1 + salas variadas y jefe final
Abrir: doble clic en `index.html`, o servir la carpeta: `python3 -m http.server 8080` y visitar http://localhost:8080
Sin dependencias ni build: Phaser 3.90 va en `lib/`. Datos de progreso en localStorage (`castillo-mates-v1`).
Ajustar dificultad: `src/math/DifficultyManager.js`. Arte provisional: `src/systems/PlaceholderArt.js`.
Cada partida: 3 salas (obstáculos distintos: puerta+roca, agujero, monstruo, pared; 3 de 4 al azar) + jefe final con cronómetro (CONFIG.BOSS).
Fase 2: cada sala tiene CONFIG.OPS_PER_ROOM operaciones (el obstáculo avanza con cada acierto), racha, '+1 ⭐', pistas tras 2 fallos.
Fase 2b: 3 vidas (❤️), castigos por obstáculo, salas en 3 direcciones (→, ←, ↓ pozo), 5 salas, 5 monstruos, 3 jefes, Guerrera.
Fase 3: cada personaje tiene rasgos propios en CONFIG.CHARACTERS (caminar, respirar, celebrar, ataque, reacción al daño, objetos en mano); en la selección se puede probar cada uno.
