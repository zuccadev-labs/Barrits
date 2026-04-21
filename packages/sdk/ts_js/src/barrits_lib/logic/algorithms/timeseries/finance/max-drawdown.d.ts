import type { TimeSeriesPoint } from "../types";
export type DrawdownPoint = {
    readonly timestamp: number;
    readonly value: number;
    readonly peak: number;
    readonly drawdown: number;
};
export declare const maxDrawdown: (points: readonly TimeSeriesPoint<number>[]) => DrawdownPoint | null;
