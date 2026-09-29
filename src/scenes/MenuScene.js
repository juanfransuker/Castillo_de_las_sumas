class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }
  create() {
    drawBackdrop(this, true);
    const t = title(this, 140, 'El Castillo\nde los Números', 84);
    this.tweens.add({ targets: t, y: 150, duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
    const play = new AnswerButton(this, 640, 600, '¡JUGAR!', 0xf5a623, () => {
      AudioManager.unlock(); AudioManager.startMusic(); AudioManager.sfx('click'); this.scene.start('Character');
    }, 380, 120, 60);
    this.tweens.add({ targets: play, scale: 1.06, duration: 700, yoyo: true, repeat: -1 });
    const snd = new AnswerButton(this, 1200, 60, AudioManager.musicOn ? '🔊' : '🔇', 0x6a5acd, b => {
      AudioManager.unlock(); AudioManager.startMusic(); AudioManager.musicOn = !AudioManager.musicOn; b.txt.setText(AudioManager.musicOn ? '🔊' : '🔇');
    }, 90, 80, 40);
    this.cameras.main.fadeIn(300);
  }
}
