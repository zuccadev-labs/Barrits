/**
 * @module
 * [EN] Build manifest and watch snapshot summarization: aggregate diagnostics and compact summaries.
 * [ES] Resumen de manifiestos de compilación y snapshots de observación: agregación de diagnósticos y resúmenes compactos.
 */
import type {
  BarritsBuildManifest,
  BarritsConsumedStateSummary,
  BarritsConsumedTraitDescriptor,
  BarritsLanguageToolSnapshot,
  BarritsSelectionFilters,
  BarritsTraitDiagnostic,
  BarritsTraitDiagnosticAggregate,
  BarritsWatchSnapshot,
  BarritsImportAction,
} from "./contracts";
import {
  createEmptyTraitDiagnosticCounts,
  createEmptyTraitDiagnosticCategoryCounts,
  createEmptyTraitDiagnosticCodeCounts,
  type MutableTraitDiagnosticCounts,
  type MutableTraitDiagnosticCategoryCounts,
  type MutableTraitDiagnosticCodeCounts,
} from "./validation";

export const mapImportStatements = (importActions: readonly BarritsImportAction[]): string[] => {
  return importActions.map((action) => action.statement);
};

export const mapTraitDescriptors = (
  descriptors: readonly BarritsConsumedTraitDescriptor[] | undefined,
): BarritsConsumedTraitDescriptor[] => {
  return [...(descriptors ?? [])].sort((left, right) => {
    if (left.name === right.name) {
      return left.sourceFile.localeCompare(right.sourceFile);
    }

    return left.name.localeCompare(right.name);
  });
};

export const mapTraitDiagnostics = (
  diagnostics: readonly BarritsTraitDiagnostic[] | undefined,
): BarritsTraitDiagnostic[] => {
  return [...(diagnostics ?? [])].sort((left, right) => {
    if (left.severity === right.severity) {
      if (left.code === right.code) {
        return left.sourceFile.localeCompare(right.sourceFile);
      }

      return left.code.localeCompare(right.code);
    }

    return left.severity.localeCompare(right.severity);
  });
};

export const createTraitDiagnosticAggregate = (
  diagnostics: readonly BarritsTraitDiagnostic[] | undefined,
): BarritsTraitDiagnosticAggregate | undefined => {
  if (!diagnostics || diagnostics.length === 0) {
    return undefined;
  }

  const counts = createEmptyTraitDiagnosticCounts();
  const byCategory = createEmptyTraitDiagnosticCategoryCounts();
  const byCode = createEmptyTraitDiagnosticCodeCounts();
  const byDescriptor = new Map<string, {
    descriptorName: string;
    sourceFile: string;
    bindingName?: string;
    counts: MutableTraitDiagnosticCounts;
    byCategory: MutableTraitDiagnosticCategoryCounts;
    byCode: MutableTraitDiagnosticCodeCounts;
    codes: Set<BarritsTraitDiagnostic["code"]>;
  }>();

  for (const diagnostic of diagnostics) {
    counts.total += 1;
    counts[diagnostic.severity === "error" ? "errorCount" : "warningCount"] += 1;
    byCategory[diagnostic.category] += 1;
    byCode[diagnostic.code] += 1;

    const descriptorName = diagnostic.descriptorName ?? "(anonymous)";
    const key = `${descriptorName}:${diagnostic.sourceFile}:${diagnostic.bindingName ?? ""}`;
    const existing = byDescriptor.get(key) ?? {
      descriptorName,
      sourceFile: diagnostic.sourceFile,
      bindingName: diagnostic.bindingName,
      counts: createEmptyTraitDiagnosticCounts(),
      byCategory: createEmptyTraitDiagnosticCategoryCounts(),
      byCode: createEmptyTraitDiagnosticCodeCounts(),
      codes: new Set<BarritsTraitDiagnostic["code"]>(),
    };

    existing.counts.total += 1;
    existing.counts[diagnostic.severity === "error" ? "errorCount" : "warningCount"] += 1;
    existing.byCategory[diagnostic.category] += 1;
    existing.byCode[diagnostic.code] += 1;
    existing.codes.add(diagnostic.code);
    byDescriptor.set(key, existing);
  }

  return {
    counts,
    byCategory,
    byCode,
    byDescriptor: Array.from(byDescriptor.values())
      .sort((left, right) => {
        if (left.descriptorName === right.descriptorName) {
          return left.sourceFile.localeCompare(right.sourceFile);
        }

        return left.descriptorName.localeCompare(right.descriptorName);
      })
      .map((entry) => ({
        descriptorName: entry.descriptorName,
        sourceFile: entry.sourceFile,
        bindingName: entry.bindingName,
        counts: entry.counts,
        byCategory: entry.byCategory,
        byCode: entry.byCode,
        codes: Array.from(entry.codes).sort((left, right) => left.localeCompare(right)),
      })),
  };
};

