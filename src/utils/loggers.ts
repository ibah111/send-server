import { node } from '../main';

export const endPerfomance = (begin: number, message?: string) => {
  const end = performance.now();
  node === 'dev'
    ? console.log(`Time taken: ${end - begin} milliseconds.`, message)
    : null;
};
