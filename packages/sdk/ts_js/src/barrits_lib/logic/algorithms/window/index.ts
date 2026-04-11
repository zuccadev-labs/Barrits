import { movingAverage } from "./moving-average";
import { rollingSum } from "./rolling-sum";
import { slidingWindow } from "./sliding-window";
import { windowDelta } from "./window-delta";

export { movingAverage } from "./moving-average";
export { rollingSum } from "./rolling-sum";
export { slidingWindow } from "./sliding-window";
export { windowDelta } from "./window-delta";

export const windowAlgorithms = {
  movingAverage,
  rollingSum,
  slidingWindow,
  windowDelta,
};
