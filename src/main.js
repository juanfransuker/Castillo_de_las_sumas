// Texto nítido en pantallas de alta densidad (móviles): renderiza los textos con más resolución.
(function () {
  const F = Phaser.GameObjects.GameObjectFactory.prototype, t = F.text;
  F.text = function (...a) { const o = t.apply(this, a); o.setResolution(Math.min(2, Math.ceil(window.devicePixelRatio || 1))); return o; };
})();
window.addEventListener('load', () => {
  ProgressManager.load();
  new Phaser.Game({
    type: Phaser.AUTO, parent: 'game', width: CONFIG.W, height: CONFIG.H,
    backgroundColor: '#2a1f45', audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, MenuScene, CharacterScene, DifficultyScene, MapScene, GameScene, ResultScene]
  });
});
