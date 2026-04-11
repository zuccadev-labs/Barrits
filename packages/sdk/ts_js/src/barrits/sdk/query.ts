import type {
  BarritsConsumedTraitDescriptor,
  BarritsDomainIntegration,
  BarritsExportCollision,
  BarritsFileExport,
  BarritsFileIntegration,
  BarritsGraphFilters,
  BarritsImportFilters,
  BarritsIntegrationGraph,
  BarritsTraitDiagnostic,
} from "./contracts";
import { filterImportActions } from "./imports";
import { joinPath, normalizePath } from "./path";

const isAbsolutePath = (value: string): boolean => {
  return /^(?:[A-Za-z]:\/|\/)/.test(normalizePath(value));
};

const matchesAllowedValue = (value: string, allowedValues: Set<string> | null): boolean => {
  return !allowedValues || allowedValues.has(value);
};

const filterExports = (
  exportsList: readonly BarritsFileExport[],
  exportFilter: Set<string> | null,
  visibilityFilter: Set<string> | null,
): BarritsFileExport[] => {
  return exportsList.filter((entry) => {
    if (!matchesAllowedValue(entry.name, exportFilter)) {
      return false;
    }

    if (!matchesAllowedValue(entry.visibility, visibilityFilter)) {
      return false;
    }

    return true;
  });
};

const filterFiles = (
  files: readonly BarritsFileIntegration[],
  options: {
    fileKindFilter: Set<string> | null;
    exportFilter: Set<string> | null;
    visibilityFilter: Set<string> | null;
  },
): BarritsFileIntegration[] => {
  const hasExportFilters = Boolean(options.exportFilter || options.visibilityFilter);

  return files.flatMap((file) => {
    if (!matchesAllowedValue(file.kind, options.fileKindFilter)) {
      return [];
    }

    const exports = filterExports(file.exports, options.exportFilter, options.visibilityFilter);

    if (hasExportFilters && exports.length === 0) {
      return [];
    }

    return [{
      ...file,
      exports,
    }];
  });
};

const collectGraphMetrics = (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
) => {
  const files = [...rootFiles, ...domains.flatMap((domain) => domain.files)];
  const exportsCount = files.reduce((count, file) => count + file.exports.length, 0);
  const publicExportsCount = files.reduce(
    (count, file) => count + file.exports.filter((entry) => entry.visibility === "public").length,
    0,
  );

  return {
    filesCount: files.length,
    exportsCount,
    publicExportsCount,
    internalExportsCount: exportsCount - publicExportsCount,
    barrelsCount: files.filter((file) => file.kind === "barrel" || file.kind === "root").length,
  };
};

const filterCollisions = (
  collisions: readonly BarritsExportCollision[],
  filters: {
    domainFilter: Set<string> | null;
    exportFilter: Set<string> | null;
  },
): BarritsExportCollision[] => {
  return collisions.filter((collision) => {
    if (filters.domainFilter && !filters.domainFilter.has(collision.namespace)) {
      return false;
    }

    if (filters.exportFilter && !filters.exportFilter.has(collision.exportName)) {
      return false;
    }

    return true;
  });
};

const collectVisibleTraitDescriptorFiles = (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
): Set<string> => {
  return new Set(
    [...rootFiles, ...domains.flatMap((domain) => domain.files)]
      .filter((file) => file.traitDescriptors.length > 0)
      .map((file) => file.path),
  );
};

const filterTraitDescriptors = (
  descriptors: readonly BarritsConsumedTraitDescriptor[],
  visibleFiles: Set<string>,
): BarritsConsumedTraitDescriptor[] => {
  return descriptors.filter((descriptor) => visibleFiles.has(descriptor.sourceFile));
};

const filterTraitDiagnostics = (
  diagnostics: readonly BarritsTraitDiagnostic[],
  visibleFiles: Set<string>,
): BarritsTraitDiagnostic[] => {
  return diagnostics.filter((diagnostic) => visibleFiles.has(diagnostic.sourceFile));
};

export const filterIntegrationGraph = (
  graph: BarritsIntegrationGraph,
  filters: BarritsGraphFilters = {},
): BarritsIntegrationGraph => {
  const domainFilter = filters.domains ? new Set(filters.domains) : null;
  const exportFilter = filters.exports ? new Set(filters.exports) : null;
  const fileKindFilter = filters.fileKinds ? new Set(filters.fileKinds) : null;
  const visibilityFilter = filters.visibilities ? new Set(filters.visibilities) : null;
  const shouldKeepRootFiles = !domainFilter || domainFilter.has("root");

  const rootFiles = shouldKeepRootFiles
    ? filterFiles(graph.rootFiles, { fileKindFilter, exportFilter, visibilityFilter })
    : [];
  const libraryRootFiles = shouldKeepRootFiles
    ? filterFiles(graph.libraryRootFiles, { fileKindFilter, exportFilter, visibilityFilter })
    : [];
  const domains = graph.domains.flatMap((domain) => {
    if (domainFilter && !domainFilter.has(domain.name)) {
      return [];
    }

    const files = filterFiles(domain.files, { fileKindFilter, exportFilter, visibilityFilter });

    if (files.length === 0 && (fileKindFilter || exportFilter || visibilityFilter)) {
      return [];
    }

    return [{
      ...domain,
      files,
    }];
  });
  const libraryDomains = graph.libraryDomains.flatMap((domain) => {
    if (domainFilter && !domainFilter.has(domain.name)) {
      return [];
    }

    const files = filterFiles(domain.files, { fileKindFilter, exportFilter, visibilityFilter });

    if (files.length === 0 && (fileKindFilter || exportFilter || visibilityFilter)) {
      return [];
    }

    return [{
      ...domain,
      files,
    }];
  });
  const metrics = collectGraphMetrics(rootFiles, domains);
  const visibleTraitFiles = collectVisibleTraitDescriptorFiles(rootFiles, domains);
  const importActionFilters: BarritsImportFilters = {
    domains: filters.domains,
    exports: filters.exports,
  };

  return {
    ...graph,
    rootFiles,
    libraryRootFiles,
    domains,
    libraryDomains,
    ...metrics,
    traitDescriptors: filterTraitDescriptors(graph.traitDescriptors, visibleTraitFiles),
    traitDiagnostics: filterTraitDiagnostics(graph.traitDiagnostics, visibleTraitFiles),
    importActions: filterImportActions(graph, importActionFilters).importActions,
    collisions: filterCollisions(graph.collisions, { domainFilter, exportFilter }),
  };
};

export const resolveProjectFilePath = (
  projectRoot: string,
  filePath: string | undefined,
): string | undefined => {
  if (!filePath) {
    return undefined;
  }

  const normalizedPath = normalizePath(filePath);

  if (isAbsolutePath(normalizedPath)) {
    return normalizedPath;
  }

  return joinPath(projectRoot, normalizedPath);
};