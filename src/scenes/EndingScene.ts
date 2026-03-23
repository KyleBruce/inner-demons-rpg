import Phaser from 'phaser';
import { ProfilingSystem } from '../systems/ProfilingSystem';
import { DemonCollection } from '../systems/Collection';

export class EndingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndingScene' });
  }
  
  create(): void {
    const { width, height } = this.scale;
    const profile = ProfilingSystem.getProfile();
    const endingType = ProfilingSystem.getEndingType();
    const playStyle = ProfilingSystem.getPlayStyle();
    const collection = DemonCollection.getCollection();
    
    this.cameras.main.setBackgroundColor('#0a0a1a');
    
    // Fade in
    this.cameras.main.fadeIn(1000);
    
    // Title
    this.add.text(width / 2, 80, 'THE END', {
      fontFamily: 'monospace',
      fontSize: '36px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Ending type
    const endingTitle = this.getEndingTitle(endingType);
    const endingColor = this.getEndingColor(endingType);
    
    this.add.text(width / 2, 140, endingTitle, {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: endingColor,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Therapist final comment
    const finalComment = ProfilingSystem.getTherapistCommentary('ending');
    this.add.text(width / 2, 200, `"${finalComment}"`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#7f8c8d',
      align: 'center',
      wordWrap: { width: width - 40 },
    }).setOrigin(0.5);
    
    // Stats
    let y = 300;
    const stats = [
      `Battles Fought: ${profile.battlesFought}`,
      `Battles Won: ${profile.battlesWon}`,
      `Battles Lost: ${profile.battlesLost}`,
      `Play Style: ${playStyle}`,
      `Demons Captured: ${collection.length}/6`,
      `Favorite Demon: ${profile.favoriteDemon || 'None'}`,
      `Mazes Explored: ${profile.mazesExplored}`,
    ];
    
    stats.forEach(stat => {
      this.add.text(width / 2, y, stat, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#95a5a6',
      }).setOrigin(0.5);
      y += 22;
    });
    
    // Session time
    const playTimeMinutes = Math.round((profile.lastPlayedAt - profile.firstPlayedAt) / 60000);
    this.add.text(width / 2, y + 10, `Session Length: ${playTimeMinutes} minutes`, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#7f8c8d',
    }).setOrigin(0.5);
    
    // Restart button
    const restartBtn = this.add.text(width / 2, height - 80, '[ PLAY AGAIN ]', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#2ecc71',
    }).setOrigin(0.5);
    
    restartBtn.setInteractive();
    restartBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        // Clear collection and profile for new game
        DemonCollection.clearCollection();
        ProfilingSystem.clearProfile();
        this.scene.start('TitleScene');
      });
    });
    
    // Keep progress button
    const keepBtn = this.add.text(width / 2, height - 40, '[ KEEP PROGRESS ]', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#3498db',
    }).setOrigin(0.5);
    
    keepBtn.setInteractive();
    keepBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => {
        this.scene.start('TitleScene');
      });
    });
  }
  
  private getEndingTitle(endingType: string): string {
    const titles: Record<string, string> = {
      'avoider': 'THE AVOIDER',
      'grinder': 'THE GRINDER',
      'balancer': 'THE BALANCER',
      'self-destroyer': 'THE SELF-DESTROYER',
      'integrated': 'THE INTEGRATED',
    };
    return titles[endingType] || 'UNKNOWN';
  }
  
  private getEndingColor(endingType: string): string {
    const colors: Record<string, string> = {
      'avoider': '#f1c40f',      // Yellow - neutral
      'grinder': '#e74c3c',      // Red - aggressive
      'balancer': '#3498db',     // Blue - stable
      'self-destroyer': '#9b59b6', // Purple - dark
      'integrated': '#2ecc71',   // Green - best ending
    };
    return colors[endingType] || '#ffffff';
  }
}
