import { Demon, DemonInstance, Stance, Ability } from '../entities/Demon';
import { DEMONS, getRandomDemon, getRandomStance } from '../data/demons';

export interface BattleState {
  player: DemonInstance;
  enemy: DemonInstance;
  turnNumber: number;
  currentTurn: 'player' | 'enemy';
  battleLog: string[];
  isOver: boolean;
  winner: 'player' | 'enemy' | null;
  consecutiveAbilities: Map<string, number>; // Track consecutive ability uses
}

export class BattleSystem {
  private state: BattleState;

  constructor(playerDemonType?: string, enemyDemonType?: string) {
    // Create player demon
    const playerDemon = playerDemonType 
      ? DEMONS[playerDemonType as keyof typeof DEMONS]
      : getRandomDemon();
    
    // Create enemy demon
    const enemyDemon = enemyDemonType
      ? DEMONS[enemyDemonType as keyof typeof DEMONS]
      : getRandomDemon();

    this.state = {
      player: this.createDemonInstance(playerDemon),
      enemy: this.createDemonInstance(enemyDemon),
      turnNumber: 1,
      currentTurn: 'player',
      battleLog: [],
      isOver: false,
      winner: null,
      consecutiveAbilities: new Map()
    };

    this.log(`A wild ${enemyDemon.name} appears!`);
    this.log(`Stance: ${this.state.enemy.currentStance.name}`);
  }

  private createDemonInstance(demon: Demon): DemonInstance {
    const stance = getRandomStance(demon);
    return {
      demon,
      currentStance: stance,
      currentHealth: demon.baseStats.maxHealth,
      maxHealth: demon.baseStats.maxHealth,
      currentAttack: demon.baseStats.attack,
      currentDefense: demon.baseStats.defense,
      currentSpeed: demon.baseStats.speed,
      power: 0,
      buffs: [],
      debuffs: []
    };
  }

  private applyStanceModifiers(instance: DemonInstance): void {
    const stance = instance.currentStance;
    
    // Reset to base
    instance.currentAttack = instance.demon.baseStats.attack;
    instance.currentDefense = instance.demon.baseStats.defense;
    instance.currentSpeed = instance.demon.baseStats.speed;

    // Apply stance modifiers
    if (stance.modifiers.attack) {
      instance.currentAttack *= stance.modifiers.attack;
    }
    if (stance.modifiers.defense) {
      instance.currentDefense *= stance.modifiers.defense;
    }
    if (stance.modifiers.speed) {
      instance.currentSpeed *= stance.modifiers.speed;
    }
  }

  switchStance(instance: DemonInstance, stance: Stance): void {
    instance.currentStance = stance;
    this.applyStanceModifiers(instance);
    this.log(`${instance.demon.name} shifts to ${stance.name} stance.`);
  }

  useAbility(attacker: DemonInstance, defender: DemonInstance, ability: Ability): void {
    this.log(`${attacker.demon.name} uses ${ability.name}!`);

    // Track consecutive uses
    const count = this.state.consecutiveAbilities.get(ability.id) || 0;
    this.state.consecutiveAbilities.set(ability.id, count + 1);

    // Apply cost
    if (ability.cost.health) {
      attacker.currentHealth -= ability.cost.health;
      this.log(`Cost: ${ability.cost.health} health`);
    }
    if (ability.cost.defense) {
      attacker.currentDefense *= (1 - Math.abs(ability.cost.defense) / 100);
    }

    // Apply effect
    let damage = ability.effect.damage || 0;
    
    // Context bonuses
    if (ability.contextBonus) {
      if (ability.contextBonus.situation === 'consecutive' && count > 0) {
        damage += ability.contextBonus.bonusAmount * count;
        this.log(`Consecutive use bonus: +${ability.contextBonus.bonusAmount * count}`);
      }
      if (ability.contextBonus.situation === 'low_time' && this.state.turnNumber > 5) {
        damage += ability.contextBonus.bonusAmount;
        this.log(`Deadline panic bonus!`);
      }
    }

    // Apply damage
    if (damage > 0) {
      const actualDamage = Math.max(1, damage - defender.currentDefense / 2);
      defender.currentHealth -= actualDamage;
      this.log(`${defender.demon.name} takes ${Math.round(actualDamage)} damage!`);
    }

    // Apply healing
    if (ability.effect.heal) {
      attacker.currentHealth = Math.min(
        attacker.maxHealth,
        attacker.currentHealth + ability.effect.heal
      );
      this.log(`${attacker.demon.name} heals ${ability.effect.heal}!`);
    }

    // Apply buffs
    if (ability.effect.buff) {
      attacker.buffs.push(ability.effect.buff);
      this.log(`${attacker.demon.name} gains ${ability.effect.buff} buff!`);
    }

    // Apply debuffs
    if (ability.effect.debuff) {
      defender.debuffs.push(ability.effect.debuff);
      this.log(`${defender.demon.name} suffers ${ability.effect.debuff}!`);
    }

    // Check for death
    if (defender.currentHealth <= 0) {
      defender.currentHealth = 0;
      this.state.isOver = true;
      this.state.winner = attacker === this.state.player ? 'player' : 'enemy';
      this.log(`${defender.demon.name} is defeated!`);
    }
  }

  basicAttack(attacker: DemonInstance, defender: DemonInstance): void {
    const damage = Math.max(1, attacker.currentAttack - defender.currentDefense / 2);
    defender.currentHealth -= damage;
    this.log(`${attacker.demon.name} attacks for ${Math.round(damage)} damage!`);

    if (defender.currentHealth <= 0) {
      defender.currentHealth = 0;
      this.state.isOver = true;
      this.state.winner = attacker === this.state.player ? 'player' : 'enemy';
      this.log(`${defender.demon.name} is defeated!`);
    }
  }

  defend(instance: DemonInstance): void {
    instance.currentDefense *= 1.5;
    instance.buffs.push('defending');
    this.log(`${instance.demon.name} braces for impact!`);
  }

  processTurnEnd(): void {
    // Process per-turn effects
    [this.state.player, this.state.enemy].forEach(instance => {
      // Health drain from stance
      if (instance.currentStance.modifiers.healthDrain) {
        instance.currentHealth -= instance.currentStance.modifiers.healthDrain;
        this.log(`${instance.demon.name} loses ${instance.currentStance.modifiers.healthDrain} health from ${instance.currentStance.name}.`);
      }

      // Power buildup
      if (instance.currentStance.modifiers.powerBuildup) {
        instance.power += instance.currentStance.modifiers.powerBuildup;
        this.log(`${instance.demon.name} builds power: ${instance.power}`);
      }
    });

    // Increment turn
    this.state.turnNumber++;
    
    // Swap turns
    this.state.currentTurn = this.state.currentTurn === 'player' ? 'enemy' : 'player';
  }

  getState(): BattleState {
    return this.state;
  }

  private log(message: string): void {
    this.state.battleLog.push(message);
  }

  getLastLog(): string {
    return this.state.battleLog[this.state.battleLog.length - 1] || '';
  }

  getBattleLog(): string[] {
    return this.state.battleLog;
  }
}
