import { restar, sumar } from "./operations";
export { restar, sumar };
export { isNumberInput } from "./guards";
/**
 * [EN] Aggregate service for arithmetic operations.
 * [ES] Servicio agregado para operaciones aritméticas.
 */
export declare const arithmetic: {
    /** [EN] Sums two numbers. [ES] Suma dos números. */
    sumar: (left: import("../../..").NumberInput, right: import("../../..").NumberInput) => number;
    /** [EN] Subtracts two numbers. [ES] Resta dos números. */
    restar: (left: import("../../..").NumberInput, right: import("../../..").NumberInput) => number;
};
