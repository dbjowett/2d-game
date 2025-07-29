import { BasePlayer } from './BasePlayer';
import type { GameState } from './Game';

export class BugGamePlayer extends BasePlayer {
  constructor(x: number, y: number, startingHealth: number) {
    super(x, y, startingHealth);
  }

  updateHealth({ add, subtract }: { add?: number; subtract?: number }) {
    if (subtract) this.health = this.health -= subtract;
    if (add) this.health = this.health += add;
  }

  checkHealth(updateGameStatus: (status: GameState) => void) {
    this.health <= 0 && updateGameStatus('lost');
  }
}
