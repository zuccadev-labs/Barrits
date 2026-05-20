/**
 * [EN] Implementation of Assert finite number.
 * [ES] Implementación de Assert finite number.
 */
export const assertFiniteNumber = (value: number, label: string): void => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${label} must be a finite number.`);
  }
};