import type { BarritsFileIntegration, BarritsDomainIntegration, BarritsExportCollision } from "../contracts";
type PublicNamespaceEntry = {
  namespace: string;
  exportName: string;
  sourceFile: string;
};
/**
 * Validates whether the given path represents an structural domain aggregator or explicit API flat export index.
 */
export declare const isAggregatorFile: (path: string) => boolean;
/**
 * Discovers and maps logically flat representations of all deeply nested public exports aggregating domain interfaces.
 */
export declare const collectPublicNamespaceEntries: (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
) => PublicNamespaceEntry[];
/**
 * Determines runtime domain conflict events where cross-project namespace interfaces collide overriding native structural payloads.
 */
export declare const collectCollisions: (
  projectRootFiles: readonly BarritsFileIntegration[],
  projectDomains: readonly BarritsDomainIntegration[],
  libraryRootFiles: readonly BarritsFileIntegration[],
  libraryDomains: readonly BarritsDomainIntegration[],
) => BarritsExportCollision[];
export {};
