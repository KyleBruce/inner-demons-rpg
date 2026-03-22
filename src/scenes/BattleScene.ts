import Phaser from 'phaser';
import { BattleSystem, BattleState } from '../systems/BattleSystem';
import { DemonInstance } from '../entities/Demon';

export class BattleScene extends Phaser.Scene {
  private battleTimer!: number;
  private timerText!: Phaser.GameObjects.Text;
  private battleSystem!: BattleSystem;
  private battleState!: BattleState;
  private battleEnded = false;
  private logText!: Phaser.GameObjects.Text;
  private stanceButtons: Phaser.GameObjects.Container[] = [];
  private abilityButtons: Phaser.GameObjects.Container[] = [];

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    const { width } = this.scale;
    
    this.battleEnded = false;
    
    // Initialize battle system
    this.battleSystem = new BattleSystem('hope', undefined); // Player starts with Hope
    this.battleState = this.battleSystem.getState();
    
    // Battle background
    this.cameras.main.setBackgroundColor('#16213e');
    
    // Timer (1 minute max)
    this.battleTimer = 60;
    this.timerText = this.add.text(width / 2, 30, `⏱ ${this.battleTimer}s`, {
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
    
    // Draw battle
    this.drawBattle();
    
    // Fade in
    this.cameras.main.fadeIn(300);
  }

  private drawBattle(): void {
    const { width, height } = this.scale;
    
    // Clear old UI
    this.stanceButtons.forEach(b => b.destroy());
    this.abilityButtons.forEach(b => b.destroy());
    this.stanceButtons = [];
    this.abilityButtons = [];
    
    // Enemy section
    this.drawDemonSection(this.battleState.enemy, width / 2, height * 0.15, false);
    
    // Player section  
    this.drawDemonSection(this.battleState.player, width / 2, height * 0.5, true);
    
    // Battle log
    this.logText = this.add.text(width / 2, height * 0.42, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#95a5a6',
      align: 'center',
      wordWrap: { width: width * 0.9 },
    }).setOrigin(0.5);
    this.updateLog();
    
    // Action buttons (only on player turn)
    if (this.battleState.currentTurn === 'player' && !this.battleEnded) {
      this.drawActionButtons();
    }
  }

