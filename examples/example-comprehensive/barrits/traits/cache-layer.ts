/**
 * [EN] Cache layer trait. Depends on data-layer, provides caching.
 * [ES] Trait de capa de caché. Depende de data-layer, proporciona cacheo.
 */

export interface CacheLayerContract {
  get: (key: string) => Promise<unknown | null>;
  set: (key: string, value: unknown, ttl?: number) => Promise<void>;
  invalidate: (pattern: string) => Promise<number>;
}

/**
 * [EN] Cache Layer Trait Definition
 * [ES] Definición del Trait de Capa de Caché
 *
 * @trait
 * @name cache-layer
 * @requires ["db:query", "db:execute"]
 * @provides ["cache:get", "cache:set", "cache:invalidate"]
 * @state { entries: Map<string, CacheEntry>, stats: CacheStats }
 */
export const createCacheLayerTrait = () => ({
  name: "cache-layer",
  requires: ["db:query", "db:execute"],
  provides: ["cache:get", "cache:set", "cache:invalidate"],
  state: {
    entries: new Map() as Map<string, { value: unknown; expiry: number }>,
    stats: { hits: 0, misses: 0 },
  },
  create: async (state: Record<string, unknown>) => {
    const entries = state.entries as Map<string, { value: unknown; expiry: number }>;
    const stats = state.stats as { hits: number; misses: number };

    return {
      get: async (key: string) => {
        const entry = entries.get(key);
        if (!entry) {
          stats.misses++;
          return null;
        }
        if (Date.now() > entry.expiry) {
          entries.delete(key);
          stats.misses++;
          return null;
        }
        stats.hits++;
        console.log(`[cache-layer] HIT: ${key}`);
        return entry.value;
      },
      set: async (key: string, value: unknown, ttl = 3600000) => {
        entries.set(key, { value, expiry: Date.now() + ttl });
        console.log(`[cache-layer] SET: ${key}`);
      },
      invalidate: async (pattern: string) => {
        let count = 0;
        for (const key of entries.keys()) {
          if (key.includes(pattern)) {
            entries.delete(key);
            count++;
          }
        }
        console.log(`[cache-layer] INVALIDATED: ${count} entries matching ${pattern}`);
        return count;
      },
    };
  },
});
