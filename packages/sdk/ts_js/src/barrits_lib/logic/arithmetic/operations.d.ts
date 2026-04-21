import type { NumberInput } from "../../../barrits/shared";
/**
 * [EN] Adds two numeric values with operand normalization.
 * [ES] Suma dos valores numéricos con normalización de operandos.
 *
 * @param left - [EN] Left operand. [ES] Operando izquierdo.
 * @param right - [EN] Right operand. [ES] Operando derecho.
 * @returns [EN] Arithmetic sum. [ES] Suma aritmética.
 */
export declare const sumar: (left: NumberInput, right: NumberInput) => number;
/**
 * [EN] Subtracts the right numeric value from the left with operand normalization.
 * [ES] Resta el valor numérico derecho del izquierdo con normalización de operandos.
 *
 * @param left - [EN] Left operand. [ES] Operando izquierdo.
 * @param right - [EN] Right operand. [ES] Operando derecho.
 * @returns [EN] Arithmetic difference. [ES] Diferencia aritmética.
 */
export declare const restar: (left: NumberInput, right: NumberInput) => number;
