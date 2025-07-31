import { difficultyMap, gameBorderThickness, playerStartingPoint } from '../constants';

import chest from '../sprites/chest.png';
import grass from '../sprites/grass.png';
import type { Difficulty, GameType } from '../types';
import { msToText } from '../utils';
import { BugGamePlayer } from './BugGamePlayer';
import { Crown } from './Crown';
import { Enemy } from './Enemy';
import { Gem } from './Gem';
import { GemGamePlayer } from './GemGamePlayer';

// Types
export type GameTime = { start: number; end: number };
export type GameState = 'playing' | 'lost' | 'won';

// Elements
const finalScreen = document.getElementById('final-screen') as HTMLElement;
const timer = document.getElementById('timer') as HTMLDivElement;

// Constants
const HIGH_SCORE_BUGS = 'high-score-bugs';
const HIGH_SCORE_GEMS = 'high-score-gems';

export class Game {
  image = new Image();
  goalImage = new Image();
  imageLoaded = false;
  canvas: HTMLCanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  ctx: CanvasRenderingContext2D;
  player: BugGamePlayer | GemGamePlayer;
  wallThickness = 50;
  entities: Enemy[];
  gameState: GameState;
  difficulty: Difficulty;
  gameType: GameType;
  gameTime: GameTime;
  crown: Crown | null = null;

  constructor(canvas: HTMLCanvasElement, difficulty: Difficulty, gameType: GameType) {
    this.canvas = canvas;
    this.difficulty = difficulty;
    this.gameType = gameType;

    this.canvasWidth = window.innerWidth - gameBorderThickness;
    this.canvasHeight = window.innerHeight - gameBorderThickness;
    this.canvas.height = this.canvasHeight;
    this.canvas.width = this.canvasWidth;
    this.gameState = 'playing';
    this.entities = this.createEntities();
    this.gameTime = { start: new Date().getTime(), end: Infinity };

    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('No canvas');
    this.ctx = ctx;
    this.image.src = grass;
    this.goalImage.src = chest;
    this.player = this.getPlayer(); // player starting location
    this.image.onload = () => (this.imageLoaded = true);
    if (this.gameType === 'bugs') this.crown = new Crown(this.canvas);

    window.addEventListener('resize', () => {
      this.canvasWidth = window.innerWidth - gameBorderThickness;
      this.canvasHeight = window.innerHeight - gameBorderThickness;
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
    if (!finalScreen) return;

    const gameTimeNum = this.gameTime.end - this.gameTime.start;
    const gameTimeText = msToText(gameTimeNum);

    finalScreen.style.display = 'flex';

    finalScreen.querySelector<HTMLHeadingElement>('#title')!.textContent =
      this.gameState === 'lost' ? 'You Lost 😞' : 'You Win 🥇';

    finalScreen.querySelector<HTMLSpanElement>('#score')!.textContent = gameTimeText;

    if (this.gameState === 'won') {
      const key = this.gameType === 'bugs' ? HIGH_SCORE_BUGS : HIGH_SCORE_GEMS;
      const pbTimeStr = window.localStorage.getItem(key);
      const pbTime = pbTimeStr ? parseInt(pbTimeStr) : null;

      const isNewRecord = pbTime === null || gameTimeNum < pbTime;

      const header = finalScreen.querySelector('#high-score-header');
      const highScore = finalScreen.querySelector('#high-score');

      if (isNewRecord) {
        window.localStorage.setItem(key, gameTimeNum.toString());
        header!.textContent = 'New High Score!:';
        highScore!.textContent = gameTimeText;
      } else if (pbTime !== null) {
        header!.textContent = 'High Score:';
        highScore!.textContent = msToText(pbTime);
      }
    }
  }

  updateTime() {
    const timeNow = new Date().getTime();
    this.gameTime = { ...this.gameTime, end: timeNow };
    const timeText = msToText(timeNow - this.gameTime.start);
    timer.innerText = timeText;
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
    if (this.gameState !== 'playing') {
      this.showGameOverScreen();
      return;
    }
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.updateTime();
    this.addBackground();
    if (this.gameType === 'bugs' && this.crown) {
      if (this.crown.checkCollision(this.player)) this.updateGameStatus('won');
      this.crown.draw(this.ctx);
    }

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
