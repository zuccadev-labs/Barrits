import type { BarritsTraitDescriptorInspection, BarritsTraitDiagnostic } from "../contracts";
import type { ExportedTraitBinding } from "./traits";
/**
 * Validates abstract portable graph contracts against programmatic runtime mappings evaluating semantic rule collisions identically structurally identifying mismatches.
 *
 * @param descriptors - Pure portable semantic interfaces identifying global payload logic context.
 * @param bindingsBySourceFile - Deep programmatic node mapping representing AST node explicit structures natively pointing targeting interface bindings.
 * @returns Exhaustive diagnostic payload collection detailing validation failures or structural drifts natively identifying path context.
 */
export declare const collectTraitDiagnostics: (
  descriptors: readonly BarritsTraitDescriptorInspection[],
  bindingsBySourceFile: ReadonlyMap<string, readonly ExportedTraitBinding[]>,
) => BarritsTraitDiagnostic[];
