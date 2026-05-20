/**
 * @module
 * [EN] Placeholder module description.
 * [ES] Descripción de marcador de posición del módulo.
 */
import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsTraitDiagnostic } from "./contracts";
type TraitDiagnosticCarrier = Pick<BarritsIntegrationGraph, "traitDescriptors" | "traitDiagnostics"> | Pick<BarritsBuildManifest, "traitDescriptors" | "traitDiagnostics">;
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
