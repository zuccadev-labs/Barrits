import test from "node:test";
import assert from "node:assert/strict";

import {
  averageBy,
  binarySearch,
  breadthFirstSearch,
  bucketByInterval,
  chunk,
  dijkstraShortestPath,
  findSortedRange,
  groupBy,
  insertSorted,
  movingAverage,
  movingAverageSeries,
  orderBy,
  paginate,
  partitionBy,
  rankBy,
  rollingSum,
  slidingWindow,
  sumBy,
  topologicalSort,
  topK,
  uniqueBy,
  windowDelta,
} from "../src/barrits";

test("search and sort algorithms cover repeated values and ordered insertion", () => {
  const values = [1, 2, 2, 3, 5, 8, 13, 21, 21, 34];

  assert.equal(binarySearch(values, 13), 6);
  assert.deepEqual(findSortedRange(values, 21), {
    found: true,
    startIndex: 7,
    endIndex: 9,
    count: 2,
  });
  assert.deepEqual(insertSorted(values, 20), [1, 2, 2, 3, 5, 8, 13, 20, 21, 21, 34]);
});

test("selection and collection algorithms produce reusable operational views", () => {
  const incidents = [
    { id: "inc-1", severity: 5, affected: 300, squad: "core" },
    { id: "inc-2", severity: 4, affected: 120, squad: "catalog" },
    { id: "inc-3", severity: 4, affected: 90, squad: "catalog" },
    { id: "inc-4", severity: 2, affected: 15, squad: "support" },
  ];
  const orderedIncidents = orderBy(incidents, [
    { project: (incident) => incident.severity, direction: "desc" },
    { project: (incident) => incident.affected, direction: "desc" },
  ]);
  const topIncidents = topK(incidents, 2, (left, right) => {
    return ((left.severity * 1000) + left.affected) - ((right.severity * 1000) + right.affected);
  }, "desc");
  const paginated = paginate(orderedIncidents, { page: 1, pageSize: 2 });
  const partitioned = partitionBy(incidents, (incident) => incident.severity >= 4);
  const grouped = groupBy(incidents, (incident) => incident.squad);
  const deduplicated = uniqueBy([
    { id: "cus-1", name: "Atlas" },
    { id: "cus-2", name: "Atlas" },
    { id: "cus-3", name: "Nova" },
  ], (customer) => customer.name);
  const ranked = rankBy(incidents, [
    { project: (incident) => incident.severity, direction: "desc" },
    { project: (incident) => incident.affected, direction: "desc" },
  ]);

  assert.deepEqual(topIncidents.map((incident) => incident.id), ["inc-1", "inc-2"]);
  assert.equal(paginated.totalPages, 2);
  assert.deepEqual(partitioned.matched.map((incident) => incident.id), ["inc-1", "inc-2", "inc-3"]);
  assert.deepEqual(Array.from(grouped.get("catalog") ?? []).map((incident) => incident.id), ["inc-2", "inc-3"]);
  assert.deepEqual(deduplicated.map((customer) => customer.id), ["cus-1", "cus-3"]);
  assert.deepEqual(ranked.map((entry) => [entry.value.id, entry.rank]), [["inc-1", 1], ["inc-2", 2], ["inc-3", 3], ["inc-4", 4]]);
  assert.deepEqual(chunk(orderedIncidents, 3).map((group) => group.map((incident) => incident.id)), [["inc-1", "inc-2", "inc-3"], ["inc-4"]]);
});

test("graph and timeseries algorithms solve operational routing and rolling metrics", () => {
  const serviceDependencies = [
    { from: "api-gateway", to: "checkout", weight: 1 },
    { from: "checkout", to: "payments", weight: 2 },
    { from: "payments", to: "ledger", weight: 1 },
    { from: "checkout", to: "risk", weight: 1 },
    { from: "risk", to: "ledger", weight: 3 },
  ] as const;
  const latencySeries = [
    { timestamp: 1_000, value: 120 },
    { timestamp: 2_000, value: 160 },
    { timestamp: 3_000, value: 200 },
    { timestamp: 5_000, value: 150 },
  ] as const;

  assert.deepEqual(breadthFirstSearch(serviceDependencies, "api-gateway"), ["api-gateway", "checkout", "payments", "risk", "ledger"]);
  assert.deepEqual(topologicalSort(serviceDependencies), ["api-gateway", "checkout", "payments", "risk", "ledger"]);
  const shortestPath = dijkstraShortestPath(serviceDependencies, "api-gateway", "ledger");
  assert.equal(shortestPath.distance, 4);
  assert.deepEqual(shortestPath.path, ["api-gateway", "checkout", "payments", "ledger"]);
  assert.equal(shortestPath.visitedOrder[0], "api-gateway");
  assert.ok(shortestPath.visitedOrder.includes("ledger"));
  assert.deepEqual(slidingWindow([1, 2, 3, 4], 2), [[1, 2], [2, 3], [3, 4]]);
  assert.deepEqual(movingAverage([100, 150, 200, 250], 2), [125, 175, 225]);
  assert.deepEqual(rollingSum([100, 150, 200, 250], 2), [250, 350, 450]);
  assert.deepEqual(windowDelta([100, 150, 200, 250], 3), [100, 100]);
  assert.equal(sumBy(latencySeries, (point) => point.value), 630);
  assert.equal(averageBy(latencySeries, (point) => point.value), 157.5);
  assert.deepEqual(bucketByInterval(latencySeries, 2_000).map((bucket) => bucket.bucketStart), [0, 2_000, 4_000]);
  assert.deepEqual(movingAverageSeries(latencySeries, 2), [
    { timestamp: 2_000, value: 140 },
    { timestamp: 3_000, value: 180 },
    { timestamp: 5_000, value: 175 },
  ]);
});