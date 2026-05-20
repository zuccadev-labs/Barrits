import type { NumberInput } from "../../../barrits/shared";
import { assertFiniteNumber } from "../../../barrits/internal";
import { isNumberInput } from "./guards";

/**
 * [EN] Implementation of Normalize operands.
 * [ES] Implementación de Normalize operands.
 */
export const normalizeOperands = (left: NumberInput, right: NumberInput): [number, number] => {
  if (!isNumberInput(left) || !isNumberInput(right)) {
    throw new TypeError("Arithmetic operations require numeric inputs.");
  }

  const normalizedLeft = Number(left);
  const normalizedRight = Number(right);

  assertFiniteNumber(normalizedLeft, "left");
  assertFiniteNumber(normalizedRight, "right");

  return [normalizedLeft, normalizedRight];
};