import enemy from '../sprites/beetle.png';
import { BaseEntity } from './BaseEntity';
import type { Player } from './Player';
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

  update(player: Player, _removeEntity?: () => void) {
    if (this.checkCollision(player)) {
      player.updateHealth({ subtract: 1 });
      healthBar.value = player.health;
      if (healthBar.value < 25) {
        healthBar.classList.add('low-health');
      } else {
        healthBar.classList.remove('low-health');
      }
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
