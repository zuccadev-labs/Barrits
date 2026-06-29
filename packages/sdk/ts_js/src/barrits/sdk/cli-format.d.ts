/**
 * @module
 * [EN] CLI output formatting utilities for trait overviews and diagnostic summaries.
 * [ES] Utilidades de formato de salida CLI para resúmenes de traits y diagnósticos.
 */
import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsTraitDiagnostic } from "./contracts";
type TraitDiagnosticCarrier =
  | Pick<BarritsIntegrationGraph, "traitDescriptors" | "traitDiagnostics">
  | Pick<BarritsBuildManifest, "traitDescriptors" | "traitDiagnostics">;
/**
 * [EN] Implementation of Format trait overview lines.
 * [ES] Implementación de Format trait overview lines.
 */
export declare const formatTraitOverviewLines: (value: TraitDiagnosticCarrier) => string[];
/**
 * [EN] Implementation of Format trait diagnostic detail lines.
 * [ES] Implementación de Format trait diagnostic detail lines.
 */
export declare const formatTraitDiagnosticDetailLines: (diagnostics: readonly BarritsTraitDiagnostic[], limit?: number) => string[];
export {};
