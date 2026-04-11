import type { NumberInput } from "../../shared";
import { assertFiniteNumber } from "../../internal";
import { isNumberInput } from "./guards";

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