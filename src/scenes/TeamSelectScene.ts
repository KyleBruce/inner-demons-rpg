import Phaser from 'phaser';
import { DEMONS, DemonType } from '../data/demons';
import { Stance, Ability } from '../entities/Demon';
import { DemonCollection, CapturedDemon } from '../systems/Collection';

export class TeamSelectScene extends Phaser.Scene {
  private selectedDemon: DemonType | null = null;
  private demonCards: Phaser.GameObjects.Container[] = [];
  private infoPanel!: Phaser.GameObjects.Container;
  private readyButton!: Phaser.GameObjects.Container;
  private collection: CapturedDemon[] = [];
  
  constructor() {
    super({ key: 'TeamSelectScene' });
  }
  
  create(): void {
    const { width } = this.scale;
    
    // Load collection
    this.collection = DemonCollection.getCollection();
    
    // If no demons captured, give player Hope as starter
    if (this.collection.length === 0) {
      DemonCollection.captureDemon('hope', 'Hope');
      this.collection = DemonCollection.getCollection();
    }
    
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Title
    this.add.text(width / 2, 40, 'YOUR DEMONS', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Collection count
    this.add.text(width / 2, 70, `${this.collection.length}/6 captured`,
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
    
    // Select first captured demon by default
    if (this.collection.length > 0) {
      this.selectDemon(this.collection[0].type as DemonType);
    }
    
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
      const captured = this.collection.find(d => d.type === type);
      
      const card = this.createDemonCard(x, y, type, cardWidth, cardHeight, captured);
      this.demonCards.push(card);
    });
  }
  
  private createDemonCard(x: number, y: number, type: DemonType, w: number, h: number, captured?: CapturedDemon): Phaser.GameObjects.Container {
    const demon = DEMONS[type];
    const card = this.add.container(x, y);
    const isLocked = !captured;
    
    // Background
    const bgColor = isLocked ? 0x1a1a2e : 0x2c3e50;
    const bg = this.add.rectangle(0, 0, w, h, bgColor)
      .setStrokeStyle(2, isLocked ? 0x333333 : 0x34495e);
    
    // Demon sprite
    const sprite = this.add.sprite(0, -10, `demon_${type}`)
      .setScale(1.5)
      .setTint(isLocked ? 0x333333 : 0xffffff)
      .setAlpha(isLocked ? 0.3 : 1);
    
    // Name (shortened)
    const shortName = demon.name.substring(0, 6);
    const nameColor = isLocked ? '#555555' : '#ecf0f1';
    const nameText = this.add.text(0, 22, isLocked ? '???' : shortName, {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: nameColor,
    }).setOrigin(0.5);
    
    // Level badge (if captured)
    let levelBadge: Phaser.GameObjects.Text | null = null;
    if (captured && !isLocked) {
      levelBadge = this.add.text(w/2 - 5, -h/2 + 5, `Lv${captured.level}`, {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#f1c40f',
      }).setOrigin(0.5);
    }
    
    // Lock icon (if locked)
    let lockIcon: Phaser.GameObjects.Text | null = null;
    if (isLocked) {
      lockIcon = this.add.text(0, 0, '🔒', {
        fontSize: '16px',
      }).setOrigin(0.5);
    }
    
    card.add([bg, sprite, nameText]);
    if (levelBadge) card.add(levelBadge);
    if (lockIcon) card.add(lockIcon);
    card.setSize(w, h);
    
    // Only captured demons are interactive
    if (!isLocked) {
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
    }
    
    return card;
  }
  
  private selectDemon(type: DemonType): void {
    this.selectedDemon = type;
    
    // Update card visuals
    this.demonCards.forEach((card, i) => {
      const demonTypes: DemonType[] = ['anxiety', 'procrastination', 'confidence', 'numbness', 'mania', 'hope'];
      const cardType = demonTypes[i];
      const isSelected = cardType === type;
      const captured = this.collection.find(d => d.type === cardType);
      const isLocked = !captured;
      
      // Get the background (first child)
      const bg = card.getAt(0) as Phaser.GameObjects.Rectangle;
      
      if (isLocked) {
        bg.setStrokeStyle(2, 0x333333);
        bg.setFillStyle(0x1a1a2e);
      } else if (isSelected) {
        bg.setStrokeStyle(3, 0x2ecc71);
        bg.setFillStyle(0x34495e);
      } else {
        bg.setStrokeStyle(2, 0x34495e);
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
    if (!this.selectedDemon) return;
    
    const demon = DEMONS[this.selectedDemon];
    const captured = this.collection.find(d => d.type === this.selectedDemon);
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
    
    // Level and XP (if captured)
    if (captured) {
      const xpText = this.add.text(0, yOffset, `Level ${captured.level} | XP: ${captured.experience}/100 | Wins: ${captured.battlesWon}`, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#f1c40f',
      }).setOrigin(0.5);
      this.infoPanel.add(xpText);
      yOffset += 20;
    }
    
    // Description
    const descText = this.add.text(0, yOffset, demon.description, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#95a5a6',
      align: 'center',
      wordWrap: { width: width - 60 },
    }).setOrigin(0.5);
    this.infoPanel.add(descText);
    yOffset += 30;
    
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
      if (!this.selectedDemon) return;
      
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
    if (!this.selectedDemon) return;
    
    this.cameras.main.fadeOut(300, 0, 0, 0);
    this.time.delayedCall(300, () => {
      this.scene.start('BattleScene', { 
        playerDemonType: this.selectedDemon 
      });
    });
  }
}
