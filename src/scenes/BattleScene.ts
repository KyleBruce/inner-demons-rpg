import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  private battleTimer!: number;
  private timerText!: Phaser.GameObjects.Text;
  private playerHealth = 100;
  private enemyHealth = 100;
  private currentTurn: 'player' | 'enemy' = 'player';
  private battleEnded = false;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    const { width, height } = this.scale;
    
    this.battleEnded = false;
    this.playerHealth = 100;
    this.enemyHealth = 100;
    this.currentTurn = 'player';
    
    // Battle background
    this.cameras.main.setBackgroundColor('#16213e');
    
    // Timer (1 minute max)
    this.battleTimer = 60;
    this.timerText = this.add.text(width / 2, 30, `Time: ${this.battleTimer}s`, {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#e74c3c',
    }).setOrigin(0.5);
    
    // Timer countdown
    this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      repeat: 59,
    });
    
    // Enemy demon (placeholder: Anxiety)
    this.add.sprite(width / 2, height * 0.25, 'demon_anxiety')
      .setScale(3);
    
    this.add.text(width / 2, height * 0.35, '???', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#9b59b6',
    }).setOrigin(0.5);
    
    // Enemy health bar
    const enemyHealthBar = this.add.rectangle(width / 2, height * 0.4, 200, 20, 0xe74c3c);
    const enemyHealthText = this.add.text(width / 2, height * 0.4, '100', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Therapist commentary
    this.add.text(width / 2, height * 0.5,
      '"Interesting. You\'ve found something.\nSurvive its patterns. Then name it."',
      {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#7f8c8d',
        align: 'center',
        wordWrap: { width: width * 0.8 },
      }
    ).setOrigin(0.5);
    
    // Player health bar
    const playerHealthBar = this.add.rectangle(width / 2, height * 0.62, 200, 20, 0x2ecc71);
    const playerHealthText = this.add.text(width / 2, height * 0.62, '100', {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Stance buttons
    const stanceY = height * 0.72;
    
    const attackButton = this.createButton(width * 0.25, stanceY, 'ATTACK', 0xe74c3c);
    const defendButton = this.createButton(width * 0.5, stanceY, 'DEFEND', 0x3498db);
    const abilityButton = this.createButton(width * 0.75, stanceY, 'ABILITY', 0x9b59b6);
    
    // Recognition input (hidden initially)
    const recognitionY = height * 0.85;
    const recognitionPrompt = this.add.text(width / 2, recognitionY, 
      'What demon is this? (Tap to guess)', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f1c40f',
      }
    ).setOrigin(0.5).setVisible(false);
    
    // Simple battle logic
    attackButton.setInteractive();
    attackButton.on('pointerdown', () => this.playerAction('attack'));
    
    defendButton.setInteractive();
    defendButton.on('pointerdown', () => this.playerAction('defend'));
    
    abilityButton.setInteractive();
    abilityButton.on('pointerdown', () => this.playerAction('ability'));
    
    // Store references for updates
    this.data.set('enemyHealthBar', enemyHealthBar);
    this.data.set('enemyHealthText', enemyHealthText);
    this.data.set('playerHealthBar', playerHealthBar);
    this.data.set('playerHealthText', playerHealthText);
    this.data.set('recognitionPrompt', recognitionPrompt);
    
    // Fade in
    this.cameras.main.fadeIn(300);
  }

  private createButton(x: number, y: number, text: string, color: number): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 100, 50, color)
      .setStrokeStyle(2, 0xffffff);
    
    const label = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    
    // Touch feedback
    button.setSize(100, 50);
    button.setInteractive();
    button.on('pointerdown', () => {
      this.tweens.add({
        targets: button,
        scaleX: 0.9,
        scaleY: 0.9,
        duration: 50,
        yoyo: true,
      });
    });
    
    return button;
  }

  private updateTimer(): void {
    if (this.battleEnded) return;
    
    this.battleTimer--;
    this.timerText.setText(`Time: ${this.battleTimer}s`);
    
    if (this.battleTimer <= 0) {
      this.endBattle('timeout');
    }
  }

  private playerAction(action: string): void {
    if (this.battleEnded || this.currentTurn !== 'player') return;
    
    // Simple damage calculation
    let damage = 0;
    
    switch (action) {
      case 'attack':
        damage = Phaser.Math.Between(15, 25);
        break;
      case 'defend':
        damage = 0;
        break;
      case 'ability':
        damage = Phaser.Math.Between(30, 40);
        break;
    }
    
    this.enemyHealth = Math.max(0, this.enemyHealth - damage);
    this.updateHealthBars();
    
    // Check win
    if (this.enemyHealth <= 0) {
      this.endBattle('win');
      return;
    }
    
    // Enemy turn
    this.currentTurn = 'enemy';
    this.time.delayedCall(500, () => this.enemyTurn());
  }

  private enemyTurn(): void {
    if (this.battleEnded) return;
    
    const damage = Phaser.Math.Between(10, 20);
    this.playerHealth = Math.max(0, this.playerHealth - damage);
    this.updateHealthBars();
    
    // Check lose
    if (this.playerHealth <= 0) {
      this.endBattle('lose');
      return;
    }
    
    // Back to player
    this.currentTurn = 'player';
  }

  private updateHealthBars(): void {
    const enemyBar = this.data.get('enemyHealthBar') as Phaser.GameObjects.Rectangle;
    const enemyText = this.data.get('enemyHealthText') as Phaser.GameObjects.Text;
    const playerBar = this.data.get('playerHealthBar') as Phaser.GameObjects.Rectangle;
    const playerText = this.data.get('playerHealthText') as Phaser.GameObjects.Text;
    
    // Scale health bars
    enemyBar.setScale(this.enemyHealth / 100, 1);
    enemyText.setText(this.enemyHealth.toString());
    
    playerBar.setScale(this.playerHealth / 100, 1);
    playerText.setText(this.playerHealth.toString());
  }

  private endBattle(result: 'win' | 'lose' | 'timeout'): void {
    this.battleEnded = true;
    
    this.time.delayedCall(500, () => {
      this.scene.start('ResultsScene', { result });
    });
  }
}
