import { restar, sumar } from "./operations";
export { restar, sumar };
export { isNumberInput } from "./guards";
export declare const arithmetic: {
    sumar: (left: import("../../..").NumberInput, right: import("../../..").NumberInput) => number;
    restar: (left: import("../../..").NumberInput, right: import("../../..").NumberInput) => number;
};
