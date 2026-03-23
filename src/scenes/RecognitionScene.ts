import Phaser from 'phaser';
import { DEMONS } from '../data/demons';
import { DemonCollection } from '../systems/Collection';

interface RecognitionData {
  enemyType: string;
  battleResult: 'survived' | 'timeout';
  turnsSurvived: number;
}

export class RecognitionScene extends Phaser.Scene {
  private enemyType!: string;
  private nameInput!: HTMLInputElement;
  private inputContainer!: HTMLDivElement;
  private feedbackText!: Phaser.GameObjects.Text;
  private attemptsLeft: number = 3;
  
  constructor() {
    super({ key: 'RecognitionScene' });
  }
  
  create(data: RecognitionData): void {
    const { width, height } = this.scale;
    this.enemyType = data.enemyType;
    this.attemptsLeft = 3;
    
    this.cameras.main.setBackgroundColor('#1a1a2e');
    
    // Demon survived message
    this.add.text(width / 2, 60, 'THE DEMON WAITS', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 90, "It's staring at you.\nYou survived. But do you understand it?",
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#7f8c8d',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // Demon sprite (mysterious, obscured)
    const sprite = this.add.sprite(width / 2, 200, `demon_${this.enemyType}`)
      .setScale(4)
      .setAlpha(0.6)
      .setTint(0x888888);
    
    // Pulsing effect
    this.tweens.add({
      targets: sprite,
      alpha: 0.8,
      scaleX: 4.2,
      scaleY: 4.2,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });
    
    // Recognition prompt
    this.add.text(width / 2, 300, 'NAME IT', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#9b59b6',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 325, '"If you know what haunts you, it cannot control you."',
      {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#7f8c8d',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // HTML input for name (works better on mobile)
    this.createNameInput();
    
    // Feedback text
    this.feedbackText = this.add.text(width / 2, 520, '', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#f1c40f',
      align: 'center',
      wordWrap: { width: width - 40 },
    }).setOrigin(0.5);
    
    // Attempts counter
    this.updateAttemptsDisplay();
    
    // Skip button (if you give up)
    const skipBtn = this.add.text(width / 2, height - 60, '[ Give Up ]', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#7f8c8d',
    }).setOrigin(0.5);
    
    skipBtn.setInteractive();
    skipBtn.on('pointerdown', () => this.giveUp());
    
    // Fade in
    this.cameras.main.fadeIn(300);
  }
  
  private createNameInput(): void {
    this.inputContainer = document.createElement('div');
    this.inputContainer.style.cssText = `
      position: fixed;
      top: 400px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      z-index: 1000;
    `;
    
    this.nameInput = document.createElement('input');
    this.nameInput.type = 'text';
    this.nameInput.placeholder = 'Type the demon\'s name...';
    this.nameInput.style.cssText = `
      width: 100%;
      padding: 16px;
      font-family: monospace;
      font-size: 16px;
      background: #16213e;
      border: 2px solid #3498db;
      color: #ecf0f1;
      text-align: center;
      border-radius: 4px;
      outline: none;
    `;
    
    this.nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.submitName();
      }
    });
    
    const submitBtn = document.createElement('button');
    submitBtn.textContent = 'RECOGNIZE';
    submitBtn.style.cssText = `
      width: 100%;
      margin-top: 10px;
      padding: 12px;
      font-family: monospace;
      font-size: 14px;
      background: #9b59b6;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    `;
    submitBtn.addEventListener('click', () => this.submitName());
    
    this.inputContainer.appendChild(this.nameInput);
    this.inputContainer.appendChild(submitBtn);
    document.body.appendChild(this.inputContainer);
    
    // Focus input
    setTimeout(() => this.nameInput.focus(), 100);
  }
  
  private updateAttemptsDisplay(): void {
    const { width } = this.scale;
    
    // Remove old display
    const old = this.children.getByName('attemptsText');
    if (old) old.destroy();
    
    const text = this.add.text(width / 2, 560, `Attempts: ${this.attemptsLeft}`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#95a5a6',
    }).setOrigin(0.5);
    text.setName('attemptsText');
  }
  
  private submitName(): void {
    const guess = this.nameInput.value.trim().toLowerCase();
    if (!guess) return;
    
    const demon = DEMONS[this.enemyType as keyof typeof DEMONS];
    const correctNames = [
      demon.name.toLowerCase(),
      demon.type.toLowerCase(),
      // Common aliases
      ...(demon.type === 'anxiety' ? ['worry', 'fear', 'stress', 'panic'] : []),
      ...(demon.type === 'procrastination' ? ['procrastination', 'delay', 'putting off', 'lazy', 'laziness'] : []),
      ...(demon.type === 'confidence' ? ['confidence', 'confident', 'self esteem', 'self-esteem', 'pride'] : []),
      ...(demon.type === 'numbness' ? ['numbness', 'numb', 'apathy', 'dissociation', 'dissociate'] : []),
      ...(demon.type === 'mania' ? ['mania', 'manic', 'hypomania', 'energy', 'chaos'] : []),
      ...(demon.type === 'hope' ? ['hope', 'hopeful', 'optimism'] : []),
    ];
    
    const isCorrect = correctNames.includes(guess);
    
    if (isCorrect) {
      this.showSuccess(demon.name);
    } else {
      this.attemptsLeft--;
      this.updateAttemptsDisplay();
      
      if (this.attemptsLeft <= 0) {
        this.showFailure();
      } else {
        this.feedbackText.setText(`Not quite. Think about what you faced.\n${this.getHint()}`);
        this.nameInput.value = '';
        
        // Shake effect
        this.cameras.main.shake(100, 0.01);
      }
    }
  }
  
  private getHint(): string {
    const demon = DEMONS[this.enemyType as keyof typeof DEMONS];
    
    const hints: Record<string, string[]> = {
      anxiety: [
        'It moved so fast...',
        'Your heart was racing...',
        'Everything felt urgent...',
      ],
      procrastination: [
        'It waited for you to wait...',
        'Time was running out...',
        'Power built up, but would you act?',
      ],
      confidence: [
        'It made you feel stronger...',
        'But criticism shattered it...',
        'Fragile pride...',
      ],
      numbness: [
        'It took every hit...',
        'But didn\'t feel anything...',
        'A wall of nothing...',
      ],
      mania: [
        'Unpredictable...',
        'Sometimes amazing, sometimes disaster...',
        'Wild energy...',
      ],
      hope: [
        'It kept you going...',
        'A light in the darkness...',
        'The will to believe...',
      ],
    };
    
    const demonHints = hints[demon.type] || ['Look closer...'];
    return demonHints[Math.floor(Math.random() * demonHints.length)];
  }
  
  private showSuccess(demonName: string): void {
    const { width, height } = this.scale;
    
    this.cleanup();
    
    // Capture the demon
    const captured = DemonCollection.captureDemon(this.enemyType, demonName);
    
    // Success overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    
    this.add.text(width / 2, height * 0.3, 'RECOGNIZED', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#2ecc71',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, height * 0.4, `"${demonName.toUpperCase()}"\n\nhas joined your collection`, {
      fontFamily: 'monospace',
      fontSize: '16px',
      color: '#ecf0f1',
      align: 'center',
    }).setOrigin(0.5);
    
    // Level display
    this.add.text(width / 2, height * 0.55, `Level ${captured.level} | XP: ${captured.experience}`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#f1c40f',
    }).setOrigin(0.5);
    
    // Therapist comment
    this.add.text(width / 2, height * 0.68, 
      `"You saw it for what it is.\nThat's how you take the power back."`,
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#7f8c8d',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // Continue button
    const continueBtn = this.add.text(width / 2, height * 0.85, '[ CONTINUE ]', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#2ecc71',
    }).setOrigin(0.5);
    
    continueBtn.setInteractive();
    continueBtn.on('pointerdown', () => {
      this.scene.start('ResultsScene', {
        result: 'captured',
        demonName: demonName,
        captured: true,
      });
    });
  }
  
  private showFailure(): void {
    const { width, height } = this.scale;
    
    this.cleanup();
    
    // Failure overlay
    this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
    
    this.add.text(width / 2, height * 0.3, 'IT FLED', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    const demon = DEMONS[this.enemyType as keyof typeof DEMONS];
    
    this.add.text(width / 2, height * 0.42, 
      `You didn't recognize it.\n\nIt was **${demon.name.toUpperCase()}**.`,
      {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ecf0f1',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // Therapist comment
    this.add.text(width / 2, height * 0.6, 
      `"Not every demon wants to be known.\nMaybe next time you'll see it coming."`,
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#7f8c8d',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // Continue button
    const continueBtn = this.add.text(width / 2, height * 0.85, '[ CONTINUE ]', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#e74c3c',
    }).setOrigin(0.5);
    
    continueBtn.setInteractive();
    continueBtn.on('pointerdown', () => {
      this.scene.start('ResultsScene', {
        result: 'fled',
        demonName: demon.name,
        captured: false,
      });
    });
  }
  
  private giveUp(): void {
    this.attemptsLeft = 0;
    this.showFailure();
  }
  
  private cleanup(): void {
    if (this.inputContainer && this.inputContainer.parentNode) {
      this.inputContainer.parentNode.removeChild(this.inputContainer);
    }
  }
  
  shutdown(): void {
    this.cleanup();
  }
}
