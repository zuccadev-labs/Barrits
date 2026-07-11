/**
 * @module
 * [EN] CLI output formatting utilities for trait overviews and diagnostic summaries.
 * [ES] Utilidades de formato de salida CLI para resúmenes de traits y diagnósticos.
 */
import type { BarritsBuildManifest, BarritsIntegrationGraph, BarritsTraitDiagnostic } from "./contracts";

type TraitDiagnosticCarrier =
  | Pick<BarritsIntegrationGraph, "traitDescriptors" | "traitDiagnostics">
  | Pick<BarritsBuildManifest, "traitDescriptors" | "traitDiagnostics">;

const countTraitDiagnosticSeverities = (diagnostics: readonly BarritsTraitDiagnostic[]) => {
  const errorCount = diagnostics.filter((diagnostic) => diagnostic.severity === "error").length;

  return {
    errorCount,
    warningCount: diagnostics.length - errorCount,
  };
};

const formatTraitDiagnosticCategorySummary = (diagnostics: readonly BarritsTraitDiagnostic[]): string | null => {
  const counts: Record<BarritsTraitDiagnostic["category"], number> = {
    drift: 0,
    impossible: 0,
    "non-verifiable": 0,
  };

  for (const diagnostic of diagnostics) {
    counts[diagnostic.category] += 1;
  }

  const parts = (Object.entries(counts) as [BarritsTraitDiagnostic["category"], number][])
    .filter(([, count]) => count > 0)
    .map(([category, count]) => `${count} ${category}`);

  return parts.length > 0 ? `  - categories: ${parts.join(", ")}` : null;
};

/**
 * [EN] Implementation of Format trait overview lines.
 * [ES] Implementación de Format trait overview lines.
 */
export const formatTraitOverviewLines = (value: TraitDiagnosticCarrier): string[] => {
  const lines = [`traits: ${value.traitDescriptors.length}`];

  if (value.traitDiagnostics.length === 0) {
    return lines;
  }

  const { errorCount, warningCount } = countTraitDiagnosticSeverities(value.traitDiagnostics);
  lines.push(`traitDiagnostics: ${value.traitDiagnostics.length} (${errorCount} errors, ${warningCount} warnings)`);
  return lines;
};

/**
 * [EN] Implementation of Format trait diagnostic detail lines.
 * [ES] Implementación de Format trait diagnostic detail lines.
 */
export const formatTraitDiagnosticDetailLines = (diagnostics: readonly BarritsTraitDiagnostic[], limit = 12): string[] => {
  if (diagnostics.length === 0) {
    return [];
  }

  const lines = ["traitDiagnostics:"];
  const categorySummary = formatTraitDiagnosticCategorySummary(diagnostics);

  if (categorySummary) {
    lines.push(categorySummary);
  }

  for (const diagnostic of diagnostics.slice(0, limit)) {
    lines.push(`  - [${diagnostic.severity}] ${diagnostic.code}: ${diagnostic.message}`);
  }

  if (diagnostics.length > limit) {
    lines.push(`  ... ${diagnostics.length - limit} more`);
  }

  return lines;
};
