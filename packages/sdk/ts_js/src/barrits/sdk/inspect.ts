/**
 * @module
 * [EN] Integration graph inspection via AST crawling, trait discovery, and diagnostics collection.
 * [ES] Inspección del grafo de integración mediante crawling AST, descubrimiento de traits y recolección de diagnósticos.
 */
import { mapConcurrent } from "./async-utils";
import { joinPath, normalizePath } from "./path";
import { loadBarritsConfig, type BarritsExportContractConfig } from "../config";
import { inspectLayer } from "./crawler/layer";
import { collectExportedTraitBindings, mergeTraitDescriptors, toTraitContractDescriptor, type ExportedTraitBinding } from "./ast/traits";
import { collectTraitDiagnostics } from "./ast/diagnostics";
import { collectCollisions } from "./graph/collisions";
import { planImportActions } from "./graph/imports";
import type {
  BarritsDiscovery,
  BarritsIntegrationGraph,
  BarritsFileIntegration,
  BarritsDomainIntegration,
  BarritsExportVisibility,
  BarritsTraitDescriptorInspection,
  RuntimeFileSystemAdapter,
} from "./contracts";

const toConfigProjectRoots = (discovery: BarritsDiscovery): string[] => {
  const normalizedProjectRoot = normalizePath(discovery.projectRoot);
  const normalizedBarritsDirectory = normalizePath(discovery.barritsDirectory);
  const candidateRoots = new Set<string>([normalizedProjectRoot]);

  if (normalizedBarritsDirectory.endsWith("/barrits")) {
    candidateRoots.add(normalizedBarritsDirectory.slice(0, -"/barrits".length));
  }

  return Array.from(candidateRoots).filter(Boolean);
};

const mergeRootFiles = (
  projectRootFiles: readonly BarritsFileIntegration[],
  libraryRootFiles: readonly BarritsFileIntegration[],
): BarritsFileIntegration[] => {
  return [...projectRootFiles, ...libraryRootFiles].sort((left, right) => {
    if (left.path === right.path) {
      return left.sourceLayer.localeCompare(right.sourceLayer);
    }

    return left.path.localeCompare(right.path);
  });
};

const mergeDomains = (
  projectDomains: readonly BarritsDomainIntegration[],
  libraryDomains: readonly BarritsDomainIntegration[],
): BarritsDomainIntegration[] => {
  const mergedDomains = new Map<string, BarritsDomainIntegration>();

  for (const domain of [...projectDomains, ...libraryDomains]) {
    const existingDomain = mergedDomains.get(domain.name);

    if (!existingDomain) {
      mergedDomains.set(domain.name, { ...domain, files: [...domain.files] });
      continue;
    }

    mergedDomains.set(domain.name, {
      ...existingDomain,
      files: [...existingDomain.files, ...domain.files].sort((left, right) => {
        if (left.path === right.path) {
          return left.sourceLayer.localeCompare(right.sourceLayer);
        }

        return left.path.localeCompare(right.path);
      }),
    });
  }

  return Array.from(mergedDomains.values()).sort((left, right) => left.name.localeCompare(right.name));
};

type ExportVisibilityOverride = {
  readonly sourceFile: string;
  readonly exportName?: string;
  readonly accessPath?: string;
  readonly visibility: BarritsExportVisibility;
};

