import { breadthFirstSearch, dijkstraShortestPath, topologicalSort } from "barrits";

const serviceDependencies = [
  { from: "edge", to: "api", weight: 2 },
  { from: "api", to: "catalog", weight: 1 },
  { from: "api", to: "payments", weight: 3 },
  { from: "catalog", to: "inventory", weight: 2 },
  { from: "payments", to: "ledger", weight: 1 },
  { from: "inventory", to: "ledger", weight: 2 },
];

export const createGraphExamples = () => {
  return {
    breadthFirstDependencies: breadthFirstSearch(serviceDependencies, "edge"),
    releaseOrder: topologicalSort(serviceDependencies),
    shortestRouteToLedger: dijkstraShortestPath(serviceDependencies, "edge", "ledger"),
  };
};
