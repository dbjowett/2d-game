import type { BasePlayer } from './BasePlayer';

export abstract class BaseEntity {
  x: number;
  y: number;
  image: HTMLImageElement = new Image();
  imageLoaded: boolean = false;
  id: number;
  speed: number = 0;
  frameX = 0;
  frameY = 0;

  direction = 0;

  spriteCutoutWidth = 36;
  spriteCutoutHeight = 38;

  sprite_width = 38;
  sprite_height = 38;

  width: number = 30;
  height: number = 30;

  staggerFrames = 10;
  gameFrame = 0;
  canvasWidth: number;

  constructor(canvas: HTMLCanvasElement) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.id = Date.now() * Math.random();
    this.canvasWidth = canvas.width;
  }

  checkCollision(player: BasePlayer) {
    return (
      this.x < player.x + player.frameWidth &&
      this.x + this.width > player.x &&
      this.y < player.y + player.frameHeight &&
      this.y + this.height > player.y
    );
  }

  abstract update(player: BasePlayer, removeEntity: () => void): void;

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx || !this.imageLoaded) return;
    const sourceX = this.frameX * this.spriteCutoutWidth; // 0, 1 ,2, 3
    const sourceY = this.direction * this.spriteCutoutHeight; // add 4

    ctx.drawImage(
      this.image,
      sourceX, // X where to cut out
      sourceY, // Y where to cut out
      this.spriteCutoutWidth, // width of the sprite
      this.spriteCutoutHeight, // height of the sprite
      this.x, // X location on canvas
      this.y, // Y location on canvas
      this.sprite_width, // destination width
      this.sprite_height // destination height
    );

    if (this.gameFrame % this.staggerFrames === 0) {
      if (this.frameX < 3) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
    }
    this.gameFrame++;
  }
}
