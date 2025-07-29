import type { Difficulty, GameType } from '../main';
import grass from '../sprites/grass.png';
import { msToSec } from '../utils';
import { BugGamePlayer } from './BugGamePlayer';
import { Enemy } from './Enemy';
import { Gem } from './Gem';
import { GemGamePlayer } from './GemGamePlayer';

const winScreen = document.getElementById('win-screen') as HTMLElement;
const deadScreen = document.getElementById('dead-screen') as HTMLElement;
const timer = document.getElementById('timer') as HTMLDivElement;

type GameTime = { start: number; end: number | null };

const borderThickness = 200;
// ** Constants ** //
const playerStartingPoint: Record<GameType, Record<'x' | 'y' | 'health', number>> = {
  bugs: {
    x: 0,
    y: 0,
    health: 100,
  },
  gems: {
    x: 0,
    y: 0,
    health: 0,
  },
};

const difficultyMap: Record<GameType, Record<Difficulty, number>> = {
  bugs: {
    easy: 40,
    medium: 80,
    hard: 200,
  },
  gems: {
    easy: 200,
    medium: 100,
    hard: 40,
  },
};

export type GameState = 'playing' | 'lost' | 'won';

export class Game {
  image = new Image();
  imageLoaded = false;
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  player: BugGamePlayer | GemGamePlayer;
  // lastFrameTime: number;
  wallThickness = 50;
  entities: Enemy[];
  gameState: GameState;
  difficulty: Difficulty;
  gameType: GameType;
  gameTime: GameTime;

  constructor(canvas: HTMLCanvasElement, difficulty: Difficulty, gameType: GameType) {
    this.canvas = canvas;
    this.difficulty = difficulty;
    this.gameType = gameType;

    this.canvasWidth = window.innerWidth - borderThickness;
    this.canvasHeight = window.innerHeight - borderThickness;
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
    // this.lastFrameTime = new Date().getTime();
    this.gameState = 'playing';
    this.entities = this.createEntities();
    this.gameTime = { start: new Date().getTime(), end: null };

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas');
    this.ctx = ctx;
    this.image.src = grass;
    this.player = this.getPlayer(); // player starting location
    this.image.onload = () => (this.imageLoaded = true);

    window.addEventListener('resize', () => {
      this.canvasWidth = window.innerWidth - borderThickness;
      this.canvasHeight = window.innerHeight - borderThickness;
      this.canvas.width = this.canvasWidth;
      this.canvas.height = this.canvasHeight;
    });
  }

  private getPlayer() {
    const { x, y, health } = playerStartingPoint[this.gameType];
    switch (this.gameType) {
      case 'bugs':
        return new BugGamePlayer(x, y, health);
      case 'gems':
        return new GemGamePlayer(x, y, health);
      default:
        throw new Error('No game type found!');
    }
  }

  private createEntities() {
    const entityCount = difficultyMap[this.gameType][this.difficulty];
    if (this.gameType === 'bugs')
      return [...Array(entityCount).keys()].map(() => new Enemy(this.canvas));
    if (this.gameType === 'gems')
      return [...Array(entityCount).keys()].map(() => new Gem(this.canvas));
    return [];
  }

  removeEntity(id: number) {
    this.entities = this.entities.filter((entity) => entity.id !== id);
  }

  showGameOverScreen() {
    if (this.gameState === 'won') {
      winScreen.style.display = 'flex';
    } else {
      deadScreen.style.display = 'flex';
    }
  }

  updateTime() {
    const timeNow = new Date().getTime();
    this.gameTime = { ...this.gameTime, end: timeNow };
    const time = msToSec(timeNow - this.gameTime.start);
    timer.innerText = time;
  }

  addBackground() {
    const pattern = this.ctx.createPattern(this.image, 'repeat');
    if (!pattern) return;
    this.ctx.fillStyle = pattern;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  updateGameStatus(gameState: GameState) {
    this.gameState = gameState;
  }

  gameLoop = (_ts: number) => {
    if (this.gameState === 'lost' || this.gameState === 'won') {
      this.showGameOverScreen();
      return;
    }
    this.updateTime();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.addBackground();

    this.entities.forEach((entity) => {
      entity.update(this.player, () => this.removeEntity(entity.id));
      entity.draw(this.ctx);
    });

    this.player.checkHealth((state: GameState) => this.updateGameStatus(state));
    this.player.draw(this.ctx);
    this.player.update(this.canvas);
    requestAnimationFrame(this.gameLoop);
  };

  startGame() {
    requestAnimationFrame(this.gameLoop);
  }
}
