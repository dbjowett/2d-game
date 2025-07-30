import enemy from '../sprites/beetle.png';
import { BaseEntity } from './BaseEntity';
import type { BasePlayer } from './BasePlayer';
const healthBar = document.getElementById('health') as HTMLProgressElement;

export class Enemy extends BaseEntity {
  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.speed = Math.random() * 6 - 3;
    this.canvasWidth = canvas.width;
    this.id = Date.now();

    this.image.src = enemy;
    this.image.onload = () => (this.imageLoaded = true);
  }

  update(player: BasePlayer, _removeEntity?: () => void) {
    if (this.checkCollision(player)) {
      player.updateHealth({ subtract: 1 });
      healthBar.value = player.health;
      if (healthBar.value < 25) {
        healthBar.classList.add('low-health');
      } else {
        healthBar.classList.remove('low-health');
      }
    }
    // left side of bug + its width >= width of canvas (ie right side of bug is touching right side of canvas)
    if (this.x + this.width >= this.canvasWidth) {
      this.x = this.canvasWidth - this.width;
      this.speed *= -1;
    }
    // left side of bug is touching left side of canvas
    if (this.x <= 0) {
      this.x = 0;
      this.speed *= -1;
    }

    this.x += this.speed;
  }
}
