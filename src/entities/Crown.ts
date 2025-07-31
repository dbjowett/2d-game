import chest from '../sprites/chest.png';
import { BaseEntity } from './BaseEntity';
import type { BasePlayer } from './BasePlayer';

export class Crown extends BaseEntity {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.image.src = chest;
    this.image.onload = () => (this.imageLoaded = true);
    const scale = 1.4;
    this.spriteCutoutWidth = 16;
    this.spriteCutoutHeight = 14;
    this.sprite_width = 16 * scale;
    this.sprite_height = 14 * scale;
    this.width = this.sprite_width;
    this.height = this.sprite_height;

    this.x = canvas.width - this.width;
    this.y = canvas.height - this.height;
  }

  // Crown doesn't move
  update(_player: BasePlayer, _removeEntity: () => void): void {}

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx || !this.imageLoaded) return;

    ctx.drawImage(
      this.image,
      0,
      0,
      this.spriteCutoutWidth,
      this.spriteCutoutHeight,
      this.x,
      this.y,
      this.sprite_width,
      this.sprite_height
    );

    if (this.gameFrame % this.staggerFrames === 0) {
      this.frameX = this.frameX === 3 ? 0 : this.frameX + 1;
    }
    this.gameFrame++;
  }
}
