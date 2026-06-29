import type { BarritsFileIntegration, BarritsDomainIntegration, BarritsExportCollision } from "../contracts";

type PublicNamespaceEntry = {
  namespace: string;
  exportName: string;
  sourceFile: string;
};

/**
 * Validates whether the given path represents an structural domain aggregator or explicit API flat export index.
 */
export const isAggregatorFile = (path: string): boolean => {
  return path === "index.ts" || path.endsWith("/index.ts") || path === "api/flat.ts";
};

/**
 * Discovers and maps logically flat representations of all deeply nested public exports aggregating domain interfaces.
 */
export const collectPublicNamespaceEntries = (
  rootFiles: readonly BarritsFileIntegration[],
  domains: readonly BarritsDomainIntegration[],
): PublicNamespaceEntry[] => {
  const entries: PublicNamespaceEntry[] = [];

  for (const file of rootFiles.filter((rootFile) => rootFile.path === "index.ts")) {
    for (const exportedMember of file.exports) {
      if (exportedMember.visibility === "public") {
        entries.push({
          namespace: "root",
          exportName: exportedMember.accessPath,
          sourceFile: file.path,
        });
      }
    }
  }

  for (const domain of domains) {
    const isApiDomain = domain.name === "api";

    for (const file of domain.files) {
      if (isApiDomain && file.path !== "api/flat.ts") {
        continue;
      }

      for (const exportedMember of file.exports) {
        if (exportedMember.visibility === "public") {
          entries.push({
            namespace: domain.name,
            exportName: isApiDomain ? exportedMember.name : exportedMember.accessPath,
            sourceFile: file.path,
          });
        }
      }
    }
  }

  return entries.sort((left, right) => {
    if (left.namespace === right.namespace) {
      if (left.exportName === right.exportName) {
        return left.sourceFile.localeCompare(right.sourceFile);
      }

      return left.exportName.localeCompare(right.exportName);
    }

    return left.namespace.localeCompare(right.namespace);
  });
};

/**
 * Determines runtime domain conflict events where cross-project namespace interfaces collide overriding native structural payloads.
 */
export const collectCollisions = (
  projectRootFiles: readonly BarritsFileIntegration[],
  projectDomains: readonly BarritsDomainIntegration[],
  libraryRootFiles: readonly BarritsFileIntegration[],
  libraryDomains: readonly BarritsDomainIntegration[],
): BarritsExportCollision[] => {
  const projectEntries = collectPublicNamespaceEntries(projectRootFiles, projectDomains);
  const libraryEntries = collectPublicNamespaceEntries(libraryRootFiles, libraryDomains);
  const collisions: BarritsExportCollision[] = [];
  const projectNamespaces = new Map<string, string>();
  const libraryNamespaces = new Map<string, string>();

  for (const entry of projectEntries) {
    const collisionKey = `${entry.namespace}:${entry.exportName}`;
    const existingSourceFile = projectNamespaces.get(collisionKey);

    if (existingSourceFile && existingSourceFile !== entry.sourceFile) {
      const existingIsAggregator = isAggregatorFile(existingSourceFile);
      const currentIsAggregator = isAggregatorFile(entry.sourceFile);

      if (existingIsAggregator !== currentIsAggregator) {
        if (!currentIsAggregator) {
          projectNamespaces.set(collisionKey, entry.sourceFile);
        }

        continue;
      }

      collisions.push({
        type: "project-project",
        namespace: entry.namespace,
        exportName: entry.exportName,
        projectSourceFile: existingSourceFile,
        conflictSourceFile: entry.sourceFile,
        message: `Export collision for ${entry.namespace}.${entry.exportName}: ${existingSourceFile} and ${entry.sourceFile} resolve to the same namespace path. Use @barrits-path to disambiguate.`,
      });
      continue;
    }

    projectNamespaces.set(collisionKey, entry.sourceFile);
  }

  for (const entry of libraryEntries) {
    libraryNamespaces.set(`${entry.namespace}:${entry.exportName}`, entry.sourceFile);
  }

  for (const [collisionKey, projectSourceFile] of projectNamespaces.entries()) {
    const librarySourceFile = libraryNamespaces.get(collisionKey);

    if (!librarySourceFile) {
      continue;
    }

    const [namespace, exportName] = collisionKey.split(":");

    collisions.push({
      type: "project-library",
      namespace,
      exportName,
      projectSourceFile,
      conflictSourceFile: librarySourceFile,
      librarySourceFile,
      message: `Export collision for ${namespace}.${exportName}: ${projectSourceFile} already exists and barrits_lib adds ${librarySourceFile}.`,
    });
  }

  return collisions.sort((left, right) => {
    if (left.namespace === right.namespace) {
      return left.exportName.localeCompare(right.exportName);
    }

    return left.namespace.localeCompare(right.namespace);
  });
};
