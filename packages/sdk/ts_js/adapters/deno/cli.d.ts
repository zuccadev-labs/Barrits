/**
 * @module
 * Deno CLI for Barrits discovery, inspection, imports, watch, and build automation.
 */
/**
 * Runs the Barrits CLI command pipeline inside Deno.
 *
 * @param argumentsList Optional CLI arguments. Defaults to runtime args.
 * @returns Process exit code compatible with shell tooling.
 */
export declare const runDenoCli: (argumentsList?: string[]) => Promise<number>;
