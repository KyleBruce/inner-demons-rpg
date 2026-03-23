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
  }

  create(): void {
    console.log('Inner Demons RPG - Booted');
    
    // Generate placeholder textures
    this.createPlaceholderTextures();
    
    // Start title scene
    this.scene.start('TitleScene');
  }

  private createPlaceholderTextures(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    
    // Helper function to draw demon with eyes
    const drawDemon = (bodyColor: number, eyeColor: number = 0xffffff) => {
      graphics.clear();
      
      // Body (rounded rectangle approximation)
      graphics.fillStyle(bodyColor);
      graphics.fillRoundedRect(4, 4, 24, 24, 8);
      
      // Eyes
      graphics.fillStyle(eyeColor);
      graphics.fillCircle(12, 12, 3);
      graphics.fillCircle(20, 12, 3);
      
      // Pupils
      graphics.fillStyle(0x000000);
      graphics.fillCircle(12, 12, 1.5);
      graphics.fillCircle(20, 12, 1.5);
      
      // Mouth (simple line)
      graphics.lineStyle(2, 0x000000);
      graphics.beginPath();
      graphics.moveTo(12, 21);
      graphics.lineTo(20, 21);
      graphics.strokePath();
    };
    
    // Anxiety - purple/pink, worried eyes
    drawDemon(0x9b59b6, 0xffcccc);
    graphics.generateTexture('demon_anxiety', 32, 32);
    
    // Procrastination - blue, sleepy eyes
    drawDemon(0x3498db, 0xffffff);
    graphics.generateTexture('demon_procrastination', 32, 32);
    
    // Confidence - gold, bright eyes
    drawDemon(0xf1c40f, 0xffffff);
    graphics.generateTexture('demon_confidence', 32, 32);
    
    // Numbness - gray, hollow eyes
    graphics.clear();
    graphics.fillStyle(0x5a6a7a);
    graphics.fillRoundedRect(4, 4, 24, 24, 8);
    // Hollow eyes (empty)
    graphics.fillStyle(0x2a3a4a);
    graphics.fillCircle(12, 12, 4);
    graphics.fillCircle(20, 12, 4);
    graphics.generateTexture('demon_numbness', 32, 32);
    
    // Mania - orange/red, wild eyes
    graphics.clear();
    graphics.fillStyle(0xe74c3c);
    graphics.fillRoundedRect(4, 4, 24, 24, 8);
    // Wild eyes (different sizes)
    graphics.fillStyle(0xffff00);
    graphics.fillCircle(11, 12, 4);
    graphics.fillCircle(21, 12, 3);
    graphics.fillStyle(0x000000);
    graphics.fillCircle(11, 12, 2);
    graphics.fillCircle(21, 12, 1.5);
    // Jagged mouth
    graphics.lineStyle(2, 0x000000);
    graphics.beginPath();
    graphics.moveTo(10, 21);
    graphics.lineTo(14, 24);
    graphics.lineTo(18, 20);
    graphics.lineTo(22, 24);
    graphics.strokePath();
    graphics.generateTexture('demon_mania', 32, 32);
    
    // Hope - green, kind eyes
    drawDemon(0x2ecc71, 0xffffff);
    graphics.generateTexture('demon_hope', 32, 32);
    
    // The Mask (boss) - white with border, hollow eyes
    graphics.clear();
    graphics.fillStyle(0xffffff);
    graphics.fillRoundedRect(4, 4, 40, 40, 12);
    graphics.lineStyle(3, 0x000000);
    graphics.strokeRoundedRect(4, 4, 40, 40, 12);
    // Hollow mask eyes
    graphics.fillStyle(0x000000);
    graphics.fillCircle(18, 20, 6);
    graphics.fillCircle(30, 20, 6);
    // Enigmatic smile
    graphics.lineStyle(2, 0x000000);
    graphics.beginPath();
    graphics.arc(24, 30, 8, 0.2, Math.PI - 0.2, false);
    graphics.strokePath();
    graphics.generateTexture('demon_mask', 48, 48);
    
    // Player placeholder (simple person shape)
    graphics.clear();
    graphics.fillStyle(0x3498db);
    graphics.fillCircle(16, 10, 8); // Head
    graphics.fillRect(12, 18, 8, 14); // Body
    graphics.generateTexture('player', 32, 32);
    
    graphics.destroy();
  }
}
