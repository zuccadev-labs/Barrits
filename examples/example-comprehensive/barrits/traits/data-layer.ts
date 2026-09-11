/**
 * [EN] Data persistence layer trait. Provides core database operations.
 * [ES] Trait de capa de persistencia. Proporciona operaciones de base de datos.
 */

export interface DataLayerContract {
  query: (sql: string) => Promise<unknown[]>;
  execute: (sql: string) => Promise<number>;
  transaction: <T>(fn: () => Promise<T>) => Promise<T>;
}

/**
 * [EN] Data Layer Trait Definition
 * [ES] Definición del Trait de Capa de Datos
 *
 * @trait
 * @name data-layer
 * @provides ["db:query", "db:execute", "db:transaction"]
 * @state { connected: boolean, pool: PoolReference }
 *
 * @example
 * ```typescript
 * const dataTrait = createTraitDescriptor({
 *   name: "data-layer",
 *   provides: ["db:query", "db:execute", "db:transaction"],
 *   state: { connected: false, pool: null },
 *   create: async (state) => ({
 *     query: async (sql) => { ... },
 *     execute: async (sql) => { ... },
 *     transaction: async (fn) => { ... }
 *   })
 * });
 * ```
 */
export const createDataLayerTrait = () => ({
  name: "data-layer",
  provides: ["db:query", "db:execute", "db:transaction"],
  state: { connected: false, pool: null as unknown },
  create: async (state: Record<string, unknown>) => {
    state.connected = true;
    return {
      query: async (sql: string) => {
        console.log(`[data-layer] executing query: ${sql}`);
        return [{ result: "mocked" }];
      },
      execute: async (sql: string) => {
        console.log(`[data-layer] executing: ${sql}`);
        return 1;
      },
      transaction: async <T,>(fn: () => Promise<T>): Promise<T> => {
        console.log("[data-layer] starting transaction");
        const result = await fn();
        console.log("[data-layer] committing transaction");
        return result;
      },
    };
  },
});
