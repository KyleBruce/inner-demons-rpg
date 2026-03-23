// Player's captured demons collection
export interface CapturedDemon {
  type: string;
  name: string;
  level: number;
  experience: number;
  battlesWon: number;
  capturedAt: number; // timestamp
}

// Collection manager
export class DemonCollection {
  private static STORAGE_KEY = 'inner_demons_collection';
  
  static getCollection(): CapturedDemon[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  
  static saveCollection(collection: CapturedDemon[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(collection));
    } catch (e) {
      console.error('Failed to save collection:', e);
    }
  }
  
  static captureDemon(type: string, name: string): CapturedDemon {
    const collection = this.getCollection();
    
    // Check if already captured
    const existing = collection.find(d => d.type === type);
    if (existing) {
      // Already have this demon - just level it up
      existing.experience += 50;
      existing.battlesWon++;
      existing.level = Math.floor(existing.experience / 100) + 1;
      this.saveCollection(collection);
      return existing;
    }
    
    // New capture
    const newDemon: CapturedDemon = {
      type,
      name,
      level: 1,
      experience: 25, // Starting XP from capture
      battlesWon: 1,
      capturedAt: Date.now(),
    };
    
    collection.push(newDemon);
    this.saveCollection(collection);
    return newDemon;
  }
  
  static getCapturedTypes(): string[] {
    return this.getCollection().map(d => d.type);
  }
  
  static hasDemon(type: string): boolean {
    return this.getCollection().some(d => d.type === type);
  }
  
  static getDemonByType(type: string): CapturedDemon | undefined {
    return this.getCollection().find(d => d.type === type);
  }
  
  static addExperience(type: string, amount: number): void {
    const collection = this.getCollection();
    const demon = collection.find(d => d.type === type);
    if (demon) {
      demon.experience += amount;
      demon.battlesWon++;
      demon.level = Math.floor(demon.experience / 100) + 1;
      this.saveCollection(collection);
    }
  }
  
  static clearCollection(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
