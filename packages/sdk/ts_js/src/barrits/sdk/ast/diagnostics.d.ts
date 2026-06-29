import type { BarritsTraitDescriptorInspection, BarritsTraitDiagnostic } from "../contracts";
import type { ExportedTraitBinding } from "./traits";
/**
 * Validates abstract portable graph contracts against programmatic runtime mappings.
 */
export declare const collectTraitDiagnostics: (descriptors: readonly BarritsTraitDescriptorInspection[], bindingsBySourceFile: ReadonlyMap<string, readonly ExportedTraitBinding[]>) => BarritsTraitDiagnostic[];
