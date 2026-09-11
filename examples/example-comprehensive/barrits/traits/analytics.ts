/**
 * [EN] Analytics trait. Cross-cutting concern, integrates with cache and API.
 * [ES] Trait de Analytics. Concern transversal, se integra con caché y API.
 */

export interface AnalyticsContract {
  track: (event: string, data: Record<string, unknown>) => Promise<void>;
  report: () => Promise<Record<string, unknown>>;
}

/**
 * [EN] Analytics Trait Definition
 * [ES] Definición del Trait de Analytics
 *
 * @trait
 * @name analytics
 * @requires ["cache:set", "http:route"]
 * @provides ["analytics:track", "analytics:report"]
 * @state { events: Event[], aggregations: Map<string, Aggregation> }
 */
export const createAnalyticsTrait = () => ({
  name: "analytics",
  requires: ["cache:set", "http:route"],
  provides: ["analytics:track", "analytics:report"],
  state: {
    events: [] as Array<{ event: string; data: Record<string, unknown>; timestamp: number }>,
    aggregations: new Map() as Map<string, number>,
  },
  create: async (state: Record<string, unknown>) => {
    const events = state.events as Array<{ event: string; data: Record<string, unknown>; timestamp: number }>;
    const aggregations = state.aggregations as Map<string, number>;

    return {
      track: async (event: string, data: Record<string, unknown>) => {
        events.push({ event, data, timestamp: Date.now() });
        aggregations.set(event, (aggregations.get(event) ?? 0) + 1);
        console.log(`[analytics] tracked event: ${event}`);
      },
      report: async () => {
        console.log("[analytics] generating report");
        return Object.fromEntries(aggregations);
      },
    };
  },
});
