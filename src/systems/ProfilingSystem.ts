// Player behavior profiling system
// Tracks how you play and reflects it back through therapist narrator

export interface PlayerProfile {
  // Battle style
  battlesFought: number;
  battlesWon: number;
  battlesLost: number;
  battlesAvoided: number;
  averageTurnsPerBattle: number;
  totalTurnsPlayed: number;
  
  // Demon preferences
  demonsFielded: Record<string, number>; // demonType -> times used
  demonsCaptured: string[];
  demonsAvoided: string[];
  favoriteDemon: string | null;
  
  // Stance choices
  stanceChoices: Record<string, number>; // stance -> times chosen
  // e.g., "anxious" vs "managed" for Anxiety
  
  // Combat behavior
  abilitiesUsed: number;
  basicAttacksUsed: number;
  timesHealed: number;
  timesLowHealth: number; // ended battle with <25% HP
  
  // Avoidance patterns
  demonsFled: string[]; // failed to recognize
  mazesExplored: number;
  stepsInMaze: number;
  
  // Boss performance
  bossesFought: number;
  bossesDefeated: number;
  
  // Session meta
  sessionsPlayed: number;
  totalPlayTimeMs: number;
  firstPlayedAt: number;
  lastPlayedAt: number;
}

const STORAGE_KEY = 'inner_demons_profile';

export class ProfilingSystem {
  private static profile: PlayerProfile | null = null;
  
