export const endPerfomance = (begin: number, message?: string) => {
  const end = performance.now();
  console.log(`Time taken: ${end - begin} milliseconds.`, message);
};
