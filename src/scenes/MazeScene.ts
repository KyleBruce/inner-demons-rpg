import Phaser from 'phaser';
import { DemonType } from '../data/demons';
import { DemonCollection } from '../systems/Collection';
import { ProfilingSystem } from '../systems/ProfilingSystem';

interface MazeCell {
  x: number;
  y: number;
  visited: boolean;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
}

interface MazeSceneData {
  playerDemonType?: string;
}

export class MazeScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private playerX: number = 1;
  private playerY: number = 1;
  private maze: MazeCell[][] = [];
  private mazeSize: number = 7;
  private cellSize: number = 50;
  private encounterChance: number = 0.15;
  private moveCount: number = 0;
  private stepsUntilBoss: number = 20;
  private playerDemonType: string = 'hope';
  private stepText!: Phaser.GameObjects.Text;
  
  constructor() {
    super({ key: 'MazeScene' });
  }
  
  create(data: MazeSceneData): void {
    const { width, height } = this.scale;
    
    // Get player's selected demon (use first captured if not specified)
    this.playerDemonType = data.playerDemonType || 
      (DemonCollection.getCollection()[0]?.type || 'hope');
    
    this.cameras.main.setBackgroundColor('#0a0a1a');
    
    // Generate maze
    this.generateMaze();
    
    // Draw maze
    this.drawMaze();
    
    // Create player
    this.playerX = 1;
    this.playerY = 1;
    this.player = this.add.sprite(
      this.getCellX(this.playerX),
      this.getCellY(this.playerY),
      'player'
    ).setScale(1.5);
    
    // UI
    this.add.text(width / 2, 30, 'THE MAZE', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#e74c3c',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    
    this.add.text(width / 2, 50, '"Every path leads back. Every turn is a thought you\'ve had before."',
      {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#7f8c8d',
        align: 'center',
      }
    ).setOrigin(0.5);
    
    // Step counter
    this.stepText = this.add.text(width / 2, 70, `Steps: 0/${this.stepsUntilBoss} until The Mask`,
      {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#f1c40f',
      }
    ).setOrigin(0.5);
    
    // Instructions
    this.add.text(width / 2, height - 40, 'TAP to move in that direction', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#7f8c8d',
    }).setOrigin(0.5);
    
    // Touch controls
    this.setupControls();
    
    // Fade in
    this.cameras.main.fadeIn(300);
  }
  
  private generateMaze(): void {
    // Initialize maze grid
    this.maze = [];
    for (let y = 0; y < this.mazeSize; y++) {
      const row: MazeCell[] = [];
      for (let x = 0; x < this.mazeSize; x++) {
        row.push({
          x,
          y,
          visited: false,
          walls: { top: true, right: true, bottom: true, left: true },
        });
      }
      this.maze.push(row);
    }
    
    // Generate maze using recursive backtracker
    const stack: MazeCell[] = [];
    const start = this.maze[1][1];
    start.visited = true;
    stack.push(start);
    
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(current);
      
      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        this.removeWall(current, next);
        next.visited = true;
        stack.push(next);
      }
    }
    
    // Make maze more open (remove some walls randomly for loops)
    for (let y = 2; y < this.mazeSize - 2; y++) {
      for (let x = 2; x < this.mazeSize - 2; x++) {
        if (Math.random() < 0.2) {
          const cell = this.maze[y][x];
          const directions = ['top', 'right', 'bottom', 'left'] as const;
          const dir = directions[Math.floor(Math.random() * 4)];
          cell.walls[dir] = false;
        }
      }
    }
  }
  
  private getUnvisitedNeighbors(cell: MazeCell): MazeCell[] {
    const neighbors: MazeCell[] = [];
    const { x, y } = cell;
    
    if (y > 1 && !this.maze[y - 1][x].visited) neighbors.push(this.maze[y - 1][x]);
    if (x < this.mazeSize - 2 && !this.maze[y][x + 1].visited) neighbors.push(this.maze[y][x + 1]);
    if (y < this.mazeSize - 2 && !this.maze[y + 1][x].visited) neighbors.push(this.maze[y + 1][x]);
    if (x > 1 && !this.maze[y][x - 1].visited) neighbors.push(this.maze[y][x - 1]);
    
    return neighbors;
  }
  
  private removeWall(current: MazeCell, next: MazeCell): void {
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    
    if (dx === 1) {
      current.walls.right = false;
      next.walls.left = false;
    } else if (dx === -1) {
      current.walls.left = false;
      next.walls.right = false;
    } else if (dy === 1) {
      current.walls.bottom = false;
      next.walls.top = false;
    } else if (dy === -1) {
      current.walls.top = false;
      next.walls.bottom = false;
    }
  }
  
  private drawMaze(): void {
    const { width, height } = this.scale;
    const offsetX = (width - this.mazeSize * this.cellSize) / 2;
    const offsetY = (height - this.mazeSize * this.cellSize) / 2 + 20;
    
    const graphics = this.add.graphics();
    graphics.lineStyle(2, 0x4a4a6a);
    
    for (let y = 0; y < this.mazeSize; y++) {
      for (let x = 0; x < this.mazeSize; x++) {
        const cell = this.maze[y][x];
        const px = offsetX + x * this.cellSize;
        const py = offsetY + y * this.cellSize;
        
        // Draw walls
        if (cell.walls.top) graphics.lineBetween(px, py, px + this.cellSize, py);
        if (cell.walls.right) graphics.lineBetween(px + this.cellSize, py, px + this.cellSize, py + this.cellSize);
        if (cell.walls.bottom) graphics.lineBetween(px, py + this.cellSize, px + this.cellSize, py + this.cellSize);
        if (cell.walls.left) graphics.lineBetween(px, py, px, py + this.cellSize);
      }
    }
    
    // Draw demon shadows in some cells
    for (let y = 2; y < this.mazeSize - 1; y++) {
      for (let x = 2; x < this.mazeSize - 1; x++) {
        if (Math.random() < 0.15) {
          const px = offsetX + x * this.cellSize + this.cellSize / 2;
          const py = offsetY + y * this.cellSize + this.cellSize / 2;
          this.add.circle(px, py, 8, 0x2a2a4a, 0.5);
        }
      }
    }
  }
  
  private getCellX(x: number): number {
    const { width } = this.scale;
    const offsetX = (width - this.mazeSize * this.cellSize) / 2;
    return offsetX + x * this.cellSize + this.cellSize / 2;
  }
  
  private getCellY(y: number): number {
    const { height } = this.scale;
    const offsetY = (height - this.mazeSize * this.cellSize) / 2 + 20;
    return offsetY + y * this.cellSize + this.cellSize / 2;
  }
  
  private setupControls(): void {
    const { width, height } = this.scale;
    
    // Direction arrows (visual hints)
    const arrowStyle = {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#4a4a6a',
    };
    
    // Up arrow
    this.add.text(width / 2, height / 2 - 200, '▲', arrowStyle).setOrigin(0.5).setAlpha(0.5);
    // Down arrow  
    this.add.text(width / 2, height / 2 + 200, '▼', arrowStyle).setOrigin(0.5).setAlpha(0.5);
    // Left arrow
    this.add.text(width / 2 - 140, height / 2, '◀', arrowStyle).setOrigin(0.5).setAlpha(0.5);
    // Right arrow
    this.add.text(width / 2 + 140, height / 2, '▶', arrowStyle).setOrigin(0.5).setAlpha(0.5);
    
    // Touch zones for movement
    const zoneSize = 100;
    
    // Top
    this.add.zone(width / 2, height / 2 - 150, width, zoneSize)
      .setInteractive()
      .on('pointerdown', () => this.movePlayer(0, -1));
    
    // Bottom
    this.add.zone(width / 2, height / 2 + 150, width, zoneSize)
      .setInteractive()
      .on('pointerdown', () => this.movePlayer(0, 1));
    
    // Left
    this.add.zone(width / 2 - 100, height / 2, zoneSize, height)
      .setInteractive()
      .on('pointerdown', () => this.movePlayer(-1, 0));
    
    // Right
    this.add.zone(width / 2 + 100, height / 2, zoneSize, height)
      .setInteractive()
      .on('pointerdown', () => this.movePlayer(1, 0));
  }
  
  private movePlayer(dx: number, dy: number): void {
    const cell = this.maze[this.playerY][this.playerX];
    
    // Check walls
    if (dx === 1 && cell.walls.right) return;
    if (dx === -1 && cell.walls.left) return;
    if (dy === 1 && cell.walls.bottom) return;
    if (dy === -1 && cell.walls.top) return;
    
    // Move
    this.playerX += dx;
    this.playerY += dy;
    this.moveCount++;
    
    // Update step counter
    const stepsLeft = Math.max(0, this.stepsUntilBoss - this.moveCount);
    this.stepText.setText(`Steps: ${this.moveCount}/${this.stepsUntilBoss} until The Mask`);
    
    // Warn as approaching boss
    if (stepsLeft <= 5 && stepsLeft > 0) {
      this.stepText.setColor('#e74c3c');
      this.stepText.setFontStyle('bold');
    }
    
    // Animate
    this.tweens.add({
      targets: this.player,
      x: this.getCellX(this.playerX),
      y: this.getCellY(this.playerY),
      duration: 150,
      ease: 'Power1',
      onComplete: () => {
        this.checkEncounter();
      },
    });
  }
  
  private checkEncounter(): void {
    // Boss check
    if (this.moveCount >= this.stepsUntilBoss) {
      this.encounterBoss();
      return;
    }
    
    // Random encounter
    if (Math.random() < this.encounterChance) {
      this.encounterDemon();
    }
  }
  
  private encounterDemon(): void {
    // Pick a random demon (not boss)
    const types: DemonType[] = ['anxiety', 'procrastination', 'confidence', 'numbness', 'mania', 'hope'];
    const enemyType = types[Math.floor(Math.random() * types.length)];
    
    // Track maze exploration for profiling
    ProfilingSystem.trackMazeExplored(this.moveCount);
    
    // Flash effect
    this.cameras.main.flash(200, 100, 0, 0);
    
    this.time.delayedCall(300, () => {
      this.scene.start('BattleScene', {
        playerDemonType: this.playerDemonType,
        enemyDemonType: enemyType,
      });
    });
  }
  
  private encounterBoss(): void {
    // Track maze exploration for profiling
    ProfilingSystem.trackMazeExplored(this.moveCount);
    ProfilingSystem.trackBossFought();
    
    this.cameras.main.flash(400, 200, 0, 0);
    
    this.time.delayedCall(500, () => {
      this.scene.start('BattleScene', {
        playerDemonType: this.playerDemonType,
        enemyDemonType: 'mask',
      });
    });
  }
}
