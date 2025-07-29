import { Game } from './entities/Game';
import { addKeyboardListeners, hideInitialUi } from './utils/';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameType = 'gems' | 'bugs';

const startButtonGames = document.querySelectorAll('#start-game');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

startButtonGames.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;
    const difficulty = (target.dataset.difficulty || 'medium') as Difficulty;
    const gameType = (target.dataset.gametype || 'bugs') as GameType;
    hideInitialUi(gameType);
    addKeyboardListeners();
    const game = new Game(canvas, difficulty, gameType);
    game.startGame();
  })
);
