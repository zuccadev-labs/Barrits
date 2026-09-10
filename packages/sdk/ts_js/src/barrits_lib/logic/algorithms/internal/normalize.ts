/**
 * [EN] Normalizes a size-like input (window size, chunk size, page size, interval) into a positive integer.
 * `NaN`, `Infinity`, non-numbers and values below `1` resolve to `fallback`, so callers never build
 * windows or buckets from a poisoned value.
 * [ES] Normaliza una entrada de tipo tamaño (ventana, chunk, página, intervalo) a un entero positivo.
 * `NaN`, `Infinity`, no-números y valores por debajo de `1` resuelven a `fallback`, de modo que nunca se
 * construyen ventanas o cubetas a partir de un valor envenenado.
 *
 * @param value - [EN] Raw input. [ES] Entrada bruta.
 * @param fallback - [EN] Value used when the input is not a finite number ≥ 1 (default 1). [ES] Valor usado cuando la entrada no es un número finito ≥ 1 (por defecto 1).
 * @returns [EN] A positive integer. [ES] Un entero positivo.
 */
export const toPositiveInteger = (value: unknown, fallback = 1): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  const floored = Math.floor(value);
  return floored >= 1 ? floored : fallback;
};

/**
 * [EN] Normalizes a count-like input into a non-negative integer; invalid inputs resolve to `fallback`.
 * [ES] Normaliza una entrada de tipo conteo a un entero no negativo; las entradas inválidas resuelven a `fallback`.
 *
 * @param value - [EN] Raw input. [ES] Entrada bruta.
 * @param fallback - [EN] Value used when the input is not a finite number ≥ 0 (default 0). [ES] Valor usado cuando la entrada no es un número finito ≥ 0 (por defecto 0).
 * @returns [EN] A non-negative integer. [ES] Un entero no negativo.
 */
export const toNonNegativeInteger = (value: unknown, fallback = 0): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  const floored = Math.floor(value);
  return floored >= 0 ? floored : fallback;
};
