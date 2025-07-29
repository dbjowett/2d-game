import { Game } from './entities/Game';
import { addKeyboardListeners, hideInitialUi } from './utils/';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameType = 'gems' | 'bugs';

const startButtonGames = document.querySelectorAll('#start-game');
const restartBtn = document.querySelectorAll('#restart-btn');
const resetBtns = document.querySelectorAll('#reset-btn');
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

let selectedDifficulty: Difficulty = 'medium';
let selectedGameType: GameType = 'gems';

startButtonGames.forEach((btn) =>
  btn.addEventListener('click', (e) => {
    const target = e.target as HTMLButtonElement;
    const difficulty = (target.dataset.difficulty || 'medium') as Difficulty;
    const gameType = (target.dataset.gametype || 'bugs') as GameType;
    selectedDifficulty = difficulty;
    selectedGameType = gameType;

    hideInitialUi(gameType);
    addKeyboardListeners();
    const game = new Game(canvas, difficulty, gameType);
    game.startGame();
  })
);

restartBtn.forEach((btn) =>
  btn?.addEventListener('click', () => {
    hideInitialUi(selectedGameType);
    addKeyboardListeners();
    const game = new Game(canvas, selectedDifficulty, selectedGameType);
    game.startGame();
  })
);

resetBtns.forEach((btn) => btn?.addEventListener('click', () => window.location.reload()));
