<script setup lang="ts">
import manifest from "virtual:barrits/manifest";

import { createBuildManifestSummary, maxDrawdown, movingAverageSeries, orderBy } from "barrits";

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
</script>

<template>
  <main style="font-family: Georgia, serif; padding: 2rem; line-height: 1.5;">
    <h1>barrits Vue example</h1>
    <p>Domains detectados automaticamente: {{ sortedDomains.join(", ") || "none" }}</p>
    <pre>{{ JSON.stringify({ movingAverage, drawdown }, null, 2) }}</pre>
  </main>
</template>