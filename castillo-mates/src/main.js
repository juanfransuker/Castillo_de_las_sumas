window.addEventListener('load', () => {
  ProgressManager.load();
  new Phaser.Game({
    type: Phaser.AUTO, parent: 'game', width: CONFIG.W, height: CONFIG.H,
    backgroundColor: '#2a1f45', audio: { noAudio: true },
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: [BootScene, MenuScene, CharacterScene, DifficultyScene, GameScene, ResultScene]
  });
});
