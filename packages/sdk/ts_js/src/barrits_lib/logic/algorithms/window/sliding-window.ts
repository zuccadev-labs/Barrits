export const slidingWindow = <Value>(values: readonly Value[], size: number): Value[][] => {
  const windowSize = Math.max(1, Math.floor(size));

  if (values.length < windowSize) {
    return [];
  }

  const windows: Value[][] = [];

  for (let index = 0; index <= values.length - windowSize; index += 1) {
    windows.push(values.slice(index, index + windowSize));
  }

  return windows;
};
