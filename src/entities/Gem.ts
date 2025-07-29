import gems from '../sprites/gems.png';
import { BaseEntity } from './BaseEntity';
import type { BugGamePlayer } from './BugGamePlayer';
const gemBar = document.getElementById('gem-bar') as HTMLProgressElement;

export class Gem extends BaseEntity {
  spriteCutoutWidth = 15;
  spriteCutoutHeight = 13;
  sprite_width = 25;
  sprite_height = 23;
  constructor(canvas: HTMLCanvasElement) {
    super(canvas); // call parent contructor
    this.id = Date.now() * Math.random();
    this.image.src = gems;
    this.image.onload = () => (this.imageLoaded = true);
  }

  update(player: BugGamePlayer, removeEntity: () => void) {
    if (this.checkCollision(player)) {
      player.updateHealth({ add: 5 });
      removeEntity();
      gemBar.value = player.health;
    }
    if (this.x > this.canvasWidth) {
      this.x = -this.width; // move enemy back to beginning -width
      return;
    }
    if (this.x < -this.width) {
      this.x = this.canvasWidth;
      return;
    }

    this.x += this.speed;
  }
}
