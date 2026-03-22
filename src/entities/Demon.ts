// Demon types
export type DemonType = 'anxiety' | 'procrastination' | 'confidence' | 'numbness' | 'mania' | 'hope' | 'mask';

// Stance definitions
export interface Stance {
  id: string;
  name: string;
  description: string;
  modifiers: {
    attack?: number;      // Multiplier (1.0 = normal)
    defense?: number;     // Multiplier
    speed?: number;       // Multiplier
    healthDrain?: number; // Health lost per turn
    powerBuildup?: number; // Power gained per turn if waiting
  };
}

// Ability definitions
export interface Ability {
  id: string;
  name: string;
  description: string;
  cost: {
    health?: number;      // Health cost
    turns?: number;       // Skip turns
    defense?: number;     // Defense reduction
  };
  effect: {
    damage?: number;      // Base damage
    heal?: number;        // Healing
    buff?: string;        // Stat to buff
    buffAmount?: number;  // Buff amount
    debuff?: string;      // Stat to debuff on enemy
    debuffAmount?: number;
    special?: string;     // Special effect ID
  };
  contextBonus?: {
    situation: string;    // When this ability is better
    bonusAmount: number;  // Extra effect
  };
}

// Full demon definition
export interface Demon {
  type: DemonType;
  name: string;
  description: string;
  isBoss: boolean;
  stances: Stance[];
  abilities: Ability[];
  baseStats: {
    maxHealth: number;
    attack: number;
    defense: number;
    speed: number;
  };
}

// Demon instance in battle
export interface DemonInstance {
  demon: Demon;
  currentStance: Stance;
  currentHealth: number;
  maxHealth: number;
  currentAttack: number;
  currentDefense: number;
  currentSpeed: number;
  power: number;          // Built up power from waiting
  buffs: string[];        // Active buffs
  debuffs: string[];      // Active debuffs
}
