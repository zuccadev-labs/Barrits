import type { NumberInput } from "../../../barrits/shared";
import { normalizeOperands } from "./internal";

export const sumar = (left: NumberInput, right: NumberInput): number => {
  const [normalizedLeft, normalizedRight] = normalizeOperands(left, right);
  return normalizedLeft + normalizedRight;
};

export const restar = (left: NumberInput, right: NumberInput): number => {
  const [normalizedLeft, normalizedRight] = normalizeOperands(left, right);
  return normalizedLeft - normalizedRight;
};