import { mergeTraits } from "./merge";
import { composePipeline } from "./pipeline";
export { composePipeline, mergeTraits };
/**
 * Trait composition strategies and merge/pipeline helpers.
 */
export declare const compose: {
    mergeTraits: <TLeft extends object, TRight extends object>(left: TLeft, right: TRight, options?: import("./merge").MergeTraitsOptions) => TLeft & TRight;
    composePipeline: <TValue>(initialValue: TValue, ...steps: Array<import("../..").UnaryFunction<TValue, TValue>>) => TValue;
};
