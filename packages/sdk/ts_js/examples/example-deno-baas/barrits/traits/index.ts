/**
 * Barrel re-exporting all trait descriptors for the Deno BaaS example.
 *
 * Consumers import traits from this barrel rather than individual files,
 * ensuring the orchestration layer exposes a stable contract surface.
 */
export { runtimeTrait } from "./runtime-trait.ts";
export { databaseServiceTrait } from "./database-service.ts";
export { httpEndpointTrait } from "./http-endpoint.ts";
