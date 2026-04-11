import { performance } from "node:perf_hooks";

import { orderBy, quickSort, topK } from "../../src/barrits";

type BenchmarkSample = {
  readonly label: string;
  readonly durationMs: number;
};

const createRandomDataset = (size: number): number[] => {
  return Array.from({ length: size }, (_, index) => ((index * 9301) + 49297) % 233280);
};

const benchmark = (label: string, iterations: number, run: () => void): BenchmarkSample => {
  const startedAt = performance.now();

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    run();
  }

  return {
    label,
    durationMs: Number((performance.now() - startedAt).toFixed(2)),
  };
};

const benchmarkPlans = [
  { size: 10_000, iterations: { quickSort: 10, orderBy: 10, topK: 30 } },
  { size: 50_000, iterations: { quickSort: 5, orderBy: 5, topK: 20 } },
  { size: 100_000, iterations: { quickSort: 3, orderBy: 3, topK: 10 } },
  { size: 1_000_000, iterations: { quickSort: 1, orderBy: 1, topK: 3 } },
];

const suites = benchmarkPlans.map((plan) => {
  const dataset = createRandomDataset(plan.size);
  const objectDataset = dataset.map((value, index) => ({ id: index, score: value, latency: value % 1000 }));

  return {
    datasetSize: plan.size,
    samples: [
      benchmark("quickSort(numbers)", plan.iterations.quickSort, () => {
        quickSort(dataset);
      }),
      benchmark("orderBy(objects by score desc, latency asc)", plan.iterations.orderBy, () => {
        orderBy(objectDataset, [
          { project: (entry) => entry.score, direction: "desc" },
          { project: (entry) => entry.latency, direction: "asc" },
        ]);
      }),
      benchmark("topK(objects, 100)", plan.iterations.topK, () => {
        topK(objectDataset, 100, (left, right) => left.score - right.score);
      }),
    ],
  };
});

console.log(JSON.stringify({ suites }, null, 2));
