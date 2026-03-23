import { describe, it, expect, beforeEach } from 'vitest';
import { ProfilingSystem } from '../src/systems/ProfilingSystem';

// Mock localStorage
const mockStorage: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => mockStorage[key] || null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(key => delete mockStorage[key]); },
  length: Object.keys(mockStorage).length,
  key: (index: number) => Object.keys(mockStorage)[index] || null,
};

describe('ProfilingSystem', () => {
  beforeEach(() => {
    // Reset storage
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    // Reset cached profile
    (ProfilingSystem as any).profile = null;
  });

  describe('getProfile', () => {
    it('should create default profile if none exists', () => {
    global.localStorage = mockLocalStorage as any;
    
    const profile = ProfilingSystem.getProfile();
    
    expect(profile).toBeDefined();
    expect(profile.battlesFought).toBe(0);
    expect(profile.battlesWon).toBe(0);
    expect(profile.demonsCaptured).toEqual([]);
  });
  });

  describe('trackBattleStart', () => {
    it('should increment battles fought', () => {
    global.localStorage = mockLocalStorage as any;
    
    ProfilingSystem.trackBattleStart('hope');
    const profile = ProfilingSystem.getProfile();
    
    expect(profile.battlesFought).toBe(1);
    expect(profile.demonsFielded['hope']).toBe(1);
  });
  });

  describe('trackBattleWin', () => {
    it('should increment battles won and track turns', () => {
    global.localStorage = mockLocalStorage as any;
    
    ProfilingSystem.trackBattleStart('hope');
    ProfilingSystem.trackBattleWin(5, 0.8);
    const profile = ProfilingSystem.getProfile();
    
    expect(profile.battlesWon).toBe(1);
    expect(profile.totalTurnsPlayed).toBe(5);
    expect(profile.averageTurnsPerBattle).toBe(5);
  });
  });

  describe('getPlayStyle', () => {
    it('should return avoidant for high avoidance', () => {
    global.localStorage = mockLocalStorage as any;
    
    // Simulate avoidant behavior
    for (let i = 0; i < 10; i++) {
      ProfilingSystem.trackBattleStart('hope');
    }
    const profile = ProfilingSystem.getProfile();
    profile.battlesAvoided = 15; // More avoided than fought
    
    const style = ProfilingSystem.getPlayStyle();
    expect(style).toBe('avoidant');
  });

    it('should return aggressive for high ability use', () => {
    global.localStorage = mockLocalStorage as any;
    
    // Simulate aggressive behavior
    ProfilingSystem.trackBattleStart('hope');
    ProfilingSystem.trackBattleWin(3, 0.9);
    const profile = ProfilingSystem.getProfile();
    profile.abilitiesUsed = 10;
    profile.basicAttacksUsed = 2;
    
    const style = ProfilingSystem.getPlayStyle();
    expect(style).toBe('aggressive');
  });
  });

  describe('getEndingType', () => {
    it('should return avoider for high flee count', () => {
    global.localStorage = mockLocalStorage as any;
    
    const profile = ProfilingSystem.getProfile();
    profile.demonsFled = ['anxiety', 'procrastination', 'numbness'];
    
    const ending = ProfilingSystem.getEndingType();
    expect(ending).toBe('avoider');
  });

    it('should return integrated when all demons captured', () => {
    global.localStorage = mockLocalStorage as any;
    
    const profile = ProfilingSystem.getProfile();
    profile.demonsCaptured = ['anxiety', 'procrastination', 'confidence', 'numbness', 'mania', 'hope'];
    
    const ending = ProfilingSystem.getEndingType();
    expect(ending).toBe('integrated');
  });

    it('should return self-destroyer for anxiety/mania overuse', () => {
    global.localStorage = mockLocalStorage as any;
    
    const profile = ProfilingSystem.getProfile();
    profile.demonsFielded = {
      'anxiety': 15,
      'mania': 20,
      'hope': 3,
    };
    
    const ending = ProfilingSystem.getEndingType();
    expect(ending).toBe('self-destroyer');
  });
  });
});
