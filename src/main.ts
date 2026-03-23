import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { TeamSelectScene } from './scenes/TeamSelectScene';
import { MazeScene } from './scenes/MazeScene';
import { BattleScene } from './scenes/BattleScene';
import { RecognitionScene } from './scenes/RecognitionScene';
import { ResultsScene } from './scenes/ResultsScene';
import { EndingScene } from './scenes/EndingScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 390,
    height: 844,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
    },
  },
  scene: [BootScene, TitleScene, TeamSelectScene, MazeScene, BattleScene, RecognitionScene, ResultsScene, EndingScene],
  input: {
    activePointers: 3,
    touch: {
      capture: true,
    },
  },
  render: {
    pixelArt: true,
    antialias: false,
  },
};

new Phaser.Game(config);
