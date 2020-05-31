import './random'

declare global {
  // tslint:disable-next-line: interface-name
  interface Math {
    seed(seed: number): void;
  }
}

export const shuffle = ([...array]) => {
  Math.seed(new Date().getHours())
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
