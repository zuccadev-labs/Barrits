import type { BarritsDiscovery, BarritsIntegrationGraph, RuntimeFileSystemAdapter } from "./contracts";
/**
 * Orchestrates the massive discovery routing pipeline, injecting cross-domain diagnostics
 * and systematically compiling the final integration map for the Barrits project.
 */
export declare const inspectBarritsIntegrations: (
  adapter: RuntimeFileSystemAdapter,
  discovery: BarritsDiscovery,
) => Promise<BarritsIntegrationGraph>;