const normalizeExportVisibilityOverride = (contract: BarritsExportContractConfig): ExportVisibilityOverride | null => {
  const sourceFile = normalizePath(contract.sourceFile).replace(/^\.\//u, "").trim();
  const exportName = contract.exportName?.trim();
  const accessPath = contract.accessPath?.trim();

  if (!sourceFile || (!exportName && !accessPath)) {
    return null;
  }

  return {
    sourceFile,
    exportName,
    accessPath,
    visibility: contract.visibility ?? "internal",
  };
};

const applyExportVisibilityOverrides = (
  files: readonly BarritsFileIntegration[],
  overrides: readonly ExportVisibilityOverride[],
): BarritsFileIntegration[] => {
  if (overrides.length === 0) return [...files];

  const byName = new Map<string, BarritsExportVisibility>();
  const byAccessPath = new Map<string, BarritsExportVisibility>();

  for (const override of overrides) {
    if (override.exportName) byName.set(`${override.sourceFile}:${override.exportName}`, override.visibility);
    if (override.accessPath) byAccessPath.set(`${override.sourceFile}:${override.accessPath}`, override.visibility);
  }

  return files.map((file) => {
    const normalizedPath = normalizePath(file.path);
    const nextExports = file.exports.map((entry) => {
      const visibility =
        byName.get(`${normalizedPath}:${entry.name}`) ?? byAccessPath.get(`${normalizedPath}:${entry.accessPath}`) ?? entry.visibility;

      return visibility === entry.visibility ? entry : { ...entry, visibility };
    });

    return { ...file, exports: nextExports };
  });
};

const collectTraitDescriptors = (files: readonly BarritsFileIntegration[]): BarritsTraitDescriptorInspection[] => {
  return files
    .flatMap((file) => file.traitDescriptors)
    .sort((left, right) => {
      if (left.name === right.name) return left.sourceFile.localeCompare(right.sourceFile);
      return left.name.localeCompare(right.name);
    });
};

/**
 * Orchestrates the massive discovery routing pipeline, injecting cross-domain diagnostics
 * and systematically compiling the final integration map for the Barrits project.
 */
export const inspectBarritsIntegrations = async (
  adapter: RuntimeFileSystemAdapter,
  discovery: BarritsDiscovery,
): Promise<BarritsIntegrationGraph> => {
  const projectLayer = await inspectLayer(adapter, discovery.barritsDirectory, "barrits");
  const extraLayers = await mapConcurrent(
    discovery.discoveryRoots,
    10,
    (root) => inspectLayer(adapter, joinPath(discovery.projectRoot, root), "barrits"),
  );

  const allLayers = [projectLayer, ...extraLayers];
  let inspectedFiles = allLayers.flatMap((layer) => layer.files);
  let loadedConfig = null;

  for (const configProjectRoot of toConfigProjectRoots(discovery)) {
    loadedConfig = await loadBarritsConfig(configProjectRoot);
    if (loadedConfig) break;
  }

  const contractTraitDescriptors = (loadedConfig?.contracts?.traits ?? [])
    .map((contract) => toTraitContractDescriptor(contract))
    .filter((descriptor): descriptor is BarritsTraitDescriptorInspection => descriptor !== null);

  const exportVisibilityOverrides = (loadedConfig?.contracts?.exports ?? [])
    .map((contract) => normalizeExportVisibilityOverride(contract))
    .filter((override): override is ExportVisibilityOverride => override !== null);

  inspectedFiles = applyExportVisibilityOverrides(inspectedFiles, exportVisibilityOverrides);

  const rootFiles = mergeRootFiles(
    inspectedFiles.filter((file) => file.path === "index.ts"),
    [],
  );
  const domains = mergeDomains(
    allLayers.flatMap((layer) =>
      layer.domains.map((domain) => ({
        ...domain,
        files: inspectedFiles.filter((file) => file.path.startsWith(`${domain.name}/`) && file.sourceLayer === layer.sourceLayer),
      })),
    ),
    [],
  );
  const exportsCount = inspectedFiles.reduce((count, file) => count + file.exports.length, 0);
  const publicExportsCount = inspectedFiles.reduce(
    (count, file) => count + file.exports.filter((entry) => entry.visibility === "public").length,
    0,
  );
  const internalExportsCount = exportsCount - publicExportsCount;
  const barrelsCount = inspectedFiles.filter((file) => file.kind === "barrel" || file.kind === "root").length;

  const discoveredTraitDescriptors = collectTraitDescriptors(inspectedFiles);
  const traitDescriptors = mergeTraitDescriptors(discoveredTraitDescriptors, contractTraitDescriptors);
  const bindingsBySourceFile = new Map<string, readonly ExportedTraitBinding[]>();

  for (const file of inspectedFiles) {
    if (file.kind !== "trait") continue;
    const absolutePath = joinPath(discovery.barritsDirectory, file.path);
    const source = await adapter.readTextFile(absolutePath);
    bindingsBySourceFile.set(file.path, collectExportedTraitBindings(source, file.path));
  }

  const traitDiagnostics = collectTraitDiagnostics(traitDescriptors, bindingsBySourceFile);
  const collisions = collectCollisions(rootFiles, domains, [], []);
  const importActions = planImportActions(rootFiles, domains);

  return {
    ...discovery,
    rootFiles,
    domains,
    libraryRootFiles: [],
    libraryDomains: [],
    filesCount: inspectedFiles.length,
    exportsCount,
    publicExportsCount,
    internalExportsCount,
    barrelsCount,
    traitDescriptors,
    traitDiagnostics,
    importActions,
    collisions,
  };
};
