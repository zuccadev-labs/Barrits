import type { OrderCriterion } from "../sort";
export type RankedValue<Value> = {
    readonly value: Value;
    readonly rank: number;
    readonly ordinal: number;
};
export declare const rankBy: <Value>(values: readonly Value[], criteria: readonly OrderCriterion<Value>[]) => RankedValue<Value>[];
