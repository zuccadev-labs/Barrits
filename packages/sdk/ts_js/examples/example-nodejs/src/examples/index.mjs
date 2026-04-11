import { createCollectionExamples } from "./collection/real-collection-cases.mjs";
import { createGraphExamples } from "./graph/real-graph-cases.mjs";
import { createSearchExamples } from "./search/real-search-cases.mjs";
import { createSelectionExamples } from "./selection/real-selection-cases.mjs";
import { createSortExamples } from "./sort/real-sort-cases.mjs";
import { createTimeSeriesExamples } from "./timeseries/real-timeseries-cases.mjs";
import { createWindowExamples } from "./window/real-window-cases.mjs";

export const createOperationalShowcase = () => {
  const timeSeriesExamples = createTimeSeriesExamples();

  return {
    aggregate: timeSeriesExamples.aggregate,
    collection: createCollectionExamples(),
    graph: createGraphExamples(),
    search: createSearchExamples(),
    selection: createSelectionExamples(),
    sort: createSortExamples(),
    timeseries: timeSeriesExamples.timeseries,
    window: createWindowExamples(),
  };
};