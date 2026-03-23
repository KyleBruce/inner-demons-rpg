import Phaser from 'phaser';
import { DEMONS, DemonType } from '../data/demons';
import { Stance, Ability } from '../entities/Demon';

export class TeamSelectScene extends Phaser.Scene {
  private selectedDemon: DemonType = 'hope';
  private demonCards: Phaser.GameObjects.Container[] = [];
  private infoPanel!: Phaser.GameObjects.Container;
  private readyButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'TeamSelectScene' });
  }

  create(): void {
    const { width } = this.scale;
    
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Title
    this.add.text(width / 2, 40, 'CHOOSE YOUR DEMON', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Therapist comment
    this.add.text(width / 2, 70, '"Pick your neurosis. They\'re all you, anyway."',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#7f8c8d',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // Draw demon cards
    this.drawDemonCards();
    
    // Info panel (shows selected demon details)
    this.drawInfoPanel();
    
    // Ready button
    this.drawReadyButton();
    
    // Select default demon
    this.selectDemon('hope');
    
    // Fade in
    this.cameras.main.fadeIn(300);
  }

  private drawDemonCards(): void {
    const { width } = this.scale;
    const cardWidth = 55;
    const cardHeight = 70;
    const spacing = 8;
    const startX = (width - (6 * cardWidth + 5 * spacing)) / 2 + cardWidth / 2;
    const y = 130;
    
    const demonTypes: DemonType[] = ['anxiety', 'procrastination', 'confidence', 'numbness', 'mania', 'hope'];
    
    demonTypes.forEach((type, i) => {
      const x = startX + i * (cardWidth + spacing);
      
      const card = this.createDemonCard(x, y, type, cardWidth, cardHeight);
      this.demonCards.push(card);
    });
  }

  private createDemonCard(x: number, y: number, type: DemonType, w: number, h: number): Phaser.GameObjects.Container {
    const demon = DEMONS[type];
    const card = this.add.container(x, y);
    
    // Background
    const bg = this.add.rectangle(0, 0, w, h, 0x2c3e50)
      .setStrokeStyle(2, 0x34495e);
    
    // Demon sprite
    const sprite = this.add.sprite(0, -10, `demon_${type}`).setScale(1.5);
    
    // Name (shortened)
    const shortName = demon.name.substring(0, 6);
    const nameText = this.add.text(0, 22, shortName, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#ecf0f1',
    }).setOrigin(0.5);
    
    card.add([bg, sprite, nameText]);
    card.setSize(w, h);
    
    // Make interactive
    card.setInteractive();
    card.on('pointerdown', () => {
      this.selectDemon(type);
      this.tweens.add({
        targets: card,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 50,
        yoyo: true,
      });
    });
    
    return card;
  }

  private selectDemon(type: DemonType): void {
    this.selectedDemon = type;
    
    // Update card visuals
    this.demonCards.forEach((card, i) => {
      const demonTypes: DemonType[] = ['anxiety', 'procrastination', 'confidence', 'numbness', 'mania', 'hope'];
      const cardType = demonTypes[i];
      const isSelected = cardType === type;
      
      // Get the background (first child)
      const bg = card.getAt(0) as Phaser.GameObjects.Rectangle;
      bg.setStrokeStyle(2, isSelected ? 0x2ecc71 : 0x34495e);
      
      if (isSelected) {
        bg.setFillStyle(0x34495e);
      } else {
        bg.setFillStyle(0x2c3e50);
      }
    });
    
    // Update info panel
    this.updateInfoPanel();
  }

  private drawInfoPanel(): void {
    const { width } = this.scale;
    const panelY = 220;
    const panelHeight = 320;
    
    this.infoPanel = this.add.container(width / 2, panelY);
    
    // Background
    const bg = this.add.rectangle(0, 0, width - 20, panelHeight, 0x16213e)
      .setStrokeStyle(2, 0x34495e);
    this.infoPanel.add(bg);
  }

  private updateInfoPanel(): void {
    const demon = DEMONS[this.selectedDemon];
    const { width } = this.scale;
    
    // Clear old content (keep background at index 0)
    while (this.infoPanel.length > 1) {
      this.infoPanel.removeAt(1, true);
    }
    
    let yOffset = -140;
    
    // Demon name
    const nameText = this.add.text(0, yOffset, demon.name.toUpperCase(), {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.infoPanel.add(nameText);
    yOffset += 25;
    
    // Description
    const descText = this.add.text(0, yOffset, demon.description, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#95a5a6',
      align: 'center',
      wordWrap: { width: width - 60 },
    }).setOrigin(0.5);
    this.infoPanel.add(descText);
    yOffset += 35;
    
    // Base stats
    const statsText = this.add.text(0, yOffset, 
      `HP:${demon.baseStats.maxHealth} | ATK:${demon.baseStats.attack} | DEF:${demon.baseStats.defense} | SPD:${demon.baseStats.speed}`,
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7f8c8d',
      }
    ).setOrigin(0.5);
    this.infoPanel.add(statsText);
    yOffset += 25;
    
    // Stances header
    const stancesHeader = this.add.text(0, yOffset, 'STANCES', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#9b59b6',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.infoPanel.add(stancesHeader);
    yOffset += 18;
    
    // Stances
    demon.stances.forEach((stance: Stance) => {
      const stanceText = this.add.text(0, yOffset, `[${stance.name}] ${stance.description}`, {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#bdc3c7',
        align: 'center',
        wordWrap: { width: width - 60 },
      }).setOrigin(0.5);
      this.infoPanel.add(stanceText);
      yOffset += 22;
    });
    
    yOffset += 5;
    
    // Abilities header
    const abilitiesHeader = this.add.text(0, yOffset, 'ABILITIES', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#e67e22',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.infoPanel.add(abilitiesHeader);
    yOffset += 18;
    
    // Abilities
    demon.abilities.forEach((ability: Ability) => {
      const abilityText = this.add.text(0, yOffset, `${ability.name}: ${ability.description}`, {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#bdc3c7',
        align: 'center',
        wordWrap: { width: width - 60 },
      }).setOrigin(0.5);
      this.infoPanel.add(abilityText);
      yOffset += 22;
    });
  }

  private drawReadyButton(): void {
    const { width, height } = this.scale;
    const y = height - 60;
    
    this.readyButton = this.add.container(width / 2, y);
    
    const bg = this.add.rectangle(0, 0, 150, 45, 0x2ecc71)
      .setStrokeStyle(2, 0xffffff);
    
    const label = this.add.text(0, 0, 'FIGHT', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.readyButton.add([bg, label]);
    this.readyButton.setSize(150, 45);
    
    this.readyButton.setInteractive();
    this.readyButton.on('pointerdown', () => {
      this.tweens.add({
        targets: this.readyButton,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.startBattle();
        }
      });
    });
  }

  private startBattle(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('BattleScene', { 
        playerDemonType: this.selectedDemon 
      });
    });
  }
}
