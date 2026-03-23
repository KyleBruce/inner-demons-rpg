import Phaser from 'phaser';
import { ProfilingSystem } from '../systems/ProfilingSystem';

interface ResultsData {
  result: 'win' | 'lose' | 'timeout' | 'captured' | 'fled';
  demonName?: string;
  captured?: boolean;
}

export class ResultsScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ResultsScene' });
  }

  create(data: ResultsData): void {
    const { width, height } = this.scale;
    const { result, demonName = 'the demon' } = data;
    
    // Background based on result
    let bgColor = '#3d0a0a';
    if (result === 'win' || result === 'captured') bgColor = '#0a3d0a';
    if (result === 'timeout') bgColor = '#3d3d0a';
    this.cameras.main.setBackgroundColor(bgColor);
    
    // Result text
    let resultText = '';
    let resultColor = '';
    
    switch (result) {
      case 'win':
        resultText = `${demonName.toUpperCase()} DEFEATED`;
        resultColor = '#2ecc71';
        break;
      case 'captured':
        resultText = `${demonName.toUpperCase()} CAPTURED`;
        resultColor = '#2ecc71';
        break;
      case 'fled':
        resultText = `${demonName.toUpperCase()} ESCAPED`;
        resultColor = '#f1c40f';
        break;
      case 'lose':
        resultText = 'YOU FELL';
        resultColor = '#e74c3c';
        break;
      case 'timeout':
        resultText = 'TIME\'S UP';
        resultColor = '#f1c40f';
        break;
    }
    
    // Get therapist comment from profiling system
    const therapistComment = ProfilingSystem.getTherapistCommentary(
      result === 'win' ? 'battle_win' : 
      result === 'lose' ? 'battle_lose' : 
      'battle_win'
    );
    
    // Title
    this.add.text(width / 2, height * 0.3, resultText, {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: resultColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Therapist comment
    this.add.text(width / 2, height * 0.5, therapistComment, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#7f8c8d',
      align: 'center',
      wordWrap: { width: width * 0.8 },
    }).setOrigin(0.5);
    
    // Continue button
    const continueButton = this.add.text(width / 2, height * 0.75, '[ TAP TO CONTINUE ]', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#2ecc71',
    }).setOrigin(0.5);
    
    // Pulse animation
    this.tweens.add({
      targets: continueButton,
      alpha: 0.5,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
    
    // Tap to continue
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('TeamSelectScene');
      });
    });
    
    // Fade in
    this.cameras.main.fadeIn(300);
  }
}
