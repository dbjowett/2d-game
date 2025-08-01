import type { GameType } from '../types';

export const hideInitialUi = (gameType: GameType) => {
  const health = document.getElementById('health-container') as HTMLDivElement;
  const gems = document.getElementById('gems-container') as HTMLDivElement;
  (gameType === 'bugs' ? health : gems).style.display = 'block';
  const timerContainer = document.getElementById('timer-container') as HTMLBodyElement;
  timerContainer.style.display = 'flex';
  document
    .querySelectorAll('.final-screen')
    .forEach((ui) => ((ui as HTMLElement).style.display = 'none'));
  document
    .querySelectorAll('.start-ui-container')
    .forEach((ui) => ((ui as HTMLElement).style.display = 'none'));
};

export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

type keyType = keyof typeof keys;

export const addKeyboardListeners = () => {
  window.addEventListener('keydown', ({ key }) => {
    if (!Object.keys(keys).includes(key)) return;
    keys[key as keyType] = true;
  });
  window.addEventListener('keyup', ({ key }) => {
    if (!Object.keys(keys).includes(key)) return;
    keys[key as keyType] = false;
  });
};

export const msToText = (ms: number | null): string => {
  // returns ex: 01:21
  if (!ms) return '00:00';
  const minutes = Math.floor(ms / 60000);
  const seconds = Number(((ms % 60000) / 1000).toFixed(0));
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const secToMs = (sec: number): number => sec * 1000;

export const parseStringNum = (num: string): number => {
  // receives ex: 01:21 (len = 5)
  if (!num || !num.includes(':') || num.length !== 5) return 0;

  const [min, sec] = num.split(':');
  return secToMs(parseInt(min) * 60 + parseInt(sec));
};
