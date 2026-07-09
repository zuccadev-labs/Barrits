/**
 * [EN] Represents a single data point in a time-series.
 * [ES] Representa un único punto de datos en una serie temporal.
 * 
 * @template Value [EN] Type of the data value. [ES] Tipo del valor de los datos.
 */
export type TimeSeriesPoint<Value = number> = {
  /** [EN] Timestamp. [ES] Marca de tiempo. */
  readonly timestamp: number;
  /** [EN] Value. [ES] Valor. */
  readonly value: Value;
};

/**
 * [EN] Represents a temporal bucket containing multiple time-series points.
 * [ES] Representa una cubeta temporal que contiene múltiples puntos de series temporales.
 */
export type TimeBucket<Value = number> = {
  /** [EN] Bucket start. [ES] Bucket inicio. */
  readonly bucketStart: number;
  /** [EN] Bucket end. [ES] Bucket fin. */
  readonly bucketEnd: number;
  /** [EN] Points. [ES] Puntos. */
  readonly points: TimeSeriesPoint<Value>[];
};
