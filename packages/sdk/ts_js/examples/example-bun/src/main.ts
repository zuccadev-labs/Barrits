import {
  averageBy,
  defineBarritsPackage,
  movingAverage,
  orderBy,
  topK,
} from "@zuccadev-labs/barrits";

import { buildBunOperationalPath, inspectBunOperationalPath } from "../barrits/index.ts";

const throughputSeries = [18, 20, 25, 19, 31, 28, 35, 33];

const barritsPackage = defineBarritsPackage({
  runtime: "other",
  watch: "manual",
  debugCommands: true,
});

const sortedRecords = orderBy(
  [
    { domain: "metrics", score: 91 },
    { domain: "observability", score: 97 },
    { domain: "contracts", score: 89 },
  ],
  [{ project: (record) => record.score, direction: "desc" }],
);

const operationalPath = buildBunOperationalPath("ops", "daily", "throughput.json");

console.log(
  JSON.stringify(
    {
      runtime: "bun",
      package: barritsPackage,
      movingAverage: movingAverage(throughputSeries, 3),
      average: averageBy(throughputSeries, (value) => value),
      topThroughput: topK(throughputSeries, 3),
      sortedRecords,
      operationalPath,
      parsedPath: inspectBunOperationalPath(operationalPath),
    },
    null,
    2,
  ),
);
