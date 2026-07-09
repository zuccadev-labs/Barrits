/**
 * Database service trait for Deno BaaS.
 *
 * Declares a generic database capability that the consumer BaaS implements.
 * The IoC container wires the concrete database adapter at runtime.
 *
 * @barrits-trait
 * @barrits-provides database:connection
 * @barrits-consumes runtime:deno
 * @barrits-state Database
 */
export const databaseServiceTrait = {
  name: "database-service" as const,
  provides: ["database:connection"] as readonly string[],
  consumes: ["runtime:deno"] as readonly string[],
  state: ["Database"] as readonly string[],
  initialize: () => ({
    connectionString: "pending://injection",
    connected: false,
  }),
};
