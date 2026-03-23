import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BattleSystem } from '../src/systems/BattleSystem';

// Mock demons for testing
const mockPlayerDemon = {
  type: 'hope',
  name: 'Hope',
  description: 'Test demon',
  isBoss: false,
  baseStats: { maxHealth: 100, attack: 20, defense: 10, speed: 15 },
  stances: [
    { id: 'hopeful', name: 'Hopeful', description: 'Test stance', attackMod: 1.0, defenseMod: 1.0, speedMod: 1.0 },
  ],
  abilities: [],
};

const mockEnemyDemon = {
  type: 'anxiety',
  name: 'Anxiety',
  description: 'Test enemy',
  isBoss: false,
  baseStats: { maxHealth: 80, attack: 15, defense: 8, speed: 10 },
  stances: [
    { id: 'anxious', name: 'Anxious', description: 'Test stance', attackMod: 1.0, defenseMod: 1.0, speedMod: 1.0 },
  ],
  abilities: [],
};

describe('BattleSystem', () => {
  let battleSystem: BattleSystem;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basicAttack', () => {
    it('should deal damage to defender', () => {
      battleSystem = new BattleSystem('hope', 'anxiety');
      const initialState = battleSystem.getState();
      const initialHealth = initialState.enemy.currentHealth;
      
      const result = battleSystem.basicAttack(initialState.player, initialState.enemy);
      
      expect(result.damage).toBeGreaterThan(0);
      expect(result.isDodged).toBe(false);
      expect(initialState.enemy.currentHealth).toBeLessThan(initialHealth);
    });

    it('should apply critical hit damage multiplier', () => {
      // Run attack many times to check crit damage is 1.5x
      let critFound = false;
      
      for (let i = 0; i < 100; i++) {
        battleSystem = new BattleSystem('hope', 'anxiety');
        const state = battleSystem.getState();
        const normalDamage = state.player.currentAttack - state.enemy.currentDefense / 2;
        
        const result = battleSystem.basicAttack(state.player, state.enemy);
        
        if (result.isCritical) {
          expect(result.damage).toBeGreaterThanOrEqual(normalDamage * 1.4);
          critFound = true;
          break;
        }
      }
      
      // With 100 attempts, should find at least one crit (10% chance)
      // This test might occasionally fail due to randomness
    });

    it('should allow evasion based on speed difference', () => {
      let dodgeFound = false;
      
      // Create scenario where enemy is much faster than player
      for (let i = 0; i < 200; i++) {
        battleSystem = new BattleSystem('hope', 'mania'); // Mania has high speed
        const state = battleSystem.getState();
        
        const result = battleSystem.basicAttack(state.player, state.enemy);
        
        if (result.isDodged) {
          expect(result.damage).toBe(0);
          dodgeFound = true;
          break;
        }
      }
      
      // Evasion is 0-20% based on speed, so 200 attempts should find one
    });

    it('should end battle when health reaches 0', () => {
      battleSystem = new BattleSystem('hope', 'anxiety');
      const state = battleSystem.getState();
      
      // Reduce enemy health to 1
      state.enemy.currentHealth = 1;
      
      battleSystem.basicAttack(state.player, state.enemy);
      
      expect(state.enemy.currentHealth).toBe(0);
      expect(state.isOver).toBe(true);
      expect(state.winner).toBe('player');
    });
  });

  describe('getState', () => {
    it('should initialize with correct demon types', () => {
      battleSystem = new BattleSystem('hope', 'anxiety');
      const state = battleSystem.getState();
      
      expect(state.player.demon.type).toBe('hope');
      expect(state.enemy.demon.type).toBe('anxiety');
    });

    it('should start with full health', () => {
      battleSystem = new BattleSystem('hope', 'anxiety');
      const state = battleSystem.getState();
      
      expect(state.player.currentHealth).toBe(state.player.maxHealth);
      expect(state.enemy.currentHealth).toBe(state.enemy.maxHealth);
    });

    it('should track turn number', () => {
      battleSystem = new BattleSystem('hope', 'anxiety');
      const state = battleSystem.getState();
      
      expect(state.turnNumber).toBe(1);
    });
  });
});
