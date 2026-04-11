import React from "react";
import { createRoot } from "react-dom/client";
import manifest from "virtual:barrits/manifest";

import { createBuildManifestSummary, maxDrawdown, movingAverageSeries, orderBy } from "barrits";
import { AppRouterProvider, useAppRouter } from "./barrits";

const latencySeries = [
  { timestamp: 1710000000000, value: 120 },
  { timestamp: 1710000060000, value: 140 },
  { timestamp: 1710000120000, value: 180 },
  { timestamp: 1710000180000, value: 130 },
];
const manifestSummary = createBuildManifestSummary(manifest);
const sortedDomains = orderBy(manifestSummary.domains, [{ project: (domain) => domain, direction: "asc" }]);
const movingAverage = movingAverageSeries(latencySeries, 2);
const drawdown = maxDrawdown(latencySeries);

const RouterStatus = () => {
  const router = useAppRouter();

  return React.createElement("section", { style: { marginTop: "1rem" } }, [
    React.createElement("p", { key: "path" }, `Ruta actual: ${router.pathname}`),
    React.createElement("button", { key: "button", onClick: router.goToMetrics, type: "button" }, "Ir a metrics"),
  ]);
};

const App = () => {
  return React.createElement("main", { style: { fontFamily: "Georgia, serif", padding: "2rem", lineHeight: 1.5 } }, [
    React.createElement("h1", { key: "title" }, "barrits React example"),
    React.createElement("p", { key: "summary" }, `Domains detectados automaticamente: ${sortedDomains.join(", ") || "none"}`),
    React.createElement("pre", { key: "ma" }, JSON.stringify({ movingAverage, drawdown }, null, 2)),
    React.createElement(AppRouterProvider, { key: "router" }, React.createElement(RouterStatus, { key: "status" })),
  ]);
};

createRoot(document.getElementById("root")).render(React.createElement(App));