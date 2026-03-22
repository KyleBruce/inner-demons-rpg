import { Demon, DemonType } from '../entities/Demon';

// All demon definitions
export const DEMONS: Record<DemonType, Demon> = {
  anxiety: {
    type: 'anxiety',
    name: 'Anxiety',
    description: 'Fast but fragile. Speed is power, but power has a cost.',
    isBoss: false,
    stances: [
      {
        id: 'panicked',
        name: 'Panicked',
        description: 'Fast. Very fast. Everything is an emergency.',
        modifiers: { speed: 2.0, healthDrain: 5 }
      },
      {
        id: 'managed',
        name: 'Managed',
        description: 'Slower. Stable. Breathing through it.',
        modifiers: { speed: 1.2, defense: 1.2 }
      }
    ],
    abilities: [
      {
        id: 'overthink',
        name: 'Overthink',
        description: 'Double your speed this turn. Lose 10% health.',
        cost: { health: 10 },
        effect: { buff: 'speed', buffAmount: 2.0 }
      },
      {
        id: 'spiral',
        name: 'Spiral',
        description: 'Attack increases with each consecutive use.',
        cost: {},
        effect: { damage: 15 },
        contextBonus: { situation: 'consecutive', bonusAmount: 10 }
      }
    ],
    baseStats: { maxHealth: 80, attack: 12, defense: 8, speed: 15 }
  },

  procrastination: {
    type: 'procrastination',
    name: 'Procrastination',
    description: 'Power builds when you wait. But will you act in time?',
    isBoss: false,
    stances: [
      {
        id: 'avoiding',
        name: 'Avoiding',
        description: 'Build power each turn. But lose the chance to act.',
        modifiers: { powerBuildup: 20, attack: 0.5 }
      },
      {
        id: 'confronting',
        name: 'Confronting',
        description: 'Act now. Weaker, but at least you showed up.',
        modifiers: { attack: 1.0, speed: 1.1 }
      }
    ],
    abilities: [
      {
        id: 'one_more_turn',
        name: 'One More Turn',
        description: 'Skip this turn. Triple damage next turn.',
        cost: { turns: 1 },
        effect: { buff: 'attack', buffAmount: 3.0 }
      },
      {
        id: 'deadline_panic',
        name: 'Deadline Panic',
        description: 'Massive damage if battle is almost over. Weak otherwise.',
        cost: {},
        effect: { damage: 10 },
        contextBonus: { situation: 'low_time', bonusAmount: 40 }
      }
    ],
    baseStats: { maxHealth: 90, attack: 10, defense: 12, speed: 8 }
  },

  confidence: {
    type: 'confidence',
    name: 'Confidence',
    description: 'Buff others. But fragile when challenged.',
    isBoss: false,
    stances: [
      {
        id: 'steady',
        name: 'Steady',
        description: 'Consistent buffs. Nothing flashy.',
        modifiers: { attack: 1.0, defense: 1.0 }
      },
      {
        id: 'bold',
        name: 'Bold',
        description: 'Stronger effects. Shatters on criticism.',
        modifiers: { attack: 1.5, defense: 0.5 }
      }
    ],
    abilities: [
      {
        id: 'speak_up',
        name: 'Speak Up',
        description: 'Major attack buff. Become vulnerable to criticism.',
        cost: { defense: -50 },
        effect: { buff: 'attack', buffAmount: 2.5 }
      },
      {
        id: 'inspire',
        name: 'Inspire',
        description: 'Heal yourself and boost defense.',
        cost: {},
        effect: { heal: 15, buff: 'defense', buffAmount: 1.3 }
      }
    ],
    baseStats: { maxHealth: 70, attack: 14, defense: 10, speed: 10 }
  },

  numbness: {
    type: 'numbness',
    name: 'Numbness',
    description: 'Take hits. Don\'t feel them. But don\'t do much either.',
    isBoss: false,
    stances: [
      {
        id: 'numb',
        name: 'Numb',
        description: 'Massive defense. Almost no offense.',
        modifiers: { defense: 2.5, attack: 0.3 }
      },
      {
        id: 'feeling',
        name: 'Feeling',
        description: 'Balanced. It hurts, but you can fight back.',
        modifiers: { defense: 1.0, attack: 1.0, healthDrain: 3 }
      }
    ],
    abilities: [
      {
        id: 'dissociate',
        name: 'Dissociate',
        description: 'Nullify next 2 hits. Can\'t act while dissociating.',
        cost: { turns: 2 },
        effect: { special: 'invulnerable' }
      },
      {
        id: 'shutdown',
        name: 'Shutdown',
        description: 'Endure everything for 3 turns. Heal 50% of damage taken.',
        cost: {},
        effect: { special: 'absorb', heal: 50 }
      }
    ],
    baseStats: { maxHealth: 120, attack: 5, defense: 20, speed: 5 }
  },

  mania: {
    type: 'mania',
    name: 'Mania',
    description: 'Unpredictable. Could be amazing. Could be disaster.',
    isBoss: false,
    stances: [
      {
        id: 'hypomanic',
        name: 'Hypomanic',
        description: 'Everything is faster. Everything is louder.',
        modifiers: { speed: 1.8, attack: 1.3, defense: 0.6 }
      },
      {
        id: 'crashing',
        name: 'Crashing',
        description: 'The comedown. Slow. Heavy. But stable.',
        modifiers: { speed: 0.5, defense: 1.5, healthDrain: 2 }
      }
    ],
    abilities: [
      {
        id: 'chaos',
        name: 'Chaos',
        description: 'Random effect. Could be 50 damage, could be -20 health.',
        cost: {},
        effect: { special: 'random', damage: 0 }
      },
      {
        id: 'all_in',
        name: 'All In',
        description: 'Double everything. Triple cost.',
        cost: { health: 15 },
        effect: { buff: 'all', buffAmount: 2.0 }
      }
    ],
    baseStats: { maxHealth: 75, attack: 15, defense: 7, speed: 18 }
  },

  hope: {
    type: 'hope',
    name: 'Hope',
    description: 'Support others. Keep them standing. But can\'t do it alone.',
    isBoss: false,
    stances: [
      {
        id: 'cautious',
        name: 'Cautious',
        description: 'Small, reliable effects. Stay safe.',
        modifiers: { defense: 1.3, attack: 0.8 }
      },
      {
        id: 'reckless',
        name: 'Reckless',
        description: 'Big effects. Big risk.',
        modifiers: { attack: 1.5, defense: 0.5, healthDrain: 4 }
      }
    ],
    abilities: [
      {
        id: 'hold_on',
        name: 'Hold On',
        description: 'Prevent one demon from being defeated this battle.',
        cost: { health: 20 },
        effect: { special: 'prevent_death' }
      },
      {
        id: 'believe',
        name: 'Believe',
        description: 'Buff all stats slightly. Stacks with other buffs.',
        cost: {},
        effect: { buff: 'all', buffAmount: 1.15 }
      }
    ],
    baseStats: { maxHealth: 60, attack: 8, defense: 12, speed: 12 }
  },

  mask: {
    type: 'mask',
    name: 'The Mask',
    description: 'It looks like you. Fights like you. But it\'s not you.',
    isBoss: true,
    stances: [
      {
        id: 'mirroring',
        name: 'Mirroring',
        description: 'Copies your stance and stats.',
        modifiers: {}
      },
      {
        id: 'superior',
        name: 'Superior',
        description: 'Better than you. Always was.',
        modifiers: { attack: 1.3, defense: 1.3, speed: 1.2 }
      }
    ],
    abilities: [
      {
        id: 'identity_crisis',
        name: 'Identity Crisis',
        description: 'Switch stances to counter your current stance.',
        cost: {},
        effect: { special: 'counter_stance' }
      },
      {
        id: 'gaslight',
        name: 'Gaslight',
        description: 'Lower your attack and defense. Make you doubt everything.',
        cost: {},
        effect: { debuff: 'all', debuffAmount: 0.7 }
      }
    ],
    baseStats: { maxHealth: 200, attack: 15, defense: 15, speed: 15 }
  }
};

// Get a random demon (not boss)
export function getRandomDemon(): Demon {
  const types: DemonType[] = ['anxiety', 'procrastination', 'confidence', 'numbness', 'mania', 'hope'];
  const randomType = types[Math.floor(Math.random() * types.length)];
  return DEMONS[randomType];
}

// Get a random stance for a demon
export function getRandomStance(demon: Demon): typeof demon.stances[0] {
  return demon.stances[Math.floor(Math.random() * demon.stances.length)];
}
