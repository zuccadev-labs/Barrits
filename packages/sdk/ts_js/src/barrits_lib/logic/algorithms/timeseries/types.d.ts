/**
 * [EN] Represents a single data point in a time-series.
 * [ES] Representa un único punto de datos en una serie temporal.
 *
 * @template Value [EN] Type of the data value. [ES] Tipo del valor de los datos.
 */
export type TimeSeriesPoint<Value = number> = {
    readonly timestamp: number;
    readonly value: Value;
};
/**
 * [EN] Represents a temporal bucket containing multiple time-series points.
 * [ES] Representa una cubeta temporal que contiene múltiples puntos de series temporales.
 */
export type TimeBucket<Value = number> = {
    readonly bucketStart: number;
    readonly bucketEnd: number;
    readonly points: TimeSeriesPoint<Value>[];
};
