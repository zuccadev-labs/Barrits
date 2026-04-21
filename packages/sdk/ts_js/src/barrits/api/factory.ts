import { resolveBarritsConfig, type BarritsRootConfig, type ResolvedBarritsConfig } from "../config";
import { barrits } from "./domains";

/**
 * Dynamically generated application API context matching the requested namespace.
 */
export type CustomBarritsApi<TNamespace extends string> = {
  [K in TNamespace]: typeof barrits;
} & {
  brt: typeof barrits;
  barrits: typeof barrits;
  config: ResolvedBarritsConfig;
};

/**
 * Bootstraps a custom Barrits API domain namespace using the factory pattern.
 * Reads environment configuration to dynamically infer the root object name.
 * 
 * This enables the codebase to act under a user-defined umbrella variable
 * without losing IDE autocompletion or breaking standard bundler workflows.
 * 
 * @param options Explicit configuration overrides to bypass automatic discovery.
 * @returns An API instance featuring the custom configured namespace alongside defaults.
 */
export const createBarrits = async <TNamespace extends string = "barrits">(
  options?: BarritsRootConfig
): Promise<CustomBarritsApi<TNamespace>> => {
  const config = await resolveBarritsConfig(options);
  const namespace = (config.namespace ?? "barrits") as TNamespace;

  return {
    [namespace]: barrits,
    brt: barrits,
    barrits: barrits,
    config,
  } as unknown as CustomBarritsApi<TNamespace>;
};