  private drawDemonSection(demon: DemonInstance, x: number, y: number, isPlayer: boolean): void {
    const label = isPlayer ? 'YOU' : 'ENEMY';
    const color = isPlayer ? '#2ecc71' : '#e74c3c';
    
    // Label
    this.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#7f8c8d',
    }).setOrigin(0.5);
    
    // Demon sprite
    const textureKey = `demon_${demon.demon.type}`;
    this.add.sprite(x, y + 40, textureKey).setScale(2.5);
    
    // Demon name
    this.add.text(x, y + 90, demon.demon.name, {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: color,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    // Stance
    this.add.text(x, y + 110, `[${demon.currentStance.name}]`, {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#9b59b6',
    }).setOrigin(0.5);
    
    // Health bar background
    const healthBarWidth = 180;
    const healthBarHeight = 16;
    this.add.rectangle(x, y + 130, healthBarWidth, healthBarHeight, 0x2c3e50);
    
    // Health bar fill
    const healthPercent = demon.currentHealth / demon.maxHealth;
    const healthColor = healthPercent > 0.5 ? 0x2ecc71 : healthPercent > 0.25 ? 0xf1c40f : 0xe74c3c;
    this.add.rectangle(
      x - (healthBarWidth / 2) + (healthBarWidth * healthPercent / 2),
      y + 130,
      healthBarWidth * healthPercent,
      healthBarHeight,
      healthColor
    ).setOrigin(0.5);
    
    // Health text
    this.add.text(x, y + 130, `${Math.round(demon.currentHealth)}/${demon.maxHealth}`, {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ffffff',
    }).setOrigin(0.5);
    
    // Stats
    this.add.text(x, y + 150, 
      `ATK:${Math.round(demon.currentAttack)} | DEF:${Math.round(demon.currentDefense)} | SPD:${Math.round(demon.currentSpeed)}`,
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7f8c8d',
      }
    ).setOrigin(0.5);
    
    // Power indicator (if any)
    if (demon.power > 0) {
      this.add.text(x, y + 165, `⚡ Power: ${demon.power}`, {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#f1c40f',
      }).setOrigin(0.5);
    }
  }

  private drawActionButtons(): void {
    const { width, height } = this.scale;
    const player = this.battleState.player;
    
    // Stance buttons
    const stanceY = height * 0.68;
    this.add.text(width / 2, stanceY - 20, 'STANCE', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#9b59b6',
    }).setOrigin(0.5);
    
    player.demon.stances.forEach((stance, i) => {
      const x = width * 0.25 + (i * width * 0.25);
      const isActive = stance.id === player.currentStance.id;
      const btn = this.createButton(x, stanceY + 15, stance.name, isActive ? 0x27ae60 : 0x3498db, 85, 35);
      
      btn.setInteractive();
      btn.on('pointerdown', () => {
        if (!isActive) {
          this.battleSystem.switchStance(player, stance);
          this.updateLog();
          this.endPlayerTurn();
        }
      });
      
      this.stanceButtons.push(btn);
    });
    
    // Ability buttons
    const abilityY = height * 0.78;
    this.add.text(width / 2, abilityY - 20, 'ABILITIES', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#e67e22',
    }).setOrigin(0.5);
    
    player.demon.abilities.forEach((ability, i) => {
      const x = width * 0.3 + (i * width * 0.35);
      const btn = this.createButton(x, abilityY + 10, ability.name, 0xe67e22, 100, 35);
      
      btn.setInteractive();
      btn.on('pointerdown', () => {
        this.battleSystem.useAbility(player, this.battleState.enemy, ability);
        this.updateLog();
        if (this.battleState.isOver) {
          this.endBattle('win');
        } else {
          this.endPlayerTurn();
        }
      });
      
      this.abilityButtons.push(btn);
    });
    
    // Basic attack button
    const attackBtn = this.createButton(width * 0.5, height * 0.88, '⚔ ATTACK', 0xe74c3c, 120, 40);
    attackBtn.setInteractive();
    attackBtn.on('pointerdown', () => {
      this.battleSystem.basicAttack(player, this.battleState.enemy);
      this.updateLog();
      if (this.battleState.isOver) {
        this.endBattle('win');
      } else {
        this.endPlayerTurn();
      }
    });
    
    // Defend button
    const defendBtn = this.createButton(width * 0.5, height * 0.94, '🛡 DEFEND', 0x3498db, 120, 35);
    defendBtn.setInteractive();
    defendBtn.on('pointerdown', () => {
      this.battleSystem.defend(player);
      this.updateLog();
      this.endPlayerTurn();
    });
  }

  private createButton(x: number, y: number, text: string, color: number, w: number = 100, h: number = 40): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, w, h, color)
      .setStrokeStyle(2, 0xffffff);
    
    const label = this.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: `${Math.min(14, h * 0.4)}px`,
      color: '#ffffff',
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    button.setSize(w, h);
    
    // Touch feedback
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

  private updateLog(): void {
    const log = this.battleSystem.getBattleLog();
    const recent = log.slice(-3).join('\n');
    this.logText.setText(recent);
  }

  private updateTimer(): void {
    if (this.battleEnded) return;
    
    this.battleTimer--;
    this.timerText.setText(`⏱ ${this.battleTimer}s`);
    
    if (this.battleTimer <= 0) {
      this.endBattle('timeout');
    }
  }

  private endPlayerTurn(): void {
    // Process turn end effects
    this.battleSystem.processTurnEnd();
    
    // Check for player death from health drain
    if (this.battleState.player.currentHealth <= 0) {
      this.battleState.player.currentHealth = 0;
      this.endBattle('lose');
      return;
    }
    
    // Enemy turn
    this.time.delayedCall(500, () => {
      this.enemyTurn();
    });
  }

  private enemyTurn(): void {
    if (this.battleEnded) return;
    
    const enemy = this.battleState.enemy;
    const player = this.battleState.player;
    
    // Simple AI: use ability if health > 50%, otherwise attack
    if (enemy.currentHealth > enemy.maxHealth * 0.5 && enemy.demon.abilities.length > 0) {
      const ability = enemy.demon.abilities[Math.floor(Math.random() * enemy.demon.abilities.length)];
      this.battleSystem.useAbility(enemy, player, ability);
    } else {
      this.battleSystem.basicAttack(enemy, player);
    }
    
    this.updateLog();
    
    // Check for player death
    if (this.battleState.isOver) {
      this.endBattle('lose');
      return;
    }
    
    // Process turn end
    this.battleSystem.processTurnEnd();
    
    // Check for death from health drain
    if (player.currentHealth <= 0) {
      player.currentHealth = 0;
      this.endBattle('lose');
      return;
    }
    
    // Redraw UI for player turn
    this.drawBattle();
  }

  private endBattle(result: 'win' | 'lose' | 'timeout'): void {
    this.battleEnded = true;
    
    this.time.delayedCall(1000, () => {
      this.scene.start('ResultsScene', { 
        result,
        demonName: this.battleState.enemy.demon.name
      });
    });
  }
}