const withOptionalFilters = <T extends object>(
  value: T,
  filters: BarritsSelectionFilters | undefined,
): T & { filters?: BarritsSelectionFilters } => {
  if (!filters) {
    return value;
  }

  return {
    ...value,
    filters,
  };
};

export const createBuildManifestSummary = (
  manifest: BarritsBuildManifest | null,
): BarritsConsumedStateSummary => {
  if (!manifest) {
    return {
      generatedAt: null,
      strategy: "missing",
      domains: [],
      importStatements: [],
      traitDescriptors: [],
    };
  }

  return withOptionalFilters({
    generatedAt: manifest.generatedAt,
    strategy: manifest.strategy,
    domains: manifest.domains,
    importStatements: mapImportStatements(manifest.importActions),
    traitDescriptors: mapTraitDescriptors(manifest.traitDescriptors),
    traitDiagnostics: mapTraitDiagnostics(manifest.traitDiagnostics),
    traitDiagnosticAggregate: createTraitDiagnosticAggregate(manifest.traitDiagnostics),
    collisionsCount: manifest.collisions?.length ?? 0,
  }, manifest.filters);
};

export const createWatchSnapshotSummary = (
  snapshot: BarritsWatchSnapshot | null,
): BarritsConsumedStateSummary => {
  if (!snapshot) {
    return {
      generatedAt: null,
      strategy: "missing",
      domains: [],
      importStatements: [],
      traitDescriptors: [],
    };
  }

  return withOptionalFilters({
    generatedAt: snapshot.generatedAt,
    mode: snapshot.mode,
    strategy: snapshot.graph.strategy,
    domains: snapshot.graph.domains.map((domain) => domain.name),
    importStatements: mapImportStatements(snapshot.graph.importActions),
    traitDescriptors: mapTraitDescriptors(snapshot.graph.traitDescriptors),
    traitDiagnostics: mapTraitDiagnostics(snapshot.graph.traitDiagnostics),
    traitDiagnosticAggregate: createTraitDiagnosticAggregate(snapshot.graph.traitDiagnostics),
    collisionsCount: snapshot.graph.collisions?.length ?? 0,
  }, snapshot.filters);
};

export const createLanguageToolSnapshot = (
  snapshot: BarritsWatchSnapshot,
): BarritsLanguageToolSnapshot => {
  const traitDiagnosticAggregate = createTraitDiagnosticAggregate(snapshot.graph.traitDiagnostics) ?? {
    counts: createEmptyTraitDiagnosticCounts(),
    byCategory: createEmptyTraitDiagnosticCategoryCounts(),
    byCode: createEmptyTraitDiagnosticCodeCounts(),
    byDescriptor: [],
  };

  return withOptionalFilters({
    generatedAt: snapshot.generatedAt,
    mode: snapshot.mode,
    strategy: snapshot.graph.strategy,
    domains: snapshot.graph.domains.map((domain) => ({
      name: domain.name,
      filesCount: domain.files.length,
      exportNames: domain.files.flatMap((file) => file.exports.map((entry) => entry.name)),
    })),
    traitDescriptors: mapTraitDescriptors(snapshot.graph.traitDescriptors),
    traitDiagnostics: mapTraitDiagnostics(snapshot.graph.traitDiagnostics),
    traitDiagnosticAggregate,
    importActions: snapshot.graph.importActions,
    importStatements: mapImportStatements(snapshot.graph.importActions),
    collisions: snapshot.graph.collisions ?? [],
  }, snapshot.filters);
};
