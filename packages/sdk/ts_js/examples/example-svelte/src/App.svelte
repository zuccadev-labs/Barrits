<script lang="ts">
  import manifest from "virtual:barrits/manifest";

  import { createBuildManifestSummary, movingAverageSeries, sumar } from "@zuccadev-labs/barrits";

  const manifestSummary = createBuildManifestSummary(manifest);
  const movingAverage = movingAverageSeries([
    { timestamp: 1710000000000, value: 20 },
    { timestamp: 1710000060000, value: 30 },
    { timestamp: 1710000120000, value: 50 },
  ], 2);
</script>

<main style="font-family: Georgia, serif; padding: 2rem; line-height: 1.5;">
  <h1>barrits Svelte example</h1>
  <p>Operacion de control: {sumar(30, 12)}</p>
  <p>Domains detectados automaticamente: {manifestSummary.domains.join(", ") || "none"}</p>
  <pre>{JSON.stringify({ movingAverage }, null, 2)}</pre>
</main>