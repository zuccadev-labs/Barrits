import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsTraitDiagnostic } from "./contracts";
type TraitDiagnosticCarrier = Pick<BarritsIntegrationGraph, "traitDescriptors" | "traitDiagnostics"> | Pick<BarritsBuildManifest, "traitDescriptors" | "traitDiagnostics">;
export declare const formatTraitOverviewLines: (value: TraitDiagnosticCarrier) => string[];
export declare const formatTraitDiagnosticDetailLines: (diagnostics: readonly BarritsTraitDiagnostic[], limit?: number) => string[];
export {};