  static getProfile(): PlayerProfile {
    if (this.profile) return this.profile;
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.profile = JSON.parse(data);
        return this.profile!;
      }
    } catch (e) {
      console.error('Failed to load profile:', e);
    }
    
    // Create new profile
    this.profile = this.createDefaultProfile();
    return this.profile;
  }
  
  private static createDefaultProfile(): PlayerProfile {
    return {
      battlesFought: 0,
      battlesWon: 0,
      battlesLost: 0,
      battlesAvoided: 0,
      averageTurnsPerBattle: 0,
      totalTurnsPlayed: 0,
      
      demonsFielded: {},
      demonsCaptured: [],
      demonsAvoided: [],
      favoriteDemon: null,
      
      stanceChoices: {},
      abilitiesUsed: 0,
      basicAttacksUsed: 0,
      timesHealed: 0,
      timesLowHealth: 0,
      
      demonsFled: [],
      mazesExplored: 0,
      stepsInMaze: 0,
      
      bossesFought: 0,
      bossesDefeated: 0,
      
      sessionsPlayed: 0,
      totalPlayTimeMs: 0,
      firstPlayedAt: Date.now(),
      lastPlayedAt: Date.now(),
    };
  }
  
  static saveProfile(): void {
    if (!this.profile) return;
    
    try {
      this.profile.lastPlayedAt = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.error('Failed to save profile:', e);
    }
  }
  
  // Event tracking methods
  
  static trackBattleStart(demonType: string): void {
    const profile = this.getProfile();
    profile.battlesFought++;
    profile.demonsFielded[demonType] = (profile.demonsFielded[demonType] || 0) + 1;
    this.updateFavoriteDemon();
    this.saveProfile();
  }
  
  static trackBattleWin(turns: number, endHealthPercent: number): void {
    const profile = this.getProfile();
    profile.battlesWon++;
    profile.totalTurnsPlayed += turns;
    profile.averageTurnsPerBattle = profile.totalTurnsPlayed / profile.battlesFought;
    
    if (endHealthPercent < 0.25) {
      profile.timesLowHealth++;
    }
    
    this.saveProfile();
  }
  
  static trackBattleLost(): void {
    const profile = this.getProfile();
    profile.battlesLost++;
    this.saveProfile();
  }
  
  static trackStanceChoice(stanceId: string): void {
    const profile = this.getProfile();
    profile.stanceChoices[stanceId] = (profile.stanceChoices[stanceId] || 0) + 1;
    this.saveProfile();
  }
  
  static trackAbilityUsed(): void {
    const profile = this.getProfile();
    profile.abilitiesUsed++;
    this.saveProfile();
  }
  
  static trackBasicAttack(): void {
    const profile = this.getProfile();
    profile.basicAttacksUsed++;
    this.saveProfile();
  }
  
  static trackDemonCaptured(demonType: string): void {
    const profile = this.getProfile();
    if (!profile.demonsCaptured.includes(demonType)) {
      profile.demonsCaptured.push(demonType);
    }
    // Remove from fled list if recaptured
    profile.demonsFled = profile.demonsFled.filter(d => d !== demonType);
    this.saveProfile();
  }
  
  static trackDemonFled(demonType: string): void {
    const profile = this.getProfile();
    if (!profile.demonsFled.includes(demonType)) {
      profile.demonsFled.push(demonType);
    }
    this.saveProfile();
  }
  
  static trackMazeExplored(steps: number): void {
    const profile = this.getProfile();
    profile.mazesExplored++;
    profile.stepsInMaze += steps;
    this.saveProfile();
  }
  
  static trackBossFought(): void {
    const profile = this.getProfile();
    profile.bossesFought++;
    this.saveProfile();
  }
  
  static trackBossDefeated(): void {
    const profile = this.getProfile();
    profile.bossesDefeated++;
    this.saveProfile();
  }
  
  static trackSessionStart(): void {
    const profile = this.getProfile();
    profile.sessionsPlayed++;
    this.saveProfile();
  }
  
  // Analysis methods
  
  private static updateFavoriteDemon(): void {
    const profile = this.getProfile();
    const entries = Object.entries(profile.demonsFielded);
    if (entries.length === 0) {
      profile.favoriteDemon = null;
      return;
    }
    
    entries.sort((a, b) => b[1] - a[1]);
    profile.favoriteDemon = entries[0][0];
  }
  
  static getPlayStyle(): 'aggressive' | 'defensive' | 'avoidant' | 'balanced' {
    const profile = this.getProfile();
    
    // Calculate ratios
    const avoidRatio = profile.battlesAvoided / Math.max(1, profile.battlesFought + profile.battlesAvoided);
    const abilityRatio = profile.abilitiesUsed / Math.max(1, profile.abilitiesUsed + profile.basicAttacksUsed);
    const winRatio = profile.battlesWon / Math.max(1, profile.battlesFought);
    
    // Avoidant if >30% battles avoided
    if (avoidRatio > 0.3) return 'avoidant';
    
    // Aggressive if high ability use and high win rate
    if (abilityRatio > 0.6 && winRatio > 0.7) return 'aggressive';
    
    // Defensive if low ability use but still winning
    if (abilityRatio < 0.4 && winRatio > 0.5) return 'defensive';
    
    return 'balanced';
  }
  
  static getAvoidancePattern(): string | null {
    const profile = this.getProfile();
    
    if (profile.demonsFled.length === 0) return null;
    
    // Which demon type do you fail to recognize most?
    const fledCounts: Record<string, number> = {};
    profile.demonsFled.forEach(d => {
      fledCounts[d] = (fledCounts[d] || 0) + 1;
    });
    
    const entries = Object.entries(fledCounts);
    if (entries.length === 0) return null;
    
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }
  
  static getStancePattern(): string | null {
    const profile = this.getProfile();
    
    const entries = Object.entries(profile.stanceChoices);
    if (entries.length === 0) return null;
    
    // Find dominant stance
    entries.sort((a, b) => b[1] - a[1]);
    return entries[0][0];
  }
  
  static getEndingType(): string {
    const profile = this.getProfile();
    const playStyle = this.getPlayStyle();
    
    // Calculate ending based on behavior
    
    // The Self-Destroyer: Used anxiety/burnout demons extensively
    const anxietyUse = profile.demonsFielded['anxiety'] || 0;
    const maniaUse = profile.demonsFielded['mania'] || 0;
    const totalUse = Object.values(profile.demonsFielded).reduce((a, b) => a + b, 0);
    if (totalUse > 5 && (anxietyUse + maniaUse) / totalUse > 0.6) {
      return 'self-destroyer';
    }
    
    // The Avoider: High avoidance, many demons fled
    if (playStyle === 'avoidant' || profile.demonsFled.length >= 3) {
      return 'avoider';
    }
    
    // The Grinder: Fought every battle, many won
    if (profile.battlesAvoided === 0 && profile.battlesWon > 5) {
      return 'grinder';
    }
    
    // The Integrated: Captured all demons
    if (profile.demonsCaptured.length >= 6) {
      return 'integrated';
    }
    
    // The Balancer: Default - mixed approach
    return 'balancer';
  }
  
  // Therapist commentary generator
  
  static getTherapistCommentary(situation: 'battle_start' | 'battle_win' | 'battle_lose' | 'capture' | 'fled' | 'maze' | 'ending'): string {
    const profile = this.getProfile();
    const playStyle = this.getPlayStyle();
    const favoriteDemon = profile.favoriteDemon;
    
    const comments: Record<string, string[]> = {
      battle_start: [
        "Another fight. You do seem to enjoy the dance.",
        "Here we go again. At least you're consistent.",
        "This demon looks familiar. Don't they all?",
      ],
      battle_win: [
        "Clean victory. You're getting good at this.",
        "Won again. But did you understand it, or just hit it?",
        "Impressive. Or obsessive. Hard to tell with you.",
      ],
      battle_lose: [
        "Sometimes you lose. The demons are patient.",
        "They always come back, you know. Stronger.",
        "A setback. But you knew that already.",
      ],
      capture: [
        "You understood it. That's the hard part.",
        "Recognition. The rarest of skills.",
        "Another demon named. Another piece of yourself.",
      ],
      fled: [
        "It got away. But you'll see it again.",
        "Some demons don't want to be known. Yet.",
        "Missed that one. They remember.",
      ],
      maze: [
        "The maze goes nowhere. That's the point.",
        "Lost in thought. Literally.",
        "Every path leads back. Every turn is a thought you've had before.",
      ],
      ending: this.getEndingCommentary(),
    };
    
    // Add personalized comments based on profile
    if (situation === 'battle_start' && favoriteDemon) {
      if (favoriteDemon === 'anxiety') {
        comments.battle_start.push("Anxiety again. You really lean into the fear.");
      } else if (favoriteDemon === 'hope') {
        comments.battle_start.push("Still fielding Hope. Optimism or denial?");
      }
    }
    
    if (situation === 'maze' && profile.mazesExplored > 3) {
      comments.maze.push("You've walked these paths many times. The maze knows you now.");
    }
    
    if (playStyle === 'avoidant' && situation === 'battle_start') {
      comments.battle_start.push("You've been avoiding a lot of battles. I noticed.");
    }
    
    const options = comments[situation] || comments.battle_start;
    return options[Math.floor(Math.random() * options.length)];
  }
  
  private static getEndingCommentary(): string[] {
    const ending = this.getEndingType();
    
    const endings: Record<string, string[]> = {
      'avoider': [
        "You ran from everything. The demons are still there. But at least you're fast now.",
        "Avoidance is a strategy. Not a good one, but a strategy.",
      ],
      'grinder': [
        "You fought every battle. You're exhausted. But you're strong.",
        "No retreat, no surrender. Admirable. Exhausting. Maybe both.",
      ],
      'balancer': [
        "You picked your battles. Some things you faced, some you deferred. That's called living.",
        "The middle path. Boring but effective.",
      ],
      'self-destroyer': [
        "You used Anxiety and Mania on everything. You won, but at what cost?",
        "Power has a price. You paid it. Was it worth it?",
      ],
      'integrated': [
        "You accepted every demon. They're not enemies anymore. They're just... you.",
        "Complete. Whole. For what it's worth.",
      ],
    };
    
    return endings[ending] || endings['balancer'];
  }
  
  // Clear profile (for testing/reset)
  static clearProfile(): void {
    this.profile = null;
    localStorage.removeItem(STORAGE_KEY);
  }
}
