export const chunk = <Value>(values: readonly Value[], size: number): Value[][] => {
  const chunkSize = Math.max(1, Math.floor(size));
  const chunks: Value[][] = [];

  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }

  return chunks;
};