import type { NumberInput } from "../../shared";

export const isNumberInput = (value: unknown): value is NumberInput => {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  if (typeof value === "string" && value.trim() !== "") {
    return Number.isFinite(Number(value));
  }

  return false;
};