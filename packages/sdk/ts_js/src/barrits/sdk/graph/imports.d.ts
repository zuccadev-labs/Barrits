import type { BarritsFileIntegration, BarritsDomainIntegration, BarritsImportAction, BarritsFileExport } from "../contracts";
/**
 * Filter exported interfaces natively targeting mapped module components resolving explicit interfaces mapping.
 */
export declare const collectMergedExports: (
  files: readonly BarritsFileIntegration[],
  matcher: (file: BarritsFileIntegration) => boolean,
) => BarritsFileExport[];
/**
 * Validates logical import aliases structurally planning deterministic namespace import patterns mapped globally.
 */
export declare const planImportActions: (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
) => BarritsImportAction[];
