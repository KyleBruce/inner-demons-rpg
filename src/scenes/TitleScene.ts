import Phaser from 'phaser';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create(): void {
    const { width, height } = this.scale;
    
    // Dark background
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Title
    this.add.text(width / 2, height * 0.3, 'INNER DEMONS', {
      fontFamily: 'monospace',
      fontSize: '48px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height * 0.38, 'RPG', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#9b59b6',
    }).setOrigin(0.5);
    
    // Therapist opening line
    this.add.text(width / 2, height * 0.55, 
      '"So. You\'re here again.\nLet\'s see what you\'re running from this time."',
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#7f8c8d',
        align: 'center',
        wordWrap: { width: width * 0.8 },
      }
    ).setOrigin(0.5);
    
    // Start button
    const startButton = this.add.text(width / 2, height * 0.75, '[ TAP TO BEGIN ]', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#2ecc71',
    }).setOrigin(0.5);
    
    // Pulse animation on button
    this.tweens.add({
      targets: startButton,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    // Floating demon sprites in background
    const demons = ['demon_anxiety', 'demon_procrastination', 'demon_confidence', 
                    'demon_numbness', 'demon_mania', 'demon_hope'];
    
    demons.forEach((demon, i) => {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(100, height - 100);
      const sprite = this.add.sprite(x, y, demon)
        .setAlpha(0.2)
        .setScale(1.5);
      
      this.tweens.add({
        targets: sprite,
        y: y - 20,
        alpha: 0.3,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        delay: i * 200,
      });
    });
    
    // Tap to start
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('BattleScene');
      });
    });
    
    // Fade in
    this.cameras.main.fadeIn(500);
  }
}
