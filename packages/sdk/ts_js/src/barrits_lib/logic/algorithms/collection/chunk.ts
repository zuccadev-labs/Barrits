import { toPositiveInteger } from "../internal/normalize";

/**
 * [EN] Splits a collection into consecutive chunks of `size` elements; the last chunk may be shorter.
 * `size` is normalized to a positive integer (`NaN`, `Infinity` and values below 1 become 1).
 * An empty collection yields no chunks.
 * [ES] Divide una colección en trozos consecutivos de `size` elementos; el último puede ser más corto.
 * `size` se normaliza a un entero positivo (`NaN`, `Infinity` y valores menores que 1 pasan a 1).
 * Una colección vacía no produce trozos.
 *
 * @param values [EN] Collection to split. [ES] Colección a dividir.
 * @param size [EN] Chunk size. [ES] Tamaño de cada trozo.
 * @returns [EN] Array of chunks. [ES] Arreglo de trozos.
 */
export const chunk = <Value>(values: readonly Value[], size: number): Value[][] => {
  const chunkSize = toPositiveInteger(size, 1);
  const chunks: Value[][] = [];

  for (let index = 0; index < values.length; index += chunkSize) {
    chunks.push(values.slice(index, index + chunkSize));
  }

  return chunks;
};
