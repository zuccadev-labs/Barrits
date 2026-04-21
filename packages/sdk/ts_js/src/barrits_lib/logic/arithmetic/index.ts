import { restar, sumar } from "./operations";

export { restar, sumar };
export { isNumberInput } from "./guards";

/**
 * [EN] Aggregate service for arithmetic operations.
 * [ES] Servicio agregado para operaciones aritméticas.
 */
export const arithmetic = {
  /** [EN] Sums two numbers. [ES] Suma dos números. */
  sumar,
  /** [EN] Subtracts two numbers. [ES] Resta dos números. */
  restar,
};