import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Load placeholder assets
    this.load.on('progress', (value: number) => {
      console.log(`Loading: ${Math.round(value * 100)}%`);
    });

    // Placeholder: create colored rectangles for demons
    // In production, load actual sprite sheets
  }

  create(): void {
    console.log('Inner Demons RPG - Booted');
    
    // Generate placeholder textures
    this.createPlaceholderTextures();
    
    // Start title scene
    this.scene.start('TitleScene');
  }

  private createPlaceholderTextures(): void {
    // Placeholder demon sprite (32x32 pixel art style)
    const graphics = this.make.graphics({ x: 0, y: 0 });
    
    // Anxiety - purple/pink
    graphics.fillStyle(0x9b59b6);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('demon_anxiety', 32, 32);
    graphics.clear();
    
    // Procrastination - blue
    graphics.fillStyle(0x3498db);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('demon_procrastination', 32, 32);
    graphics.clear();
    
    // Confidence - gold
    graphics.fillStyle(0xf1c40f);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('demon_confidence', 32, 32);
    graphics.clear();
    
    // Numbness - gray
    graphics.fillStyle(0x7f8c8d);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('demon_numbness', 32, 32);
    graphics.clear();
    
    // Mania - orange/red
    graphics.fillStyle(0xe74c3c);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('demon_mania', 32, 32);
    graphics.clear();
    
    // Hope - green
    graphics.fillStyle(0x2ecc71);
    graphics.fillRect(0, 0, 32, 32);
    graphics.generateTexture('demon_hope', 32, 32);
    graphics.clear();
    
    // The Mask (boss) - white with border
    graphics.fillStyle(0xffffff);
    graphics.fillRect(0, 0, 48, 48);
    graphics.lineStyle(2, 0x000000);
    graphics.strokeRect(0, 0, 48, 48);
    graphics.generateTexture('demon_mask', 48, 48);
    graphics.clear();
    
    // Player placeholder
    graphics.fillStyle(0x3498db);
    graphics.fillCircle(16, 16, 16);
    graphics.generateTexture('player', 32, 32);
    
    graphics.destroy();
  }
}
