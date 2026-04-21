import { movingAverage } from "./moving-average";
import { rollingSum } from "./rolling-sum";
import { slidingWindow } from "./sliding-window";
import { windowDelta } from "./window-delta";

export { movingAverage } from "./moving-average";
export { rollingSum } from "./rolling-sum";
export { slidingWindow } from "./sliding-window";
export { windowDelta } from "./window-delta";

/**
 * [EN] Collection of window-based data processing algorithms.
 * [ES] Colección de algoritmos de procesamiento de datos por ventanas.
 */
export const windowAlgorithms = {
  /** [EN] Calculation of moving averages. [ES] Cálculo de promedios móviles. */
  movingAverage,
  /** [EN] Real-time rolling sum calculation. [ES] Cálculo de suma acumulada en tiempo real. */
  rollingSum,
  /** [EN] Sliding window generator. [ES] Generador de ventanas deslizantes. */
  slidingWindow,
  /** [EN] Delta calculation within a window. [ES] Cálculo de delta dentro de una ventana. */
  windowDelta,
};
