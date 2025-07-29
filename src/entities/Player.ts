import type { GameType } from '../main';
import blonde from '../sprites/blonde_boy.png';
import { keys } from '../utils/';

const Direction = {
  Down: 0,
  Left: 1,
  Right: 2,
  Up: 3,
} as const;

export class Player {
  image = new Image();
  imageLoaded = false;
  x: number;
  y: number;
  speed = 3;

  frameWidth = 14;
  frameHeight = 16;

  renderWidth = this.frameWidth * 1.6;
  renderHeight = this.frameHeight * 1.6;

  health: number;

  direction = 0;
  frameX = 0;
  gameFrame = 0;
  staggerFrames = 10;
  isMoving = false;

  constructor(x: number, y: number, gameType: GameType) {
    this.x = x;
    this.y = y;
    this.health = gameType === 'bugs' ? 100 : 1;
    this.direction = Direction['Down'];
    this.image.src = blonde;
    this.image.onload = () => (this.imageLoaded = true);
  }

  updateHealth({ add, subtract }: { add?: number; subtract?: number }) {
    if (subtract) this.health = this.health -= subtract;
    if (add) this.health = this.health += add;
  }

  checkHealth(handleDeath: () => void) {
    this.health <= 0 && handleDeath();
  }

  update(canvas: HTMLCanvasElement) {
    this.isMoving = false;
    // TODO: fix arbitrary numbers for walls
    if (keys['ArrowLeft']) {
      if (this.x - this.frameWidth / 2 <= -6) return;
      this.x -= this.speed;
      this.direction = Direction['Left'];
      this.isMoving = true;
    }
    if (keys['ArrowRight']) {
      if (this.x + this.frameWidth / 2 >= canvas.width - 12) return;
      this.x += this.speed;
      this.direction = Direction['Right'];
      this.isMoving = true;
    }
    if (keys['ArrowUp']) {
      if (this.y + this.frameHeight / 2 <= 8) return;
      this.y -= this.speed;
      this.direction = Direction['Up'];
      this.isMoving = true;
    }
    if (keys['ArrowDown']) {
      if (this.y + this.frameHeight >= canvas.height - 12) return;
      this.y += this.speed;
      this.direction = Direction['Down'];
      this.isMoving = true;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx || !this.imageLoaded) return;

    const sourceX = this.frameX * this.frameWidth;
    const sourceY = this.direction * this.frameHeight;

    ctx.drawImage(
      this.image,
      sourceX,
      sourceY, // source sprite x, y
      this.frameWidth,
      this.frameHeight, // sprite width, height
      this.x,
      this.y, // canvas destination x, y
      this.renderWidth,
      this.renderHeight // canvas render width/height
    );

    // Animate only when moving
    if (this.gameFrame % this.staggerFrames === 0 && this.isMoving) {
      this.frameX = (this.frameX + 1) % 4; // assuming 4 frames per row
    }
    this.gameFrame++;
  }
}
