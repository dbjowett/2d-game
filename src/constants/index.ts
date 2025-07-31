import type { Difficulty, GameType } from '../types';

export const gameBorderThickness = 200;

// Player start location and progress bar state (health)
export const playerStartingPoint: Record<GameType, Record<'x' | 'y' | 'health', number>> = {
  bugs: {
    x: 0,
    y: 0,
    health: 100,
  },
  gems: {
    x: 0,
    y: 0,
    health: 0,
  },
};

// Amount of bugs/gems per difficulty
export const difficultyMap: Record<GameType, Record<Difficulty, number>> = {
  bugs: {
    easy: 40,
    medium: 80,
    hard: 200,
  },
  gems: {
    easy: 230,
    medium: 200,
    hard: 170,
  },
};
