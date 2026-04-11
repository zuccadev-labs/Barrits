import { averageBy, defineBarritsPackage, movingAverage, topK } from "../../dist/adapters/deno/mod.js";
import { buildOperationalPath } from "./barrits/index.ts";

const throughput = [12, 15, 14, 18, 22, 26, 31];
const criticalValues = topK(throughput, 3);
const barritsPackage = defineBarritsPackage({
  runtime: "deno",
  watch: "manual",
});

console.log(JSON.stringify({
  package: barritsPackage,
  movingAverage: movingAverage(throughput, 3),
  average: averageBy(throughput, (value) => value),
  criticalValues,
  operationalPath: buildOperationalPath("ops", "daily", "throughput.json"),
}, null, 2));